import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the vcarrd admin panel. Monitor system health and user activity here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-background p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Total Users</h3>
          <p className="text-4xl font-bold">1,248</p>
        </div>
        <div className="bg-background p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Active Campaigns</h3>
          <p className="text-4xl font-bold">342</p>
        </div>
        <div className="bg-background p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">System Status</h3>
          <p className="text-2xl font-bold text-sage">Operational</p>
        </div>
      </div>
      
      <div className="bg-background p-6 rounded-2xl border border-border shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Admin charts and tables will go here.</p>
      </div>
    </div>
  );
}
