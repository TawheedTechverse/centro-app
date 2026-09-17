"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlarmClock,
  CalendarPlus,
  Info,
  LayoutDashboard,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roster/new", label: "Create Roster", icon: CalendarPlus },
  { href: "/frequent-orders", label: "Frequent Orders", icon: TrendingUp },
  { href: "/expiry/view", label: "Closest Expiry", icon: AlarmClock },
  { href: "/boost", label: "Boost Business", icon: Rocket },
  { href: "/about", label: "About", icon: Info },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-4">
      <nav className="liquid-glass flex w-full max-w-5xl items-center gap-1 rounded-full px-3 py-2 sm:gap-2 sm:px-4">
        <Link
          href="/"
          className="mr-1 flex shrink-0 flex-col leading-tight sm:mr-3"
        >
          <span className="text-lg font-bold tracking-tight text-maroon-dark dark:text-white">
            Centro
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-wider text-maroon dark:text-maroon-light sm:block">
            Manage your Business
          </span>
        </Link>

        <div className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition whitespace-nowrap ${
                  active
                    ? "bg-maroon text-white shadow-sm"
                    : "text-maroon-dark hover:bg-white/30 dark:text-white/80 dark:hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <ThemeToggle />
      </nav>
    </header>
  );
}
