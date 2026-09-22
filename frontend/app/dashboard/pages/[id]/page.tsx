"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { DEFAULT_PAGE_BUILDER_STATE, PageBuilderState } from "@/components/page-builder/types";
import { getPage, deletePage, mapPayloadToState, PageResponse } from "@/lib/api/pages";
import { Activity, Users, ExternalLink, Pencil, Trash2, ArrowLeft } from "lucide-react";

export default function PageDetails() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [activeTab, setActiveTab] = useState<"overview" | "leads">("overview");
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await getPage(pageId);
        setPageData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      try {
        await deletePage(pageId);
        router.push("/dashboard/pages");
      } catch (error: any) {
        console.error("Failed to delete page:", error);
        alert(`Failed to delete: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl max-w-md text-center border border-destructive/20">
          <h2 className="text-xl font-bold mb-2">Error Loading Page</h2>
          <p className="text-sm opacity-90 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard/pages")}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/pages")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">{pageData.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded border border-border">
                /{pageData.slug}
              </span>
              <Link
                href={`/public/${pageData.slug}`}
                target="_blank"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <span>Visit Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 border border-border transition-colors"
            title="Delete Page"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            href={`/dashboard/pages/${pageId}/builder`}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit in Builder
          </Link>
        </div>
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
          Contacts
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Total Views</h3>
              <p className="text-4xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-2">No data yet</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">QR Scans</h3>
              <p className="text-4xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-2">No data yet</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Contacts Captured</h3>
              <p className="text-4xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-2">No data yet</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Activity className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-medium mb-2">No activity yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Share your page link or QR code to start collecting views and contacts.
            </p>
            <Link
              href={`/public/${pageData.slug}`}
              target="_blank"
              className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
            >
              <span>Open public page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab: Contacts */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-16 text-center shadow-sm">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Contacts Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              When visitors submit the form on your landing page, their details will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
