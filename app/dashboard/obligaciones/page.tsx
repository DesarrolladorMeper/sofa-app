// page.tsx - Versión actualizada con función de pago
'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Obligacion, FiltrosObligacion, CategoriaPresupuesto } from '@/components/obligaciones/obligaciones-types';
import ObligacionesTable from '@/components/obligaciones/ObligacionesTable';
import ObligacionesFiltros from '@/components/obligaciones/ObligacionesFiltros';
import NuevaObligacionModal from '@/components/obligaciones/NuevaObligacionModal';
import Paginacion from '@/components/ui/Paginacion';
import Spinner from '@/components/ui/Spinner';
import { usePaginacion } from '@/hooks/usePaginacion';

export default function ObligacionesPage() {
  const [obligaciones, setObligaciones] = useState<Obligacion[]>([]);
  const [categorias, setCategorias] = useState<CategoriaPresupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [obligacionEditar, setObligacionEditar] = useState<Obligacion | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [actualizandoEstado, setActualizandoEstado] = useState<number | null>(null);
  const [filtros, setFiltros] = useState<FiltrosObligacion>({
    busqueda: '',
    entidad: '',
    estado: '',
    categoria: '',
    fechaDesde: '',
    fechaHasta: '',
  });

  const cargarObligaciones = useCallback(async () => {
    try {
      const res = await fetch('/api/obligaciones');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setObligaciones(data);
    } catch (error) {
      toast.error('Error al cargar las obligaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // const cargarCategorias = useCallback(async () => {
  //   try {
  //     const res = await fetch('/api/catalogos');
  //     const data = await res.json();
  //     setCategorias(data.categoriasPresupuesto || []);
  //   } catch (error) {
  //     console.error('Error cargando categorías:', error);
  //   }
  // }, []);

  useEffect(() => {
    cargarObligaciones();
    // cargarCategorias();
  }, [cargarObligaciones, 
    //cargarCategorias
  ]);


  // Filtrar obligaciones
  const obligacionesFiltradas = obligaciones.filter((obl) => {
    const valorObligacion = typeof obl.valor_obligacion === 'string' 
      ? parseFloat(obl.valor_obligacion) 
      : obl.valor_obligacion;
    const valorPagado = typeof obl.valor_pagado === 'string' 
      ? parseFloat(obl.valor_pagado) 
      : obl.valor_pagado;
    
    const matchBusqueda = !filtros.busqueda ||
      obl.entidad.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      obl.servicio_producto.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      obl.factura_cuenta_cobro?.toLowerCase().includes(filtros.busqueda.toLowerCase());

    const matchEntidad = !filtros.entidad ||
      obl.entidad.toLowerCase().includes(filtros.entidad.toLowerCase());

    const matchEstado = !filtros.estado || obl.estado === filtros.estado;

    const matchCategoria = !filtros.categoria ||
      obl.categoria_presupuesto?.nombre_categoria === filtros.categoria;

    const matchFechaDesde = !filtros.fechaDesde ||
      obl.fecha >= filtros.fechaDesde;

    const matchFechaHasta = !filtros.fechaHasta ||
      obl.fecha <= filtros.fechaHasta;

    return matchBusqueda && matchEntidad && matchEstado && matchCategoria && matchFechaDesde && matchFechaHasta;
  });

  const pag = usePaginacion(obligacionesFiltradas, 20);

  useEffect(() => {
    pag.resetear();
    setSelectedRows([]);
  }, [filtros]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta obligación?')) return;

    try {
      const res = await fetch(`/api/obligaciones/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Obligación eliminada');
      cargarObligaciones();
      setSelectedRows([]);
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;
    if (!confirm(`¿Eliminar ${selectedRows.length} obligación(es)?`)) return;

    try {
      await Promise.all(
        selectedRows.map(id =>
          fetch(`/api/obligaciones/${id}`, { method: 'DELETE' })
        )
      );
      toast.success(`${selectedRows.length} obligación(es) eliminada(s)`);
      cargarObligaciones();
      setSelectedRows([]);
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Gestión de Obligaciones</h1>
          <p className="text-gray-400 text-sm mt-1">
            {obligacionesFiltradas.length} obligaciones encontradas
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
            Nueva Obligación
          </button>
        </div>
      </div>

      {/* Filtros */}
      <ObligacionesFiltros
        filtros={filtros}
        onChange={(nuevos) => setFiltros({ ...filtros, ...nuevos })}
        categorias={categorias}
        onLimpiar={() => setFiltros({
          busqueda: '',
          entidad: '',
          estado: '',
          categoria: '',
          fechaDesde: '',
          fechaHasta: '',
        })}
      />

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <ObligacionesTable
          obligaciones={pag.itemsPagina}
          onEdit={(obl) => {
            setObligacionEditar(obl);
            setModalAbierto(true);
          }}
          onDelete={handleDelete}
          selectedRows={selectedRows}
          actualizandoEstado={actualizandoEstado}
          onSelectRow={(id) => {
            setSelectedRows(prev =>
              prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            );
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedRows(pag.itemsPagina.map(o => o.id_obligacion));
            } else {
              setSelectedRows([]);
            }
          }}
        />
        <Paginacion {...pag} />
      </div>

      {/* Modal */}
      {modalAbierto && (
        <NuevaObligacionModal
          onClose={() => {
            setModalAbierto(false);
            setObligacionEditar(null);
          }}
          onCreado={() => {
            cargarObligaciones();
            setModalAbierto(false);
            setObligacionEditar(null);
          }}
          obligacionEditar={obligacionEditar}
          categorias={categorias}
        />
      )}
    </div>
  );
}