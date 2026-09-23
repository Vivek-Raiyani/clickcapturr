"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getCampaign, deleteCampaign, updateCampaign, CampaignResponse } from "@/lib/api/campaigns";
import { getPage, getPages, PageResponse } from "@/lib/api/pages";
import { Activity, Users, ExternalLink, Trash2, ArrowLeft, ArrowRight, Megaphone, LayoutTemplate, Pencil, Edit, Copy, Check, QrCode } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function CampaignDetails() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [activeTab, setActiveTab] = useState<"overview" | "leads">("overview");
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const [pagesList, setPagesList] = useState<PageResponse[]>([]);
  const [editPageModalOpen, setEditPageModalOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [savingPage, setSavingPage] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Edit Campaign State
  const [editCampaignModalOpen, setEditCampaignModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [editCampaignError, setEditCampaignError] = useState<string | null>(null);

  // Delete Campaign State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadCampaignAndPage = async () => {
      try {
        const campaign = await getCampaign(campaignId);
        setCampaignData(campaign);
        setSelectedPageId(campaign.page_id || "");
        
        const [pagesData] = await Promise.all([
          getPages(),
          (async () => {
            if (campaign.page_id) {
              try {
                const page = await getPage(campaign.page_id);
                setPageData(page);
              } catch (pageErr) {
                console.error("Failed to load attached page:", pageErr);
              }
            } else {
              setPageData(null);
            }
          })()
        ]);
        setPagesList(pagesData);
      } catch (err: any) {
        setError(err.message || "Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      loadCampaignAndPage();
    }
  }, [campaignId]);

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

  const handleDelete = async () => {
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

  const handleCopyLink = (shortcode: string, linkId: string) => {
    const url = `${window.location.origin}/s/${shortcode}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkId(linkId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

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

  return (
    <div className="animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
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

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={openEditCampaignModal}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors flex items-center gap-2"
            title="Edit Campaign"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 border border-border transition-colors flex items-center gap-2"
            title="Delete Campaign"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Page Reference Box */}
      <div className="mb-8 bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
            <Megaphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{campaignData.title}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            {pageData ? (
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border border-border">
                <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{pageData.name}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground italic">No Page Attached</span>
            )}
            <button
              onClick={() => {
                setSelectedPageId(campaignData?.page_id || "");
                setSaveError(null);
                setEditPageModalOpen(true);
              }}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Change Linked Page"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {pageData && (
          <Link
            href={`/public/${pageData.slug}`}
            target="_blank"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-lg"
          >
            <span>Visit Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "leads"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          Leads & Contacts
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Links Section */}
          {campaignData.links && campaignData.links.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Campaign Links</h3>
              </div>
              <div className="space-y-3">
                {campaignData.links.map(link => (
                  <div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-lg bg-background">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                      <div className="flex items-center bg-muted border border-border rounded-lg overflow-hidden flex-1 sm:max-w-md">
                        <span className="px-3 py-2 text-sm font-mono text-muted-foreground border-r border-border bg-background truncate flex-1">
                          {typeof window !== 'undefined' ? `${window.location.origin}/s/${link.shortcode}` : `/s/${link.shortcode}`}
                        </span>
                        <button 
                          onClick={() => handleCopyLink(link.shortcode, link.id)}
                          className="p-2 hover:bg-background transition-colors text-foreground flex items-center justify-center w-10 shrink-0"
                          title="Copy Link"
                        >
                          {copiedLinkId === link.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto whitespace-nowrap">
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-foreground">{link.total_clicks}</span>
                          <span className="text-xs">Clicks</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-foreground">{link.total_scans}</span>
                          <span className="text-xs">Scans</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Total Visits</h3>
              <p className="text-4xl font-bold">{campaignData.total_visits || 0}</p>
              {campaignData.total_visits > 0 ? (
                <p className="text-xs text-green-500 mt-2 font-medium">Tracking active</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">No data yet</p>
              )}
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Contacts Captured</h3>
              <p className="text-4xl font-bold">{campaignData.total_lead_captures || 0}</p>
              {campaignData.total_lead_captures > 0 ? (
                <p className="text-xs text-green-500 mt-2 font-medium">Tracking active</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">No data yet</p>
              )}
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Total Spend</h3>
              <p className="text-4xl font-bold">$0</p>
              <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Activity className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-medium mb-2">No activity yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Start driving traffic to your campaign's page to see performance metrics here.
            </p>
            {pageData && (
              <Link
                href={`/public/${pageData.slug}`}
                target="_blank"
                className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
              >
                <span>Open public page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Tab: Leads */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-16 text-center shadow-sm">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Leads Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              When visitors submit the form on this campaign's page, their details will appear here.
            </p>
          </div>
        </div>
      )}
    {/* Edit Page Modal */}
      <Modal
        open={editPageModalOpen}
        onClose={() => setEditPageModalOpen(false)}
        title="Change Linked Page"
        description="Select the page you want to link to this campaign."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Select Page
            </label>
            <select
              value={selectedPageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
            >
              <option value="">-- No page attached --</option>
              {pagesList.map(p => (
                <option key={p.id} value={p.id}>{p.name} (/{p.slug})</option>
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Campaign?"
        highlight={campaignData?.title}
        description="This will permanently delete this campaign. Note that any linked page will NOT be deleted."
        confirmLabel="Delete Campaign"
        isDangerous
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Edit Campaign Modal */}
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
