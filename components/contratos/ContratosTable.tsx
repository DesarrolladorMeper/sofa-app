"use client";

import { Contrato } from "./contratos-types";

const COP = (v: number | string) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(v));

const fecha = (s: string) =>
  s ? new Date(s).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const BADGE: Record<string, string> = {
  ACTIVO:    "bg-green-100 text-green-700",
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  VENCIDO:   "bg-red-100 text-red-700",
  CANCELADO: "bg-gray-100 text-gray-500",
};

type Props = {
  contratos: Contrato[];
  selectedRows: number[];
  onSelectRow: (id: number) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (c: Contrato) => void;
  onDelete: (id: number) => void;
};

export default function ContratosTable({
  contratos,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onEdit,
  onDelete,
}: Props) {
  const todosSeleccionados =
    contratos.length > 0 && contratos.every((c) => selectedRows.includes(c.id_contrato));

  if (contratos.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        No hay contratos que mostrar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">
            <th className="py-3 px-4 text-left">
              <input
                type="checkbox"
                checked={todosSeleccionados}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300"
              />
            </th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 whitespace-nowrap">N° Contrato</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600">Cliente</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600">Comercial</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 whitespace-nowrap">Mes Contrato</th>
            <th className="py-3 px-4 text-right font-semibold text-gray-600">Valor</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">IVA</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600">Estado</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha Generación</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha Cobro</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 whitespace-nowrap">Finalización</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">Facturado</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {contratos.map((c) => (
            <tr
              key={c.id_contrato}
              className={`hover:bg-gray-50 transition-colors ${
                selectedRows.includes(c.id_contrato) ? "bg-amber-50/40" : ""
              }`}
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(c.id_contrato)}
                  onChange={() => onSelectRow(c.id_contrato)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="py-3 px-4 font-mono font-semibold text-[#514737] whitespace-nowrap">
                {c.numero_contrato}
              </td>
              <td className="py-3 px-4 text-gray-800 max-w-[180px] truncate" title={c.cliente_nombre_somos}>
                {c.cliente_nombre_somos}
              </td>
              <td className="py-3 px-4 text-gray-600">
                {c.comercial?.username ?? <span className="text-gray-300">—</span>}
              </td>
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{c.mes_contrato}</td>
              <td className="py-3 px-4 text-right font-medium text-gray-800 whitespace-nowrap">
                {COP(c.valor)}
              </td>
              <td className="py-3 px-4 text-center">
                {c.tiene_iva ? (
                  <span className="text-green-600 font-semibold text-xs">Sí</span>
                ) : (
                  <span className="text-gray-300 text-xs">No</span>
                )}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BADGE[c.estado] ?? "bg-gray-100 text-gray-500"}`}>
                  {c.estado}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{fecha(c.fecha_generacion_factura)}</td>
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{fecha(c.fecha_vencimiento_factura)}</td>
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{fecha(c.finalizacion_contrato)}</td>
              <td className="py-3 px-4 text-center">
                {c.esta_facturado ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(c)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#514737] hover:bg-amber-50 transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(c.id_contrato)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
