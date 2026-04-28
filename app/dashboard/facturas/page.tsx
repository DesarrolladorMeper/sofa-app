"use client";

import { useEffect, useState } from "react";

type Factura = {
  id_factura: number;
  numero_factura: string;
  tipo_servicio: string;
  fecha_generacion_factura: string;
  fecha_vencimiento: string;
  fecha_pago_factura: string | null;
  va_con_iva: boolean;
  valor_sin_iva: string | number;
  valor_iva: string | number;
  valor_total: string | number;
  estado_factura: string;
  valor_comision: string | number | null;
  comercial: { username: string } | null;
  contrato: { numero_contrato: string; cliente_nombre_somos: string } | null;
};

const COP = (v: string | number | null) =>
  v != null ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(v)) : "—";

const fecha = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const BADGE: Record<string, string> = {
  PAGADA:    "bg-green-100 text-green-700",
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  VENCIDA:   "bg-red-100 text-red-700",
};

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    fetch("/api/facturas")
      .then((r) => r.json())
      .then((data) => { setFacturas(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtradas = facturas.filter((f) => {
    const q = busqueda.toLowerCase();
    if (q && !f.numero_factura.toLowerCase().includes(q) && !(f.contrato?.cliente_nombre_somos ?? "").toLowerCase().includes(q)) return false;
    if (estado && f.estado_factura !== estado) return false;
    return true;
  });

  const totalFacturado = filtradas.reduce((acc, f) => acc + Number(f.valor_total), 0);
  const totalPendiente = filtradas.filter((f) => f.estado_factura === "PENDIENTE").reduce((acc, f) => acc + Number(f.valor_total), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Facturas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Registro de facturación</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl px-5 py-4">
          <p className="text-xs text-gray-500 font-medium">Total facturas</p>
          <p className="text-2xl font-bold mt-1 text-blue-700">{facturas.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl px-5 py-4">
          <p className="text-xs text-gray-500 font-medium">Total facturado</p>
          <p className="text-lg font-bold mt-1 text-green-700">{COP(totalFacturado)}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl px-5 py-4">
          <p className="text-xs text-gray-500 font-medium">Por cobrar</p>
          <p className="text-lg font-bold mt-1 text-yellow-700">{COP(totalPendiente)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#514737]/30 min-w-[220px] flex-1"
          placeholder="Buscar por número o cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#514737]/30"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="PAGADA">Pagada</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="VENCIDA">Vencida</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Cargando...</div>
        ) : filtradas.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No hay facturas que mostrar.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">No. Factura</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600">Cliente</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">Contrato</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">Tipo Servicio</th>
                <th className="py-3 px-3 text-right font-semibold text-gray-600 whitespace-nowrap">Valor Total</th>
                <th className="py-3 px-3 text-right font-semibold text-gray-600 whitespace-nowrap">IVA</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600">Estado</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">Generación</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">Vencimiento</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600 whitespace-nowrap">Pago</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600">Comercial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtradas.map((f) => (
                <tr key={f.id_factura} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-[#514737] text-xs whitespace-nowrap">{f.numero_factura}</td>
                  <td className="py-2.5 px-3 text-gray-800 max-w-[150px] truncate font-medium text-xs" title={f.contrato?.cliente_nombre_somos}>
                    {f.contrato?.cliente_nombre_somos ?? "—"}
                  </td>
                  <td className="py-2.5 px-3 text-gray-400 font-mono text-xs whitespace-nowrap">{f.contrato?.numero_contrato ?? "—"}</td>
                  <td className="py-2.5 px-3 text-gray-600 text-xs whitespace-nowrap">{f.tipo_servicio}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-gray-800 text-xs whitespace-nowrap">{COP(f.valor_total)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-500 text-xs whitespace-nowrap">{f.va_con_iva ? COP(f.valor_iva) : "—"}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BADGE[f.estado_factura] ?? "bg-gray-100 text-gray-500"}`}>
                      {f.estado_factura}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs whitespace-nowrap">{fecha(f.fecha_generacion_factura)}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs whitespace-nowrap">{fecha(f.fecha_vencimiento)}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs whitespace-nowrap">{fecha(f.fecha_pago_factura)}</td>
                  <td className="py-2.5 px-3 text-gray-400 text-xs">{f.comercial?.username ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
