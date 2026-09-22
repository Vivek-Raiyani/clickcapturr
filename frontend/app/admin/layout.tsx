"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  Settings, 
  Activity, 
  LogOut,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/");
      } else if (!user.is_superuser) {
        // Redirect regular users trying to access admin
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || !user || !user.is_superuser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-background border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-foreground font-bold font-serif text-lg tracking-tight">
            <ShieldCheck className="w-5 h-5 text-burgundy" />
            vcarrd. admin
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
          >
            <Activity className="w-4 h-4" />
            Overview
          </Link>
          <Link 
            href="/admin/users" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname.includes('/admin/users') ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
          >
            <Users className="w-4 h-4" />
            User Management
          </Link>
          <Link 
            href="/admin/settings" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname.includes('/admin/settings') ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
          >
            <Settings className="w-4 h-4" />
            System Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to User Dashboard
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header (visible only on small screens) */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 md:hidden">
          <div className="flex items-center gap-2 text-foreground font-bold font-serif">
            <ShieldCheck className="w-5 h-5 text-burgundy" />
            vcarrd. admin
          </div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Exit
          </Link>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
