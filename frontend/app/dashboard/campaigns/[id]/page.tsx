"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  getCampaign,
  deleteCampaign,
  updateCampaign,
  createCampaignLink,
  deleteCampaignLink,
  CampaignResponse,
  LinkResponse,
} from "@/lib/api/campaigns";
import { getPage, getPages, PageResponse } from "@/lib/api/pages";
import {
  Activity, Users, ExternalLink, Trash2, ArrowLeft, ArrowRight,
  Megaphone, LayoutTemplate, Pencil, Edit, Copy, Check, Plus, Link2, QrCode, BarChart3
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const PLATFORM_OPTIONS = [
  { value: "", label: "— None —" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "vimeo", label: "Vimeo" },
  { value: "tiktok", label: "TikTok" },
  { value: "other", label: "Other" },
];

type ActiveView = 
  | { type: "overview" }
  | { type: "leads" }
  | { type: "link", linkId: string };

export default function CampaignDetails() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [activeView, setActiveView] = useState<ActiveView>({ type: "overview" });
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Copy shortcode
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Page linking
  const [pagesList, setPagesList] = useState<PageResponse[]>([]);
  const [editPageModalOpen, setEditPageModalOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [savingPage, setSavingPage] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Edit Campaign
  const [editCampaignModalOpen, setEditCampaignModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [editCampaignError, setEditCampaignError] = useState<string | null>(null);

  // Delete Campaign
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Create Link
  const [createLinkModalOpen, setCreateLinkModalOpen] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkPlatform, setNewLinkPlatform] = useState("");
  const [creatingLink, setCreatingLink] = useState(false);
  const [createLinkError, setCreateLinkError] = useState<string | null>(null);

  // Delete Link
  const [confirmDeleteLinkId, setConfirmDeleteLinkId] = useState<string | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  const loadCampaign = async () => {
    try {
      const campaign = await getCampaign(campaignId);
      setCampaignData(campaign);
      setSelectedPageId(campaign.page_id || "");
      if (campaign.page_id) {
        try {
          const page = await getPage(campaign.page_id);
          setPageData(page);
        } catch {
          setPageData(null);
        }
      } else {
        setPageData(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load campaign");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadCampaign();
        const pages = await getPages();
        setPagesList(pages);
      } finally {
        setLoading(false);
      }
    };
    if (campaignId) init();
  }, [campaignId]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCopyLink = (e: React.MouseEvent, shortcode: string, linkId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/s/${shortcode}`);
    setCopiedLinkId(linkId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleSavePage = async () => {
    try {
      setSavingPage(true);
      setSaveError(null);
      const newPageId = selectedPageId || null;
      const updated = await updateCampaign(campaignId, { page_id: newPageId });
      setCampaignData(updated);
      if (newPageId) {
        const page = await getPage(newPageId);
        setPageData(page);
      } else {
        setPageData(null);
      }
      setEditPageModalOpen(false);
    } catch (err: any) {
      setSaveError(err.message || "Failed to update page.");
    } finally {
      setSavingPage(false);
    }
  };

  const openEditCampaignModal = () => {
    if (campaignData) {
      setEditTitle(campaignData.title);
      setEditDescription(campaignData.description || "");
      setEditCampaignError(null);
      setEditCampaignModalOpen(true);
    }
  };

  const handleSaveCampaign = async () => {
    if (!editTitle.trim()) {
      setEditCampaignError("Campaign title is required.");
      return;
    }
    try {
      setSavingCampaign(true);
      setEditCampaignError(null);
      const updated = await updateCampaign(campaignId, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setCampaignData(updated);
      setEditCampaignModalOpen(false);
    } catch (err: any) {
      setEditCampaignError(err.message || "Failed to update campaign.");
    } finally {
      setSavingCampaign(false);
    }
  };

  const handleDeleteCampaign = async () => {
    try {
      setDeleting(true);
      await deleteCampaign(campaignId);
      router.push("/dashboard/campaigns");
    } catch (error: any) {
      console.error("Failed to delete campaign:", error);
      alert(`Failed to delete: ${error.message}`);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCreateLink = async () => {
    if (!newLinkLabel.trim()) {
      setCreateLinkError("Label is required to identify this link.");
      return;
    }
    
    try {
      setCreatingLink(true);
      setCreateLinkError(null);
      const newLink = await createCampaignLink({
        campaign_id: campaignId,
        label: newLinkLabel.trim() || undefined,
        platform: newLinkPlatform || undefined,
      });
      await loadCampaign();
      setCreateLinkModalOpen(false);
      setNewLinkLabel("");
      setNewLinkPlatform("");
      // Select the newly created link
      setActiveView({ type: "link", linkId: newLink.id });
    } catch (err: any) {
      setCreateLinkError(err.message || "Failed to create link.");
    } finally {
      setCreatingLink(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!confirmDeleteLinkId) return;
    try {
      setDeletingLinkId(confirmDeleteLinkId);
      await deleteCampaignLink(confirmDeleteLinkId);
      await loadCampaign();
      
      // If we deleted the currently active link, switch back to overview
      if (activeView.type === "link" && activeView.linkId === confirmDeleteLinkId) {
        setActiveView({ type: "overview" });
      }
      
      setConfirmDeleteLinkId(null);
    } catch (err: any) {
      console.error("Failed to delete link:", err);
      alert(`Failed to delete link: ${err.message}`);
    } finally {
      setDeletingLinkId(null);
    }
  };

  // ── Render Helpers ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !campaignData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl max-w-md text-center border border-destructive/20">
          <h2 className="text-xl font-bold mb-2">Error Loading Campaign</h2>
          <p className="text-sm opacity-90 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard/campaigns")}
            className="bg-background text-foreground px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const linkToDelete = campaignData.links.find(l => l.id === confirmDeleteLinkId);
  
  // Find active link data if a link is selected
  const activeLinkData = activeView.type === "link" 
    ? campaignData.links.find(l => l.id === activeView.linkId)
    : null;

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.push("/dashboard/campaigns")}
            className="p-2 mt-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              {campaignData.title}
            </h1>
            {campaignData.description && (
              <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                {campaignData.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openEditCampaignModal}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 border border-border transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* ── Main Layout Split ── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        
        {/* ── Left Sidebar ── */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">
          
          {/* Main Navigation */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-2 flex flex-col gap-1">
              <button
                onClick={() => setActiveView({ type: "overview" })}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView.type === "overview"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Activity className="w-4 h-4" />
                Campaign Overview
              </button>
              <button
                onClick={() => setActiveView({ type: "leads" })}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView.type === "leads"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Users className="w-4 h-4" />
                Leads & Contacts
              </button>
            </div>
          </div>

          {/* Tracking Links Navigation */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-[calc(100vh-180px)] min-h-[400px]">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Tracking Links
              </h3>
              <span className="text-xs bg-background border border-border text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                {campaignData.links.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {campaignData.links.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground italic">
                  No links created yet.
                </div>
              ) : (
                campaignData.links.map(link => {
                  const isActive = activeView.type === "link" && activeView.linkId === link.id;
                  return (
                    <div
                      key={link.id}
                      onClick={() => setActiveView({ type: "link", linkId: link.id })}
                      className={`group flex items-center justify-between p-2 rounded-lg text-sm cursor-pointer transition-colors ${
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">
                          {link.label || link.shortcode}
                        </span>
                        {link.platform && (
                          <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {link.platform}
                          </span>
                        )}
                      </div>
                      
                      {/* Action buttons (appear on hover/active) */}
                      <div className={`flex items-center gap-1 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>
                        <button
                          onClick={(e) => handleCopyLink(e, link.shortcode, link.id)}
                          className={`p-1.5 rounded-md transition-colors ${isActive ? "hover:bg-primary-foreground/20 text-primary-foreground" : "hover:bg-background text-muted-foreground"}`}
                          title="Copy Link"
                        >
                          {copiedLinkId === link.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteLinkId(link.id);
                          }}
                          className={`p-1.5 rounded-md transition-colors ${isActive ? "hover:bg-red-500/20 text-primary-foreground" : "hover:bg-red-500/10 hover:text-red-500 text-muted-foreground"}`}
                          title="Delete Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-border bg-muted/30">
              <button
                onClick={() => {
                  setNewLinkLabel("");
                  setNewLinkPlatform("");
                  setCreateLinkError(null);
                  setCreateLinkModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium bg-background border border-border hover:border-primary/50 text-foreground hover:text-primary py-2 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add New Link
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Content Area ── */}
        <div className="flex-1 w-full flex flex-col gap-5">
          
          {/* Always show what page is attached at the top of the right pane */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-muted p-2 rounded-lg">
                <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Destination Page</p>
                {pageData ? (
                  <p className="text-sm font-medium text-foreground">{pageData.name}</p>
                ) : (
                  <p className="text-sm text-destructive font-medium">No Page Attached</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedPageId(campaignData?.page_id || "");
                  setSaveError(null);
                  setEditPageModalOpen(true);
                }}
                className="text-xs font-medium px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors border border-border"
              >
                Change Page
              </button>
              {pageData && (
                <Link
                  href={`/public/${pageData.slug}`}
                  target="_blank"
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg"
                >
                  <span>Open Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {/* VIEW: OVERVIEW */}
          {activeView.type === "overview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Campaign Overview
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Total Visits
                    </h3>
                    <p className="text-5xl font-bold text-foreground">{campaignData.total_visits || 0}</p>
                  </div>
                  {campaignData.total_visits > 0 ? (
                    <p className="text-xs text-green-500 mt-4 font-medium">Across all tracking links and direct visits</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-4">No traffic recorded yet</p>
                  )}
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Contacts Captured
                    </h3>
                    <p className="text-5xl font-bold text-foreground">{campaignData.total_lead_captures || 0}</p>
                  </div>
                  {campaignData.total_lead_captures > 0 ? (
                    <p className="text-xs text-green-500 mt-4 font-medium">From connected page form submissions</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-4">No leads recorded yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: LEADS */}
          {activeView.type === "leads" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Leads & Contacts
              </h2>
              
              <div className="bg-card border border-border rounded-xl p-16 text-center shadow-sm">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-foreground">No Leads Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  When visitors submit the form on this campaign's page, their details will appear here.
                </p>
              </div>
            </div>
          )}

          {/* VIEW: SINGLE LINK */}
          {activeView.type === "link" && activeLinkData && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link2 className="w-4 h-4 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      {activeLinkData.label || "Unlabeled Link"}
                    </h2>
                    {activeLinkData.platform && (
                      <span className="text-[10px] bg-muted border border-border uppercase tracking-wider px-2 py-0.5 rounded-full text-muted-foreground ml-2">
                        {activeLinkData.platform}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <div className="bg-muted border border-border rounded-md px-3 py-1.5 flex items-center">
                      <span className="text-sm font-mono text-muted-foreground truncate max-w-[200px] sm:max-w-md">
                        {typeof window !== "undefined"
                          ? `${window.location.origin}/s/${activeLinkData.shortcode}`
                          : `/s/${activeLinkData.shortcode}`}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleCopyLink(e, activeLinkData.shortcode, activeLinkData.id)}
                      className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                      title="Copy Link"
                    >
                      {copiedLinkId === activeLinkData.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-4 bg-card border border-border p-3 rounded-lg shadow-sm">
                  <div className="flex flex-col items-center px-4 border-r border-border">
                    <span className="text-2xl font-bold text-foreground leading-none">{activeLinkData.total_clicks}</span>
                    <span className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">Clicks</span>
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <span className="text-2xl font-bold text-foreground leading-none">{activeLinkData.total_scans}</span>
                    <span className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">Scans</span>
                  </div>
                </div>
              </div>

              {/* QR Code Section Placeholder */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    QR Code Configuration
                  </h3>
                </div>
                <div className="p-12 text-center flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                  <QrCode className="w-16 h-16 text-muted-foreground/20 mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">Design Your QR Code</h4>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Custom colors, patterns, and logos will be configurable here soon. Each link gets its own unique QR code that tracks scans independently.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ── Modals ── (Kept identical functionally) */}

      <Modal
        open={createLinkModalOpen}
        onClose={() => setCreateLinkModalOpen(false)}
        title="Add Campaign Link"
        description="Create a new trackable link for this campaign. Each link tracks clicks and QR scans independently."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Label <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder='e.g. "YouTube Main Video"'
              value={newLinkLabel}
              onChange={(e) => setNewLinkLabel(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Platform <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <select
              value={newLinkPlatform}
              onChange={(e) => setNewLinkPlatform(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
            >
              {PLATFORM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {createLinkError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {createLinkError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setCreateLinkModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateLink}
              disabled={creatingLink}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {creatingLink ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Create Link
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDeleteLinkId}
        title="Delete Link?"
        highlight={linkToDelete?.label || linkToDelete?.shortcode}
        description="This will permanently delete this link. Existing clicks and scans data will be lost. This cannot be undone."
        confirmLabel="Delete Link"
        isDangerous
        isLoading={!!deletingLinkId}
        onConfirm={handleDeleteLink}
        onCancel={() => setConfirmDeleteLinkId(null)}
      />

      <Modal
        open={editPageModalOpen}
        onClose={() => setEditPageModalOpen(false)}
        title="Change Linked Page"
        description="Select the page you want to link to this campaign."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Select Page</label>
            <select
              value={selectedPageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
            >
              <option value="">-- No page attached --</option>
              {pagesList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (/{p.slug})
                </option>
              ))}
            </select>
          </div>

          {saveError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {saveError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setEditPageModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePage}
              disabled={savingPage}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {savingPage ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Campaign?"
        highlight={campaignData?.title}
        description="This will permanently delete this campaign and all its links. Note that any linked page will NOT be deleted."
        confirmLabel="Delete Campaign"
        isDangerous
        isLoading={deleting}
        onConfirm={handleDeleteCampaign}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <Modal
        open={editCampaignModalOpen}
        onClose={() => setEditCampaignModalOpen(false)}
        title="Edit Campaign"
        description="Update the title and description for this campaign."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          {editCampaignError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {editCampaignError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setEditCampaignModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCampaign}
              disabled={savingCampaign || !editTitle.trim()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {savingCampaign ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
