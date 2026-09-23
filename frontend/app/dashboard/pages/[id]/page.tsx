"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { DEFAULT_PAGE_BUILDER_STATE, PageBuilderState } from "@/components/page-builder/types";
import { getPage, deletePage, mapPayloadToState, PageResponse } from "@/lib/api/pages";
import { updateCampaignLink } from "@/lib/api/campaigns";
import { Activity, Users, ExternalLink, Pencil, Trash2, ArrowLeft, Copy, QrCode, Check, TrendingUp } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { QrPreview } from "@/components/features/links/QrPreview";
import { QRConfig } from "@/types/qr";

import { useAuth } from "@/context/AuthContext";
import { ContactsTable } from "@/components/features/contacts/ContactsTable";
import { listSubmissionsAction } from "@/actions/form.actions";
import { FormSubmission } from "@/types";

export default function PageDetails() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isQrSaving, setIsQrSaving] = useState(false);

  useEffect(() => {
    if (token && pageId && submissions.length === 0) {
      setLoadingContacts(true);
      listSubmissionsAction(pageId, token).then(result => {
        if (result.success && result.data) {
          setSubmissions(result.data);
        }
        setLoadingContacts(false);
      });
    }
  }, [token, pageId, submissions.length]);

  const handleSaveQrConfig = async (config: QRConfig) => {
    if (!pageData?.link?.id) return;
    setIsQrSaving(true);
    try {
      await updateCampaignLink(pageData.link.id, { qr_config: config });
      setPageData(prev => prev ? ({
        ...prev,
        link: { ...prev.link, qr_config: config }
      }) : null);
      setQrModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save QR configuration");
    } finally {
      setIsQrSaving(false);
    }
  };

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

  const handleCopyLink = () => {
    if (!pageData?.link) return;
    const url = `${window.location.origin}/s/${pageData.link.shortcode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="flex flex-row items-start justify-between gap-2 sm:gap-4 mb-8">
        <div className="flex items-start gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => router.push("/dashboard/pages")}
            className="p-1.5 sm:p-2 mt-0.5 sm:mt-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground truncate">{pageData.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleDelete}
            className="p-1.5 sm:p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 border border-border transition-colors shrink-0"
            title="Delete Page"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            href={`/dashboard/pages/${pageId}/builder`}
            className="bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 sm:gap-2 shrink-0"
          >
            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Edit in Builder</span>
            <span className="sm:hidden">Edit</span>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
          {/* Link Share Section */}
          {pageData.link && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Share your page</h3>
                <p className="text-xs text-muted-foreground">Use this short link to drive traffic and track views.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center bg-muted border border-border rounded-lg overflow-hidden">
                  <span className="px-3 py-2 text-sm font-mono text-muted-foreground border-r border-border bg-background truncate max-w-[200px] sm:max-w-none">
                    {typeof window !== 'undefined' ? `${window.location.origin}/s/${pageData.link.shortcode}` : `/s/${pageData.link.shortcode}`}
                  </span>
                  <button 
                    onClick={handleCopyLink}
                    className="p-2 hover:bg-background transition-colors text-foreground flex items-center justify-center w-10"
                    title="Copy Link"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => setQrModalOpen(true)}
                  className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  QR Code
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Total Views
                </h3>
                <p className="text-3xl font-bold">{pageData.total_visits || 0}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">Direct page visits</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Total Clicks
                </h3>
                <p className="text-3xl font-bold">{pageData.link?.total_clicks || 0}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">From short link</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" />
                  QR Scans
                </h3>
                <p className="text-3xl font-bold">{pageData.link?.total_scans || 0}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">From QR code scans</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Contacts Captured
                </h3>
                <p className="text-3xl font-bold">{pageData.total_lead_captures || 0}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">From form submissions</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Conversion Rate
                </h3>
                <p className="text-3xl font-bold">{pageData.total_visits ? ((pageData.total_lead_captures || 0) / pageData.total_visits * 100).toFixed(1) : 0}%</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">Contacts per view</p>
            </div>
          </div>


        </div>

      <div className="mt-12 space-y-6">
        <div className="flex items-center gap-2 mb-2 border-b border-border pb-4">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-medium text-foreground">Contacts</h2>
        </div>
        <ContactsTable submissions={submissions} loading={loadingContacts} />
      </div>

      {/* QR Code Modal */}
      <Modal 
        open={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        title="Configure QR Code" 
        maxWidth="4xl"
      >
        {pageData?.link && (
          <div className="p-4">
            <QrPreview
              url={typeof window !== "undefined" ? `${window.location.origin}/qr/${pageData.link.shortcode.split('').reverse().join('')}` : `/qr/${pageData.link.shortcode.split('').reverse().join('')}`}
              title="QR Code"
              shortCode={pageData.link.shortcode.split('').reverse().join('')}
              initialConfig={pageData.link.qr_config || null}
              onSaveConfig={handleSaveQrConfig}
              isSaving={isQrSaving}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
