"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, KeyRound, CreditCard } from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Profile", href: "/dashboard/settings/profile", icon: User },
    { name: "Password", href: "/dashboard/settings/password", icon: KeyRound },
    { name: "Subscription", href: "/dashboard/settings/subscription", icon: CreditCard },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <h2 className="text-2xl font-bold font-serif mb-6">Settings</h2>
        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-burgundy text-white font-medium shadow-md shadow-burgundy/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-background rounded-2xl border border-border shadow-sm p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
