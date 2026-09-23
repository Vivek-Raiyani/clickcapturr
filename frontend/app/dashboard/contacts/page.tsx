"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listAllSubmissionsAction } from "@/actions/form.actions";
import { FormSubmission } from "@/types";
import { Users, RefreshCw } from "lucide-react";
import { ContactsTable } from "@/components/features/contacts/ContactsTable";

export default function ContactsDashboard() {
  const { user, token } = useAuth();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    </div>
  );
}
