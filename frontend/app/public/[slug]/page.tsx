"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PublicPageViewer } from "@/components/page-builder/PublicPageViewer";
import { DEFAULT_PAGE_BUILDER_STATE, PageBuilderState } from "@/components/page-builder/types";
import { getPublicPage, mapPayloadToState } from "@/lib/api/pages";

export default function PublicPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await getPublicPage(slug);
        setPageData(data);
      } catch (err: any) {
        setError("This page could not be found or is not active.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Loading experience...</p>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl max-w-md text-center border border-destructive/20">
          <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
          <p className="text-sm opacity-90 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PublicPageViewer page={pageData} />
  );
}
