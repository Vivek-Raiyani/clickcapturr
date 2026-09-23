"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Files,
  Users,
  Megaphone,
  Settings,
  Bell,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-28">
      {/* Dashboard Header */}
      <header className="bg-background border-b border-border px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tight font-serif">vcarrd.</div>
        <div className="flex items-center gap-6">
          <button className="text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-burgundy rounded-full border border-background"></span>
          </button>

          {user.is_superuser && (
            <Link
              href="/admin"
              className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-3 border-b border-border/50"
            >
              <ShieldCheck className="w-4 h-4 text-burgundy" />
              Admin Panel
            </Link>
          )}

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
            >
              <div className="hidden sm:block text-sm font-medium">{user.first_name || user.email}</div>
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center text-sm font-bold text-black">
                {(user.first_name?.[0] || user.email[0]).toUpperCase()}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-border/50 sm:hidden">
                  <p className="text-sm font-medium truncate">{user.first_name || user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Floating Bottom Nav Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="relative rounded-[2rem] p-[2px] overflow-hidden group">
          {/* Animated gradient background for the border effect */}
          <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--color-burgundy)_50%,transparent_100%)] opacity-90" />

          {/* Inner content container */}
          <div className="relative bg-background rounded-[2rem] px-6 py-3 md:px-12 md:py-5 flex items-center gap-6 md:gap-10 shadow-2xl">
            <Link
              href="/dashboard"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2.5 transition-colors ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-medium tracking-wide">Dashboard</span>
            </Link>

            <Link
              href="/dashboard/pages"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2.5 transition-colors ${pathname.includes('/pages') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Files className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-medium tracking-wide">Pages</span>
            </Link>

            <Link
              href="/dashboard/contacts"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2.5 transition-colors ${pathname.includes('/contacts') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Users className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-medium tracking-wide">Contacts</span>
            </Link>

            <Link
              href="/dashboard/campaigns"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2.5 transition-colors ${pathname.includes('/campaigns') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Megaphone className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-medium tracking-wide">Campaigns</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2.5 transition-colors ${pathname.includes('/settings') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Settings className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-medium tracking-wide">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
