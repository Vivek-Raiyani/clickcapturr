"use client";

import { useState } from "react";

export default function ThemePreviewPage() {
  const [isDark, setIsDark] = useState(false);
  const [activeFont, setActiveFont] = useState("font-sans");

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
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
              onClick={() => setIsDark(!isDark)}
              className="px-6 py-3 bg-card border border-border rounded-full hover:bg-muted shadow-sm transition-colors flex items-center gap-2 font-medium text-sm"
            >
              {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
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

        </div>
      </div>
    </div>
  );
}

