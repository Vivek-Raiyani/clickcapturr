/**
 * types/page.ts
 * -------------
 * All types that describe a landing page's theme, content, and form structure.
 * These types are consumed by the PageBuilder and the public page viewer.
 */

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

export type TemplateStyle =
  | "bento"
  | "glass"
  | "split"
  | "editorial"
  | "minimal"
  | "brutalist"
  | "neumorphic"
  | "aurora"
  | "y2k"
  | "asymmetric"
  | "dark-academia"
  | "fairycore"
  | "diegetic"
  | "comic"
  | "riso"
  | "skeuomorphic"
  | "memphis"
  | "card";

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

export interface PageThemeFonts {
  headlineFont:   string;
  headlineWeight: string;
  subtitleFont:   string;
  subtitleWeight: string;
  formFont:       string;
  formWeight:     string;
  buttonFont:     string;
  buttonWeight:   string;
}

// ---------------------------------------------------------------------------
// Background
// ---------------------------------------------------------------------------

export interface PageBackground {
  type:    "color" | "gradient" | "image" | "video" | "none";
  url?:    string;
  overlay?: number;
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

export interface PageTheme {
  template:     TemplateStyle;
  logoUrl:      string | null;
  logoText?:    string;
  primaryColor: string;
  accentColor:  string;
  bgColor:      string;
  textColor:    string;
  fonts?:       PageThemeFonts;
  background?:  PageBackground | null;
}

// ---------------------------------------------------------------------------
// Hero / Media
// ---------------------------------------------------------------------------

export interface HeroMedia {
  type:    "image" | "video";
  url?:    string;
  aspect?: "16:9" | "1:1" | "4:3" | "21:9" | "portrait";
}

// ---------------------------------------------------------------------------
// Offer / Lead-magnet
// ---------------------------------------------------------------------------

export interface OfferConfig {
  type?:          string;            // "pdf" | "url" | "redirect" | "message" | "text" | "link" | "file" | "video" | "image"
  deliveryMode?:  string;            // alternative discriminator used by inspector panel
  autoDownload?:  boolean;
  fileUrl?:       string | null;
  fileName?:      string | null;
  fileSize?:      string | null;
  assetId?:       string | null;
  url?:           string | null;
  linkUrl?:       string | null;     // alias for url in some UI paths
  redirectUrl?:   string | null;
  message?:       string | null;
  linkTitle?:     string | null;
  textContent?:   string | null;     // reveal-code / text offer body
  textDescription?: string | null;   // supporting description for text offers
  code?:          string | null;     // shorthand reveal code
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export interface TestimonialItem {
  id:       string;
  name:     string;
  title:    string;
  quote:    string;
  photoUrl?: string;
}

// ---------------------------------------------------------------------------
// Form success
// ---------------------------------------------------------------------------

export interface FormSuccessAction {
  type?:       "message" | "redirect" | "download" | "reveal_code";
  message?:    string;
  code?:       string;
  codeDescription?: string;
  redirectUrl?: string;
  downloadFileName?: string;
  downloadUrl?:      string;
  autoDownload?:     boolean;
}

export interface FormSuccessEffect {
  type:        "confetti" | "fireworks" | "none";
  durationMs?: number;
}

// ---------------------------------------------------------------------------
// Sponsors & Content Blocks (used by PageInspectorPanel)
// ---------------------------------------------------------------------------

export interface SponsorItem {
  id:      string;
  name:    string;
  description?: string;
  offerLine?: string;
  buttonText?: string;
  buttonUrl?: string;
  logoUrl?: string;
  imageUrl?: string;
  url?:    string;
}

export type ContentBlockType = "text" | "image" | "video" | "cta" | "divider" | "spacer" | "embed" | "faq";

export interface ContentBlockItem {
  id:      string;
  type:    ContentBlockType;
  content?: string;
  title?:  string;
  url?:    string;
  embedType?: string;
  embedTitle?: string;
  embedUrl?: string;
  faqs?:   any[];
}

// ---------------------------------------------------------------------------
// Page content
// ---------------------------------------------------------------------------

export interface PageContent {
  // Sections
  eyebrow?:                 string;
  headline?:                string;
  headlineSize?:            "sm" | "md" | "lg" | "xl";
  headlineAlign?:           "left" | "center" | "right";
  description?:             string;
  descriptionSize?:         "sm" | "md" | "lg";
  hero?:                    HeroMedia | null;
  buttonText?:              string;
  offer?:                   OfferConfig;
  additionalContentEnabled?: boolean;
  testimonials?:            TestimonialItem[];
  sponsors?:                SponsorItem[];
  contentBlocks?:           ContentBlockItem[];
  formEnabled?:             boolean;

  // Success state
  successAction?:     FormSuccessAction;
  successEffect?:     FormSuccessEffect;
  successTitle?:      string;
  successSubtitle?:   string;
  successButtonText?: string;
}
