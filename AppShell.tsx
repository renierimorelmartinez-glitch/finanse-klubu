"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/transactions", label: "Transakcje", icon: "💰" },
  { href: "/recurring", label: "Stałe", icon: "🔄" },
  { href: "/months", label: "Miesiące", icon: "📅" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar - desktop */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 bg-bg-secondary border-b border-border">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold tracking-wider text-accent">
            FINANSE MAGAZYNU
          </h1>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-bg-hover text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          Wyloguj
        </button>
      </header>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border">
        <h1 className="text-base font-bold tracking-wider text-accent">
          FINANSE MAGAZYNU
        </h1>
        <button
          onClick={handleLogout}
          className="text-xs text-text-muted"
        >
          Wyloguj
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-6">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border flex z-50">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              pathname.startsWith(item.href)
                ? "text-accent"
                : "text-text-muted"
            }`}
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
