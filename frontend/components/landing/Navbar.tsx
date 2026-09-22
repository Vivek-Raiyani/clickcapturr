"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Magnet, Menu, X, Sparkles, ChevronRight, Palette, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-theme-bg/90 border-b border-theme-border-subtle transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-theme-primary text-theme-primary-fg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Magnet className="w-5 h-5 rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold tracking-tight text-xl text-theme-text uppercase">
              VueMagnet
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-theme-text-muted -mt-1 font-medium">
              Creator Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-sans font-medium text-theme-text-muted">
          <Link
            href="/#how-it-works"
            className="hover:text-theme-text transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#creators"
            className="hover:text-theme-text transition-colors"
          >
            Creators
          </Link>
          <Link
            href="/#features"
            className="hover:text-theme-text transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="hover:text-theme-text transition-colors font-semibold"
          >
            Pricing
          </Link>
          <Link
            href="/#comparison"
            className="hover:text-theme-text transition-colors"
          >
            Why Switch
          </Link>
        </nav>

        {/* Action Buttons & Theme Selector */}
        <div className="hidden md:flex items-center gap-3">
          {/* User Logged In State vs Logged Out State */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-theme-surface border border-theme-border text-xs font-medium text-theme-text hover:bg-theme-surface-hover transition-colors"
              >
                <User className="w-3.5 h-3.5 text-theme-primary" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </Link>
              <button
                onClick={() => logout()}
                className="p-2 rounded-full text-theme-text-muted hover:text-theme-text hover:bg-theme-surface transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuthModal("signin")}
                className="text-sm font-sans font-medium text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg text-sm font-sans font-semibold shadow-sm transition-all duration-200 hover:shadow cursor-pointer"
              >
                Sign Up
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <button
              onClick={() => logout()}
              className="p-2 rounded-lg text-theme-text hover:bg-theme-surface"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => openAuthModal("signin")}
              className="px-3 py-1.5 rounded-full bg-theme-primary text-theme-primary-fg text-xs font-semibold"
            >
              Sign In
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-theme-text hover:bg-theme-surface transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-theme-border px-5 py-4 bg-theme-card/95 backdrop-blur-md space-y-3">
          {user && (
            <div className="p-3 rounded-xl bg-theme-surface border border-theme-border text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-theme-primary" />
                <span className="font-semibold text-theme-text">{user.email}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-theme-text-muted hover:text-theme-text text-xs"
              >
                Log Out
              </button>
            </div>
          )}
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-theme-text hover:text-theme-primary"
          >
            How It Works
          </Link>
          <Link
            href="/#creators"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-theme-text hover:text-theme-primary"
          >
            Creators & Results
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-theme-text hover:text-theme-primary"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-theme-text hover:text-theme-primary font-semibold"
          >
            Pricing
          </Link>
          <Link
            href="/#comparison"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-theme-text hover:text-theme-primary"
          >
            Why Switch
          </Link>

          {!user && (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("signin");
                }}
                className="w-full py-2.5 rounded-xl border border-theme-border text-sm font-semibold text-theme-text text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("signup");
                }}
                className="w-full py-2.5 rounded-xl bg-theme-primary text-theme-primary-fg text-sm font-semibold text-center"
              >
                Create Free Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
