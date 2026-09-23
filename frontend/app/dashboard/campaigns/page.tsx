"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign, CampaignResponse } from "@/lib/api/campaigns";
import { getPages, PageResponse } from "@/lib/api/pages";
import { Megaphone, Plus, Trash2, Search, X, Edit, LayoutTemplate } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";

export default function CampaignsList() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [pages, setPages] = useState<PageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageId, setPageId] = useState<string>("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsData, pagesData] = await Promise.all([
          getCampaigns(),
          getPages()
        ]);
        setCampaigns(campaignsData);
        setPages(pagesData);
      } catch (err: any) {
        setError(err.message || "Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return c.title.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q);
  });

  const openModal = () => {
    setSaveError(null);
    setTitle("");
    setDescription("");
    setPageId("");
    setModalOpen(true);
    setTimeout(() => titleInputRef.current?.focus(), 100);
  };

  const handleSave = async () => {
    if (!title.trim()) { setSaveError("Campaign title is required."); return; }

    try {
      setSaving(true);
      setSaveError(null);

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        page_id: pageId || null
      };

      const created = await createCampaign(payload);
      setCampaigns(prev => [created, ...prev]);
      
      setModalOpen(false);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  const getPageName = (id: string | null) => {
    if (!id) return "No Page Attached";
    const page = pages.find(p => p.id === id);
    return page ? page.name : "Unknown Page";
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Campaigns</h1>
          <p className="text-muted-foreground">Manage your marketing campaigns and track their associated pages.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      {/* Search */}
      {!loading && !error && campaigns.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20 text-muted-foreground">
          <div className="animate-pulse">Loading campaigns...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">{error}</div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-card/50">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
            <Megaphone className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Create a campaign to organize and track your marketing efforts.
          </p>
          <button
            onClick={() => openModal()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create Campaign
          </button>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-10 h-10 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium mb-2">No campaigns match "{searchQuery}"</h3>
          <button onClick={() => setSearchQuery("")} className="text-sm text-primary hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary">
                  <Megaphone className="w-5 h-5" />
                </div>
                <Link
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
                >
                  View Details
                </Link>
              </div>
              
              <h3 className="text-lg font-bold mb-1 truncate">{campaign.title}</h3>
              {campaign.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{campaign.description}</p>
              )}
              
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
                  <span className={`text-sm ${campaign.page_id ? 'text-foreground font-medium' : 'text-muted-foreground italic'}`}>
                    {getPageName(campaign.page_id)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Campaign"
        description="Fill in the campaign details below."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Sale 2024"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the campaign..."
              rows={3}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Linked Page <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <select
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
            >
              <option value="">-- No page selected --</option>
              {pages.map(p => (
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
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Campaign"}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
