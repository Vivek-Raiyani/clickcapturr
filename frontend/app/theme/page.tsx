"use client";

import { useState } from "react";
import { 
  Button, 
  Input, 
  DataTable, 
  StatCard, 
  Accordion, 
  SegmentedControl,
  Modal,
  ConfirmDialog,
  Toast
} from "../../components/ui";
import { 
  PageTopBar, 
  PageNavPanel, 
  PageInspectorPanel,
  DEFAULT_PAGE_BUILDER_STATE 
} from "../../components/page-builder";
export default function ThemePreviewPage() {
  const [isLight, setIsLight] = useState(false);
  const [activeFont, setActiveFont] = useState("font-sans");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [builderTab, setBuilderTab] = useState<any>("content");
  const [builderSection, setBuilderSection] = useState<any>("headline");

  return (
    <div className={`min-h-screen ${isLight ? "light" : ""}`}>
      <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${activeFont} p-8 md:p-16`}>
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 max-w-5xl mx-auto gap-4">
          <div>
            <h1 className="text-4xl font-medium mb-2">Theme Preview</h1>
            <p className="text-muted-foreground">Test the Warm Editorial SaaS design system.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex bg-card border border-border rounded-full p-1 shadow-sm items-center">
              <span className="text-xs font-semibold text-muted-foreground px-3 uppercase tracking-wider">Font:</span>
              <button 
                onClick={() => setActiveFont("font-sans")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFont === "font-sans" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Sans
              </button>
              <button 
                onClick={() => setActiveFont("font-serif")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFont === "font-serif" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Serif
              </button>
              <button 
                onClick={() => setActiveFont("font-mono")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFont === "font-mono" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Mono
              </button>
            </div>
            <button 
              onClick={() => setIsLight(!isLight)}
              className="px-6 py-3 bg-card border border-border rounded-full hover:bg-muted shadow-sm transition-colors flex items-center gap-2 font-medium text-sm"
            >
              {isLight ? "🌙 Switch to Dark Mode" : "☀️ Switch to Light Mode"}
            </button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto space-y-20">
          
          {/* Base Colors Section */}
          <section className="space-y-6">
            <h2 className="text-2xl border-b border-border pb-2 font-medium">Base UI Elements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-medium mb-4">Standard Card</h3>
                  <p className="text-muted-foreground mb-6">
                    This card uses <code className="text-foreground font-mono bg-background px-1 py-0.5 rounded">bg-card</code> and text uses <code className="text-foreground font-mono bg-background px-1 py-0.5 rounded">text-muted-foreground</code>.
                  </p>
                  <input 
                    type="text" 
                    placeholder="Input field (border-input)" 
                    className="w-full bg-transparent border border-input rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary mb-6"
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity">
                    Primary Action
                  </button>
                  <button className="bg-transparent text-foreground border border-border px-6 py-2.5 rounded-full font-medium hover:bg-muted transition-colors">
                    Secondary
                  </button>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-muted border border-border flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-medium mb-4">Muted Area</h3>
                  <p className="text-muted-foreground mb-6">
                    This section uses <code className="text-foreground font-mono bg-background px-1 py-0.5 rounded">bg-muted</code> to subtly contrast with the main background. Great for sidebars or secondary content blocks.
                  </p>
                  <ul className="space-y-4 text-sm text-foreground">
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">✨</span> 
                      <span>Excellent for sidebars and settings</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">🎨</span> 
                      <span>Subtle feature highlights</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </section>

          {/* Accent Sections */}
          <section className="space-y-6">
            <h2 className="text-2xl border-b border-border pb-2 font-medium">Accent Sections</h2>
            <p className="text-muted-foreground mb-8">These sections use fixed accent colors designed for high-impact visual blocks, overriding the dynamic theme where necessary.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-8 rounded-2xl bg-sage text-black shadow-sm">
                <h3 className="text-xl mb-2 font-medium">Sage Green</h3>
                <p className="opacity-80 text-sm mb-8">#DAE9C4 - Soft, premium feeling. Best used for large navigation or mega-menus.</p>
                <button className="bg-black text-cream px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity w-full">Learn more</button>
              </div>

              <div className="p-8 rounded-2xl bg-burgundy text-soft-white shadow-sm">
                <h3 className="text-xl mb-2 font-medium">Muted Burgundy</h3>
                <p className="opacity-80 text-sm mb-8">#884F4E - Warmth and emotion. Ideal for testimonials or feature sections.</p>
                <button className="bg-yellow text-black px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity w-full">Read story</button>
              </div>

              <div className="p-8 rounded-2xl bg-rose text-black shadow-sm">
                <h3 className="text-xl mb-2 font-medium">Dusty Rose</h3>
                <p className="opacity-80 text-sm mb-8">#E0CCCB - Cohesive pairing. Used to complement the burgundy sections.</p>
                <button className="bg-transparent border border-black/20 hover:border-black px-6 py-2.5 rounded-full text-sm font-medium transition-colors w-full">View details</button>
              </div>
              
            </div>
          </section>

          {/* Typography */}
          <section className="space-y-6">
            <h2 className="text-2xl border-b border-border pb-2 font-medium">Typography & Content</h2>
            <div className="max-w-3xl">
              <h1 className="text-5xl mb-6 font-medium">The power of Warm Editorial SaaS</h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                The typography combined with the color palette makes the interface feel intentional and high-end. Pure whites are avoided in favor of warm, paper-like creams.
              </p>
              <blockquote className="border-l-4 border-primary pl-6 my-10 py-2">
                <p className="text-2xl italic text-foreground leading-snug">
                  "Keep the palette desaturated and warm. Let large sections carry the accent colors, while yellow is reserved almost exclusively for high-priority actions."
                </p>
              </blockquote>
            </div>
          </section>

          {/* UI Components Showcase */}
          <section className="space-y-6">
            <h2 className="text-2xl border-b border-border pb-2 font-medium">UI Components</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Buttons */}
              <div className="p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-6">
                <h3 className="text-xl font-medium border-b border-border pb-2">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-4 items-center mt-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button isLoading>Loading</Button>
                </div>
              </div>

              {/* Inputs */}
              <div className="p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-6">
                <h3 className="text-xl font-medium border-b border-border pb-2">Inputs</h3>
                <Input placeholder="Standard input..." id="input-1" />
                <Input label="With Label & Hint" placeholder="Enter text..." hint="We'll never share this with anyone." id="input-2" />
                <Input label="With Error" error="This field is required" placeholder="Error state" id="input-3" />
              </div>

              {/* Stat Cards */}
              <div className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-6">
                <h3 className="text-xl font-medium border-b border-border pb-2">Stat Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard title="Total Revenue" value="$45,231.89" change={20.1} />
                  <StatCard title="Active Users" value="+2,350" change={-4.5} />
                  <StatCard title="New Signups" value="894" change={12.4} />
                </div>
              </div>

              {/* Interactive */}
              <div className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-6">
                <h3 className="text-xl font-medium border-b border-border pb-2">Interactive Elements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <h4 className="font-medium text-muted-foreground">Accordion</h4>
                    <Accordion 
                      items={[
                        { id: "1", title: "Is this accessible?", content: "Yes. It adheres to the WAI-ARIA design pattern." },
                        { id: "2", title: "Is it styled?", content: "Yes. It comes with default styles that matches the other components." }
                      ]}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <h4 className="font-medium text-muted-foreground">Segmented Control</h4>
                    <SegmentedControl 
                      options={[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }]}
                      value="weekly"
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-6">
                <h3 className="text-xl font-medium border-b border-border pb-2">Data Table</h3>
                <DataTable 
                  columns={[
                    { key: "name", header: "Name" },
                    { key: "status", header: "Status", render: (val) => <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground border border-border">{String(val)}</span> },
                    { key: "role", header: "Role" },
                  ]}
                  rows={[
                    { id: 1, name: "Alice Freeman", status: "Active", role: "Admin" },
                    { id: 2, name: "Bob Smith", status: "Inactive", role: "User" },
                    { id: 3, name: "Charlie Davis", status: "Active", role: "Editor" },
                  ]}
                />
              </div>

              {/* Overlays */}
              <div className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-6">
                <h3 className="text-xl font-medium border-b border-border pb-2">Dialogs & Overlays</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                  <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>Open Confirm Dialog</Button>
                  <Button variant="secondary" onClick={() => setToastMessage("Your settings have been saved successfully.")}>Show Toast</Button>
                </div>
              </div>

              {/* Page Builder UI */}
              <div className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-6">
                <h3 className="text-xl font-medium border-b border-border pb-2">Page Builder UI</h3>
                <p className="text-muted-foreground text-sm">Testing the structural components of the page builder against the current theme.</p>
                <div className="border border-border rounded-xl overflow-hidden shadow-lg bg-background flex flex-col h-[600px]">
                  <PageTopBar 
                    title="Theme Preview Page" 
                    slug="preview" 
                    onChangeTitle={() => {}} 
                    backHref="#" 
                    onToggleSuccessPreview={() => {}} 
                    onSelectAIPreset={() => {}} 
                  />
                  <div className="flex flex-1 overflow-hidden">
                    <PageNavPanel 
                      activeTab={builderTab} 
                      onTabChange={setBuilderTab} 
                      activeSection={builderSection} 
                      onSectionChange={setBuilderSection} 
                      state={DEFAULT_PAGE_BUILDER_STATE} 
                    />
                    <div className="flex-1 bg-muted/30 p-8 flex flex-col items-center justify-center border-l border-r border-border border-dashed text-center">
                      <p className="text-foreground font-medium mb-2">Preview Canvas Area</p>
                      <p className="text-muted-foreground text-xs max-w-sm">The actual page builder rendering happens here. Use the left sidebar to navigate sections, and the right sidebar to configure them.</p>
                    </div>
                    <div className="w-80 shrink-0 bg-card overflow-y-auto hidden lg:block">
                      <PageInspectorPanel 
                        activeSection={builderSection} 
                        state={DEFAULT_PAGE_BUILDER_STATE} 
                        onUpdateTheme={() => {}} 
                        onUpdateContent={() => {}} 
                        onUpdateFormFields={() => {}} 
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Render Overlays */}
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Profile" description="Make changes to your profile here. Click save when you're done.">
            <div className="space-y-4 py-4">
              <Input label="Name" placeholder="Alice Freeman" id="modal-input-1" />
              <Input label="Username" placeholder="@alice" id="modal-input-2" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>Save changes</Button>
            </div>
          </Modal>

          <ConfirmDialog 
            open={isConfirmOpen} 
            title="Delete Account" 
            description="Are you sure you want to delete your account? This action cannot be undone." 
            confirmLabel="Delete Account" 
            isDangerous={true} 
            onConfirm={() => setIsConfirmOpen(false)} 
            onCancel={() => setIsConfirmOpen(false)} 
          />

          {toastMessage && (
            <div className="fixed bottom-4 right-4 z-50">
              <Toast message={toastMessage} type="success" onDismiss={() => setToastMessage(null)} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

