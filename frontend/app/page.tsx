export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <header className="border-b border-light-border px-8 py-6 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tight font-serif">vcarrd.</div>
        <nav className="flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-warm-gray transition-colors">Features</a>
          <a href="#" className="hover:text-warm-gray transition-colors">Pricing</a>
          <a href="#" className="hover:text-warm-gray transition-colors">About</a>
        </nav>
        <button className="bg-black text-soft-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal transition-colors">
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-8 py-24 md:py-32 max-w-5xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-6 text-black">
            The minimal way to <br/> share your world.
          </h1>
          <p className="text-xl md:text-2xl text-warm-gray max-w-2xl mb-12">
            Create a beautiful, simple personal page in minutes. 
            No design skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-yellow text-black px-8 py-4 rounded-full font-medium text-lg hover:brightness-95 transition-all">
              Start Free Trial
            </button>
            <button className="border border-light-border bg-transparent text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black/[0.02] transition-colors">
              View Examples
            </button>
          </div>
        </section>

        {/* Sage Feature Section */}
        <section className="bg-sage px-8 py-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-medium text-black mb-6">Designed for clarity.</h2>
              <p className="text-lg text-black/80 mb-8">
                We believe your content should take center stage. Our themes are deliberately understated, giving your work the breathing room it deserves.
              </p>
              <ul className="space-y-4">
                {['No distracting animations', 'Focus on typography', 'Lightning fast loading'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-cream p-8 rounded-3xl shadow-sm border border-black/5 aspect-square flex flex-col items-center justify-center">
               {/* Abstract representation of a card */}
               <div className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden border border-light-border">
                  <div className="h-32 bg-rose"></div>
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-cream rounded-full mx-auto -mt-14 border-4 border-white mb-4"></div>
                    <div className="h-4 bg-black/10 rounded-full w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-black/5 rounded-full w-1/2 mx-auto"></div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Dark Testimonial Section */}
        <section className="bg-black text-soft-white px-8 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-16">Loved by creatives.</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-charcoal p-8 rounded-2xl text-left border border-white/10">
                <p className="text-lg mb-6 text-cream">"It's exactly what I needed. Nothing more, nothing less. The design is just stunningly simple."</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose"></div>
                  <div>
                    <div className="font-medium text-cream">Sarah Jenkins</div>
                    <div className="text-sm text-white/50">Photographer</div>
                  </div>
                </div>
              </div>
              <div className="bg-charcoal p-8 rounded-2xl text-left border border-white/10">
                <p className="text-lg mb-6 text-cream">"I set up my page in literally 5 minutes. It looks better than the site I spent 2 weeks building."</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-sage"></div>
                  <div>
                    <div className="font-medium text-cream">David Chen</div>
                    <div className="text-sm text-white/50">Writer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Burgundy CTA Section */}
        <section className="bg-burgundy text-soft-white px-8 py-24 text-center">
           <div className="max-w-2xl mx-auto">
             <h2 className="text-4xl font-serif font-medium mb-6">Ready to stand out?</h2>
             <p className="text-xl mb-10 text-soft-white/80">Join thousands of others using vcarrd today.</p>
             <button className="bg-yellow text-black px-10 py-4 rounded-full font-medium text-lg hover:brightness-95 transition-all">
                Get Started Now
             </button>
           </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="px-8 py-12 border-t border-light-border text-center text-warm-gray text-sm">
        &copy; {new Date().getFullYear()} vcarrd. All rights reserved.
      </footer>
    </div>
  );
}
