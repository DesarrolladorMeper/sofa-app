"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Contrato, Comercial, FiltrosContrato } from "@/components/contratos/contratos-types";
import ContratosTable from "@/components/contratos/ContratosTable";
import ContratosFiltros from "@/components/contratos/ContratosFiltros";
import NuevoContratoModal from "@/components/contratos/NuevoContratoModal";
import Paginacion from "@/components/ui/Paginacion";
import Spinner from "@/components/ui/Spinner";
import { usePaginacion } from "@/hooks/usePaginacion";

const COP = (v: number | string) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(v));

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [comerciales, setComerciales] = useState<Comercial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [contratoEditar, setContratoEditar] = useState<Contrato | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filtros, setFiltros] = useState<FiltrosContrato>({
    busqueda: "",
    estado: "",
    comercial: "",
    estaFacturado: "",
    fechaDesde: "",
    fechaHasta: "",
  });

  const cargarContratos = useCallback(async () => {
    try {
      const res = await fetch("/api/contratos");
      if (!res.ok) throw new Error();
      setContratos(await res.json());
    } catch {
      toast.error("Error al cargar los contratos");
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarComerciales = useCallback(async () => {
    try {
      const res = await fetch("/api/comerciales");
      if (!res.ok) return;
      setComerciales(await res.json());
    } catch {
      // no bloquea la carga principal
    }
  }, []);

  useEffect(() => {
    cargarContratos();
    cargarComerciales();
  }, [cargarContratos, cargarComerciales]);

  const contratosFiltrados = contratos.filter((c) => {
    const q = filtros.busqueda.toLowerCase();
    const matchBusqueda =
      !q ||
      c.numero_contrato.toLowerCase().includes(q) ||
      c.cliente_nombre_somos.toLowerCase().includes(q);

    const matchEstado = !filtros.estado || c.estado === filtros.estado;
    const matchComercial = !filtros.comercial || c.comercial?.username === filtros.comercial;
    const matchFacturado =
      !filtros.estaFacturado ||
      (filtros.estaFacturado === "si" ? c.esta_facturado : !c.esta_facturado);

    return matchBusqueda && matchEstado && matchComercial && matchFacturado;
  });

  const pag = usePaginacion(contratosFiltrados, 20);

  useEffect(() => {
    pag.resetear();
    setSelectedRows([]);
  }, [filtros]);

  const totalValor = contratosFiltrados.reduce((acc, c) => acc + Number(c.valor), 0);
  const sinFacturar = contratosFiltrados.filter((c) => !c.esta_facturado).length;

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este contrato?")) return;
    try {
      const res = await fetch(`/api/contratos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Contrato eliminado");
      cargarContratos();
      setSelectedRows((prev) => prev.filter((r) => r !== id));
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedRows.length) return;
    if (!confirm(`¿Eliminar ${selectedRows.length} contrato(s)?`)) return;
    try {
      await Promise.all(selectedRows.map((id) => fetch(`/api/contratos/${id}`, { method: "DELETE" })));
      toast.success(`${selectedRows.length} contrato(s) eliminado(s)`);
      cargarContratos();
      setSelectedRows([]);
    } catch {
      toast.error("Error al eliminar");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Gestión de Contratos</h1>
          <p className="text-gray-400 text-sm mt-1">
            {contratosFiltrados.length} contrato(s) · {sinFacturar} sin facturar
          </p>
        </div>
        <div className="flex gap-3">
          {selectedRows.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar ({selectedRows.length})
            </button>
          )}
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl bg-[#514737] hover:bg-[#615542] transition-all shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
            </svg>
            Nuevo Contrato
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total contratos", value: String(contratosFiltrados.length), color: "text-gray-800" },
          { label: "Valor total", value: COP(totalValor), color: "text-[#514737]" },
          { label: "Sin facturar", value: String(sinFacturar), color: "text-yellow-600" },
          {
            label: "Contratos activos",
            value: String(contratosFiltrados.filter((c) => c.estado === "ACTIVO").length),
            color: "text-green-600",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{kpi.label}</p>
            <p className={`text-xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <ContratosFiltros
        filtros={filtros}
        comerciales={comerciales}
        onChange={(nuevos) => setFiltros((prev) => ({ ...prev, ...nuevos }))}
        onLimpiar={() =>
          setFiltros({ busqueda: "", estado: "", comercial: "", estaFacturado: "", fechaDesde: "", fechaHasta: "" })
        }
      />

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <ContratosTable
          contratos={pag.itemsPagina}
          selectedRows={selectedRows}
          onSelectRow={(id) =>
            setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
          }
          onSelectAll={(sel) =>
            setSelectedRows(sel ? pag.itemsPagina.map((c) => c.id_contrato) : [])
          }
          onEdit={(c) => {
            setContratoEditar(c);
            setModalAbierto(true);
          }}
          onDelete={handleDelete}
        />
        <Paginacion {...pag} />
      </div>

      {/* Modal */}
      {modalAbierto && (
        <NuevoContratoModal
          onClose={() => {
            setModalAbierto(false);
            setContratoEditar(null);
          }}
          onGuardado={() => {
            cargarContratos();
            setModalAbierto(false);
            setContratoEditar(null);
          }}
          contratoEditar={contratoEditar}
          comerciales={comerciales}
        />
      )}
    </div>
  );
}
