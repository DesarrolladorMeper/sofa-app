"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";

const dmsans = DM_Sans({ subsets: ["latin"] });

type SubItem = { label: string; href: string; icon: React.ReactNode };
type MainModule = { label: string; shortLabel: string; href?: string; icon: React.ReactNode; items?: SubItem[] };

const MODULES: MainModule[] = [
  {
    label: "Dashboard",
    shortLabel: "Dashboard",
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
  {
    label: "Gestión Financiera",
    shortLabel: "Financiera",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 6v6l4 2" />
        <path d="M9 12h6" />
      </svg>
    ),
    items: [
      {
        label: "Propuestas",
        href: "/dashboard/propuestas",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: "Contratos",
        href: "/dashboard/contratos",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Gestión Humana",
    shortLabel: "G. Humana",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    items: [
      {
        label: "Personal",
        href: "/dashboard/comerciales",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Configuración",
    shortLabel: "Config.",
    href: "/dashboard/configuracion",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openModule, setOpenModule] = useState<string | null>(null);

  useEffect(() => {
    for (const mod of MODULES) {
      if (mod.items?.some((item) => pathname.startsWith(item.href))) {
        setOpenModule(mod.label);
        return;
      }
    }
  }, [pathname]);

  const activePanel = MODULES.find((m) => m.label === openModule && m.items);

  const breadcrumb = (() => {
    for (const mod of MODULES) {
      if (mod.items) {
        const sub = mod.items.find((item) => pathname.startsWith(item.href));
        if (sub) return `${mod.label} / ${sub.label}`;
      }
      if (mod.href && pathname === mod.href) return mod.label;
    }
    return "Dashboard";
  })();

  return (
    <div className={`${dmsans.className} flex h-screen bg-gray-50 overflow-hidden`}>
      {/* ── Sidebar primario (iconos) ── */}
      <aside
        className="w-[68px] shrink-0 flex flex-col z-20"
        style={{ backgroundColor: "#1e2630" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <img src="/isologo.png" alt="SOFA" className="w-auto h-auto" />
          </div>
        </div>

        {/* Módulos principales */}
        <nav className="flex-1 flex flex-col items-center py-4 gap-1">
          {MODULES.map((mod) => {
            const isRouteActive =
              mod.href
                ? pathname === mod.href
                : mod.items?.some((item) => pathname.startsWith(item.href));
            const isPanelOpen = openModule === mod.label && !!mod.items;
            const highlighted = isRouteActive || isPanelOpen;

            return (
              <button
                key={mod.label}
                title={mod.label}
                onClick={() => {
                  if (mod.href) {
                    router.push(mod.href);
                    setOpenModule(null);
                  } else {
                    setOpenModule(isPanelOpen ? null : mod.label);
                  }
                }}
                className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-150 group ${
                  highlighted
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                {mod.icon}
                <span className="text-[8px] font-medium leading-none opacity-70 group-hover:opacity-100">
                  {mod.shortLabel}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Indicador de panel activo */}
        {activePanel && (
          <div className="pb-4 flex justify-center">
            <div className="w-1 h-6 rounded-full bg-white/30" />
          </div>
        )}
      </aside>

      {/* ── Panel secundario (submodulos) ── */}
      <div
        className={`shrink-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          activePanel ? "w-52" : "w-0"
        }`}
        style={{ backgroundColor: "#374151" }}
      >
        {activePanel && (
          <>
            {/* Cabecera del panel */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
              <div>
                <p className="text-white font-bold text-xs leading-tight">{activePanel.label}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{activePanel.items!.length} módulo(s)</p>
              </div>
              <button
                onClick={() => setOpenModule(null)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                title="Cerrar panel"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Ítems del panel */}
            <nav className="flex-1 py-3 px-2 space-y-0.5">
              {activePanel.items!.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
                    )}
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </div>

      {/* ── Contenido principal ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-300">SOFA</span>
            <span className="text-gray-200">/</span>
            <span className="text-[#514737] font-bold">{breadcrumb}</span>
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
