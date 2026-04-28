"use client";

import { FiltrosPropuesta } from "./propuestas-types";

type Props = {
  filtros: FiltrosPropuesta;
  onChange: (f: FiltrosPropuesta) => void;
  comerciales: { id_comercial: number; username: string }[];
};

export default function PropuestasFiltros({ filtros, onChange, comerciales }: Props) {
  const set = (k: keyof FiltrosPropuesta, v: string) => onChange({ ...filtros, [k]: v });
  const inp = "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#514737]/30 bg-white";

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <input
        className={`${inp} min-w-[220px] flex-1`}
        placeholder="Buscar cliente, número..."
        value={filtros.busqueda}
        onChange={(e) => set("busqueda", e.target.value)}
      />
      <select className={inp} value={filtros.estado} onChange={(e) => set("estado", e.target.value)}>
        <option value="">Todos los estados</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="APROBADO">Aprobado</option>
        <option value="RECHAZADO">Rechazado</option>
      </select>
      <select className={inp} value={filtros.comercial} onChange={(e) => set("comercial", e.target.value)}>
        <option value="">Todos los comerciales</option>
        {comerciales.map((c) => (
          <option key={c.id_comercial} value={String(c.id_comercial)}>{c.username}</option>
        ))}
      </select>
      <div className="flex gap-2 items-center">
        <input type="date" className={inp} value={filtros.fechaDesde} onChange={(e) => set("fechaDesde", e.target.value)} />
        <span className="text-gray-400 text-xs">—</span>
        <input type="date" className={inp} value={filtros.fechaHasta} onChange={(e) => set("fechaHasta", e.target.value)} />
      </div>
      <button
        onClick={() => onChange({ busqueda: "", estado: "", comercial: "", fechaDesde: "", fechaHasta: "" })}
        className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        Limpiar
      </button>
    </div>
  );
}
