// ─── usePaginacion.ts ─────────────────────────────────────────────────────────
// Hook reutilizable para paginación en el frontend

import { useState, useMemo } from "react";

export function usePaginacion<T>(items: T[], porPagina = 20) {
  const [pagina, setPagina] = useState(1);

  // Resetear a página 1 cuando cambian los items (ej: al filtrar)
  const totalPaginas = Math.max(1, Math.ceil(items.length / porPagina));

  // Si la página actual quedó fuera de rango por un filtro, volver a 1
  const paginaActual = Math.min(pagina, totalPaginas);

  const itemsPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * porPagina;
    return items.slice(inicio, inicio + porPagina);
  }, [items, paginaActual, porPagina]);

  const irA = (p: number) => setPagina(Math.max(1, Math.min(p, totalPaginas)));
  const siguiente = () => irA(paginaActual + 1);
  const anterior = () => irA(paginaActual - 1);
  const resetear = () => setPagina(1);

  return {
    itemsPagina,
    pagina: paginaActual,
    totalPaginas,
    totalItems: items.length,
    porPagina,
    irA,
    siguiente,
    anterior,
    resetear,
    hayAnterior: paginaActual > 1,
    haySiguiente: paginaActual < totalPaginas,
    desde: items.length === 0 ? 0 : (paginaActual - 1) * porPagina + 1,
    hasta: Math.min(paginaActual * porPagina, items.length),
  };
}