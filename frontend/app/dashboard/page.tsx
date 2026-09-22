export default function DashboardPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Manage your personal page and account settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-background border border-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Your Pages</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Create your first page</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              You haven't created any pages yet. Start building your digital presence today.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              Create New Page
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">Analytics overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-sm text-muted-foreground">Total Views</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div className="w-0 h-full bg-primary rounded-full"></div>
              </div>
              <p className="text-xs text-muted-foreground">No data available yet. Share your page to get insights.</p>
            </div>
          </div>

          <div className="bg-sage/20 border border-sage/30 rounded-2xl p-6">
            <h3 className="font-medium text-black mb-2">Pro Tip</h3>
            <p className="text-sm text-black/80">
              Complete your profile settings to make your page more discoverable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
