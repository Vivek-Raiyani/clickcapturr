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
  {
    id: "minimal-monochrome",
    name: "Modern Studio",
    primary: "#ffffff",
    accent: "#a1a1aa",
    bg: "#09090b",
    text: "#ffffff",
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
    id: "bento",
    name: "Bento Grid",
    feel: "Apple-like, organized, premium",
    bestFor: "SaaS, portfolios, product features, dashboards",
    description: "Modular cards arranged in an asymmetric grid.",
    badge: "Popular",
    styleConfig: {
      layoutType: "grid",
      cardClass: "rounded-3xl bg-white/[0.04] border border-white/10 shadow-2xl backdrop-blur-md",
      inputClass: "bg-[#1c1c22] border border-neutral-700/80 rounded-xl px-3 py-2 text-white focus:border-amber-500",
      buttonClass: "rounded-xl font-bold font-sans tracking-wide uppercase shadow-lg",
      badgeClass: "rounded-full bg-white/10 text-white font-mono uppercase text-[10px] border border-white/15",
    },
  },
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
    id: "editorial",
    name: "Editorial / Magazine",
    feel: "Sophisticated, premium, creative",
    bestFor: "Agencies, fashion, publishing, portfolios",
    description: "Large typography, asymmetric layouts, whitespace, strong visual hierarchy.",
    customCss: ".editorial-heading { font-style: italic; letter-spacing: -0.02em; }",
    styleConfig: {
      layoutType: "split",
      cardClass: "rounded-sm bg-zinc-900/90 border border-zinc-700 shadow-xl",
      inputClass: "bg-zinc-900/90 border border-zinc-700 rounded-sm px-3 py-2 font-serif text-white focus:border-amber-500",
      buttonClass: "rounded-sm font-serif uppercase tracking-widest py-3 shadow-md",
      badgeClass: "font-mono uppercase tracking-widest font-semibold text-amber-400",
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
    id: "brutalist",
    name: "Brutalism",
    feel: "Bold, rebellious, experimental",
    bestFor: "Creative agencies, artists, experimental portfolios",
    description: "Raw, intentionally unconventional layouts, huge typography, harsh borders, unexpected colors.",
    badge: "Bold",
    customCss: ".brutalist-btn:hover { box-shadow: none; transform: translate(4px, 4px); }",
    styleConfig: {
      layoutType: "split",
      cardClass: "border-3 border-white bg-black shadow-[6px_6px_0px_0px_#ffffff] rounded-none",
      inputClass: "bg-black border-2 border-white rounded-none px-3 py-2 text-white font-mono shadow-[2px_2px_0px_0px_#fff]",
      buttonClass: "bg-white text-black font-mono font-black text-xs uppercase rounded-none border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] active:translate-x-1 active:translate-y-1 active:shadow-none",
      badgeClass: "bg-white text-black font-mono font-black text-xs px-3 py-1 uppercase border-2 border-white shadow-[3px_3px_0px_0px_#000]",
    },
  },
  {
    id: "neumorphic",
    name: "Neumorphism",
    feel: "Tactile, soft, physical",
    bestFor: "Small interfaces, controls, experimental UI",
    description: "Soft raised/pressed elements created through subtle shadows and highlights.",
    customCss: ".neumorphic-emboss { box-shadow: -10px -10px 24px rgba(255,255,255,0.03), 10px 10px 30px rgba(0,0,0,0.8); }",
    styleConfig: {
      layoutType: "centered",
      cardClass: "rounded-3xl bg-[#161820] border border-white/[0.04] shadow-[-10px_-10px_24px_rgba(255,255,255,0.03),10px_10px_30px_rgba(0,0,0,0.8)]",
      inputClass: "bg-[#13141a] border-0 rounded-xl px-3 py-2.5 text-white shadow-[inset_3px_3px_6px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.04)]",
      buttonClass: "rounded-xl font-bold uppercase shadow-[-4px_-4px_10px_rgba(255,255,255,0.08),4px_4px_12px_rgba(0,0,0,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]",
      badgeClass: "rounded-full text-[10px] font-mono tracking-wider font-semibold text-zinc-400 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7),inset_-2px_-2px_4px_rgba(255,255,255,0.03)] bg-[#13141a]",
    },
  },
  {
    id: "aurora",
    name: "Aurora / Gradient Mesh",
    feel: "Modern, energetic, AI-oriented",
    bestFor: "AI SaaS, tech startups, developer tools",
    description: "Large colorful gradients flowing behind content.",
    badge: "Vibrant",
    customCss: ".aurora-mesh { background: radial-gradient(ellipse at top, rgba(99,102,241,0.25), rgba(168,85,247,0.15), transparent); }",
    styleConfig: {
      layoutType: "centered",
      cardClass: "rounded-3xl border border-indigo-400/30 bg-black/50 backdrop-blur-xl shadow-[0_0_60px_-15px_rgba(99,102,241,0.35)]",
      inputClass: "bg-black/60 border border-indigo-400/40 rounded-xl px-3 py-2 text-white focus:border-indigo-400",
      buttonClass: "rounded-xl font-bold uppercase bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)]",
      badgeClass: "rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs",
    },
  },
  {
    id: "y2k",
    name: "Y2K Cyber Retro",
    feel: "Nostalgic, playful, youthful",
    bestFor: "Fashion, music, creative projects",
    description: "Chrome, gradients, bubbly typography, glossy elements and early-internet aesthetics.",
    customCss: ".y2k-glow { text-shadow: 0 0 10px rgba(0, 240, 255, 0.7); }",
    styleConfig: {
      layoutType: "split",
      cardClass: "border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)] bg-black/90",
      inputClass: "bg-black border border-cyan-400 rounded-none px-3 py-2 font-mono text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]",
      buttonClass: "rounded-none font-mono font-black uppercase bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-black shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:brightness-110 active:scale-98",
      badgeClass: "font-mono uppercase tracking-widest bg-pink-500/20 text-pink-400 border border-pink-500",
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
    id: "dark-academia",
    name: "Dark Academia",
    feel: "Intellectual, antique, contemplative, gothic scholarly",
    bestFor: "Authors, literature, historical courses, philosophy, deep newsletters",
    description: "Old books, serif typography, dark brown/black palettes, classical imagery.",
    badge: "Classic",
    customCss: ".dark-academia-border { border: 1px solid rgba(212, 163, 115, 0.35); box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }",
    styleConfig: {
      layoutType: "asymmetric",
      cardClass: "rounded-lg bg-[#140f0c]/95 border border-[#8c6d48]/40 shadow-2xl",
      inputClass: "bg-[#0b0806] border border-[#5a4430] rounded-sm px-3 py-2 font-serif text-[#f3eae0] placeholder-[#8c7a6b] focus:border-[#d4a373]",
      buttonClass: "rounded-sm font-serif font-bold uppercase tracking-widest bg-[#8c6d48] hover:bg-[#a48259] text-[#0f0a06] shadow-md transition-all",
      badgeClass: "rounded-none px-2 py-0.5 font-serif uppercase tracking-widest text-[9px] border border-[#8c6d48] text-[#d4a373] bg-[#1a130e]",
    },
  },
  {
    id: "fairycore",
    name: "Fairycore / Dreamcore",
    feel: "Whimsical, mystical, enchanted, surreal",
    bestFor: "Creative studios, mindfulness, fantasy fiction, esoteric products, lifestyle",
    description: "Dreamy, surreal, ethereal imagery with soft glowing chromatic mist.",
    badge: "Enchanted",
    customCss: ".dreamcore-glow { filter: drop-shadow(0 0 25px rgba(224, 195, 252, 0.45)); }",
    styleConfig: {
      layoutType: "centered",
      cardClass: "rounded-3xl backdrop-blur-2xl bg-white/[0.08] border border-pink-200/30 shadow-[0_0_50px_rgba(230,190,250,0.25)]",
      inputClass: "bg-white/[0.1] border border-purple-200/40 rounded-2xl px-4 py-2 text-white placeholder-purple-200/50 backdrop-blur-md focus:border-pink-300",
      buttonClass: "rounded-full font-sans font-bold tracking-wide uppercase bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 text-purple-950 shadow-[0_0_25px_rgba(244,194,244,0.6)] hover:brightness-110 active:scale-98",
      badgeClass: "rounded-full bg-pink-400/20 text-pink-200 border border-pink-300/40 font-mono text-[10px] tracking-widest shadow-xs",
    },
  },
  {
    id: "diegetic",
    name: "Diegetic UI",
    feel: "In-universe, immersive, tactical, sci-fi console",
    bestFor: "Gaming, Web3, tech hardware, interactive simulations, AR/VR",
    description: "Interface looks like it belongs inside the fictional world rather than a normal website.",
    badge: "Immersive",
    customCss: ".diegetic-grid { background-size: 16px 16px; background-image: radial-gradient(circle, rgba(16,185,129,0.15) 1px, transparent 1px); }",
    styleConfig: {
      layoutType: "grid",
      cardClass: "rounded-none border border-emerald-500/50 bg-[#04100c]/95 shadow-[0_0_30px_rgba(16,185,129,0.2)]",
      inputClass: "bg-[#020b08] border border-emerald-500/60 rounded-none px-3 py-2 font-mono text-emerald-400 placeholder-emerald-700/80 focus:border-emerald-300 shadow-[inset_0_0_8px_rgba(16,185,129,0.2)]",
      buttonClass: "rounded-none font-mono font-bold uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] active:translate-y-0.5",
      badgeClass: "rounded-none font-mono text-[9px] uppercase tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-500/70",
    },
  },
  {
    id: "comic",
    name: "Comic / Comic-Book UI",
    feel: "Vibrant, dynamic, graphic novel, action-packed",
    bestFor: "Storytellers, creative agencies, game launches, bold creator brands, podcasts",
    description: "Panels, halftones, speech bubbles, speed lines, and thick ink outlines.",
    badge: "Graphic",
    customCss: ".comic-halftone { background-image: radial-gradient(#00000022 20%, transparent 20%); background-size: 8px 8px; }",
    styleConfig: {
      layoutType: "split",
      cardClass: "rounded-none border-4 border-black bg-amber-50 shadow-[6px_6px_0px_#000000]",
      inputClass: "bg-white border-3 border-black rounded-none px-3 py-2 text-black font-sans font-bold shadow-[3px_3px_0px_#000000] focus:bg-yellow-50 focus:outline-none",
      buttonClass: "rounded-none font-black uppercase tracking-wider bg-red-500 hover:bg-red-400 text-white border-3 border-black shadow-[5px_5px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all",
      badgeClass: "font-black uppercase tracking-widest bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_#000000] -rotate-2",
    },
  },
  {
    id: "riso",
    name: "Riso / Risograph",
    feel: "Handcrafted, tactile, artistic print, retro-indie",
    bestFor: "Art prints, design agencies, indie publishers, zines, cultural events",
    description: "Limited spot ink colors, grain, and imperfect printing textures.",
    badge: "Artistic",
    customCss: ".riso-overlay { mix-blend-mode: multiply; filter: contrast(115%) brightness(95%); }",
    styleConfig: {
      layoutType: "split",
      cardClass: "rounded-none border-2 border-[#1d3557] bg-[#fbf8f3] text-[#1d3557] shadow-[5px_5px_0px_#ff4081]",
      inputClass: "bg-white border-2 border-[#1d3557] rounded-none px-3 py-2 text-[#1d3557] font-mono placeholder-[#1d3557]/50 focus:border-[#ff4081]",
      buttonClass: "rounded-none font-bold uppercase tracking-widest bg-[#ff4081] hover:bg-[#e0356f] text-white border-2 border-[#1d3557] shadow-[4px_4px_0px_#1d3557] active:shadow-none transition-all",
      badgeClass: "font-mono font-bold uppercase text-[9px] px-2 py-0.5 bg-[#ffb703] text-[#1d3557] border border-[#1d3557]",
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
  {
    id: "memphis",
    name: "Memphis Design",
    feel: "Playful, retro-80s, quirky, energetic",
    bestFor: "Creative portfolios, youth brands, bold event landing pages, funky software tools",
    description: "Colorful geometric shapes, playful patterns, and 80s-inspired design.",
    badge: "Postmodern",
    customCss: ".memphis-dots { background-image: radial-gradient(#000 12%, transparent 12%); background-size: 14px 14px; }",
    styleConfig: {
      layoutType: "asymmetric",
      cardClass: "rounded-3xl bg-amber-50 border-3 border-black shadow-[6px_6px_0px_#ff6b8b]",
      inputClass: "bg-white border-2 border-black rounded-xl px-3 py-2 text-black font-sans font-medium focus:border-black focus:ring-2 focus:ring-cyan-400",
      buttonClass: "rounded-2xl font-black uppercase tracking-wider bg-[#00f0ff] hover:bg-[#00d4e0] text-black border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all",
      badgeClass: "rounded-full font-black uppercase tracking-wider text-[10px] px-3 py-1 bg-[#ff6b8b] text-white border-2 border-black shadow-[2px_2px_0px_#000] rotate-2",
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
  buttonText: "UNLOCK INSTANT ACCESS →",
  offer: {
    type: "pdf",
    fileUrl: "https://example.com/guide.pdf",
    fileName: "creator-leverage-playbook.pdf",
    fileSize: "4.8 MB",
    assetId: null,
  },
  additionalContentEnabled: true,
  testimonials: [
    {
      id: "t-1",
      name: "Marcus Vance",
      title: "Managing Partner, Vance Media",
      quote:
        "The highest-converting lead magnet we have launched this year. Conversion rates jumped immediately.",
      photoUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "t-2",
      name: "Elena Rostova",
      title: "Founder, Zenith AI",
      quote:
        "Our QR scan-to-lead flow doubled in less than 48 hours after launching with this template.",
      photoUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  ],
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
