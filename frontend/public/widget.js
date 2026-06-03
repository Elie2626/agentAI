(function () {
  "use strict";

  var WIDGET_VERSION = "1.0.0";

  var script = document.currentScript;
  if (!script) return;

  var chatbotId = script.getAttribute("data-chatbot-id");
  if (!chatbotId) {
    console.error("[botexpress] data-chatbot-id manquant");
    return;
  }

  var API_URL = script.getAttribute("data-api-url") || "https://api.botforge.app";

  var config = null;
  var isOpen = false;
  var messages = [];
  var container = null;
  var leadCaptured = false;
  var prefersDark = false;
  var sessionId = (localStorage.getItem("bf_session") || (function() {
    var s = "s-" + Math.random().toString(36).substr(2, 12);
    localStorage.setItem("bf_session", s);
    return s;
  }()));

  var SIZES = {
    small:  { width: "320px", height: "440px" },
    medium: { width: "380px", height: "520px" },
    large:  { width: "440px", height: "600px" },
  };

  function getLuminance(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var r = parseInt(hex.substr(0, 2), 16) / 255;
    var g = parseInt(hex.substr(2, 2), 16) / 255;
    var b = parseInt(hex.substr(4, 2), 16) / 255;
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function getContrastColor(hex) {
    return getLuminance(hex) > 0.4 ? "#111111" : "#ffffff";
  }

  function detectDark() {
    // If user set a custom background_color, no auto-detection needed
    if (config.background_color) { prefersDark = false; return; }

    // Try to read the actual page background color first
    try {
      var el = document.documentElement;
      var bg = window.getComputedStyle(el).backgroundColor;
      // Also check body if html has transparent bg
      if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") {
        bg = window.getComputedStyle(document.body).backgroundColor;
      }
      var m = bg && bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) {
        var r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
        // Ignore transparent (rgba with alpha=0)
        var isTransparent = bg.indexOf("rgba") !== -1 && bg.match(/,\s*0\s*\)/);
        if (!isTransparent && !(r === 0 && g === 0 && b === 0)) {
          var rL = r/255, gL = g/255, bL = b/255;
          rL = rL <= 0.03928 ? rL/12.92 : Math.pow((rL+0.055)/1.055, 2.4);
          gL = gL <= 0.03928 ? gL/12.92 : Math.pow((gL+0.055)/1.055, 2.4);
          bL = bL <= 0.03928 ? bL/12.92 : Math.pow((bL+0.055)/1.055, 2.4);
          prefersDark = (0.2126*rL + 0.7152*gL + 0.0722*bL) < 0.4;
          return;
        }
      }
    } catch(e) {}

    // Fallback: use system preference
    prefersDark = !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function getThemeColors() {
    var pc = sanitizeColor(config.primary_color);
    var tc = (config.text_color && config.text_color !== "auto")
      ? sanitizeColor(config.text_color)
      : getContrastColor(pc);
    var hasCustBg = !!(config.background_color);
    var bgColor = hasCustBg
      ? sanitizeColor(config.background_color)
      : (prefersDark ? "#1e1f2e" : "#ffffff");
    var bgLum = getLuminance(bgColor.replace(/[^0-9a-fA-F]/g, "").length >= 6 ? bgColor : "#ffffff");
    var isLightBg = bgLum > 0.5;
    var chatText = hasCustBg
      ? (isLightBg ? "#111827" : "#f3f4f6")
      : (prefersDark ? "#e5e7eb" : "#111827");
    var msgAsstBg = hasCustBg
      ? (isLightBg ? "#efefef" : "rgba(255,255,255,0.12)")
      : (prefersDark ? "#2d2f42" : "#f3f4f6");
    var msgAsstText = hasCustBg
      ? (isLightBg ? "#111827" : "#f3f4f6")
      : (prefersDark ? "#e5e7eb" : "#111827");
    var inputBg = hasCustBg
      ? (isLightBg ? "#f9fafb" : "rgba(255,255,255,0.08)")
      : (prefersDark ? "#2d2f42" : "#f9fafb");
    var inputText = hasCustBg ? chatText : (prefersDark ? "#e5e7eb" : "#111827");
    var borderCol = hasCustBg
      ? (isLightBg ? "#e5e7eb" : "rgba(255,255,255,0.12)")
      : (prefersDark ? "#374151" : "#e5e7eb");
    var subtleText = hasCustBg
      ? (isLightBg ? "#6b7280" : "#d1d5db")
      : (prefersDark ? "#9ca3af" : "#9ca3af");
    var formLabelText = hasCustBg
      ? (isLightBg ? "#374151" : "#d1d5db")
      : (prefersDark ? "#d1d5db" : "#374151");
    return {
      pc: pc, tc: tc, bgColor: bgColor, chatText: chatText,
      msgAsstBg: msgAsstBg, msgAsstText: msgAsstText,
      inputBg: inputBg, inputText: inputText, borderCol: borderCol,
      subtleText: subtleText, formLabelText: formLabelText
    };
  }

  function init() {
    fetchConfig().then(function (cfg) {
      config = cfg;
      detectDark();
      // Listen for system dark mode changes as fallback (only when no custom background)
      if (window.matchMedia && !config.background_color) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function() {
          detectDark();
          var old = document.getElementById("bf-styles");
          if (old) old.remove();
          injectStyles();
          if (container) render();
        });
      }
      leadCaptured = !!localStorage.getItem("bf_lead_" + chatbotId);
      messages = [{ role: "assistant", content: config.welcome_message || "Bonjour ! Comment puis-je vous aider ?" }];
      injectStyles();
      render();
    }).catch(function (err) {
      console.error("[botexpress] Erreur init:", err);
    });
  }

  function fetchConfig() {
    return fetch(API_URL + "/api/v1/chatbots/" + chatbotId + "/embed")
      .then(function (r) { return r.json(); })
      .then(function (data) { return data.config; });
  }

  function sanitizeColor(val) {
    if (!val) return "#6366f1";
    if (/^#[0-9a-fA-F]{3,8}$/.test(val)) return val;
    if (/^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(val)) return val;
    return "#6366f1";
  }

  function sanitizeFont(val) {
    if (!val) return "system-ui";
    return val.replace(/[^a-zA-Z0-9 ,\-]/g, "");
  }

  function injectStyles() {
    var old = document.getElementById("bf-styles");
    if (old) old.remove();

    var style = document.createElement("style");
    style.id = "bf-styles";
    var col = getThemeColors();
    var pc = col.pc, tc = col.tc;
    var size = SIZES[config.widget_size] || SIZES.medium;

    var headerTextOpacity = tc === "#111111" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)";
    var closeHover = tc === "#111111" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.15)";

    style.textContent = "\n" +
      ".bf-widget-container{position:fixed;bottom:20px;right:20px;z-index:2147483647;font-family:" + sanitizeFont(config.font_family) + ",-apple-system,sans-serif}\n" +
      ".bf-toggle{width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(0,0,0,0.16);transition:transform 0.2s ease,box-shadow 0.2s ease;background:" + pc + "}\n" +
      ".bf-toggle:hover{transform:scale(1.05);box-shadow:0 6px 32px rgba(0,0,0,0.2)}\n" +
      ".bf-toggle svg{width:24px;height:24px;fill:none;stroke:" + tc + ";stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n" +
      ".bf-chat{width:" + size.width + ";max-width:calc(100vw - 40px);height:" + size.height + ";max-height:calc(100dvh - 100px);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,0.16);background:" + col.bgColor + ";color:" + col.chatText + ";animation:bf-slide-up 0.25s ease-out}\n" +
      "@keyframes bf-slide-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}\n" +
      ".bf-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:" + pc + "}\n" +
      ".bf-header-info{display:flex;align-items:center;gap:10px}\n" +
      ".bf-avatar{width:32px;height:32px;border-radius:50%;background:" + (tc === "#111111" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.2)") + ";display:flex;align-items:center;justify-content:center;overflow:hidden}\n" +
      ".bf-avatar img{width:100%;height:100%;object-fit:contain;padding:2px;background:#fff;border-radius:50%}\n" +
      ".bf-header-name{color:" + tc + ";font-size:14px;font-weight:600}\n" +
      ".bf-header-status{color:" + headerTextOpacity + ";font-size:11px}\n" +
      ".bf-close{background:none;border:none;color:" + headerTextOpacity + ";cursor:pointer;padding:4px;border-radius:6px;display:flex;align-items:center;justify-content:center;transition:background 0.15s}\n" +
      ".bf-close:hover{background:" + closeHover + ";color:" + tc + "}\n" +
      ".bf-close svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n" +
      ".bf-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:" + col.bgColor + "}\n" +
      ".bf-msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5;word-wrap:break-word}\n" +
      ".bf-msg-assistant{align-self:flex-start;background:" + col.msgAsstBg + ";color:" + col.msgAsstText + ";border-bottom-left-radius:4px}\n" +
      ".bf-msg-user{align-self:flex-end;background:" + pc + ";color:" + tc + ";border-bottom-right-radius:4px}\n" +
      ".bf-msg-error{align-self:flex-start;background:#fef2f2;color:#991b1b;border-bottom-left-radius:4px;font-style:italic}\n" +
      ".bf-msg strong,.bf-msg b{font-weight:700}\n" +
      ".bf-msg ul,.bf-msg ol{margin:4px 0 4px 16px;padding:0}\n" +
      ".bf-msg li{margin-bottom:2px}\n" +
      ".bf-msg p{margin:0 0 6px 0}.bf-msg p:last-child{margin-bottom:0}\n" +
      ".bf-typing{align-self:flex-start;background:" + col.msgAsstBg + ";border-radius:16px;border-bottom-left-radius:4px;padding:10px 16px;display:flex;gap:4px}\n" +
      ".bf-typing span{width:6px;height:6px;border-radius:50%;background:#9ca3af;animation:bf-bounce 1.4s infinite}\n" +
      ".bf-typing span:nth-child(2){animation-delay:0.2s}\n" +
      ".bf-typing span:nth-child(3){animation-delay:0.4s}\n" +
      "@keyframes bf-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}\n" +
      ".bf-input-area{border-top:1px solid " + col.borderCol + ";padding:12px;display:flex;gap:8px;align-items:center;background:" + col.bgColor + "}\n" +
      ".bf-input{flex:1;border:1px solid " + col.borderCol + ";border-radius:12px;padding:10px 14px;font-size:14px;outline:none;font-family:inherit;background:" + col.inputBg + ";color:" + col.inputText + ";transition:border-color 0.15s}\n" +
      ".bf-input:focus{border-color:" + pc + ";box-shadow:0 0 0 2px " + pc + "30}\n" +
      ".bf-input::placeholder{color:#9ca3af}\n" +
      ".bf-send{width:40px;height:40px;border-radius:12px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;background:" + pc + ";transition:opacity 0.15s}\n" +
      ".bf-send:hover{opacity:0.9}\n" +
      ".bf-send:disabled{opacity:0.5;cursor:not-allowed}\n" +
      ".bf-send svg{width:18px;height:18px;fill:none;stroke:" + tc + ";stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n" +
      ".bf-powered{text-align:center;padding:4px 0 8px;font-size:10px;color:" + col.subtleText + ";background:" + col.bgColor + "}\n" +
      ".bf-powered a{color:" + col.subtleText + ";text-decoration:none}\n" +
      ".bf-powered a:hover{text-decoration:underline}\n" +
      "@media(prefers-reduced-motion:reduce){.bf-chat{animation:none}.bf-toggle{transition:none}}\n";
    document.head.appendChild(style);
  }

  function render() {
    if (container) container.remove();
    container = document.createElement("div");
    container.className = "bf-widget-container";
    container.setAttribute("role", "complementary");
    container.setAttribute("aria-label", "Chat " + (config.name || "assistant"));

    if (isOpen) {
      // Show lead capture form if enabled and not yet captured
      if (config.lead_capture_enabled && !leadCaptured) {
        container.innerHTML = buildLeadFormHTML();
        container.querySelector(".bf-close").addEventListener("click", function () {
          isOpen = false;
          render();
        });
        container.querySelector(".bf-lead-form").addEventListener("submit", function (e) {
          e.preventDefault();
          var data = {};
          var fields = config.lead_capture_fields || ["name", "email"];
          fields.forEach(function (f) {
            var el = container.querySelector("[name=bf_" + f + "]");
            if (el) data[f] = el.value.trim();
          });
          submitLead(data);
        });
        container.querySelector(".bf-lead-skip") && container.querySelector(".bf-lead-skip").addEventListener("click", function () {
          leadCaptured = true;
          render();
        });
      } else {
        container.innerHTML = buildChatHTML();
        container.querySelector(".bf-close").addEventListener("click", function () {
          isOpen = false;
          render();
        });
        var form = container.querySelector(".bf-form");
        var input = container.querySelector(".bf-input");
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var text = input.value.trim();
          if (!text) return;
          input.value = "";
          sendMessage(text);
        });
        scrollToBottom();
      }
    } else {
      container.innerHTML =
        '<button class="bf-toggle" aria-label="Ouvrir le chat">' +
        '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg>' +
        "</button>";
      container.querySelector(".bf-toggle").addEventListener("click", function () {
        isOpen = true;
        render();
      });
    }

    document.body.appendChild(container);
  }

  function buildLeadFormHTML() {
    var col = getThemeColors();
    var pc = col.pc, tc = col.tc;
    var fields = config.lead_capture_fields || ["name", "email"];
    var fieldLabels = { name: "Votre nom", email: "Votre email", phone: "Votre téléphone" };
    var fieldTypes = { name: "text", email: "email", phone: "tel" };

    // Only allow known safe field keys to prevent XSS
    var allowedFields = ["name", "email", "phone"];
    var safeFields = fields.filter(function(f) { return allowedFields.indexOf(f) !== -1; });
    var fieldsHTML = safeFields.map(function (f) {
      var label = escapeHtml(fieldLabels[f] || f);
      var inputType = escapeHtml(fieldTypes[f] || "text");
      return '<div style="margin-bottom:12px">' +
        '<label style="display:block;font-size:13px;font-weight:500;margin-bottom:4px;color:' + col.formLabelText + '">' + label + '</label>' +
        '<input name="bf_' + escapeHtml(f) + '" type="' + inputType + '" placeholder="' + label + '" ' +
        'style="width:100%;box-sizing:border-box;border:1px solid ' + col.borderCol + ';border-radius:10px;padding:10px 12px;font-size:14px;outline:none;font-family:inherit;background:' + col.inputBg + ';color:' + col.inputText + '" required>' +
        '</div>';
    }).join("");

    return '<div class="bf-chat">' +
      '<div class="bf-header">' +
      '<div class="bf-header-info"><div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center">' +
      '<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:' + tc + ';fill:none;stroke-width:2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg></div>' +
      '<div><div class="bf-header-name">' + escapeHtml(config.name || "Assistant") + '</div><div class="bf-header-status">En ligne</div></div></div>' +
      '<button class="bf-close" aria-label="Fermer"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' +
      '</div>' +
      '<div style="flex:1;padding:20px;overflow-y:auto;background:' + col.bgColor + '">' +
      '<p style="font-size:15px;font-weight:600;color:' + col.chatText + ';margin:0 0 4px">Avant de commencer</p>' +
      '<p style="font-size:13px;color:' + col.subtleText + ';margin:0 0 18px">Partagez quelques informations pour que nous puissions mieux vous aider.</p>' +
      '<form class="bf-lead-form">' + fieldsHTML +
      '<button type="submit" style="width:100%;background:' + pc + ';color:' + tc + ';border:none;border-radius:10px;padding:11px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Démarrer le chat</button>' +
      '</form>' +
      '<button class="bf-lead-skip" style="display:block;width:100%;margin-top:10px;background:none;border:none;font-size:12px;color:' + col.subtleText + ';cursor:pointer;font-family:inherit">Continuer sans renseigner</button>' +
      '</div>' +
      '<div class="bf-powered">Propulsé par <a href="https://www.botexpress.fr" target="_blank" rel="noopener">botexpress</a></div>' +
      '</div>';
  }

  function submitLead(data) {
    fetch(API_URL + "/api/v1/leads/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatbot_id: chatbotId,
        session_id: sessionId,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
      }),
    }).catch(function () {});
    localStorage.setItem("bf_lead_" + chatbotId, "1");
    leadCaptured = true;
    render();
  }

  function buildChatHTML() {
    var col = getThemeColors();
    var pc = col.pc, tc = col.tc;

    var avatarSvgStroke = tc === "#111111" ? "#333" : "#fff";
    var avatar = config.logo_url
      ? '<div class="bf-avatar"><img src="' + escapeHtml(config.logo_url) + '" alt=""></div>'
      : '<div class="bf-avatar"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:' + avatarSvgStroke + ';fill:none;stroke-width:2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg></div>';

    var msgHTML = messages.map(function (m) {
      var cls = "bf-msg bf-msg-" + m.role;
      var content = m.role === "assistant" ? formatMarkdown(m.content) : escapeHtml(m.content);
      return '<div class="' + cls + '">' + content + "</div>";
    }).join("");

    return (
      '<div class="bf-chat">' +
      '<div class="bf-header">' +
      '<div class="bf-header-info">' + avatar +
      '<div><div class="bf-header-name">' + escapeHtml(config.name || "Assistant") + '</div>' +
      '<div class="bf-header-status">En ligne</div></div></div>' +
      '<button class="bf-close" aria-label="Fermer"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' +
      "</div>" +
      '<div class="bf-messages" id="bf-messages">' + msgHTML + "</div>" +
      '<form class="bf-input-area bf-form">' +
      '<input class="bf-input" type="text" placeholder="' + escapeHtml(config.placeholder_text || "Écrivez votre message...") + '" autocomplete="off">' +
      '<button class="bf-send" type="submit" aria-label="Envoyer"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>' +
      "</form>" +
      '<div class="bf-powered">Propulsé par <a href="https://www.botexpress.fr" target="_blank" rel="noopener">botexpress</a></div>' +
      "</div>"
    );
  }

  function sendMessage(text) {
    messages.push({ role: "user", content: text });
    render();
    scrollToBottom();

    showTyping();

    fetch(API_URL + "/api/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatbot_id: chatbotId, message: text }),
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function(d) { throw new Error(d.detail || "Erreur"); });
        return r.json();
      })
      .then(function (data) {
        hideTyping();
        if (data.response) {
          messages.push({ role: "assistant", content: data.response });
        } else {
          messages.push({ role: "assistant", content: "Désolé, je n'ai pas pu répondre." });
        }
        render();
        scrollToBottom();
      })
      .catch(function (err) {
        hideTyping();
        messages.push({ role: "assistant", content: err.message || "Désolé, une erreur est survenue." });
        render();
        scrollToBottom();
      });
  }

  function showTyping() {
    var msgsEl = document.getElementById("bf-messages");
    if (!msgsEl) return;
    var typing = document.createElement("div");
    typing.className = "bf-typing";
    typing.id = "bf-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    msgsEl.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    var el = document.getElementById("bf-typing");
    if (el) el.remove();
  }

  function scrollToBottom() {
    var msgsEl = document.getElementById("bf-messages");
    if (msgsEl) {
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str || ""));
    return div.innerHTML;
  }

  function formatMarkdown(text) {
    if (!text) return "";
    var safe = escapeHtml(text);

    var lines = safe.split("\n");
    var html = "";
    var inList = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) {
        if (inList) { html += "</ul>"; inList = false; }
        continue;
      }

      var bulletMatch = line.match(/^[-*•]\s+(.+)$/);
      if (bulletMatch) {
        if (!inList) { html += "<ul>"; inList = true; }
        html += "<li>" + inlineFormat(bulletMatch[1]) + "</li>";
        continue;
      }

      var numMatch = line.match(/^\d+[.)]\s+(.+)$/);
      if (numMatch) {
        if (!inList) { html += "<ul>"; inList = true; }
        html += "<li>" + inlineFormat(numMatch[1]) + "</li>";
        continue;
      }

      if (inList) { html += "</ul>"; inList = false; }
      html += "<p>" + inlineFormat(line) + "</p>";
    }
    if (inList) html += "</ul>";

    return html;
  }

  function inlineFormat(text) {
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
    return text;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
