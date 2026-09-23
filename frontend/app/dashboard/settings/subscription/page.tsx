import React from "react";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

export default function SubscriptionSettingsPage() {
  const features = [
    "Unlimited campaigns",
    "Advanced analytics",
    "Priority support",
    "Custom domains",
    "Remove branding"
  ];

  return (
    <div>
      <h3 className="text-xl font-bold font-serif mb-6">Subscription Plan</h3>
      
      <div className="bg-muted/30 border border-border rounded-xl p-6 mb-8 max-w-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h4 className="text-lg font-semibold flex items-center gap-2">
              Free Tier
              <span className="px-2 py-1 bg-sage/20 text-sage-foreground text-xs rounded-full font-medium">Active</span>
            </h4>
            <p className="text-sm text-muted-foreground mt-1">You are currently on the free tier.</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <h4 className="text-lg font-semibold mb-4">Upgrade to Pro</h4>
        <div className="border border-burgundy/20 bg-burgundy/5 rounded-xl p-6 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-burgundy"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          
          <div className="mb-6">
            <div className="text-3xl font-bold font-serif">$9<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span></div>
            <p className="text-sm text-muted-foreground mt-1">Everything you need to grow your audience.</p>
          </div>
          
          <ul className="space-y-3 mb-8">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-burgundy/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-burgundy" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
          
          <Button variant="primary" className="w-full sm:w-auto">
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
