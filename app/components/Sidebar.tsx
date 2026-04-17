"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/projects", label: "Projects" },
    { href: "/transactions", label: "Transactions" },
    { href: "/reports", label: "Reports" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen flex flex-col sticky top-0">
      <div className="p-8 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-xl font-black text-white italic">B</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white uppercase italic">Al Bawani</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Petty Cash Tracker</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
              isActive(item.href)
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <div className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${isActive(item.href) ? "bg-indigo-400 scale-125" : "bg-transparent group-hover:bg-slate-600"}`} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-6 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-xs font-medium text-slate-500 mb-2">{isAdmin ? "Logged in as admin" : "Logged in as user"}</p>
          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-blue-500 rounded-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
