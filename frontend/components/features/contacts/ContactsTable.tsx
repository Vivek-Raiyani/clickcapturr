import { useState, useMemo } from "react";
import { FormSubmission } from "@/types";
import { Search, ExternalLink, Eye, RefreshCw, Users } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";

interface ContactsTableProps {
  submissions: FormSubmission[];
  loading: boolean;
}

export function ContactsTable({ submissions, loading }: ContactsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<FormSubmission | null>(null);

  const filteredSubmissions = useMemo(() => {
    // 1. Filter by search query
    let result = submissions;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = submissions.filter((sub) => {
        return (
          sub.email?.toLowerCase().includes(q) ||
          sub.first_name?.toLowerCase().includes(q) ||
          sub.last_name?.toLowerCase().includes(q) ||
          sub.pageName?.toLowerCase().includes(q) ||
          sub.country_name?.toLowerCase().includes(q)
        );
      });
    }

    // 2. Deduplicate by contact_id to show unique contacts only
    const seen = new Set<string>();
    return result.filter((sub) => {
      // If contact_id is missing, default to showing it to be safe
      if (!sub.contact_id) return true;
      if (seen.has(sub.contact_id)) return false;
      seen.add(sub.contact_id);
      return true;
    });
  }, [submissions, searchQuery]);

  return (
    <>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, page or country..."
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'contact' : 'contacts'}
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin opacity-50" />
                <p className="text-sm">Loading contacts...</p>
              </div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                {searchQuery ? "No matching contacts found" : "No contacts yet"}
              </h3>
              <p className="text-sm max-w-sm mx-auto">
                {searchQuery 
                  ? "Try adjusting your search query." 
                  : "Leads captured will appear here."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm border-b border-border shadow-sm">
                <tr>
                  <th className="py-3 px-4 font-semibold text-muted-foreground whitespace-nowrap">Date</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground whitespace-nowrap">Email</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground whitespace-nowrap">Name</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground whitespace-nowrap">Phone</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground whitespace-nowrap">Location</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-foreground whitespace-nowrap">
                        {new Date(sub.submittedAt || sub.created_at).toLocaleDateString(undefined, {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(sub.submittedAt || sub.created_at).toLocaleTimeString(undefined, {
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-foreground">
                      {sub.email || <span className="text-muted-foreground/50">-</span>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {sub.first_name || sub.last_name 
                        ? `${sub.first_name || ''} ${sub.last_name || ''}`.trim() 
                        : <span className="text-muted-foreground/50">-</span>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {sub.phone || <span className="text-muted-foreground/50">-</span>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{sub.country_name || sub.country || <span className="text-muted-foreground/50">-</span>}</span>
                        {(sub.city || sub.state) && (
                          <span className="text-xs text-muted-foreground">
                            {[sub.city, sub.state].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedContact(sub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted hover:text-foreground hover:bg-muted/80 border border-border rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title="Contact Details"
        description={`Submitted on ${selectedContact?.pageName || "Unknown Page"}`}
      >
        {selectedContact && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Name</p>
                <p className="text-sm text-foreground">
                  {selectedContact.first_name || selectedContact.last_name 
                    ? `${selectedContact.first_name || ''} ${selectedContact.last_name || ''}`.trim() 
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                <p className="text-sm text-foreground break-all">{selectedContact.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Phone</p>
                <p className="text-sm text-foreground">{selectedContact.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Location</p>
                <p className="text-sm text-foreground">
                  {[selectedContact.city, selectedContact.state, selectedContact.country_name || selectedContact.country].filter(Boolean).join(", ") || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Source Page</p>
                <p className="text-sm text-foreground">
                  {selectedContact.pageName || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Campaign</p>
                <p className="text-sm text-foreground">
                  {selectedContact.campaign_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Capture Method</p>
                <p className="text-sm text-foreground uppercase tracking-wider">
                  {(selectedContact.dataJson && selectedContact.dataJson["_method"]) || (selectedContact.link_id ? "click" : "direct")}
                </p>
              </div>
            </div>

            {selectedContact.dataJson && Object.keys(selectedContact.dataJson).filter(k => k !== "_method").length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2">
                  Form Responses
                </h4>
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border">
                  {Object.entries(selectedContact.dataJson)
                    .filter(([key]) => key !== "_method")
                    .map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5 capitalize">
                        {key.replace(/[-_]/g, " ")}
                      </p>
                      <p className="text-sm text-foreground">{String(value) || "-"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
