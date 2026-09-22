"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPages, createPage, deletePage, PageResponse, mapStateToPayload } from "@/lib/api/pages";
import { DEFAULT_PAGE_BUILDER_STATE } from "@/components/page-builder/types";
import { LayoutTemplate, Plus, FileEdit, ExternalLink, Loader2, ArrowRight, Trash2, Search, X } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PagesList() {
  const router = useRouter();
  const [pages, setPages] = useState<PageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<PageResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const data = await getPages();
        setPages(data);
      } catch (err: any) {
        setError(err.message || "Failed to load pages");
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  // Auto-generate slug from name unless manually edited
  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(name));
    }
  }, [name, slugEdited]);

  // Filtered pages — instant client-side search by name or slug
  const filteredPages = pages.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  const openModal = () => {
    setName("");
    setSlug("");
    setDescription("");
    setSlugEdited(false);
    setCreateError(null);
    setModalOpen(true);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const handleCreate = async () => {
    if (!name.trim()) { setCreateError("Page name is required."); return; }
    if (!slug.trim()) { setCreateError("Slug is required."); return; }

    try {
      setCreating(true);
      setCreateError(null);

      const defaultState = {
        ...DEFAULT_PAGE_BUILDER_STATE,
        title: name.trim(),
        slug: slug.trim(),
        content: {
          ...DEFAULT_PAGE_BUILDER_STATE.content,
          description: description.trim() || DEFAULT_PAGE_BUILDER_STATE.content.description,
        },
      };

      const payload = mapStateToPayload(defaultState);
      const newPage = await createPage(payload);
      setModalOpen(false);
      router.push(`/dashboard/pages/${newPage.id}/builder`);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create page.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deletePage(deleteTarget.id);
      setPages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete page.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Your Pages</h1>
          <p className="text-muted-foreground">Manage and create high-converting landing pages.</p>
        </div>
        <button
          onClick={openModal}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Page
        </button>
      </div>

      {/* Search bar — only shown when pages exist */}
      {!loading && !error && pages.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages by name or slug..."
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

      {loading ? (
        <div className="flex justify-center py-20 text-muted-foreground">
          <div className="animate-pulse">Loading pages...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">{error}</div>
      ) : pages.length === 0 ? (
        // Empty state — no pages at all
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-card/50">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
            <LayoutTemplate className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium mb-2">No pages yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Create your first landing page and start capturing leads with QR codes and short links.
          </p>
          <button
            onClick={openModal}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create New Page
          </button>
        </div>
      ) : filteredPages.length === 0 ? (
        // No search results
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-10 h-10 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium mb-2">No pages match "{searchQuery}"</h3>
          <p className="text-sm text-muted-foreground mb-4">Try a different name or slug.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-sm text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-muted w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`/public/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
                    title="View public page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {/* Delete button — visible on hover */}
                  <button
                    onClick={() => setDeleteTarget(page)}
                    className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-lg opacity-0 group-hover:opacity-100"
                    title="Delete page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 truncate">{page.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 truncate font-mono">/{page.slug}</p>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <Link
                  href={`/dashboard/pages/${page.id}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View Details
                </Link>
                <Link
                  href={`/dashboard/pages/${page.id}/builder`}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg border border-border hover:border-primary/30"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Create Page Modal ──────────────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Page"
        description="You'll be taken to the builder right after."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Page Name <span className="text-red-400">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Creator Playbook Download"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              URL Slug <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:border-primary/60 transition-colors">
              <span className="text-xs text-muted-foreground bg-muted px-3 py-2.5 border-r border-border font-mono whitespace-nowrap">
                /public/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true); }}
                placeholder="creator-playbook"
                className="flex-1 bg-background px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of what this page offers..."
              rows={2}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          {createError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {createError}
            </p>
          )}

          <button
            onClick={handleCreate}
            disabled={creating || !name.trim()}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {creating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
            ) : (
              <>Open in Builder <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </Modal>

      {/* ─── Delete Confirmation Modal ──────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Page?"
        highlight={deleteTarget?.name}
        description="This will remove the page, all its settings, and any associated contacts. This action cannot be undone."
        confirmLabel="Delete Page"
        isDangerous
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
