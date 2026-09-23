"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users, Files, Megaphone } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { StatCard } from "@/components/ui/StatCard";

interface DashboardStats {
  total_page_views: int;
  total_contacts: int;
  active_campaigns: int;
  conversion_rate: float;
  recent_campaigns: any[];
  recent_pages: any[];
  recent_contacts: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetchApi("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Here's a quick overview of your performance.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Views"
          value={stats?.total_page_views.toLocaleString() || "0"}
          icon={<Files />}
        />
        <StatCard
          label="Total Contacts"
          value={stats?.total_contacts.toLocaleString() || "0"}
          icon={<Users />}
        />
        <StatCard
          label="Active Campaigns"
          value={stats?.active_campaigns.toLocaleString() || "0"}
          icon={<Megaphone />}
        />
        <StatCard
          label="Avg Conversion"
          value={`${stats?.conversion_rate || 0}%`}
          icon={<TrendingUpIcon />}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Pages */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Pages</h2>
            <Link
              href="/dashboard/pages"
              className="text-sm text-burgundy hover:underline font-medium"
            >
              View All
            </Link>
          </div>
          
          {stats?.recent_pages && stats.recent_pages.length > 0 ? (
            <ul className="space-y-4 flex-1">
              {stats.recent_pages.map((page) => (
                <li key={page.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div>
                    <div className="font-medium text-foreground">{page.name}</div>
                    <div className="text-xs text-muted-foreground">/{page.slug}</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><Files className="w-3.5 h-3.5"/> {page.total_visits}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3.5 h-3.5"/> {page.total_lead_captures}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground mb-4">No pages created yet.</p>
              <Link href="/dashboard/pages">
                <button className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Page
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Campaigns */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Active Campaigns</h2>
            <Link
              href="/dashboard/campaigns"
              className="text-sm text-burgundy hover:underline font-medium"
            >
              View All
            </Link>
          </div>
          
          {stats?.recent_campaigns && stats.recent_campaigns.length > 0 ? (
            <ul className="space-y-4 flex-1">
              {stats.recent_campaigns.map((camp) => (
                <li key={camp.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div>
                    <div className="font-medium text-foreground">{camp.title}</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><Files className="w-3.5 h-3.5"/> {camp.total_visits}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3.5 h-3.5"/> {camp.total_lead_captures}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground mb-4">No campaigns running.</p>
              <Link href="/dashboard/campaigns">
                <button className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Campaign
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Latest Leads/Contacts */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Latest Leads</h2>
          <Link
            href="/dashboard/contacts"
            className="text-sm text-burgundy hover:underline font-medium"
          >
            View All Contacts
          </Link>
        </div>
        
        {stats?.recent_contacts && stats.recent_contacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Page</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recent_contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {contact.first_name || contact.last_name ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() : 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{contact.email || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sage/20 text-sage-foreground">
                        {contact.page_name || 'Direct'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium mb-1">No leads yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Share your pages and campaigns to start capturing leads. They will appear right here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick helper icon for the conversion card
function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
