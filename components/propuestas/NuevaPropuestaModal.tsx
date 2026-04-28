"use client";

import { useEffect, useState } from "react";
import { Propuesta, ESTADOS_PROPUESTA, TIPOS_SERVICIO_PROP } from "./propuestas-types";

type Comercial = { id_comercial: number; username: string };
type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  propuestaEditar: Propuesta | null;
  comerciales: Comercial[];
};

const VACÍO = {
  cliente_nombre_somos: "", nit: "", numero_propuesta: "", pte: "",
  tipo_servicio: "", meses_propuesta: "", cantidad_horas: "",
  fecha_propuesta: "", fecha_vencimiento: "", valor_propuesta: "",
  estado: "PENDIENTE", observaciones: "", comercialId: "",
};

export default function NuevaPropuestaModal({ open, onClose, onSave, propuestaEditar, comerciales }: Props) {
  const [form, setForm] = useState(VACÍO);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (propuestaEditar) {
      setForm({
        cliente_nombre_somos: propuestaEditar.cliente_nombre_somos,
        nit: propuestaEditar.nit ?? "",
        numero_propuesta: propuestaEditar.numero_propuesta,
        pte: propuestaEditar.pte ?? "",
        tipo_servicio: propuestaEditar.tipo_servicio ?? "",
        meses_propuesta: propuestaEditar.meses_propuesta != null ? String(propuestaEditar.meses_propuesta) : "",
        cantidad_horas: propuestaEditar.cantidad_horas != null ? String(propuestaEditar.cantidad_horas) : "",
        fecha_propuesta: propuestaEditar.fecha_propuesta ? propuestaEditar.fecha_propuesta.split("T")[0] : "",
        fecha_vencimiento: propuestaEditar.fecha_vencimiento ? propuestaEditar.fecha_vencimiento.split("T")[0] : "",
        valor_propuesta: propuestaEditar.valor_propuesta != null ? String(propuestaEditar.valor_propuesta) : "",
        estado: propuestaEditar.estado,
        observaciones: propuestaEditar.observaciones ?? "",
        comercialId: propuestaEditar.comercialId != null ? String(propuestaEditar.comercialId) : "",
      });
    } else {
      setForm(VACÍO);
    }
  }, [propuestaEditar, open]);

  if (!open) return null;

  const lbl = "block text-xs font-semibold text-gray-500 mb-1";
  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#514737]/30 text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            {propuestaEditar ? "Editar Propuesta" : "Nueva Propuesta"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {/* Identificación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={lbl}>Cliente *</label>
              <input className={inp} value={form.cliente_nombre_somos} onChange={(e) => set("cliente_nombre_somos", e.target.value)} placeholder="Nombre del cliente" />
            </div>
            <div>
              <label className={lbl}>NIT</label>
              <input className={inp} value={form.nit} onChange={(e) => set("nit", e.target.value)} placeholder="123.456.789-0" />
            </div>
            <div>
              <label className={lbl}>No. Propuesta *</label>
              <input className={inp} value={form.numero_propuesta} onChange={(e) => set("numero_propuesta", e.target.value)} placeholder="PROP-2026-001" />
            </div>
          </div>

          {/* Servicio */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={lbl}>PTE</label>
              <input className={inp} value={form.pte} onChange={(e) => set("pte", e.target.value)} placeholder="PTE739" />
            </div>
            <div>
              <label className={lbl}>Tipo de Servicio</label>
              <select className={inp} value={form.tipo_servicio} onChange={(e) => set("tipo_servicio", e.target.value)}>
                <option value="">Sin especificar</option>
                {TIPOS_SERVICIO_PROP.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Meses</label>
              <input type="number" className={inp} value={form.meses_propuesta} onChange={(e) => set("meses_propuesta", e.target.value)} placeholder="12" min="1" />
            </div>
          </div>

          {/* Fechas y valor */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={lbl}>Fecha Propuesta</label>
              <input type="date" className={inp} value={form.fecha_propuesta} onChange={(e) => set("fecha_propuesta", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Fecha Vencimiento</label>
              <input type="date" className={inp} value={form.fecha_vencimiento} onChange={(e) => set("fecha_vencimiento", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Horas</label>
              <input type="number" className={inp} value={form.cantidad_horas} onChange={(e) => set("cantidad_horas", e.target.value)} placeholder="120" min="0" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className={lbl}>Valor Propuesta (COP) *</label>
              <input type="number" className={inp} value={form.valor_propuesta} onChange={(e) => set("valor_propuesta", e.target.value)} placeholder="50000000" min="0" />
            </div>
            <div>
              <label className={lbl}>Estado</label>
              <select className={inp} value={form.estado} onChange={(e) => set("estado", e.target.value)}>
                {ESTADOS_PROPUESTA.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={lbl}>Comercial</label>
            <select className={inp} value={form.comercialId} onChange={(e) => set("comercialId", e.target.value)}>
              <option value="">Sin asignar</option>
              {comerciales.map((c) => <option key={c.id_comercial} value={String(c.id_comercial)}>{c.username}</option>)}
            </select>
          </div>

          <div>
            <label className={lbl}>Observaciones</label>
            <textarea className={`${inp} resize-none`} rows={3} value={form.observaciones} onChange={(e) => set("observaciones", e.target.value)} placeholder="Notas adicionales..." />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors">Cancelar</button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#514737" }}
          >
            {propuestaEditar ? "Guardar cambios" : "Crear propuesta"}
          </button>
        </div>
      </div>
    </div>
  );
}
