// ─── Paginacion.tsx ───────────────────────────────────────────────────────────
// Componente de controles de paginación reutilizable

type PaginacionProps = {
  pagina: number;
  totalPaginas: number;
  desde: number;
  hasta: number;
  totalItems: number;
  hayAnterior: boolean;
  haySiguiente: boolean;
  irA: (p: number) => void;
  anterior: () => void;
  siguiente: () => void;
};

export default function Paginacion({
  pagina,
  totalPaginas,
  desde,
  hasta,
  totalItems,
  hayAnterior,
  haySiguiente,
  irA,
  anterior,
  siguiente,
}: PaginacionProps) {
  if (totalPaginas <= 1) return null;

  // Generar números de página visibles (máximo 5)
  const paginas: (number | "...")[] = [];
  if (totalPaginas <= 5) {
    for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
  } else {
    paginas.push(1);
    if (pagina > 3) paginas.push("...");
    for (let i = Math.max(2, pagina - 1); i <= Math.min(totalPaginas - 1, pagina + 1); i++) {
      paginas.push(i);
    }
    if (pagina < totalPaginas - 2) paginas.push("...");
    paginas.push(totalPaginas);
  }

  const btnCls = "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all";

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
      {/* Info */}
      <p className="text-xs text-gray-400">
        Mostrando <span className="font-medium text-gray-600">{desde}–{hasta}</span> de{" "}
        <span className="font-medium text-gray-600">{totalItems}</span> registros
      </p>

      {/* Controles */}
      <div className="flex items-center gap-1">
        {/* Anterior */}
        <button
          onClick={anterior}
          disabled={!hayAnterior}
          className={`${btnCls} border border-gray-200 text-gray-500 hover:border-[#205D83] hover:text-[#205D83] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Números */}
        {paginas.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-300">
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => irA(p as number)}
              className={`${btnCls} ${
                pagina === p
                  ? "text-white border border-transparent"
                  : "border border-gray-200 text-gray-500 hover:border-[#205D83] hover:text-[#205D83]"
              }`}
              style={pagina === p ? { backgroundColor: "#205D83" } : {}}
            >
              {p}
            </button>
          )
        )}

        {/* Siguiente */}
        <button
          onClick={siguiente}
          disabled={!haySiguiente}
          className={`${btnCls} border border-gray-200 text-gray-500 hover:border-[#205D83] hover:text-[#205D83] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}