"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { listAllSubmissionsAction, exportLeadsExcelAction } from "@/actions/form.actions";
import { FormSubmission } from "@/types";
import { Users, RefreshCw, Download, FileSpreadsheet } from "lucide-react";
import { ContactsTable } from "@/components/features/contacts/ContactsTable";
import { Modal } from "@/components/ui/Modal";

export default function ContactsDashboard() {
  const { user, token } = useAuth();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Export state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState<"all" | "page" | "campaign">("all");
  const [selectedPageId, setSelectedPageId] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Compute unique pages and campaigns for the select dropdowns
  const uniquePages = useMemo(() => {
    const pages = new Map<string, string>();
    submissions.forEach(s => {
      if (s.page_id && s.pageName) pages.set(s.page_id, s.pageName);
    });
    return Array.from(pages.entries()).map(([id, name]) => ({ id, name }));
  }, [submissions]);

  const uniqueCampaigns = useMemo(() => {
    const campaigns = new Map<string, string>();
    submissions.forEach(s => {
      if (s.campaign_id && s.campaign_name) campaigns.set(s.campaign_id, s.campaign_name);
    });
    return Array.from(campaigns.entries()).map(([id, name]) => ({ id, name }));
  }, [submissions]);

  const fetchContacts = async (hideLoading = false) => {
    if (!token) return;
    if (!hideLoading) setLoading(true);
    setError(null);
    
    try {
      const result = await listAllSubmissionsAction(token);
      if (result.success && result.data) {
        setSubmissions(result.data);
      } else {
        setError(result.error || "Failed to load contacts");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching contacts");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchContacts(true);
  };

  const handleExport = async () => {
    if (!token) return;
    setIsExporting(true);
    setError(null);
    
    let pageId = undefined;
    let campaignId = undefined;
    let startIso = undefined;
    let endIso = undefined;
    
    if (exportScope === "page" && selectedPageId) pageId = selectedPageId;
    if (exportScope === "campaign" && selectedCampaignId) campaignId = selectedCampaignId;
    if (startDate) startIso = new Date(startDate).toISOString();
    if (endDate) {
      // Set to end of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      endIso = end.toISOString();
    }
    
    try {
      const result = await exportLeadsExcelAction(token, pageId, campaignId, startIso, endIso);
      if (result.success && result.data) {
        // Decode base64 to Blob
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        
        let filename = "all-contacts.xlsx";
        if (exportScope === "page") filename = `page-contacts.xlsx`;
        if (exportScope === "campaign") filename = `campaign-contacts.xlsx`;
        
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsExportModalOpen(false);
      } else {
        setError(result.error || "Failed to export contacts");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while exporting contacts");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            All Contacts
          </h1>
          <p className="text-muted-foreground">Manage unique leads captured across all your pages.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            disabled={loading || submissions.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-foreground hover:border-primary/50 transition-colors disabled:opacity-50 cursor-pointer font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      <ContactsTable submissions={submissions} loading={loading} />

      {/* Export Modal */}
      <Modal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Contacts"
        description="Download your contacts as an Excel file."
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Export Scope</label>
              <select
                value={exportScope}
                onChange={(e) => setExportScope(e.target.value as any)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
              >
                <option value="all">All Contacts</option>
                {uniquePages.length > 0 && <option value="page">Specific Page</option>}
                {uniqueCampaigns.length > 0 && <option value="campaign">Specific Campaign</option>}
              </select>
            </div>

            {exportScope === "page" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select Page</label>
                <select
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                >
                  <option value="">-- Choose a page --</option>
                  {uniquePages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {exportScope === "campaign" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select Campaign</label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                >
                  <option value="">-- Choose a campaign --</option>
                  {uniqueCampaigns.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Start Date (Optional)</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={
                isExporting || 
                (exportScope === "page" && !selectedPageId) || 
                (exportScope === "campaign" && !selectedCampaignId)
              }
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  Download Excel
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
