"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Car,
  Inbox,
  LogOut,
  Plus,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/cars/new", label: "Add car", icon: Plus },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const links = (
    <>
      {NAV.map((n) => {
        const active = n.exact
          ? pathname === n.href
          : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-gold-500 text-ink-900"
                : "text-ink-300 hover:bg-ink-800 hover:text-white",
            )}
          >
            <n.icon className="h-5 w-5" />
            {n.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-ink-800 bg-ink-900 px-4 py-3 text-white lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500 font-display text-ink-900">
            M
          </span>
          Admin
        </Link>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 hover:bg-ink-800"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-1 border-b border-ink-800 bg-ink-900 p-4 lg:hidden">
          {links}
          <FooterLinks logout={logout} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink-900 p-5 text-white lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500 font-display text-lg font-bold text-ink-900">
            M
          </span>
          <span>
            <span className="block font-bold leading-tight">{SITE.name}</span>
            <span className="block text-xs text-ink-400">Admin</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">{links}</nav>
        <FooterLinks logout={logout} />
      </aside>
    </>
  );
}

function FooterLinks({ logout }: { logout: () => void }) {
  return (
    <div className="mt-4 space-y-1 border-t border-ink-800 pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white"
      >
        <ExternalLink className="h-5 w-5" />
        View website
      </Link>
      <button
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="h-5 w-5" />
        Sign out
      </button>
    </div>
  );
}
