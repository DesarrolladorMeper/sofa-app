"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Contrato, Comercial, ESTADOS_CONTRATO } from "./contratos-types";

type Props = {
  onClose: () => void;
  onGuardado: () => void;
  contratoEditar: Contrato | null;
  comerciales: Comercial[];
};

const VACÍO = {
  nit: "",
  clienteId: "",
  cliente_nombre_somos: "",
  numero_contrato: "",
  pte: "",
  mes_contrato: "",
  meses_contrato: "",
  cantidad_horas_contrato: "",
  fecha_inicio: "",
  fecha_vencimiento_factura: "",
  fecha_generacion_factura: "",
  finalizacion_contrato: "",
  valor: "",
  tiene_iva: false,
  costos: "",
  auditoria: "",
  imprevistos: "",
  rent: "",
  total_proyecto: "",
  estado: "ACTIVO",
  observaciones: "",
  esta_facturado: false,
  comercialId: "",
};

const toISO = (s: string | null) => (s ? s.split("T")[0] : "");

export default function NuevoContratoModal({ onClose, onGuardado, contratoEditar, comerciales }: Props) {
  const [form, setForm] = useState(VACÍO);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (contratoEditar) {
      setForm({
        nit: contratoEditar.nit ?? "",
        clienteId: String(contratoEditar.clienteId),
        cliente_nombre_somos: contratoEditar.cliente_nombre_somos,
        numero_contrato: contratoEditar.numero_contrato,
        pte: contratoEditar.pte ?? "",
        mes_contrato: contratoEditar.mes_contrato ?? "",
        meses_contrato: contratoEditar.meses_contrato != null ? String(contratoEditar.meses_contrato) : "",
        cantidad_horas_contrato: contratoEditar.cantidad_horas_contrato != null ? String(contratoEditar.cantidad_horas_contrato) : "",
        fecha_inicio: toISO(contratoEditar.fecha_inicio),
        fecha_vencimiento_factura: toISO(contratoEditar.fecha_vencimiento_factura),
        fecha_generacion_factura: toISO(contratoEditar.fecha_generacion_factura),
        finalizacion_contrato: toISO(contratoEditar.finalizacion_contrato),
        valor: String(contratoEditar.valor),
        tiene_iva: contratoEditar.tiene_iva,
        costos: contratoEditar.costos != null ? String(contratoEditar.costos) : "",
        auditoria: contratoEditar.auditoria != null ? String(contratoEditar.auditoria) : "",
        imprevistos: contratoEditar.imprevistos != null ? String(contratoEditar.imprevistos) : "",
        rent: contratoEditar.rent != null ? String(contratoEditar.rent) : "",
        total_proyecto: contratoEditar.total_proyecto != null ? String(contratoEditar.total_proyecto) : "",
        estado: contratoEditar.estado,
        observaciones: contratoEditar.observaciones ?? "",
        esta_facturado: contratoEditar.esta_facturado,
        comercialId: contratoEditar.comercialId ? String(contratoEditar.comercialId) : "",
      });
    } else {
      setForm(VACÍO);
    }
  }, [contratoEditar]);

  const set = (k: keyof typeof VACÍO, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // Recalcula total_proyecto automáticamente al cambiar los componentes de costo
  const recalcularTotal = (campo: string, valor: string) => {
    const next = { ...form, [campo]: valor };
    const costos = Number(next.costos) || 0;
    const auditoria = Number(next.auditoria) || 0;
    const imprevistos = Number(next.imprevistos) || 0;
    const rent = Number(next.rent) || 0;
    const total = costos + auditoria + imprevistos + rent;
    setForm((prev) => ({ ...prev, [campo]: valor, total_proyecto: total > 0 ? String(total) : prev.total_proyecto }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente_nombre_somos || !form.numero_contrato) {
      toast.error("Cliente y número de contrato son obligatorios");
      return;
    }
    setGuardando(true);
    try {
      const url = contratoEditar ? `/api/contratos/${contratoEditar.id_contrato}` : "/api/contratos";
      const method = contratoEditar ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          clienteId: Number(form.clienteId) || 0,
          meses_contrato: form.meses_contrato ? Number(form.meses_contrato) : null,
          cantidad_horas_contrato: form.cantidad_horas_contrato ? Number(form.cantidad_horas_contrato) : null,
          valor: Number(form.valor) || 0,
          costos: form.costos ? Number(form.costos) : null,
          auditoria: form.auditoria ? Number(form.auditoria) : null,
          imprevistos: form.imprevistos ? Number(form.imprevistos) : null,
          rent: form.rent ? Number(form.rent) : null,
          total_proyecto: form.total_proyecto ? Number(form.total_proyecto) : null,
          comercialId: form.comercialId ? Number(form.comercialId) : null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(contratoEditar ? "Contrato actualizado" : "Contrato creado");
      onGuardado();
    } catch {
      toast.error("Error al guardar el contrato");
    } finally {
      setGuardando(false);
    }
  };

  const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#514737]/20 focus:border-[#514737]";
  const lbl = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";
  const sec = "text-xs font-bold text-[#514737] uppercase tracking-widest mb-3 pb-1 border-b border-[#514737]/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-800">
            {contratoEditar ? "Editar Contrato" : "Nuevo Contrato"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ── Sección 1: Identificación del cliente ── */}
          <div>
            <p className={sec}>Datos del cliente</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={lbl}>NIT</label>
                <input className={inp} value={form.nit} onChange={(e) => set("nit", e.target.value)} placeholder="900.123.456-7" />
              </div>
              <div className="col-span-2">
                <label className={lbl}>Cliente (nombre empresa) *</label>
                <input className={inp} value={form.cliente_nombre_somos} onChange={(e) => set("cliente_nombre_somos", e.target.value)} placeholder="Nombre de la empresa" required />
              </div>
            </div>
          </div>

          {/* ── Sección 2: Datos del contrato ── */}
          <div>
            <p className={sec}>Datos del contrato</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className={lbl}>No. Contrato *</label>
                <input className={inp} value={form.numero_contrato} onChange={(e) => set("numero_contrato", e.target.value)} placeholder="ej. OS-2026-001" required />
              </div>
              <div>
                <label className={lbl}>PTE</label>
                <input className={inp} value={form.pte} onChange={(e) => set("pte", e.target.value)} placeholder="PTE" />
              </div>
              <div>
                <label className={lbl}>Estado</label>
                <select className={inp} value={form.estado} onChange={(e) => set("estado", e.target.value)}>
                  {ESTADOS_CONTRATO.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className={lbl}>Meses contrato</label>
                <input type="number" className={inp} value={form.meses_contrato} onChange={(e) => set("meses_contrato", e.target.value)} placeholder="12" min={0} />
              </div>
              <div>
                <label className={lbl}>Cantidad horas contrato</label>
                <input type="number" className={inp} value={form.cantidad_horas_contrato} onChange={(e) => set("cantidad_horas_contrato", e.target.value)} placeholder="0" min={0} step="0.5" />
              </div>
              <div>
                <label className={lbl}>Mes facturación</label>
                <input className={inp} value={form.mes_contrato} onChange={(e) => set("mes_contrato", e.target.value)} placeholder="ej. Enero 2026" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Comercial</label>
                <select className={inp} value={form.comercialId} onChange={(e) => set("comercialId", e.target.value)}>
                  <option value="">Sin comercial</option>
                  {comerciales.map((c) => <option key={c.id_comercial} value={c.id_comercial}>{c.username}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>ID Cliente (SOMOS)</label>
                <input type="number" className={inp} value={form.clienteId} onChange={(e) => set("clienteId", e.target.value)} placeholder="ID en sistema SOMOS" min={0} />
              </div>
            </div>
          </div>

          {/* ── Sección 3: Fechas ── */}
          <div>
            <p className={sec}>Fechas</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={lbl}>Fecha inicio</label>
                <input type="date" className={inp} value={form.fecha_inicio} onChange={(e) => set("fecha_inicio", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Fecha vencimiento</label>
                <input type="date" className={inp} value={form.finalizacion_contrato} onChange={(e) => set("finalizacion_contrato", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Fecha gen. factura</label>
                <input type="date" className={inp} value={form.fecha_generacion_factura} onChange={(e) => set("fecha_generacion_factura", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Fecha cobro</label>
                <input type="date" className={inp} value={form.fecha_vencimiento_factura} onChange={(e) => set("fecha_vencimiento_factura", e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── Sección 4: Costos del proyecto ── */}
          <div>
            <p className={sec}>Estructura de costos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={lbl}>Costos (COP)</label>
                <input type="number" className={inp} value={form.costos} onChange={(e) => recalcularTotal("costos", e.target.value)} placeholder="0" min={0} />
              </div>
              <div>
                <label className={lbl}>Auditoría (COP)</label>
                <input type="number" className={inp} value={form.auditoria} onChange={(e) => recalcularTotal("auditoria", e.target.value)} placeholder="0" min={0} />
              </div>
              <div>
                <label className={lbl}>Imprevistos (COP)</label>
                <input type="number" className={inp} value={form.imprevistos} onChange={(e) => recalcularTotal("imprevistos", e.target.value)} placeholder="0" min={0} />
              </div>
              <div>
                <label className={lbl}>$ Rent (COP)</label>
                <input type="number" className={inp} value={form.rent} onChange={(e) => recalcularTotal("rent", e.target.value)} placeholder="0" min={0} />
              </div>
              <div>
                <label className={lbl}>Total proyecto (COP)</label>
                <input type="number" className={`${inp} font-semibold bg-gray-50`} value={form.total_proyecto} onChange={(e) => set("total_proyecto", e.target.value)} placeholder="0" min={0} />
              </div>
              <div>
                <label className={lbl}>Valor contrato (COP)</label>
                <input type="number" className={inp} value={form.valor} onChange={(e) => set("valor", e.target.value)} placeholder="0" min={0} />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.tiene_iva} onChange={(e) => set("tiene_iva", e.target.checked)} className="w-4 h-4 rounded border-gray-300 accent-[#514737]" />
                <span className="text-sm font-medium text-gray-700">Aplica IVA</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.esta_facturado} onChange={(e) => set("esta_facturado", e.target.checked)} className="w-4 h-4 rounded border-gray-300 accent-[#514737]" />
                <span className="text-sm font-medium text-gray-700">Ya está facturado</span>
              </label>
            </div>
          </div>

          {/* ── Sección 5: Observaciones ── */}
          <div>
            <label className={lbl}>Observaciones</label>
            <textarea className={`${inp} resize-none`} rows={2} value={form.observaciones} onChange={(e) => set("observaciones", e.target.value)} placeholder="Notas adicionales..." />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={guardando} className="px-5 py-2 text-sm font-bold text-white rounded-xl bg-[#514737] hover:bg-[#615542] transition-all shadow disabled:opacity-60">
            {guardando ? "Guardando..." : contratoEditar ? "Actualizar" : "Crear Contrato"}
          </button>
        </div>
      </div>
    </div>
  );
}
