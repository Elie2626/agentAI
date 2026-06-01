from pydantic import BaseModel, HttpUrl, Field
from typing import Optional
from enum import Enum


class ChatbotType(str, Enum):
    SUPPORT = "support"
    SALES = "sales"
    BOOKING = "booking"
    RESTAURANT = "restaurant"
    REAL_ESTATE = "real_estate"
    ECOMMERCE = "ecommerce"
    OTHER = "other"


class PlanType(str, Enum):
    BASIC = "basic"
    STARTER = "starter"
    PRO = "pro"
    BUSINESS = "business"


class CreateChatbotRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    chatbot_type: ChatbotType
    website_url: HttpUrl


class UpdateChatbotRequest(BaseModel):
    name: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    text_color: Optional[str] = None
    font_family: Optional[str] = None
    welcome_message: Optional[str] = None
    placeholder_text: Optional[str] = None
    position: Optional[str] = None
    widget_size: Optional[str] = None
    avatar_url: Optional[str] = None


class SiteAnalysisResult(BaseModel):
    title: str = ""
    description: str = ""
    logo_url: str = ""
    favicon_url: str = ""
    primary_color: str = "#6366f1"
    secondary_color: str = "#818cf8"
    font_family: str = "Inter"
    industry: str = ""
    content_summary: str = ""
    pages_scraped: int = 0
    tone: str = "professional"


class ChatMessage(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    chatbot_id: str


class CreateCheckoutRequest(BaseModel):
    plan: PlanType


class ChatbotResponse(BaseModel):
    id: str
    name: str
    chatbot_type: str
    website_url: str
    logo_url: str
    favicon_url: str
    primary_color: str
    secondary_color: str
    text_color: str
    font_family: str
    industry: str
    welcome_message: str
    placeholder_text: str
    position: str
    widget_size: str
    status: str
    created_at: str
    embed_code: str


class UserResponse(BaseModel):
    uid: str
    email: str
    plan: str
    chatbot_count: int
    messages_used: int
    messages_limit: int
