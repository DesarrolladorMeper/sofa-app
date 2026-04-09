// ObligacionesFiltros.tsx
'use client';

import { FiltrosObligacion, CategoriaPresupuesto } from './obligaciones-types';

type ObligacionesFiltrosProps = {
  filtros: FiltrosObligacion;
  onChange: (filtros: Partial<FiltrosObligacion>) => void;
  categorias: CategoriaPresupuesto[];
  onLimpiar: () => void;
};

export default function ObligacionesFiltros({
  filtros,
  onChange,
  categorias,
  onLimpiar,
}: ObligacionesFiltrosProps) {
  const estados = ['Cancelada', 'Por Pagar'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
        <button
          onClick={onLimpiar}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Búsqueda general */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={filtros.busqueda}
            onChange={(e) => onChange({ busqueda: e.target.value })}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
          />
          <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filtro por entidad */}
        <input
          type="text"
          placeholder="Entidad"
          value={filtros.entidad}
          onChange={(e) => onChange({ entidad: e.target.value })}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
        />

        {/* Filtro por categoría */}
        <select
          value={filtros.categoria}
          onChange={(e) => onChange({ categoria: e.target.value })}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none bg-white"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria_presupuesto} value={cat.nombre_categoria}>
              {cat.nombre_categoria}
            </option>
          ))}
        </select>

        {/* Filtro por estado */}
        <select
          value={filtros.estado}
          onChange={(e) => onChange({ estado: e.target.value })}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none bg-white"
        >
          <option value="">Todos los estados</option>
          {estados.map((est) => (
            <option key={est} value={est}>{est}</option>
          ))}
        </select>

        {/* Filtro fecha desde */}
        <input
          type="date"
          placeholder="Fecha desde"
          value={filtros.fechaDesde}
          onChange={(e) => onChange({ fechaDesde: e.target.value })}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
        />

        {/* Filtro fecha hasta */}
        <input
          type="date"
          placeholder="Fecha hasta"
          value={filtros.fechaHasta}
          onChange={(e) => onChange({ fechaHasta: e.target.value })}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
        />
      </div>
    </div>
  );
}