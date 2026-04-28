"use client";

import { Propuesta } from "./propuestas-types";

const COP = (v: number | string | null) =>
  v != null && v !== ""
    ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(v))
    : "—";

const fecha = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const BADGE: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  APROBADO:  "bg-green-100 text-green-700",
  RECHAZADO: "bg-red-100 text-red-700",
};

type Props = {
  propuestas: Propuesta[];
  selectedRows: number[];
  onSelectRow: (id: number) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (p: Propuesta) => void;
  onDelete: (id: number) => void;
  onAprobar: (p: Propuesta) => void;
  onRechazar: (p: Propuesta) => void;
};

export default function PropuestasTable({
  propuestas, selectedRows, onSelectRow, onSelectAll, onEdit, onDelete, onAprobar, onRechazar,
}: Props) {
  const todosSeleccionados = propuestas.length > 0 && propuestas.every((p) => selectedRows.includes(p.id_propuesta));

  if (propuestas.length === 0) {
    return <div className="py-16 text-center text-gray-400 text-sm">No hay propuestas que mostrar.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">
            <th className="py-3 px-3 text-left">
              <input type="checkbox" checked={todosSeleccionados} onChange={(e) => onSelectAll(e.target.checked)} className="rounded border-gray-300" />
            </th>
            <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">No. Propuesta</th>
            <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">NIT</th>
            <th className="py-3 px-3 text-left font-semibold text-gray-600">Cliente</th>
            <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">Tipo Servicio</th>
            <th className="py-3 px-3 text-center font-semibold text-gray-600 whitespace-nowrap">Meses</th>
            <th className="py-3 px-3 text-right font-semibold text-gray-600 whitespace-nowrap">Valor</th>
            <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha</th>
            <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">Vence</th>
            <th className="py-3 px-3 text-left font-semibold text-gray-600">Estado</th>
            <th className="py-3 px-3 text-left font-semibold text-gray-600">Comercial</th>
            <th className="py-3 px-3 text-left font-semibold text-gray-600">Contrato</th>
            <th className="py-3 px-3 text-center font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {propuestas.map((p) => (
            <tr key={p.id_propuesta} className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(p.id_propuesta) ? "bg-amber-50/40" : ""}`}>
              <td className="py-2.5 px-3">
                <input type="checkbox" checked={selectedRows.includes(p.id_propuesta)} onChange={() => onSelectRow(p.id_propuesta)} className="rounded border-gray-300" />
              </td>
              <td className="py-2.5 px-3 font-mono font-semibold text-[#514737] whitespace-nowrap text-xs">{p.numero_propuesta}</td>
              <td className="py-2.5 px-3 text-gray-400 text-xs font-mono whitespace-nowrap">{p.nit ?? "—"}</td>
              <td className="py-2.5 px-3 text-gray-800 max-w-[160px] truncate font-medium" title={p.cliente_nombre_somos}>{p.cliente_nombre_somos}</td>
              <td className="py-2.5 px-3 text-gray-600 text-xs whitespace-nowrap">{p.tipo_servicio ?? "—"}</td>
              <td className="py-2.5 px-3 text-center text-gray-600">{p.meses_propuesta ?? "—"}</td>
              <td className="py-2.5 px-3 text-right font-semibold text-gray-800 whitespace-nowrap text-xs">{COP(p.valor_propuesta)}</td>
              <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap text-xs">{fecha(p.fecha_propuesta)}</td>
              <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap text-xs">{fecha(p.fecha_vencimiento)}</td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BADGE[p.estado] ?? "bg-gray-100 text-gray-500"}`}>
                  {p.estado}
                </span>
              </td>
              <td className="py-2.5 px-3 text-gray-400 text-xs">{p.comercial?.username ?? "—"}</td>
              <td className="py-2.5 px-3 text-xs">
                {p.contratoId ? (
                  <span className="text-green-600 font-mono font-semibold">#{p.contratoId}</span>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="py-2.5 px-3">
                <div className="flex items-center justify-center gap-1">
                  {p.estado === "PENDIENTE" && (
                    <>
                      <button
                        onClick={() => onAprobar(p)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Aprobar → crear contrato"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onRechazar(p)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Rechazar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onEdit(p)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#514737] hover:bg-amber-50 transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(p.id_propuesta)}
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
