"use client";

import { FiltrosContrato, Comercial, ESTADOS_CONTRATO } from "./contratos-types";

type Props = {
  filtros: FiltrosContrato;
  comerciales: Comercial[];
  onChange: (f: Partial<FiltrosContrato>) => void;
  onLimpiar: () => void;
};

export default function ContratosFiltros({ filtros, comerciales, onChange, onLimpiar }: Props) {
  const hayFiltros = Object.values(filtros).some((v) => v !== "");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <input
          type="text"
          placeholder="Buscar contrato o cliente..."
          value={filtros.busqueda}
          onChange={(e) => onChange({ busqueda: e.target.value })}
          className="col-span-2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#514737]/20 focus:border-[#514737]"
        />

        <select
          value={filtros.estado}
          onChange={(e) => onChange({ estado: e.target.value })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#514737]/20 focus:border-[#514737] text-gray-600"
        >
          <option value="">Todos los estados</option>
          {ESTADOS_CONTRATO.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <select
          value={filtros.comercial}
          onChange={(e) => onChange({ comercial: e.target.value })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#514737]/20 focus:border-[#514737] text-gray-600"
        >
          <option value="">Todos los comerciales</option>
          {comerciales.map((c) => (
            <option key={c.id_comercial} value={c.username}>{c.username}</option>
          ))}
        </select>

        <select
          value={filtros.estaFacturado}
          onChange={(e) => onChange({ estaFacturado: e.target.value })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#514737]/20 focus:border-[#514737] text-gray-600"
        >
          <option value="">Facturado / Pendiente</option>
          <option value="si">Facturado</option>
          <option value="no">Sin facturar</option>
        </select>

        <button
          onClick={onLimpiar}
          disabled={!hayFiltros}
          className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
