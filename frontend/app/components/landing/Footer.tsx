"use client";

import Link from "next/link";
import { Magnet, Sparkles, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-theme-surface text-theme-text border-t border-theme-border pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-theme-border-subtle">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-theme-primary text-theme-primary-fg flex items-center justify-center shadow-sm">
                <Magnet className="w-5 h-5 rotate-45" />
              </div>
              <span className="font-serif font-bold tracking-tight text-xl text-theme-text uppercase">
                VueMagnet
              </span>
            </Link>

            <p className="text-sm text-theme-text-muted max-w-sm leading-relaxed font-sans">
              The high-conversion lead magnet & on-screen QR studio designed to turn YouTube and video viewers into your most valuable email subscribers.
            </p>

            <div className="pt-1">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg text-xs font-bold font-sans transition-colors shadow-md"
              >
                Start free trial
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-theme-text-muted mt-2 font-mono">No credit card required</p>
            </div>
          </div>

          {/* Column: GET STARTED */}
          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-mono uppercase tracking-widest text-theme-text font-bold">
              Get Started
            </h4>
            <ul className="space-y-2.5 text-xs text-theme-text-muted">
              <li>
                <Link href="/pricing" className="hover:text-theme-text transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-theme-text transition-colors">
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-theme-text transition-colors">
                  The Conversion Playlist
                </Link>
              </li>
              <li>
                <Link href="/theme" className="hover:text-theme-text transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-theme-primary" />
                  Luxury Color Themes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: USE CASES */}
          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-mono uppercase tracking-widest text-theme-text font-bold">
              Use Cases
            </h4>
            <ul className="space-y-2.5 text-xs text-theme-text-muted">
              <li>
                <Link href="/demo" className="hover:text-theme-text transition-colors">
                  YouTubers
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-theme-text transition-colors">
                  Podcasters
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-theme-text transition-colors">
                  Course Creators
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-theme-text transition-colors">
                  Coaches & Consultants
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-theme-text transition-colors">
                  E-commerce Creators
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-theme-text transition-colors">
                  Fitness & Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: PRODUCT & COMPARISONS */}
          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-mono uppercase tracking-widest text-theme-text font-bold">
              Compare
            </h4>
            <ul className="space-y-2 text-xs text-theme-text-muted">
              <li>
                <Link href="#comparison" className="hover:text-theme-text transition-colors">
                  Bitly vs VueMagnet
                </Link>
              </li>
              <li>
                <Link href="#comparison" className="hover:text-theme-text transition-colors">
                  Canva vs VueMagnet
                </Link>
              </li>
              <li>
                <Link href="#comparison" className="hover:text-theme-text transition-colors">
                  Linktree vs VueMagnet
                </Link>
              </li>
              <li>
                <Link href="#comparison" className="hover:text-theme-text transition-colors">
                  Leadpages vs VueMagnet
                </Link>
              </li>
              <li>
                <Link href="#comparison" className="hover:text-theme-text transition-colors">
                  ClickFunnels vs VueMagnet
                </Link>
              </li>
              <li>
                <Link href="#comparison" className="hover:text-theme-text transition-colors">
                  Stan Store vs VueMagnet
                </Link>
              </li>
              <li>
                <Link href="#comparison" className="hover:text-theme-text transition-colors">
                  Beacons vs VueMagnet
                </Link>
              </li>
              <li>
                <Link href="#comparison" className="hover:text-theme-text transition-colors">
                  Mailchimp vs VueMagnet
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-theme-text-muted font-mono gap-4">
          <p>© {new Date().getFullYear()} VueMagnet Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/theme" className="hover:text-theme-text transition-colors">
              Design System
            </Link>
            <Link href="/demo" className="hover:text-theme-text transition-colors">
              Terms of Service
            </Link>
            <Link href="/demo" className="hover:text-theme-text transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
