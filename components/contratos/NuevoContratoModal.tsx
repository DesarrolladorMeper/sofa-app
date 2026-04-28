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
  clienteId: "",
  cliente_nombre_somos: "",
  numero_contrato: "",
  mes_contrato: "",
  fecha_generacion_factura: "",
  fecha_vencimiento_factura: "",
  finalizacion_contrato: "",
  valor: "",
  tiene_iva: false,
  estado: "ACTIVO",
  observaciones: "",
  esta_facturado: false,
  comercialId: "",
};

export default function NuevoContratoModal({ onClose, onGuardado, contratoEditar, comerciales }: Props) {
  const [form, setForm] = useState(VACÍO);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (contratoEditar) {
      const toISO = (s: string) => s ? s.split("T")[0] : "";
      setForm({
        clienteId: String(contratoEditar.clienteId),
        cliente_nombre_somos: contratoEditar.cliente_nombre_somos,
        numero_contrato: contratoEditar.numero_contrato,
        mes_contrato: contratoEditar.mes_contrato,
        fecha_generacion_factura: toISO(contratoEditar.fecha_generacion_factura),
        fecha_vencimiento_factura: toISO(contratoEditar.fecha_vencimiento_factura),
        finalizacion_contrato: toISO(contratoEditar.finalizacion_contrato),
        valor: String(contratoEditar.valor),
        tiene_iva: contratoEditar.tiene_iva,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente_nombre_somos || !form.numero_contrato || !form.valor) {
      toast.error("Cliente, número de contrato y valor son obligatorios");
      return;
    }

    setGuardando(true);
    try {
      const url = contratoEditar
        ? `/api/contratos/${contratoEditar.id_contrato}`
        : "/api/contratos";
      const method = contratoEditar ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          clienteId: Number(form.clienteId) || 0,
          valor: Number(form.valor.replace(/\D/g, "")),
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

  const inputCls =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#514737]/20 focus:border-[#514737]";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">
            {contratoEditar ? "Editar Contrato" : "Nuevo Contrato"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Fila 1: N° Contrato + Cliente ID + Nombre cliente */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>N° Contrato *</label>
              <input
                className={inputCls}
                value={form.numero_contrato}
                onChange={(e) => set("numero_contrato", e.target.value)}
                placeholder="ej. OS-2026-001"
                required
              />
            </div>
            <div>
              <label className={labelCls}>ID Cliente (SOMOS)</label>
              <input
                type="number"
                className={inputCls}
                value={form.clienteId}
                onChange={(e) => set("clienteId", e.target.value)}
                placeholder="ID en SOMOS"
                min={0}
              />
            </div>
            <div>
              <label className={labelCls}>Nombre Cliente *</label>
              <input
                className={inputCls}
                value={form.cliente_nombre_somos}
                onChange={(e) => set("cliente_nombre_somos", e.target.value)}
                placeholder="Nombre empresa"
                required
              />
            </div>
          </div>

          {/* Fila 2: Comercial + Mes Contrato + Estado */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Comercial</label>
              <select
                className={inputCls}
                value={form.comercialId}
                onChange={(e) => set("comercialId", e.target.value)}
              >
                <option value="">Sin comercial</option>
                {comerciales.map((c) => (
                  <option key={c.id_comercial} value={c.id_comercial}>
                    {c.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Mes Contrato</label>
              <input
                className={inputCls}
                value={form.mes_contrato}
                onChange={(e) => set("mes_contrato", e.target.value)}
                placeholder="ej. Enero 2026"
              />
            </div>
            <div>
              <label className={labelCls}>Estado</label>
              <select
                className={inputCls}
                value={form.estado}
                onChange={(e) => set("estado", e.target.value)}
              >
                {ESTADOS_CONTRATO.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 3: Valor + IVA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Valor Contrato (COP) *</label>
              <input
                type="number"
                className={inputCls}
                value={form.valor}
                onChange={(e) => set("valor", e.target.value)}
                placeholder="0"
                min={0}
                required
              />
            </div>
            <div className="flex flex-col justify-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.tiene_iva}
                  onChange={(e) => set("tiene_iva", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#514737]"
                />
                <span className="text-sm font-medium text-gray-700">Aplica IVA</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.esta_facturado}
                  onChange={(e) => set("esta_facturado", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#514737]"
                />
                <span className="text-sm font-medium text-gray-700">Ya está facturado</span>
              </label>
            </div>
          </div>

          {/* Fila 4: Fechas */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Fecha Generación Factura *</label>
              <input
                type="date"
                className={inputCls}
                value={form.fecha_generacion_factura}
                onChange={(e) => set("fecha_generacion_factura", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Fecha de Cobro *</label>
              <input
                type="date"
                className={inputCls}
                value={form.fecha_vencimiento_factura}
                onChange={(e) => set("fecha_vencimiento_factura", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Finalización Contrato *</label>
              <input
                type="date"
                className={inputCls}
                value={form.finalizacion_contrato}
                onChange={(e) => set("finalizacion_contrato", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className={labelCls}>Observaciones</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={form.observaciones}
              onChange={(e) => set("observaciones", e.target.value)}
              placeholder="Notas adicionales..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={guardando}
            className="px-5 py-2 text-sm font-bold text-white rounded-xl bg-[#514737] hover:bg-[#615542] transition-all shadow disabled:opacity-60"
          >
            {guardando ? "Guardando..." : contratoEditar ? "Actualizar" : "Crear Contrato"}
          </button>
        </div>
      </div>
    </div>
  );
}
