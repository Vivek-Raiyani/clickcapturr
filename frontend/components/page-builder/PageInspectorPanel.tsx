"use client";

import * as React from "react";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Link2,
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  UploadCloud,
  FileCheck,
  ExternalLink,
  KeyRound,
  Download,
  CheckCircle2,
  Globe,
  DollarSign,
  Type,
  User,
  HelpCircle,
  Code,
  X,
  Layers,
  Film,
  ChevronUp,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import type {
  PageTheme,
  PageContent,
  SponsorItem,
  ContentBlockItem,
  ContentBlockType,
} from "@/types/page";
import type { FormField } from "@/types";
import { PageThemeEditor } from "./PageThemeEditor";
import { FormFieldEditor } from "./FormFieldEditor";
import { Toast } from "@/components/ui/Toast";
import type { BuilderSection, PageBuilderState } from "./types";

export interface PageInspectorPanelProps {
  activeSection: BuilderSection;
  state: PageBuilderState;
  pageId?: string;
  onUpdateTheme: (updater: (prev: PageTheme) => PageTheme) => void;
  onUpdateContent: (updater: (prev: PageContent) => PageContent) => void;
  onUpdateFormFields: (fields: FormField[]) => void;
}

/**
 * Contextual right-sidebar inspector providing precise configuration controls
 * for whichever section is currently active.
 *
 * Fully styled with the application's unified theme design tokens
 * (`muted`, `card`, `border`, `foreground`, `primary`).
 */
export function PageInspectorPanel({
  activeSection,
  state,
  onUpdateTheme,
  onUpdateContent,
  onUpdateFormFields,
  pageId,
}: PageInspectorPanelProps) {
  const { content, theme, formFields } = state;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentDeliverableCategory: "file" | "link" | "text" =
    content.offer?.type === "link"
      ? "link"
      : content.offer?.type === "text"
      ? "text"
      : "file";

  const [isUploading, setIsUploading] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setIsUploading(true);
    try {
      const { uploadFile, deleteFile } = await import("@/lib/api/storage");
      
      // Delete existing file if one is already uploaded (fallback for client-side deduplication)
      if (content.offer?.fileName && content.offer?.fileUrl && !pageId) {
        try {
          await deleteFile(content.offer.fileName);
        } catch (delError) {
          console.warn("Failed to delete previous file:", delError);
        }
      }

      // Pass pageId so backend clears the page folder before uploading
      const publicUrl = await uploadFile(file, pageId);

      onUpdateContent((prev) => ({
        ...prev,
        offer: {
          ...prev.offer,
          type: "pdf",
          deliveryMode: "upload",
          fileName: file.name,
          fileSize: formattedSize,
          fileUrl: publicUrl,
          assetId: null,
        },
        successAction: {
          ...prev.successAction,
          type: "download",
          downloadFileName: file.name,
          downloadUrl: publicUrl,
        },
        successTitle: prev.successTitle || "You're In!",
        successSubtitle: prev.successSubtitle || "Your resources are ready for immediate download below.",
      }));
      
      // Show success toast/alert
      setToastMessage({ message: "File uploaded successfully!", type: "success" });
      
    } catch (error: any) {
      setToastMessage({ message: error.message || "Failed to upload file", type: "error" });
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (e.target) e.target.value = '';
    }
  };

  const handleSelectDeliverableType = (newCategory: "file" | "link" | "text") => {
    if (newCategory === "file") {
      onUpdateContent((prev) => ({
        ...prev,
        offer: {
          ...prev.offer,
          type: "pdf",
          deliveryMode: prev.offer?.deliveryMode || "upload",
          fileName: prev.offer?.fileName || "creator-playbook.pdf",
          fileSize: prev.offer?.fileSize || "4.8 MB",
          fileUrl: prev.offer?.fileUrl || null,
          assetId: null,
        },
        successAction: {
          ...prev.successAction,
          type: "download",
          downloadFileName: prev.offer?.fileName || "creator-playbook.pdf",
        },
        successTitle: "You're In!",
        successSubtitle: "Your resources are ready for immediate download below.",
      }));
    } else if (newCategory === "link") {
      onUpdateContent((prev) => ({
        ...prev,
        offer: {
          ...prev.offer,
          type: "link",
          linkUrl: prev.offer?.linkUrl || prev.offer?.fileUrl || "https://notion.so/workspace-guide",
          linkTitle: prev.offer?.linkTitle || "Private Resource Hub",
          fileName: prev.offer?.linkTitle || "Private Resource Hub",
          fileSize: null,
          fileUrl: prev.offer?.linkUrl || "https://notion.so/workspace-guide",
          assetId: null,
        },
        successAction: {
          ...prev.successAction,
          type: "redirect",
          redirectUrl: prev.offer?.linkUrl || "https://notion.so/workspace-guide",
        },
        successTitle: "Access Granted!",
        successSubtitle: "Click below to enter your private resource hub.",
      }));
    } else if (newCategory === "text") {
      onUpdateContent((prev) => ({
        ...prev,
        offer: {
          ...prev.offer,
          type: "text",
          textContent: prev.offer?.textContent || prev.successAction?.code || "VIP-ACCESS-2024",
          textDescription: prev.offer?.textDescription || "Apply this code at checkout to claim your 20% discount.",
          fileName: null,
          fileSize: null,
          fileUrl: null,
          assetId: null,
        },
        successAction: {
          ...prev.successAction,
          type: "reveal_code",
          code: prev.offer?.textContent || "VIP-ACCESS-2024",
          codeDescription: prev.offer?.textDescription || "Apply this code at checkout to claim your 20% discount.",
        },
        successTitle: "Access Unlocked!",
        successSubtitle: "Your exclusive access code is ready below.",
      }));
    }
  };

  const [showAddBlockModal, setShowAddBlockModal] = React.useState(false);

  const addSponsor = () => {
    const newSponsor: SponsorItem = {
      id: `sp-${Date.now()}`,
      name: "Brand Sponsor",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
      description: "Supercharge your creator workflow with intelligent asset distribution.",
      offerLine: "Get 20% off with code SPECIAL",
      buttonText: "Learn More",
      buttonUrl: "https://example.com",
    };
    onUpdateContent((prev) => ({
      ...prev,
      sponsorsEnabled: true,
      sponsors: [...(prev.sponsors || []), newSponsor],
    }));
  };

  const updateSponsor = (id: string, field: keyof SponsorItem, value: any) => {
    onUpdateContent((prev) => ({
      ...prev,
      sponsors: (prev.sponsors || []).map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const removeSponsor = (id: string) => {
    onUpdateContent((prev) => ({
      ...prev,
      sponsors: (prev.sponsors || []).filter((s) => s.id !== id),
    }));
  };

  const addContentBlock = (type: "text" | "faq" | "embed") => {
    const id = `cb-${Date.now()}`;
    let newBlock: ContentBlockItem;

    if (type === "embed") {
      newBlock = {
        id,
        type: "embed",
        embedType: "youtube",
        embedTitle: "Featured Video Breakdown",
        embedUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      };
    } else if (type === "text") {
      newBlock = {
        id,
        type: "text",
        title: "About The Program",
        content: "Here is what you will learn inside this exclusive curriculum and operational playbook.",
      };
    } else {
      newBlock = {
        id,
        type: "faq",
        faqs: [
          { question: "How quickly do I get access?", answer: "Instantly upon registration. Access details are displayed immediately." },
          { question: "Is there any cost involved?", answer: "No, this is 100% free with no hidden paywalls." },
        ],
      };
    }

    onUpdateContent((prev) => ({
      ...prev,
      additionalContentEnabled: true,
      contentBlocks: [...(prev.contentBlocks || []), newBlock],
    }));
    setShowAddBlockModal(false);
  };

  const moveContentBlock = (index: number, direction: "up" | "down") => {
    const blocks = [...(content.contentBlocks || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const temp = blocks[index];
    blocks[index] = blocks[targetIndex];
    blocks[targetIndex] = temp;
    onUpdateContent((prev) => ({
      ...prev,
      contentBlocks: blocks,
    }));
  };

  const regenerateContentBlock = (id: string) => {
    const topic = content.headline || content.eyebrow || "high-leverage growth";
    updateContentBlock(id, (b) => {
      if (b.type === "text") {
        const textOptions = [
          {
            title: "What You Will Discover",
            content: `Inside this tactical blueprint, you will uncover step-by-step methodologies engineered specifically for ${topic.toLowerCase()}. Every concept is battle-tested to maximize your conversion velocity and build genuine leverage.`,
          },
          {
            title: "Core Curriculum Breakdown",
            content: `1. Foundation & Positioning: Establishing an undeniable value proposition.\n2. Asset Multiplication: Converting attention into automated, high-margin pipeline.\n3. The Retention Flywheel: Keeping subscribers engaged and ready to buy.`,
          },
          {
            title: "Why Traditional Playbooks Fail",
            content: `Most advice in this space is outdated. This curriculum bypasses generic theories and delivers actionable execution frameworks that generate verifiable ROI from day one.`,
          },
        ];
        const next = textOptions[Math.floor(Math.random() * textOptions.length)];
        return { ...b, title: next.title, content: next.content };
      }

      if (b.type === "faq") {
        const faqVariations = [
          [
            { question: "How quickly do I get access?", answer: "Instantly upon registration. A backup access link is also emailed immediately." },
            { question: "Is there any cost involved?", answer: "No, this master asset is 100% free with no hidden paywalls." },
            { question: "Who is this material designed for?", answer: "Founders, creators, and operators seeking repeatable leverage and scalable audience monetization." },
          ],
          [
            { question: "Can I share this resource with my team?", answer: "Yes, you have full permission to distribute this internally within your organization." },
            { question: "What format does this guide come in?", answer: "Instant access via downloadable high-resolution PDF and interactive companion workspace." },
            { question: "How long does it take to implement?", answer: "Most readers implement the core framework in under 48 hours." },
          ],
        ];
        const nextFaqs = faqVariations[Math.floor(Math.random() * faqVariations.length)];
        return { ...b, faqs: nextFaqs };
      }

      if (b.type === "embed") {
        const embedPresets = [
          { title: "Exclusive Breakdown Masterclass", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
          { title: "Framework Walkthrough & Case Study", url: "https://www.youtube.com/watch?v=LXb3EKWsInQ" },
        ];
        const nextEmbed = embedPresets[Math.floor(Math.random() * embedPresets.length)];
        return { ...b, embedTitle: nextEmbed.title, embedUrl: nextEmbed.url };
      }

      return b;
    });
  };

  const updateContentBlock = (id: string, updater: (prev: ContentBlockItem) => ContentBlockItem) => {
    onUpdateContent((prev) => ({
      ...prev,
      contentBlocks: (prev.contentBlocks || []).map((b) => (b.id === id ? updater(b) : b)),
    }));
  };

  const removeContentBlock = (id: string) => {
    onUpdateContent((prev) => ({
      ...prev,
      contentBlocks: (prev.contentBlocks || []).filter((b) => b.id !== id),
    }));
  };

  const addTestimonial = () => {
    const newId = `t-${Date.now()}`;
    const newTestimonial = {
      id: newId,
      name: "Marcus Vance",
      title: "Managing Partner, Vance Media",
      quote:
        "The highest-converting lead magnet we have launched this year. Conversion rates jumped immediately.",
      photoUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    };
    onUpdateContent((prev) => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), newTestimonial],
    }));
  };

  const removeTestimonial = (id: string) => {
    onUpdateContent((prev) => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((t) => t.id !== id),
    }));
  };

  const updateTestimonial = (
    id: string,
    field: "name" | "title" | "quote" | "photoUrl",
    val: string
  ) => {
    onUpdateContent((prev) => ({
      ...prev,
      testimonials: (prev.testimonials || []).map((t) =>
        t.id === id ? { ...t, [field]: val } : t
      ),
    }));
  };

  const isDesignSection =
    activeSection === "template" ||
    activeSection === "fonts" ||
    activeSection === "colors" ||
    activeSection === "logo" ||
    activeSection === "background";

  const sectionTitleMap: Record<string, string> = {
    template: "Layout Architecture",
    fonts: "Typography Studio",
    colors: "Color & Palette",
    logo: "Brand & Wordmark",
    background: "Atmosphere & Canvas",
    headline: "Headline Copy",
    description: "Subheadline & Body",
    hero: "Hero Media Visual",
    button: "Call To Action",
    form: "Lead Capture Form",
    offer: "Offer Deliverable",
    additionalContent: "Additional Content",
    sponsors: "Sponsor Cards",
    socialProof: "Social Proof",
    success: "Success Screen",
  };

  return (
    <aside className="w-72 sm:w-80 border-l border-border bg-muted flex flex-col shrink-0">
      <div className="h-12 border-b border-border px-4 flex items-center justify-between bg-background">
        <div className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground truncate pr-2">
          {sectionTitleMap[activeSection] || activeSection.replace(/([A-Z])/g, " $1")}
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono shrink-0">
          {isDesignSection ? "Theme" : "Content"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 1. HEADLINE */}
        {activeSection === "headline" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Eyebrow / Category Tag
              </label>
              <input
                type="text"
                value={content.eyebrow || ""}
                onChange={(e) =>
                  onUpdateContent((prev) => ({ ...prev, eyebrow: e.target.value }))
                }
                placeholder="e.g. EXCLUSIVE ACCESS"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Main Headline
              </label>
              <textarea
                rows={3}
                value={content.headline}
                onChange={(e) =>
                  onUpdateContent((prev) => ({ ...prev, headline: e.target.value }))
                }
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary resize-none transition-colors"
              />
            </div>

            <div>
            </div>
          </div>
        )}

        {/* 2. DESCRIPTION */}
        {activeSection === "description" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Value Pitch / Description
              </label>
              <textarea
                rows={5}
                value={content.description}
                onChange={(e) =>
                  onUpdateContent((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary resize-none transition-colors leading-relaxed"
              />
            </div>


          </div>
        )}

        {/* 3. HERO MEDIA */}
        {activeSection === "hero" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateContent((prev) => ({
                    ...prev,
                    hero: {
                      type: "image",
                      url:
                        prev.hero?.url ||
                        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
                      aspect: prev.hero?.aspect || "16:9",
                    },
                  }))
                }
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-colors ${
                  content.hero?.type === "image"
                    ? "bg-primary/15 border-primary text-foreground"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateContent((prev) => ({
                    ...prev,
                    hero: {
                      type: "video",
                      url:
                        prev.hero?.url ||
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                      aspect: prev.hero?.aspect || "16:9",
                    },
                  }))
                }
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-colors ${
                  content.hero?.type === "video"
                    ? "bg-primary/15 border-primary text-foreground"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video</span>
              </button>
            </div>

            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Media URL
              </label>
              <input
                type="url"
                value={content.hero?.url || ""}
                onChange={(e) =>
                  onUpdateContent((prev) => ({
                    ...prev,
                    hero: prev.hero
                      ? { ...prev.hero, url: e.target.value }
                      : { type: "image", url: e.target.value, aspect: "16:9" },
                  }))
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>


          </div>
        )}

        {/* 4. BUTTON */}
        {activeSection === "button" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Primary Call To Action Text
              </label>
              <input
                type="text"
                value={content.buttonText}
                onChange={(e) =>
                  onUpdateContent((prev) => ({ ...prev, buttonText: e.target.value }))
                }
                placeholder="e.g. GET THE DOSSIER →"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        )}

        {/* 5. OFFER DELIVERABLE */}
        {activeSection === "offer" && (
          <div className="space-y-4">
            {/* Hidden file input for file upload simulation */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Deliverable Format
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectDeliverableType("file")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all ${
                    currentDeliverableCategory === "file"
                      ? "bg-primary/15 border-primary text-foreground shadow-xs"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[11px] font-bold">File</span>
                  <span className="text-[9px] text-muted-foreground">PDF, Asset</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDeliverableType("link")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all ${
                    currentDeliverableCategory === "link"
                      ? "bg-primary/15 border-primary text-foreground shadow-xs"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Link</span>
                  <span className="text-[9px] text-muted-foreground">Notion, URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDeliverableType("text")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all ${
                    currentDeliverableCategory === "text"
                      ? "bg-primary/15 border-primary text-foreground shadow-xs"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Text</span>
                  <span className="text-[9px] text-muted-foreground">Code, Key</span>
                </button>
              </div>
            </div>

            {/* CONDITIONAL A: FILE DELIVERABLE */}
            {currentDeliverableCategory === "file" && (
              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">
                    Delivery Source
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 bg-muted p-1 rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateContent((prev) => ({
                          ...prev,
                          offer: { ...prev.offer, deliveryMode: "upload" },
                        }))
                      }
                      className={`py-1.5 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                        (content.offer?.deliveryMode || "upload") === "upload"
                          ? "bg-card text-foreground shadow-xs border border-border/50"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateContent((prev) => ({
                          ...prev,
                          offer: { ...prev.offer, deliveryMode: "url" },
                        }))
                      }
                      className={`py-1.5 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                        content.offer?.deliveryMode === "url"
                          ? "bg-card text-foreground shadow-xs border border-border/50"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Provide Link</span>
                    </button>
                  </div>
                </div>

                {(content.offer?.deliveryMode || "upload") === "upload" ? (
                  /* Upload Mode */
                  <div className="space-y-3">
                    <div
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={`border-2 border-dashed border-border rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center gap-2 group ${
                        isUploading 
                          ? "opacity-70 cursor-wait bg-card" 
                          : "hover:border-primary/60 cursor-pointer bg-card/60 hover:bg-card"
                      }`}
                    >
                      {isUploading ? (
                        <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          {isUploading 
                            ? "Uploading..." 
                            : (content.offer?.fileName ? "Replace Uploaded File" : "Upload Deliverable File")}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {isUploading ? "Please wait while we secure your file" : "Supports PDF, ZIP, MP4, EPUB, DOCX (Max 50MB)"}
                        </div>
                      </div>
                    </div>

                    {content.offer?.fileName && (
                      <div className="p-2.5 rounded-xl bg-card border border-border flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-foreground">
                              {content.offer.fileName}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {content.offer.fileSize || "Ready"}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] text-primary hover:underline shrink-0 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-foreground font-medium mb-1.5">
                        Display File Name
                      </label>
                      <input
                        type="text"
                        value={content.offer?.fileName || ""}
                        onChange={(e) =>
                          onUpdateContent((prev) => ({
                            ...prev,
                            offer: { ...prev.offer, fileName: e.target.value },
                            successAction: {
                              ...prev.successAction,
                              downloadFileName: e.target.value,
                            },
                          }))
                        }
                        placeholder="e.g. creator-playbook.pdf"
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-foreground font-medium mb-1.5">
                        File Size Label
                      </label>
                      <input
                        type="text"
                        value={content.offer?.fileSize || ""}
                        onChange={(e) =>
                          onUpdateContent((prev) => ({
                            ...prev,
                            offer: { ...prev.offer, fileSize: e.target.value },
                          }))
                        }
                        placeholder="e.g. 4.8 MB"
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  /* External URL Mode */
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-foreground font-medium mb-1.5">
                        Direct File Download URL
                      </label>
                      <input
                        type="url"
                        value={content.offer?.fileUrl || ""}
                        onChange={(e) =>
                          onUpdateContent((prev) => ({
                            ...prev,
                            offer: { ...prev.offer, fileUrl: e.target.value },
                            successAction: {
                              ...prev.successAction,
                              downloadUrl: e.target.value,
                            },
                          }))
                        }
                        placeholder="https://drive.google.com/... or https://..."
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-foreground font-medium mb-1.5">
                        Display File Name
                      </label>
                      <input
                        type="text"
                        value={content.offer?.fileName || ""}
                        onChange={(e) =>
                          onUpdateContent((prev) => ({
                            ...prev,
                            offer: { ...prev.offer, fileName: e.target.value },
                            successAction: {
                              ...prev.successAction,
                              downloadFileName: e.target.value,
                            },
                          }))
                        }
                        placeholder="e.g. 2026-playbook.pdf"
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-foreground font-medium mb-1.5">
                        File Size Label
                      </label>
                      <input
                        type="text"
                        value={content.offer?.fileSize || ""}
                        onChange={(e) =>
                          onUpdateContent((prev) => ({
                            ...prev,
                            offer: { ...prev.offer, fileSize: e.target.value },
                          }))
                        }
                        placeholder="e.g. 4.8 MB"
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Automation trigger toggle */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.offer?.autoDownload || content.successAction?.autoDownload || false}
                      onChange={(e) =>
                        onUpdateContent((prev) => ({
                          ...prev,
                          offer: { ...prev.offer, autoDownload: e.target.checked },
                          successAction: { ...prev.successAction, autoDownload: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 mt-0.5 rounded bg-card border-border text-primary focus:ring-0 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <span className="font-medium">Auto-Trigger Download</span>
                      <p className="text-[10.5px] text-muted-foreground">
                        Initiate download immediately when subscriber enters the success view.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* CONDITIONAL B: LINK DELIVERABLE */}
            {currentDeliverableCategory === "link" && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs text-foreground font-medium mb-1.5">
                    Destination Resource URL
                  </label>
                  <input
                    type="url"
                    value={content.offer?.linkUrl || content.offer?.fileUrl || ""}
                    onChange={(e) =>
                      onUpdateContent((prev) => ({
                        ...prev,
                        offer: {
                          ...prev.offer,
                          linkUrl: e.target.value,
                          fileUrl: e.target.value,
                        },
                        successAction: {
                          ...prev.successAction,
                          redirectUrl: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://notion.so/... or https://..."
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-foreground font-medium mb-1.5">
                    Resource Display Title
                  </label>
                  <input
                    type="text"
                    value={content.offer?.linkTitle || content.offer?.fileName || ""}
                    onChange={(e) =>
                      onUpdateContent((prev) => ({
                        ...prev,
                        offer: {
                          ...prev.offer,
                          linkTitle: e.target.value,
                          fileName: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Private Notion Creator OS"
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}

            {/* CONDITIONAL C: TEXT DELIVERABLE */}
            {currentDeliverableCategory === "text" && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs text-foreground font-medium mb-1.5">
                    Access Code / Text Value
                  </label>
                  <input
                    type="text"
                    value={content.offer?.textContent || content.successAction?.code || ""}
                    onChange={(e) =>
                      onUpdateContent((prev) => ({
                        ...prev,
                        offer: { ...prev.offer, textContent: e.target.value },
                        successAction: { ...prev.successAction, code: e.target.value },
                      }))
                    }
                    placeholder="e.g. VIP-ACCESS-2024"
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-primary transition-colors font-bold uppercase tracking-widest"
                  />
                </div>

                <div>
                  <label className="block text-xs text-foreground font-medium mb-1.5">
                    Instructions / Description
                  </label>
                  <textarea
                    rows={2}
                    value={content.offer?.textDescription || content.successAction?.codeDescription || ""}
                    onChange={(e) =>
                      onUpdateContent((prev) => ({
                        ...prev,
                        offer: { ...prev.offer, textDescription: e.target.value },
                        successAction: { ...prev.successAction, codeDescription: e.target.value },
                      }))
                    }
                    placeholder="e.g. Enter this code at checkout to claim your 20% discount."
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground resize-none focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. SOCIAL PROOF */}
        {activeSection === "socialProof" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.additionalContentEnabled}
                  onChange={(e) =>
                    onUpdateContent((prev) => ({
                      ...prev,
                      additionalContentEnabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded bg-card border-border text-primary focus:ring-0 cursor-pointer"
                />
                <span>Enable Social Proof</span>
              </label>
              <button
                type="button"
                onClick={addTestimonial}
                className="text-xs text-primary hover:text-primary/90 flex items-center gap-1 cursor-pointer font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-3">
              {content.testimonials?.map((t, idx) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-card border border-border space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      #{idx + 1} Testimonial
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(t.id)}
                      className="text-muted-foreground hover:text-red-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => updateTestimonial(t.id, "name", e.target.value)}
                    placeholder="Author Name"
                    className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={t.title}
                    onChange={(e) => updateTestimonial(t.id, "title", e.target.value)}
                    placeholder="Title / Role"
                    className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                  <textarea
                    rows={2}
                    value={t.quote}
                    onChange={(e) => updateTestimonial(t.id, "quote", e.target.value)}
                    placeholder="Quote content"
                    className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-xs text-foreground resize-none focus:outline-none focus:border-primary"
                  />
                  <input
                    type="url"
                    value={t.photoUrl || ""}
                    onChange={(e) => updateTestimonial(t.id, "photoUrl", e.target.value)}
                    placeholder="Photo URL (Optional)"
                    className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SUCCESS SCREEN */}
        {activeSection === "success" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Success Headline
              </label>
              <input
                type="text"
                value={content.successTitle}
                onChange={(e) =>
                  onUpdateContent((prev) => ({ ...prev, successTitle: e.target.value }))
                }
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Success Message
              </label>
              <textarea
                rows={3}
                value={content.successSubtitle}
                onChange={(e) =>
                  onUpdateContent((prev) => ({
                    ...prev,
                    successSubtitle: e.target.value,
                  }))
                }
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground resize-none focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Post-Submit Action
              </label>
              <select
                value={
                  currentDeliverableCategory === "file" && content.successAction?.autoDownload
                    ? "download_auto"
                    : (content.successAction?.type || "message")
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "download_auto") {
                    onUpdateContent((prev) => ({
                      ...prev,
                      successAction: {
                        ...prev.successAction,
                        type: "download",
                        autoDownload: true,
                      },
                      offer: {
                        ...prev.offer,
                        autoDownload: true,
                      },
                    }));
                  } else {
                    onUpdateContent((prev) => ({
                      ...prev,
                      successAction: {
                        ...prev.successAction,
                        type: val as PageContent["successAction"]["type"],
                        autoDownload: false,
                      },
                      offer: {
                        ...prev.offer,
                        autoDownload: false,
                      },
                    }));
                  }
                }}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                {currentDeliverableCategory === "file" ? (
                  <>
                    <option value="download">Download Resource (Manual Button)</option>
                    <option value="download_auto">Auto-Trigger Download + Button</option>
                    <option value="message">Confirmation Message Only</option>
                  </>
                ) : currentDeliverableCategory === "link" ? (
                  <>
                    <option value="redirect">Direct Redirect To Link</option>
                    <option value="download">Open Link (Resource Portal Button)</option>
                    <option value="message">Confirmation Message Only</option>
                  </>
                ) : (
                  <>
                    <option value="reveal_code">Reveal Access / Promo Code</option>
                    <option value="message">Confirmation Message Only</option>
                  </>
                )}
              </select>
            </div>

            {content.successAction.type === "redirect" && (
              <div>
                <label className="block text-xs text-foreground mb-1">
                  Redirect URL
                </label>
                <input
                  type="url"
                  value={content.successAction.redirectUrl || content.offer?.linkUrl || ""}
                  onChange={(e) =>
                    onUpdateContent((prev) => ({
                      ...prev,
                      successAction: { ...prev.successAction, redirectUrl: e.target.value },
                      offer: { ...prev.offer, linkUrl: e.target.value },
                    }))
                  }
                  placeholder="https://..."
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            )}

            {content.successAction.type === "reveal_code" && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-foreground mb-1">
                    Voucher / Access Code
                  </label>
                  <input
                    type="text"
                    value={content.successAction.code || content.offer?.textContent || ""}
                    onChange={(e) =>
                      onUpdateContent((prev) => ({
                        ...prev,
                        successAction: { ...prev.successAction, code: e.target.value },
                        offer: { ...prev.offer, textContent: e.target.value },
                      }))
                    }
                    placeholder="VIP-ACCESS-2024"
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">
                Celebration Effect
              </label>
              <select
                value={content.successEffect?.type || "none"}
                onChange={(e) =>
                  onUpdateContent((prev) => ({
                    ...prev,
                    successEffect:
                      e.target.value === "none"
                        ? null
                        : {
                            type: e.target.value as "confetti" | "fireworks" | "sparkles",
                            durationMs: 3500,
                          },
                  }))
                }
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="none">None</option>
                <option value="confetti">Celebratory Confetti</option>
                <option value="fireworks">Fireworks Burst</option>
                <option value="sparkles">Golden Sparkles</option>
              </select>
            </div>
          </div>
        )}

        {/* 6. ADDITIONAL CONTENT */}
        {activeSection === "additionalContent" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-foreground">Content Blocks</div>
                <div className="text-[11px] text-muted-foreground">
                  {(content.contentBlocks || []).length} blocks configured
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBlockModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Block</span>
              </button>
            </div>

            {(!content.contentBlocks || content.contentBlocks.length === 0) && (
              <div className="p-6 rounded-2xl border border-dashed border-border text-center space-y-2.5 bg-card/30">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-foreground">No Content Blocks</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Enhance your conversion page with video embeds (YouTube), FAQs, testimonials, or rich text sections.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddBlockModal(true)}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/25 cursor-pointer transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Content Block</span>
                </button>
              </div>
            )}

            <div className="space-y-3">
              {(content.contentBlocks || []).map((block, idx) => (
                <div
                  key={block.id}
                  className="p-3.5 rounded-xl bg-card border border-border space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-primary/15 text-primary flex items-center justify-center text-[10px] font-mono font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-foreground capitalize">
                        {block.type === "embed"
                          ? "Video / Embed"
                          : block.type === "faq"
                          ? "FAQ Section"
                          : "Additional Text"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* AI Regenerate / Refresh button */}
                      <button
                        type="button"
                        onClick={() => regenerateContentBlock(block.id)}
                        className="px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[10.5px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Regenerate this block with AI"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Regen</span>
                      </button>

                      {/* Reorder Up */}
                      <button
                        type="button"
                        onClick={() => moveContentBlock(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Move block up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Reorder Down */}
                      <button
                        type="button"
                        onClick={() => moveContentBlock(idx, "down")}
                        disabled={idx === (content.contentBlocks || []).length - 1}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Move block down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeContentBlock(block.id)}
                        className="p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ml-1"
                        title="Remove block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* EMBED BLOCK */}
                  {block.type === "embed" && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-foreground mb-1">
                          Block Title / Header
                        </label>
                        <input
                          type="text"
                          value={block.embedTitle || ""}
                          onChange={(e) =>
                            updateContentBlock(block.id, (b) => ({
                              ...b,
                              embedTitle: e.target.value,
                            }))
                          }
                          placeholder="e.g. video or Featured Masterclass"
                          className="w-full bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-foreground mb-1">
                          Embed Platform
                        </label>
                        <select
                          value={block.embedType || "youtube"}
                          onChange={(e) =>
                            updateContentBlock(block.id, (b) => ({
                              ...b,
                              embedType: e.target.value as any,
                            }))
                          }
                          className="w-full bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="youtube">YouTube Video</option>
                          <option value="vimeo">Vimeo Video</option>
                          <option value="calendly">Calendly Booking</option>
                          <option value="custom">Web Embed / Iframe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-foreground mb-1">
                          Embed URL
                        </label>
                        <input
                          type="url"
                          value={block.embedUrl || ""}
                          onChange={(e) =>
                            updateContentBlock(block.id, (b) => ({
                              ...b,
                              embedUrl: e.target.value,
                            }))
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
                        />
                        <span className="text-[10px] text-muted-foreground mt-1 block">
                          Paste YouTube or Vimeo URL. It automatically embeds responsively.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TEXT BLOCK */}
                  {block.type === "text" && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-foreground mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={block.title || ""}
                          onChange={(e) =>
                            updateContentBlock(block.id, (b) => ({ ...b, title: e.target.value }))
                          }
                          placeholder="About this program"
                          className="w-full bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-foreground mb-1">
                          Text Content
                        </label>
                        <textarea
                          rows={4}
                          value={block.content || ""}
                          onChange={(e) =>
                            updateContentBlock(block.id, (b) => ({ ...b, content: e.target.value }))
                          }
                          placeholder="Outline key benefits or additional context here..."
                          className="w-full bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground resize-none focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  )}


                  {/* FAQ BLOCK */}
                  {block.type === "faq" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-foreground">Q&A Questions</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateContentBlock(block.id, (b) => ({
                              ...b,
                              faqs: [
                                ...(b.faqs || []),
                                { question: "New Question?", answer: "Answer description." },
                              ],
                            }))
                          }
                          className="text-[10px] text-primary hover:underline font-medium cursor-pointer"
                        >
                          + Add Question
                        </button>
                      </div>
                      {(block.faqs || []).map((faq, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-2 rounded-lg bg-muted border border-border space-y-1.5 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-muted-foreground">
                              Q{fIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateContentBlock(block.id, (b) => ({
                                  ...b,
                                  faqs: (b.faqs || []).filter((_, i) => i !== fIdx),
                                }))
                              }
                              className="text-muted-foreground hover:text-red-400 p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) =>
                              updateContentBlock(block.id, (b) => ({
                                ...b,
                                faqs: (b.faqs || []).map((item, i) =>
                                  i === fIdx ? { ...item, question: e.target.value } : item
                                ),
                              }))
                            }
                            placeholder="Question"
                            className="w-full bg-card border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                          />
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) =>
                              updateContentBlock(block.id, (b) => ({
                                ...b,
                                faqs: (b.faqs || []).map((item, i) =>
                                  i === fIdx ? { ...item, answer: e.target.value } : item
                                ),
                              }))
                            }
                            placeholder="Answer"
                            className="w-full bg-card border border-border rounded px-2 py-1 text-xs text-foreground resize-none focus:outline-none focus:border-primary"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SPONSOR CARDS */}
        {activeSection === "sponsors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.sponsorsEnabled ?? false}
                  onChange={(e) =>
                    onUpdateContent((prev) => ({
                      ...prev,
                      sponsorsEnabled: e.target.checked,
                      sponsors:
                        e.target.checked && (!prev.sponsors || prev.sponsors.length === 0)
                          ? [
                              {
                                id: `sp-1`,
                                name: "Sponsor Partner",
                                logoUrl:
                                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
                                imageUrl:
                                  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
                                description: "One-line description of the sponsor",
                                offerLine: "Get 20% off with code CREATOR",
                                buttonText: "Learn More",
                                buttonUrl: "https://example.com",
                              },
                            ]
                          : prev.sponsors,
                    }))
                  }
                  className="w-4 h-4 rounded bg-card border-border text-primary focus:ring-0 cursor-pointer"
                />
                <span className="font-medium">Enable Sponsor Cards</span>
              </label>

              <button
                type="button"
                onClick={addSponsor}
                className="text-xs text-primary hover:text-primary/90 flex items-center gap-1 cursor-pointer font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Sponsor</span>
              </button>
            </div>

            {(!content.sponsors || content.sponsors.length === 0) && content.sponsorsEnabled && (
              <div className="p-4 rounded-xl border border-dashed border-border text-center space-y-2 bg-card/30">
                <p className="text-xs text-muted-foreground">No sponsors added yet.</p>
                <button
                  type="button"
                  onClick={addSponsor}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  + Add First Sponsor
                </button>
              </div>
            )}

            <div className="space-y-4">
              {(content.sponsors || []).map((sponsor, idx) => (
                <div
                  key={sponsor.id}
                  className="p-3.5 rounded-xl bg-card border border-border space-y-3 text-left"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-mono font-semibold text-foreground">
                      Sponsor {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSponsor(sponsor.id)}
                      className="text-muted-foreground hover:text-red-400 p-1 cursor-pointer transition-colors"
                      title="Remove sponsor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Logo (transparent PNG) */}
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1.5">
                      Logo (transparent PNG)
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {sponsor.logoUrl ? (
                          <img
                            src={sponsor.logoUrl}
                            alt="Logo preview"
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <UploadCloud className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <input
                          type="url"
                          value={sponsor.logoUrl || ""}
                          onChange={(e) => updateSponsor(sponsor.id, "logoUrl", e.target.value)}
                          placeholder="https://... logo PNG"
                          className="w-full bg-muted border border-border rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                        <span className="text-[10px] text-muted-foreground block">
                          Paste transparent PNG URL or brand badge
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sponsor Image (recommended 400x300) */}
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1.5">
                      Sponsor Image (recommended 400x300)
                    </label>
                    {sponsor.imageUrl ? (
                      <div className="relative rounded-xl border border-border overflow-hidden group mb-1.5">
                        <img
                          src={sponsor.imageUrl}
                          alt="Sponsor visual"
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => updateSponsor(sponsor.id, "imageUrl", "")}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          updateSponsor(
                            sponsor.id,
                            "imageUrl",
                            "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
                          )
                        }
                        className="w-full h-24 border-2 border-dashed border-border hover:border-primary/50 rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors bg-muted/40 group"
                      >
                        <UploadCloud className="w-5 h-5 text-muted-foreground group-hover:text-primary mb-1 transition-colors" />
                        <span className="text-[10.5px] text-muted-foreground group-hover:text-foreground font-medium">
                          Sponsor Image (recommended 400x300)
                        </span>
                        <span className="text-[9.5px] text-muted-foreground/70">
                          Click to load sample or paste URL below
                        </span>
                      </div>
                    )}
                    <input
                      type="url"
                      value={sponsor.imageUrl || ""}
                      onChange={(e) => updateSponsor(sponsor.id, "imageUrl", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full mt-1 bg-muted border border-border rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Description (0/80) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-medium text-foreground">Description</label>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {(sponsor.description || "").length}/80
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={80}
                      value={sponsor.description}
                      onChange={(e) => updateSponsor(sponsor.id, "description", e.target.value)}
                      placeholder="One-line description of the sponsor"
                      className="w-full bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Sponsor Offer Line (0/60) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-medium text-foreground">
                        Sponsor Offer Line
                      </label>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {(sponsor.offerLine || "").length}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={60}
                      value={sponsor.offerLine || ""}
                      onChange={(e) => updateSponsor(sponsor.id, "offerLine", e.target.value)}
                      placeholder="E.g. Get 20% off with code SPECIAL"
                      className="w-full bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Button Text & Button URL */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-foreground">
                          Button Text
                        </label>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {(sponsor.buttonText || "").length}/30
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={30}
                        value={sponsor.buttonText}
                        onChange={(e) => updateSponsor(sponsor.id, "buttonText", e.target.value)}
                        placeholder="Learn More"
                        className="w-full bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <div className="mb-1">
                        <label className="text-[11px] font-medium text-foreground">Button URL</label>
                      </div>
                      <input
                        type="url"
                        value={sponsor.buttonUrl}
                        onChange={(e) => updateSponsor(sponsor.id, "buttonUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. FORM FIELDS */}
        {activeSection === "form" && (
          <FormFieldEditor
            fields={formFields}
            onChange={onUpdateFormFields}
          />
        )}

        {/* 9. DESIGN SECTIONS DELEGATED TO PageThemeEditor */}
        {(activeSection === "template" ||
          activeSection === "logo" ||
          activeSection === "colors" ||
          activeSection === "fonts" ||
          activeSection === "background") && (
          <PageThemeEditor
            theme={theme}
            onChange={onUpdateTheme}
            activeSection={activeSection}
          />
        )}
      </div>

      {/* MODAL: ADD CONTENT BLOCK (Matching Screenshot 2) */}
      {showAddBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-muted border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Add Content Block</h3>
              <button
                type="button"
                onClick={() => setShowAddBlockModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-card transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Block Options (Matching Screenshot 2) */}
            <div className="p-4 space-y-2.5">
              {/* Option 1: Additional Text */}
              <button
                type="button"
                onClick={() => addContentBlock("text")}
                className="w-full p-3.5 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/40 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-muted border border-border group-hover:border-primary/30 text-foreground group-hover:text-primary shrink-0 transition-colors">
                  <Type className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Additional Text
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Add formatted text content
                  </div>
                </div>
              </button>


              {/* Option 3: FAQ Section */}
              <button
                type="button"
                onClick={() => addContentBlock("faq")}
                className="w-full p-3.5 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/40 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-muted border border-border group-hover:border-primary/30 text-foreground group-hover:text-primary shrink-0 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    FAQ Section
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Add frequently asked questions
                  </div>
                </div>
              </button>

              {/* Option 4: Embed */}
              <button
                type="button"
                onClick={() => addContentBlock("embed")}
                className="w-full p-3.5 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/40 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-muted border border-border group-hover:border-primary/30 text-foreground group-hover:text-primary shrink-0 transition-colors">
                  <Code className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Embed
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    YouTube, Calendly, Google Maps & more
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            message={toastMessage.message}
            type={toastMessage.type}
            onDismiss={() => setToastMessage(null)}
          />
        </div>
      )}
    </aside>
  );
}
