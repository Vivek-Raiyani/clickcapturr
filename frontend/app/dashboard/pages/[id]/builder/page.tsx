"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import { DEFAULT_PAGE_BUILDER_STATE, PageBuilderState } from "@/components/page-builder/types";
import { getPage, updatePage, deletePage, mapPayloadToState, mapStateToPayload } from "@/lib/api/pages";

export default function PageBuilderRoute() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [initialState, setInitialState] = useState<PageBuilderState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await getPage(pageId);
        const mappedState = mapPayloadToState(data, DEFAULT_PAGE_BUILDER_STATE);
        setInitialState(mappedState);
      } catch (err: any) {
        setError(err.message || "Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    if (pageId) loadPage();
  }, [pageId]);

  const handleSave = async (state: PageBuilderState) => {
    try {
      setSaving(true);
      const payload = mapStateToPayload(state);
      await updatePage(pageId, payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to update page:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      try {
        await deletePage(pageId);
        router.push("/dashboard/pages");
      } catch (error: any) {
        alert(`Failed to delete: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Loading builder...</p>
      </div>
    );
  }

  if (error || !initialState) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
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
    <div className="fixed inset-0 z-50 bg-background">
      <PageBuilder
        mode="production"
        initialState={initialState}
        backHref={`/dashboard/pages/${pageId}`}
        onSave={handleSave}
        onDeletePage={handleDelete}
        saving={saving}
        savedSuccess={savedSuccess}
      />
    </div>
  );
}
