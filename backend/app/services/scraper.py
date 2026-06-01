from __future__ import annotations

import asyncio
import re
import io
import httpx
import cssutils
import logging
from typing import Optional
from collections import Counter, deque
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from colorthief import ColorThief
from PIL import Image
from app.models.schemas import SiteAnalysisResult

cssutils.log.setLevel(logging.CRITICAL)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
}

INDUSTRY_KEYWORDS = {
    "restaurant": ["menu", "réservation", "plat", "cuisine", "restaurant", "carte", "chef", "recette", "repas", "dîner", "table", "food", "dish", "meal", "booking"],
    "ecommerce": ["panier", "acheter", "produit", "livraison", "commande", "prix", "boutique", "shop", "cart", "buy", "product", "delivery", "order", "price", "add to cart"],
    "real_estate": ["immobilier", "appartement", "maison", "location", "vente", "louer", "m²", "property", "apartment", "house", "rent", "real estate", "bedroom"],
    "saas": ["pricing", "features", "api", "integration", "dashboard", "trial", "signup", "plan", "subscription", "tarif", "fonctionnalités"],
    "health": ["santé", "médecin", "rendez-vous", "patient", "clinique", "docteur", "health", "doctor", "appointment", "clinic", "medical"],
    "education": ["formation", "cours", "apprendre", "étudiant", "école", "learn", "course", "student", "training", "school", "teach"],
    "finance": ["banque", "crédit", "assurance", "investissement", "finance", "bank", "insurance", "loan", "invest", "trading"],
    "travel": ["voyage", "hôtel", "vol", "destination", "réservation", "travel", "hotel", "flight", "booking", "trip"],
}

FONT_STACK_MAP = {
    "inter": "Inter",
    "roboto": "Roboto",
    "open sans": "Open Sans",
    "opensans": "Open Sans",
    "lato": "Lato",
    "montserrat": "Montserrat",
    "poppins": "Poppins",
    "nunito": "Nunito",
    "raleway": "Raleway",
    "playfair": "Playfair Display",
    "source sans": "Source Sans 3",
    "dm sans": "DM Sans",
    "plus jakarta": "Plus Jakarta Sans",
    "geist": "Geist",
    "arial": "Arial",
    "helvetica": "Helvetica",
    "verdana": "Verdana",
    "georgia": "Georgia",
}


async def analyze_website(url: str) -> SiteAnalysisResult:
    parsed = urlparse(str(url))
    base_url = f"{parsed.scheme}://{parsed.netloc}"

    async with httpx.AsyncClient(
        headers=HEADERS, follow_redirects=True, timeout=15.0
    ) as client:
        resp = await client.get(str(url))
        resp.raise_for_status()
        html = resp.text

    soup = BeautifulSoup(html, "lxml")

    title = _extract_title(soup)
    description = _extract_description(soup)
    logo_url = _extract_logo(soup, base_url)
    favicon_url = _extract_favicon(soup, base_url)
    fonts = _extract_fonts(soup, html)
    content = _extract_content(soup)
    industry = _detect_industry(title, description, content)
    tone = _detect_tone(content)

    colors = await _extract_colors(soup, html, base_url, favicon_url)

    return SiteAnalysisResult(
        title=title,
        description=description,
        logo_url=logo_url,
        favicon_url=favicon_url,
        primary_color=colors["primary"],
        secondary_color=colors["secondary"],
        font_family=fonts,
        industry=industry,
        content_summary=content[:2000],
        pages_scraped=1,
        tone=tone,
    )


def _extract_title(soup: BeautifulSoup) -> str:
    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        return og_title["content"].strip()

    title_tag = soup.find("title")
    if title_tag and title_tag.string:
        raw = title_tag.string.strip()
        for sep in [" | ", " - ", " — ", " · ", " :: "]:
            if sep in raw:
                return raw.split(sep)[0].strip()
        return raw

    h1 = soup.find("h1")
    if h1:
        return h1.get_text(strip=True)

    return ""


def _extract_description(soup: BeautifulSoup) -> str:
    og_desc = soup.find("meta", property="og:description")
    if og_desc and og_desc.get("content"):
        return og_desc["content"].strip()[:500]

    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        return meta_desc["content"].strip()[:500]

    return ""


def _extract_logo(soup: BeautifulSoup, base_url: str) -> str:
    selectors = [
        ("link", {"rel": "apple-touch-icon"}),
        ("meta", {"property": "og:image"}),
    ]
    for tag, attrs in selectors:
        el = soup.find(tag, attrs)
        if el:
            src = el.get("href") or el.get("content")
            if src:
                return urljoin(base_url, src)

    logo_patterns = [
        lambda: soup.find("img", class_=re.compile(r"logo", re.I)),
        lambda: soup.find("img", id=re.compile(r"logo", re.I)),
        lambda: soup.find("img", alt=re.compile(r"logo", re.I)),
        lambda: soup.find("a", class_=re.compile(r"logo|brand|navbar-brand", re.I)),
    ]
    for find_fn in logo_patterns:
        el = find_fn()
        if el:
            if el.name == "a":
                img = el.find("img")
                if img and img.get("src"):
                    return urljoin(base_url, img["src"])
                svg = el.find("svg")
                if svg:
                    return ""
            elif el.name == "img" and el.get("src"):
                return urljoin(base_url, el["src"])

    header = soup.find("header") or soup.find("nav")
    if header:
        img = header.find("img")
        if img and img.get("src"):
            return urljoin(base_url, img["src"])

    return ""


def _extract_favicon(soup: BeautifulSoup, base_url: str) -> str:
    for rel in [["icon"], ["shortcut", "icon"]]:
        link = soup.find("link", rel=rel)
        if link and link.get("href"):
            return urljoin(base_url, link["href"])

    return urljoin(base_url, "/favicon.ico")


def _extract_fonts(soup: BeautifulSoup, html: str) -> str:
    fonts_found: list[str] = []

    google_fonts_links = soup.find_all("link", href=re.compile(r"fonts\.googleapis\.com"))
    for link in google_fonts_links:
        href = link.get("href", "")
        family_match = re.findall(r"family=([^&:]+)", href)
        for fam in family_match:
            clean = fam.replace("+", " ").split(":")[0].strip()
            if clean:
                fonts_found.append(clean)

    style_tags = soup.find_all("style")
    for style in style_tags:
        if style.string:
            ff_matches = re.findall(
                r'font-family\s*:\s*["\']?([^;"\'}\n]+)', style.string
            )
            for match in ff_matches:
                first_font = match.split(",")[0].strip().strip("'\"")
                if first_font and first_font.lower() not in ("inherit", "initial", "unset", "sans-serif", "serif", "monospace", "system-ui"):
                    fonts_found.append(first_font)

    css_var_match = re.findall(r'--font[^:]*:\s*["\']?([^;"\'}\n]+)', html)
    for match in css_var_match:
        first_font = match.split(",")[0].strip().strip("'\"")
        if first_font and first_font.lower() not in ("inherit", "initial", "unset", "sans-serif", "serif", "monospace", "system-ui"):
            fonts_found.append(first_font)

    if fonts_found:
        normalized = []
        for f in fonts_found:
            key = f.lower().strip()
            for pattern, canonical in FONT_STACK_MAP.items():
                if pattern in key:
                    normalized.append(canonical)
                    break
            else:
                normalized.append(f)

        counter = Counter(normalized)
        return counter.most_common(1)[0][0]

    return "Inter"


async def _extract_colors(
    soup: BeautifulSoup, html: str, base_url: str, favicon_url: str
) -> dict[str, str]:
    css_colors = _extract_css_colors(soup, html)
    if css_colors["primary"] != "#6366f1":
        return css_colors

    if favicon_url:
        try:
            palette = await _colors_from_image(favicon_url)
            if palette:
                return palette
        except Exception:
            pass

    og_image = soup.find("meta", property="og:image")
    if og_image and og_image.get("content"):
        try:
            img_url = urljoin(base_url, og_image["content"])
            palette = await _colors_from_image(img_url)
            if palette:
                return palette
        except Exception:
            pass

    return {"primary": "#6366f1", "secondary": "#818cf8"}


def _extract_css_colors(soup: BeautifulSoup, html: str) -> dict[str, str]:
    color_counts: Counter = Counter()

    hex_pattern = re.compile(r"#([0-9a-fA-F]{6})\b")
    rgb_pattern = re.compile(r"rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)")
    hsl_pattern = re.compile(r"hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)")

    css_var_colors = re.findall(
        r"--(?:primary|brand|main|accent|theme)[^:]*:\s*([^;}\n]+)", html, re.I
    )
    for val in css_var_colors:
        val = val.strip()
        hex_match = hex_pattern.search(val)
        if hex_match:
            color = f"#{hex_match.group(1).lower()}"
            if _is_meaningful_color(color):
                return {
                    "primary": color,
                    "secondary": _lighten_color(color, 0.2),
                }

    sources = []
    for style in soup.find_all("style"):
        if style.string:
            sources.append(style.string)

    for el in soup.find_all(style=True):
        sources.append(el.get("style", ""))

    meta_theme = soup.find("meta", attrs={"name": "theme-color"})
    if meta_theme and meta_theme.get("content"):
        tc = meta_theme["content"].strip()
        if hex_pattern.match(tc):
            return {"primary": tc.lower(), "secondary": _lighten_color(tc.lower(), 0.2)}

    full_css = " ".join(sources)

    for match in hex_pattern.findall(full_css):
        color = f"#{match.lower()}"
        if _is_meaningful_color(color):
            color_counts[color] += 1

    for r, g, b in rgb_pattern.findall(full_css):
        color = f"#{int(r):02x}{int(g):02x}{int(b):02x}"
        if _is_meaningful_color(color):
            color_counts[color] += 1

    if color_counts:
        primary = color_counts.most_common(1)[0][0]
        secondary = _lighten_color(primary, 0.2)
        return {"primary": primary, "secondary": secondary}

    return {"primary": "#6366f1", "secondary": "#818cf8"}


def _is_meaningful_color(hex_color: str) -> bool:
    hex_color = hex_color.lstrip("#").lower()
    r, g, b = int(hex_color[:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)

    if r > 240 and g > 240 and b > 240:
        return False
    if r < 15 and g < 15 and b < 15:
        return False
    if abs(r - g) < 10 and abs(g - b) < 10 and abs(r - b) < 10:
        return False

    return True


def _lighten_color(hex_color: str, factor: float) -> str:
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    r = min(255, int(r + (255 - r) * factor))
    g = min(255, int(g + (255 - g) * factor))
    b = min(255, int(b + (255 - b) * factor))
    return f"#{r:02x}{g:02x}{b:02x}"


async def _colors_from_image(image_url: str) -> dict[str, str] | None:
    async with httpx.AsyncClient(headers=HEADERS, follow_redirects=True, timeout=10.0) as client:
        resp = await client.get(image_url)
        if resp.status_code != 200:
            return None

    img_data = io.BytesIO(resp.content)

    try:
        img = Image.open(img_data)
        if img.mode == "ICO" or image_url.endswith(".ico"):
            img = img.convert("RGBA")
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            buf.seek(0)
            img_data = buf
        else:
            img_data.seek(0)
    except Exception:
        img_data.seek(0)

    try:
        ct = ColorThief(img_data)
        palette = ct.get_palette(color_count=5, quality=5)
    except Exception:
        return None

    for r, g, b in palette:
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        if _is_meaningful_color(hex_color):
            return {
                "primary": hex_color,
                "secondary": _lighten_color(hex_color, 0.2),
            }

    return None


def _extract_content(soup: BeautifulSoup) -> str:
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "svg", "iframe"]):
        tag.decompose()

    main = soup.find("main") or soup.find("article") or soup.find(role="main")
    target = main if main else soup.body

    if not target:
        return ""

    texts = []
    for el in target.find_all(["h1", "h2", "h3", "h4", "p", "li", "td", "span", "a"]):
        text = el.get_text(separator=" ", strip=True)
        if len(text) > 10:
            texts.append(text)

    return "\n".join(texts[:200])


def _detect_industry(title: str, description: str, content: str) -> str:
    combined = f"{title} {description} {content}".lower()
    scores: dict[str, int] = {}

    for industry, keywords in INDUSTRY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in combined)
        if score > 0:
            scores[industry] = score

    if scores:
        return max(scores, key=scores.get)

    return "general"


def _detect_tone(content: str) -> str:
    content_lower = content.lower()

    casual_markers = ["!", "😊", "😄", "cool", "super", "génial", "trop bien", "hey", "salut", "awesome", "love"]
    formal_markers = ["nous vous proposons", "notre expertise", "conformément", "veuillez", "cordialement", "pursuant", "hereby", "accordingly"]

    casual_score = sum(1 for m in casual_markers if m in content_lower)
    formal_score = sum(1 for m in formal_markers if m in content_lower)

    if formal_score > casual_score:
        return "formal"
    elif casual_score > formal_score + 2:
        return "casual"

    return "professional"


# ---------------------------------------------------------------------------
# Multi-page crawler
# ---------------------------------------------------------------------------

_SKIP_EXTENSIONS = {
    ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".avif",
    ".mp4", ".mp3", ".wav", ".zip", ".rar", ".exe", ".dmg",
    ".css", ".js", ".json", ".xml", ".ico", ".woff", ".woff2", ".ttf",
}


def _normalize_url(url: str) -> str:
    """Normalize a URL for dedup: strip fragment, trailing slash, lowercase."""
    parsed = urlparse(url)
    path = parsed.path.rstrip("/") or "/"
    normalized = f"{parsed.scheme}://{parsed.netloc.lower()}{path}"
    if parsed.query:
        normalized += f"?{parsed.query}"
    return normalized


def _is_crawlable(url: str, domain: str) -> bool:
    """Check if a URL should be crawled."""
    parsed = urlparse(url)
    if parsed.netloc.lower() != domain.lower():
        return False
    if parsed.scheme not in ("http", "https"):
        return False
    path_lower = parsed.path.lower()
    for ext in _SKIP_EXTENSIONS:
        if path_lower.endswith(ext):
            return False
    if any(seg in path_lower for seg in ("/wp-admin", "/admin", "/login", "/cart", "/checkout")):
        return False
    return True


def _extract_page_text(soup: BeautifulSoup, max_chars: int = 3000) -> str:
    """Extract readable text from a page without modifying the original soup."""
    soup_copy = BeautifulSoup(str(soup), "lxml")

    for tag in soup_copy(["script", "style", "nav", "noscript", "svg", "iframe"]):
        tag.decompose()

    title_el = soup_copy.find("title")
    title = ""
    if title_el and title_el.string:
        title = title_el.string.strip()

    main = soup_copy.find("main") or soup_copy.find("article") or soup_copy.find(role="main")
    target = main if main else soup_copy.body
    if not target:
        return ""

    texts: list[str] = []
    total = 0
    for el in target.find_all(["h1", "h2", "h3", "h4", "h5", "p", "li", "td", "blockquote", "dd"]):
        text = el.get_text(separator=" ", strip=True)
        if len(text) > 8:
            texts.append(text)
            total += len(text)
            if total >= max_chars:
                break

    content = "\n".join(texts)
    if title:
        content = f"[{title}]\n{content}"
    return content[:max_chars]


async def _fetch_page(
    client: httpx.AsyncClient,
    url: str,
    domain: str,
) -> tuple[str, list[str]]:
    """Fetch a single page and return (text_content, discovered_links)."""
    try:
        resp = await client.get(url)
        if resp.status_code != 200:
            return "", []
        content_type = resp.headers.get("content-type", "")
        if "text/html" not in content_type:
            return "", []
    except Exception:
        return "", []

    soup = BeautifulSoup(resp.text, "lxml")
    content = _extract_page_text(soup)

    links: list[str] = []
    for a_tag in soup.find_all("a", href=True):
        href = a_tag["href"]
        if href.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        absolute = urljoin(url, href)
        parsed = urlparse(absolute)
        clean = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        if _is_crawlable(clean, domain):
            links.append(clean)

    return content, links


async def crawl_website(start_url: str, max_pages: int = 5) -> tuple[str, int]:
    """
    Crawl a website starting from start_url, following internal links.
    Returns (combined_content, pages_scraped).
    """
    parsed = urlparse(start_url)
    domain = parsed.netloc

    visited: set[str] = set()
    queue: deque[str] = deque([start_url])
    all_content: list[str] = []
    pages_scraped = 0

    async with httpx.AsyncClient(
        headers=HEADERS, follow_redirects=True, timeout=10.0
    ) as client:
        while queue and pages_scraped < max_pages:
            batch_size = min(5, max_pages - pages_scraped, len(queue))
            batch: list[str] = []

            while queue and len(batch) < batch_size:
                url = queue.popleft()
                norm = _normalize_url(url)
                if norm in visited:
                    continue
                visited.add(norm)
                batch.append(url)

            if not batch:
                break

            tasks = [_fetch_page(client, url, domain) for url in batch]
            results = await asyncio.gather(*tasks, return_exceptions=True)

            for url, result in zip(batch, results):
                if isinstance(result, BaseException):
                    continue
                content, links = result
                if content.strip():
                    all_content.append(f"=== {url} ===\n{content}")
                    pages_scraped += 1

                for link in links:
                    norm = _normalize_url(link)
                    if norm not in visited:
                        queue.append(link)

    combined = "\n\n".join(all_content)
    return combined, pages_scraped
