"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Personal = {
  id_comercial: number;
  username: string;
  tiene_comision_comercial: boolean;
  porcentaje_comision: number | null;
};

const VACÍO = { username: "", tiene_comision_comercial: false, porcentaje_comision: "" };

function PersonalModal({
  open, onClose, onSave, editando,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (d: Record<string, unknown>) => void;
  editando: Personal | null;
}) {
  const [form, setForm] = useState(VACÍO);
  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (editando) {
      setForm({
        username: editando.username,
        tiene_comision_comercial: editando.tiene_comision_comercial,
        porcentaje_comision: editando.porcentaje_comision != null ? String(editando.porcentaje_comision) : "",
      });
    } else {
      setForm(VACÍO);
    }
  }, [editando, open]);

  if (!open) return null;
  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#514737]/30 text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">{editando ? "Editar Personal" : "Nuevo Personal"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre completo *</label>
            <input className={inp} value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="Nombre del personal" />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="comision"
              checked={Boolean(form.tiene_comision_comercial)}
              onChange={(e) => set("tiene_comision_comercial", e.target.checked)}
              className="rounded border-gray-300 w-4 h-4"
            />
            <label htmlFor="comision" className="text-sm text-gray-700">Tiene comisión comercial</label>
          </div>
          {form.tiene_comision_comercial && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Porcentaje de comisión (%)</label>
              <input
                type="number"
                className={inp}
                value={form.porcentaje_comision}
                onChange={(e) => set("porcentaje_comision", e.target.value)}
                placeholder="5.0"
                min="0"
                max="100"
                step="0.5"
              />
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors">Cancelar</button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#514737" }}
          >
            {editando ? "Guardar" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PersonalPage() {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Personal | null>(null);

  const cargar = async () => {
    setLoading(true);
    const res = await fetch("/api/comerciales");
    setPersonal(await res.json());
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      const url = editando ? `/api/comerciales/${editando.id_comercial}` : "/api/comerciales";
      const method = editando ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success(editando ? "Personal actualizado" : "Personal agregado");
      setModalOpen(false);
      setEditando(null);
      cargar();
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (p: Personal) => {
    if (!confirm(`¿Eliminar a ${p.username}?`)) return;
    try {
      await fetch(`/api/comerciales/${p.id_comercial}`, { method: "DELETE" });
      toast.success("Personal eliminado");
      cargar();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const conComision = personal.filter((p) => p.tiene_comision_comercial);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Personal</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestión Humana — equipo comercial y consultores</p>
        </div>
        <button
          onClick={() => { setEditando(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#514737" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar personal
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#514737]/10 rounded-xl px-5 py-4">
          <p className="text-xs text-gray-500 font-medium">Total personal</p>
          <p className="text-2xl font-bold mt-1 text-[#514737]">{personal.length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl px-5 py-4">
          <p className="text-xs text-gray-500 font-medium">Con comisión</p>
          <p className="text-2xl font-bold mt-1 text-blue-700">{conComision.length}</p>
        </div>
      </div>

      {/* Grid de tarjetas */}
      {loading ? (
        <div className="py-16 text-center text-gray-400 text-sm">Cargando...</div>
      ) : personal.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">No hay personal registrado.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {personal.map((p) => (
            <div key={p.id_comercial} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: "#514737" }}>
                    {p.username.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{p.username}</p>
                    <p className="text-xs text-gray-400 mt-0.5">ID #{p.id_comercial}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {p.tiene_comision_comercial ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 11H9v-2h2v2zm0-4H9V7h2v2z" /></svg>
                    Comisión {p.porcentaje_comision}%
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-xs font-medium">
                    Sin comisión
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-1 border-t border-gray-50">
                <button
                  onClick={() => { setEditando(p); setModalOpen(true); }}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-[#514737] hover:bg-amber-50 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PersonalModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditando(null); }}
        onSave={handleSave}
        editando={editando}
      />
    </div>
  );
}
