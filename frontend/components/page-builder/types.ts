import type {
  PageTheme,
  PageContent,
  TemplateStyle,
  PageThemeFonts,
  HeroMedia,
  OfferConfig,
  TestimonialItem,
  FormSuccessAction,
  FormSuccessEffect,
} from "@/types/page";
import type { FormField, FormFieldOption } from "@/types";

export type BuilderTab = "content" | "design";

export type BuilderSection =
  | "headline"
  | "description"
  | "hero"
  | "button"
  | "offer"
  | "form"
  | "socialProof"
  | "additionalContent"
  | "sponsors"
  | "success"
  | "template"
  | "logo"
  | "colors"
  | "fonts"
  | "background";

export type DeviceMode = "desktop" | "tablet" | "mobile";

/** Full state managed inside the visual PageBuilder */
export interface PageBuilderState {
  title: string;
  slug: string;
  theme: PageTheme;
  content: PageContent;
  formFields: FormField[];
  showSuccessPreview?: boolean;
}

export interface ColorThemeOption {
  id: string;
  name: string;
  primary: string;
  accent: string;
  bg: string;
  text: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  {
    id: "app-primary",
    name: "VueMagnet Luxury (App Theme)",
    primary: "#f59e0b",
    accent: "#fbbf24",
    bg: "#09090b",
    text: "#f4f4f5",
  },
  {
    id: "luxury-gold",
    name: "High Horology (Gold & Charcoal)",
    primary: "#d4af37",
    accent: "#f59e0b",
    bg: "#09090b",
    text: "#f4f4f5",
  },
  {
    id: "obsidian-emerald",
    name: "Cyber Emerald",
    primary: "#10b981",
    accent: "#34d399",
    bg: "#050807",
    text: "#ecfdf5",
  },
  {
    id: "electric-sapphire",
    name: "Electric Sapphire",
    primary: "#3b82f6",
    accent: "#60a5fa",
    bg: "#050714",
    text: "#eff6ff",
  },
  {
    id: "royal-amethyst",
    name: "Royal Amethyst",
    primary: "#a855f7",
    accent: "#c084fc",
    bg: "#0a0512",
    text: "#faf5ff",
  },
];

export interface TemplateStyleConfig {
  layoutType?: "grid" | "split" | "centered" | "asymmetric";
  cardClass?: string;
  inputClass?: string;
  buttonClass?: string;
  badgeClass?: string;
}

export interface TemplateDefinition {
  id: TemplateStyle;
  name: string;
  feel: string;
  bestFor: string;
  description: string;
  badge?: string;
  customCss?: string;
  styleConfig?: TemplateStyleConfig;
}

/**
 * 10 Distinctive Landing Page Architecture Styles.
 * These serve as the default fallback presets when offline or unseeded,
 * and can be dynamically overridden or augmented via `page_templates` in the database.
 */
export const TEMPLATE_STYLES: TemplateDefinition[] = [
  {
    id: "glass",
    name: "Glassmorphism",
    feel: "Futuristic, elegant, soft",
    bestFor: "AI products, fintech, dashboards, futuristic landing pages",
    description: "Semi-transparent surfaces, blur, borders, and layered backgrounds.",
    badge: "Trending",
    customCss: ".glass-glow { backdrop-filter: blur(24px); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); }",
    styleConfig: {
      layoutType: "centered",
      cardClass: "rounded-3xl backdrop-blur-2xl bg-white/[0.07] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
      inputClass: "bg-white/[0.06] border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 backdrop-blur-md focus:border-white/50",
      buttonClass: "rounded-xl font-bold uppercase backdrop-blur-md border border-white/25 shadow-lg shadow-black/40",
      badgeClass: "rounded-full bg-white/10 border border-white/25 text-white shadow-xs backdrop-blur-md",
    },
  },
  {
    id: "split",
    name: "Split Screen",
    feel: "Editorial, balanced, dramatic",
    bestFor: "SaaS hero sections, portfolios, product launches",
    description: "The page is divided into two major visual/content areas.",
    styleConfig: {
      layoutType: "split",
      cardClass: "rounded-2xl bg-[#121216]/95 border border-white/10 shadow-2xl",
      inputClass: "bg-[#1c1c22] border border-neutral-700/80 rounded-xl px-3 py-2 text-white focus:border-amber-500",
      buttonClass: "rounded-xl font-bold uppercase shadow-lg",
      badgeClass: "rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border",
    },
  },
  {
    id: "minimal",
    name: "Minimalism",
    feel: "Clean, premium, calm",
    bestFor: "Apple-style products, luxury brands, portfolios",
    description: "Very few elements, lots of whitespace, restrained typography and colors.",
    styleConfig: {
      layoutType: "centered",
      cardClass: "bg-transparent border-0 shadow-none",
      inputClass: "bg-transparent border-b border-white/25 rounded-none px-1 py-2 text-white placeholder-zinc-500 focus:border-white",
      buttonClass: "rounded-full font-medium uppercase tracking-widest py-2.5 shadow-sm",
      badgeClass: "font-mono tracking-widest uppercase text-zinc-500",
    },
  },
  {
    id: "asymmetric",
    name: "Asymmetric Layout",
    feel: "Artistic, sophisticated",
    bestFor: "Creative portfolios, agencies, fashion",
    description: "Elements deliberately don't align into a conventional symmetrical structure.",
    styleConfig: {
      layoutType: "asymmetric",
      cardClass: "rounded-3xl bg-[#131317]/95 border border-white/20 shadow-2xl backdrop-blur-md",
      inputClass: "bg-[#1c1c22] border border-neutral-700/80 rounded-xl px-3 py-2 text-white focus:border-amber-500",
      buttonClass: "rounded-xl font-bold font-sans tracking-wide uppercase shadow-lg",
      badgeClass: "-rotate-1 rounded-sm font-mono uppercase tracking-wider font-bold bg-amber-400 text-black shadow-md",
    },
  },
  {
    id: "skeuomorphic",
    name: "Skeuomorphism",
    feel: "Tactile, tangible, mechanical, vintage premium",
    bestFor: "Audio plugins, luxury hardware, precision tools, analog synthesizers, craftsmanship",
    description: "UI designed to look like real physical objects with beveled tactile edges and screws.",
    badge: "Physical",
    customCss: ".skeuo-bevel { box-shadow: inset 1px 1px 2px rgba(255,255,255,0.25), inset -1px -1px 3px rgba(0,0,0,0.8), 0 8px 20px rgba(0,0,0,0.6); }",
    styleConfig: {
      layoutType: "centered",
      cardClass: "rounded-2xl bg-gradient-to-b from-[#2a2c33] to-[#1c1d22] border border-[#444855] shadow-[0_12px_32px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)]",
      inputClass: "bg-[#141519] border border-[#2b2d35] rounded-xl px-3 py-2 text-zinc-100 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.85),inset_-1px_-1px_2px_rgba(255,255,255,0.06)] focus:border-[#f59e0b]/70",
      buttonClass: "rounded-xl font-bold uppercase tracking-wider bg-gradient-to-b from-[#e89410] via-[#c67802] to-[#995900] text-amber-50 border-t border-amber-300/60 shadow-[0_6px_14px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.5)] active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(0,0,0,0.8)]",
      badgeClass: "rounded-md font-mono text-[9px] uppercase px-2 py-0.5 bg-[#141519] text-amber-400 border border-amber-500/30 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.9)]",
    },
  },
];

export const FONT_OPTIONS: Array<{
  id: string;
  name: string;
  category: "serif" | "sans" | "mono";
  fontFamily: string;
  previewSample: string;
}> = [
  {
    id: "serif-playfair",
    name: "Playfair Display",
    category: "serif",
    fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
    previewSample: "The High-Leverage Playbook",
  },
  {
    id: "serif-cormorant",
    name: "Cormorant Garamond",
    category: "serif",
    fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)",
    previewSample: "Antiquarian Literature & Wisdom",
  },
  {
    id: "sans-inter",
    name: "Inter Sans",
    category: "sans",
    fontFamily: "var(--font-inter, 'Inter', system-ui, sans-serif)",
    previewSample: "Modern High-Conversion Architecture",
  },
  {
    id: "sans-outfit",
    name: "Outfit Clean",
    category: "sans",
    fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
    previewSample: "Minimalist Geometry & Clean UI",
  },
  {
    id: "mono-jet",
    name: "JetBrains Mono",
    category: "mono",
    fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
    previewSample: "const access = unlockPass();",
  },
];

export const DEFAULT_PAGE_FONTS: PageThemeFonts = {
  headlineFont: "Playfair Display",
  headlineWeight: "700",
  subtitleFont: "Inter",
  subtitleWeight: "400",
  formFont: "Inter",
  formWeight: "500",
  buttonFont: "Inter",
  buttonWeight: "600",
};

export const DEFAULT_PAGE_THEME: PageTheme = {
  template: "split",
  logoUrl: null,
  logoText: "VueMagnet",
  primaryColor: "#d4af37",
  accentColor: "#f59e0b",
  bgColor: "#09090b",
  textColor: "#f4f4f5",
  fonts: DEFAULT_PAGE_FONTS,
  background: null,
};

export const DEFAULT_PAGE_CONTENT: PageContent = {
  eyebrow: "EXCLUSIVE ACCESS",
  headline: "Master The High-Leverage Creator Playbook",
  headlineSize: "lg",
  headlineAlign: "left",
  description:
    "Discover the exact step-by-step framework to turn social attention into high-margin owned audience and recurring revenue.",
  descriptionSize: "md",
  hero: {
    type: "image",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
    aspect: "16:9",
  },
  buttonText: "UNLOCK INSTANT ACCESS",
  offer: {
    type: "pdf",
    fileUrl: "https://example.com/guide.pdf",
    fileName: "creator-leverage-playbook.pdf",
    fileSize: "4.8 MB",
    assetId: null,
  },
  additionalContentEnabled: false,
  testimonials: [],
  formEnabled: true,
  successAction: {
    type: "message",
    message: "Check your inbox! We just sent your download link and instructions.",
  },
  successEffect: {
    type: "confetti",
    durationMs: 3500,
  },
  successTitle: "You're In!",
  successSubtitle: "Your resources are ready for immediate download below.",
  successButtonText: "Download Resource Now",
};

export const DEFAULT_FORM_FIELDS: FormField[] = [
  {
    id: "first_name",
    pageId: "",
    label: "First Name",
    fieldType: "text",
    isRequired: true,
    sortOrder: 0,
    optionsJson: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "last_name",
    pageId: "",
    label: "Last Name",
    fieldType: "text",
    isRequired: false,
    sortOrder: 1,
    optionsJson: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "email",
    pageId: "",
    label: "Email",
    fieldType: "email",
    isRequired: true,
    sortOrder: 2,
    optionsJson: null,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_PAGE_BUILDER_STATE: PageBuilderState = {
  title: "The Creator Playbook",
  slug: "creator-playbook",
  theme: DEFAULT_PAGE_THEME,
  content: DEFAULT_PAGE_CONTENT,
  formFields: DEFAULT_FORM_FIELDS,
  showSuccessPreview: false,
};

export interface AIPreset {
  name: string;
  theme: Partial<PageTheme>;
  content: Partial<PageContent>;
}

export const SAMPLE_AI_PRESETS: Record<string, AIPreset> = {
  "luxury-horology": {
    name: "Luxury Horology",
    theme: {
      template: "split",
      primaryColor: "#d4af37",
      accentColor: "#f59e0b",
      bgColor: "#08080a",
      textColor: "#f4f4f5",
      fonts: {
        ...DEFAULT_PAGE_FONTS,
        headlineFont: "Playfair Display",
      },
    },
    content: {
      eyebrow: "PRIVATE COLLECTOR DOSSIER",
      headline: "The 2026 Rare Timepiece Investment Index",
      description:
        "Gain access to proprietary auction market analytics, verified serial valuation charts, and private collector acquisition strategies.",
      buttonText: "REQUEST THE DOSSIER →",
      offer: {
        type: "pdf",
        fileName: "2026-horology-index.pdf",
        fileSize: "8.4 MB",
        fileUrl: "https://example.com/dossier.pdf",
        assetId: null,
      },
      hero: {
        type: "image",
        url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
        aspect: "16:9",
      },
    },
  },
  "saas-playbook": {
    name: "SaaS Playbook",
    theme: {
      template: "glass",
      primaryColor: "#3b82f6",
      accentColor: "#60a5fa",
      bgColor: "#060913",
      textColor: "#ffffff",
      fonts: {
        ...DEFAULT_PAGE_FONTS,
        headlineFont: "Outfit",
      },
    },
    content: {
      eyebrow: "ZERO TO $1M ARR",
      headline: "The 10-Step B2B Product-Led Growth Engine",
      description:
        "The tactical blueprint used by 45+ bootstrapped founders to scale retention, optimize funnel economics, and accelerate enterprise conversions.",
      buttonText: "GET FREE PLAYBOOK →",
      offer: {
        type: "pdf",
        fileName: "plg-engine-playbook.pdf",
        fileSize: "3.2 MB",
        fileUrl: "https://example.com/plg.pdf",
        assetId: null,
      },
      hero: {
        type: "image",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        aspect: "16:9",
      },
    },
  },
  "creator-newsletter": {
    name: "Creator Newsletter",
    theme: {
      template: "card",
      primaryColor: "#10b981",
      accentColor: "#34d399",
      bgColor: "#060807",
      textColor: "#f4f4f5",
      fonts: {
        ...DEFAULT_PAGE_FONTS,
        headlineFont: "Inter",
      },
    },
    content: {
      eyebrow: "WEEKLY INSIGHTS",
      headline: "High-Margin Creator Systems Dissected Every Sunday",
      description:
        "Join 14,000+ founders and operators getting tactical breakdowns on audience monetization, programmatic assets, and QR funnel architecture.",
      buttonText: "JOIN FREE NEWSLETTER →",
      offer: {
        type: "text",
        fileName: "welcome-edition",
        fileSize: null,
        fileUrl: null,
        assetId: null,
      },
      hero: {
        type: "image",
        url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
        aspect: "16:9",
      },
    },
  },
};
