"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";

const dmsans = DM_Sans({ subsets: ["latin"] });

type NavItem = { label: string; href: string; icon: React.ReactNode };
type NavSection = { group: string | null; items: NavItem[] };

const NAV_SECTIONS: NavSection[] = [
  {
    group: null,
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "GESTIÓN FINANCIERA",
    items: [
      {
        label: "Propuestas",
        href: "/dashboard/propuestas",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: "Contratos",
        href: "/dashboard/contratos",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        label: "Facturas",
        href: "/dashboard/facturas",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <path d="M7 15h.01M11 15h2" />
          </svg>
        ),
      },
      {
        label: "Obligaciones",
        href: "/dashboard/obligaciones",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
            <path d="M12 17h.01" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "PERSONAL",
    items: [
      {
        label: "Personal",
        href: "/dashboard/comerciales",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
    ],
  },
  {
    group: null,
    items: [
      {
        label: "Configuración",
        href: "/dashboard/configuracion",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
];

const BREADCRUMB_LABELS: Record<string, string> = {
  propuestas: "Propuestas",
  contratos: "Contratos",
  facturas: "Facturas",
  obligaciones: "Obligaciones",
  comerciales: "Personal",
  configuracion: "Configuración",
  dashboard: "Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "dashboard";
  const breadcrumb = BREADCRUMB_LABELS[lastSegment] ?? lastSegment.replace(/-/g, " ");

  return (
    <div className={`${dmsans.className} flex h-screen bg-gray-50 overflow-hidden`}>
      <aside
        className={`flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-x-hidden ${collapsed ? "w-16" : "w-60"}`}
        style={{ backgroundColor: "#374151" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
            <img src="/isologo.png" alt="Logo SOFA APP" className="w-auto h-auto" />
          </div>
          {!collapsed && (
            <p className="text-white font-bold text-sm leading-tight tracking-wider overflow-hidden">SOFA APP</p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto no-scrollbar space-y-0.5">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} className={si > 0 ? "mt-2" : ""}>
              {section.group && !collapsed && (
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-white/30 tracking-widest uppercase">
                  {section.group}
                </p>
              )}
              {section.group && collapsed && si > 0 && (
                <div className="my-1 mx-2 border-t border-white/10" />
              )}
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 relative ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
                    )}
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && <span className="truncate font-medium">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Colapsar */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white transition-all text-xs"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            {!collapsed && <span>Colapsar</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-300">SOFA</span>
            <span className="text-gray-200">/</span>
            <span className="text-[#514737] font-bold capitalize">{breadcrumb}</span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#514737] text-white font-bold text-xs shadow-sm">
            UD
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { borderRadius: "12px", fontSize: "13px", fontFamily: "inherit" },
        }}
      />
    </div>
  );
}
