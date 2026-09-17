"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/expiry/input", label: "Input Expiry" },
  { href: "/expiry/view", label: "View Expiry" },
];

export function ExpiryTabs() {
  const pathname = usePathname();

  return (
    <div className="glass-panel flex gap-1 rounded-full p-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              active ? "bg-maroon text-white" : "text-white/80 hover:bg-white/20"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
