from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from enum import StrEnum

from app.schemas.link import LinkResponse

# ---------------------------------------------------------------------------
# Enums — used as discriminator / literal type keys across all block schemas
# ---------------------------------------------------------------------------

class HeroType(StrEnum):
    IMAGE = "image"
    VIDEO = "video"

class HeroAspect(StrEnum):
    WIDESCREEN = "16:9"
    SQUARE = "1:1"
    PORTRAIT = "4:3"
    ULTRAWIDE = "21:9"

class OfferType(StrEnum):
    PDF = "pdf"        # downloadable file  → fileUrl / fileName / assetId
    URL = "url"        # open a resource URL → url
    REDIRECT = "redirect"  # full-page redirect → redirectUrl
    MESSAGE = "message"    # show a text message → message

class HeadlineSize(StrEnum):
    SM = "sm"
    MD = "md"
    LG = "lg"
    XL = "xl"

class HeadlineAlign(StrEnum):
    LEFT = "left"
    CENTER = "center"
    RIGHT = "right"

class DescriptionSize(StrEnum):
    SM = "sm"
    MD = "md"
    LG = "lg"

class FormFieldType(StrEnum):
    TEXT = "text"
    EMAIL = "email"
    PHONE = "phone"
    NUMBER = "number"
    TEXTAREA = "textarea"
    SELECT = "select"
    CHECKBOX = "checkbox"
    RADIO = "radio"

class SuccessEffectType(StrEnum):
    CONFETTI = "confetti"
    FIREWORKS = "fireworks"
    NONE = "none"


class ThemeSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    primary: Optional[str] = Field(None, description="Background color")
    secondary: Optional[str] = Field(None, description="Fonts color")
    tertiary: Optional[str] = Field(None, alias="tersory color", description="Border color")

class HeroSchema(BaseModel):
    type: HeroType
    url: Optional[str] = None
    aspect: Optional[HeroAspect] = None

class OfferSchema(BaseModel):
    """
    Drives both the 'what the user receives' AND the post-submission action.
    
    type options:
      "pdf"      → fileUrl/fileName/assetId   → show download button after submit
      "url"      → url                        → open resource URL after submit
      "redirect" → redirectUrl                → redirect the page after submit
      "message"  → message                   → show a text after submit
    """
    type: str

    # --- downloadable file ---
    fileUrl: Optional[str] = None
    fileName: Optional[str] = None
    assetId: Optional[str] = None

    # --- external URL / resource ---
    url: Optional[str] = None

    # --- full-page redirect after submit ---
    redirectUrl: Optional[str] = None

    # --- text message ---
    message: Optional[str] = None

class FormFieldSchema(BaseModel):
    id: str
    label: str
    fieldType: FormFieldType
    isRequired: bool
    sortOrder: int
    optionsJson: Optional[Dict[str, Any]] = None


class TestimonialSchema(BaseModel):
    id: str
    name: str
    title: str
    quote: str
    photoUrl: Optional[str] = None

class SuccessEffectSchema(BaseModel):
    """Visual effect played after successful form submission."""
    type: SuccessEffectType
    durationMs: Optional[int] = None

class BackgroundSchema(BaseModel):
    type: str
    url: Optional[str] = None
    overlay: Optional[float] = None

class ContentJsonSchema(BaseModel):
    # Overall design
    layout: Optional[str] = None
    font: Optional[str] = None
    logo: Optional[str] = None
    background: Optional[BackgroundSchema] = None
    effects: Optional[Dict[str, Any]] = None
    theme: Optional[ThemeSchema] = None

    # Page Sections (Blocks)
    eyebrow: Optional[str] = None
    headline: Optional[str] = None
    headlineSize: Optional[HeadlineSize] = None
    headlineAlign: Optional[HeadlineAlign] = None
    description: Optional[str] = None
    descriptionSize: Optional[DescriptionSize] = None
    hero: Optional[HeroSchema] = None
    buttonText: Optional[str] = None
    offer: Optional[OfferSchema] = None
    additionalContentEnabled: Optional[bool] = None
    testimonials: Optional[List[TestimonialSchema]] = None
    detail_form: Optional[List[FormFieldSchema]] = None
    # Post-submit action is driven by offer.type — no separate successAction needed
    successEffect: Optional[SuccessEffectSchema] = None
    successTitle: Optional[str] = None
    successSubtitle: Optional[str] = None
    successButtonText: Optional[str] = None

class PageBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    content_json: Optional[ContentJsonSchema] = None

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    content_json: Optional[ContentJsonSchema] = None

class PageResponse(PageBase):
    id: UUID
    user_id: UUID
    total_visits: int
    total_lead_captures: int
    created_at: datetime
    updated_at: datetime
    link: Optional[LinkResponse] = None

    class Config:
        from_attributes = True
