"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Propuesta, FiltrosPropuesta } from "@/components/propuestas/propuestas-types";
import PropuestasTable from "@/components/propuestas/PropuestasTable";
import PropuestasFiltros from "@/components/propuestas/PropuestasFiltros";
import NuevaPropuestaModal from "@/components/propuestas/NuevaPropuestaModal";

type Comercial = { id_comercial: number; username: string };

const FILTROS_VACÍOS: FiltrosPropuesta = { busqueda: "", estado: "", comercial: "", fechaDesde: "", fechaHasta: "" };

export default function PropuestasPage() {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [comerciales, setComerciales] = useState<Comercial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosPropuesta>(FILTROS_VACÍOS);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Propuesta | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetch("/api/propuestas"), fetch("/api/comerciales")]);
      setPropuestas(await pRes.json());
      setComerciales(await cRes.json());
    } catch {
      toast.error("Error al cargar propuestas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const filtradas = propuestas.filter((p) => {
    const q = filtros.busqueda.toLowerCase();
    if (q && !p.cliente_nombre_somos.toLowerCase().includes(q) && !p.numero_propuesta.toLowerCase().includes(q)) return false;
    if (filtros.estado && p.estado !== filtros.estado) return false;
    if (filtros.comercial && String(p.comercialId) !== filtros.comercial) return false;
    if (filtros.fechaDesde && p.fecha_propuesta && p.fecha_propuesta < filtros.fechaDesde) return false;
    if (filtros.fechaHasta && p.fecha_propuesta && p.fecha_propuesta > filtros.fechaHasta) return false;
    return true;
  });

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      const url = editando ? `/api/propuestas/${editando.id_propuesta}` : "/api/propuestas";
      const method = editando ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success(editando ? "Propuesta actualizada" : "Propuesta creada");
      setModalOpen(false);
      setEditando(null);
      cargar();
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta propuesta?")) return;
    try {
      await fetch(`/api/propuestas/${id}`, { method: "DELETE" });
      toast.success("Propuesta eliminada");
      cargar();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`¿Eliminar ${selectedRows.length} propuesta(s)?`)) return;
    await Promise.all(selectedRows.map((id) => fetch(`/api/propuestas/${id}`, { method: "DELETE" })));
    toast.success(`${selectedRows.length} propuesta(s) eliminada(s)`);
    setSelectedRows([]);
    cargar();
  };

  const handleAprobar = async (p: Propuesta) => {
    if (!confirm(`¿Aprobar "${p.numero_propuesta}"? Se creará un contrato automáticamente.`)) return;
    try {
      const res = await fetch(`/api/propuestas/${p.id_propuesta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, estado: "APROBADO" }),
      });
      if (!res.ok) throw new Error();
      const { contratoCreado } = await res.json();
      toast.success(contratoCreado ? "Propuesta aprobada — contrato creado" : "Propuesta aprobada");
      cargar();
    } catch {
      toast.error("Error al aprobar");
    }
  };

  const handleRechazar = async (p: Propuesta) => {
    if (!confirm(`¿Rechazar "${p.numero_propuesta}"?`)) return;
    try {
      await fetch(`/api/propuestas/${p.id_propuesta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, estado: "RECHAZADO" }),
      });
      toast.success("Propuesta rechazada");
      cargar();
    } catch {
      toast.error("Error al rechazar");
    }
  };

  const counts = {
    pendiente: propuestas.filter((p) => p.estado === "PENDIENTE").length,
    aprobado:  propuestas.filter((p) => p.estado === "APROBADO").length,
    rechazado: propuestas.filter((p) => p.estado === "RECHAZADO").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Propuestas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestión de propuestas comerciales</p>
        </div>
        <button
          onClick={() => { setEditando(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#514737" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva propuesta
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pendientes", value: counts.pendiente, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Aprobadas",  value: counts.aprobado,  color: "text-green-600",  bg: "bg-green-50"  },
          { label: "Rechazadas", value: counts.rechazado, color: "text-red-500",    bg: "bg-red-50"    },
        ].map((k) => (
          <div key={k.label} className={`${k.bg} rounded-xl px-5 py-4`}>
            <p className="text-xs text-gray-500 font-medium">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <PropuestasFiltros filtros={filtros} onChange={setFiltros} comerciales={comerciales} />

      {/* Acciones sobre selección */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">{selectedRows.length} seleccionada(s)</span>
          <button onClick={handleDeleteSelected} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium">
            Eliminar seleccionadas
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Cargando...</div>
        ) : (
          <PropuestasTable
            propuestas={filtradas}
            selectedRows={selectedRows}
            onSelectRow={(id) => setSelectedRows((r) => r.includes(id) ? r.filter((x) => x !== id) : [...r, id])}
            onSelectAll={(sel) => setSelectedRows(sel ? filtradas.map((p) => p.id_propuesta) : [])}
            onEdit={(p) => { setEditando(p); setModalOpen(true); }}
            onDelete={handleDelete}
            onAprobar={handleAprobar}
            onRechazar={handleRechazar}
          />
        )}
      </div>

      <NuevaPropuestaModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditando(null); }}
        onSave={handleSave}
        propuestaEditar={editando}
        comerciales={comerciales}
      />
    </div>
  );
}
