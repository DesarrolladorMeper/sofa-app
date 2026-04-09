// ObligacionesTable.tsx
'use client';

import { Obligacion } from './obligaciones-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type ObligacionesTableProps = {
  obligaciones: Obligacion[];
  onEdit: (obligacion: Obligacion) => void;
  onDelete: (id: number) => void;
  onTogglePago?: (obligacion: Obligacion) => void;
  selectedRows: number[];
  onSelectRow: (id: number) => void;
  onSelectAll: (selected: boolean) => void;
  actualizandoEstado?: number | null;
};

export default function ObligacionesTable({
  obligaciones,
  onEdit,
  onDelete,
  onTogglePago,
  selectedRows,
  onSelectRow,
  onSelectAll,
  actualizandoEstado,
}: ObligacionesTableProps) {
  const formatMoneda = (valor: number | string) => {
    const num = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (isNaN(num)) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return '—';
    return format(new Date(fecha), 'dd/MM/yyyy', { locale: es });
  };

  const getEstadoColor = (estado: string) => {
    const estados: Record<string, string> = {
      'Pendiente': 'bg-yellow-100 text-yellow-700',
      'Pagada': 'bg-green-100 text-green-700',
      'Vencida': 'bg-red-100 text-red-700',
      'Programada': 'bg-blue-100 text-blue-700',
      'Cancelada': 'bg-gray-100 text-gray-700',
    };
    return estados[estado] || 'bg-gray-100 text-gray-700';
  };

  const esNoPagado = (obligacion: Obligacion) => {
    const valorObligacion = typeof obligacion.valor_obligacion === 'string' 
      ? parseFloat(obligacion.valor_obligacion) 
      : obligacion.valor_obligacion;
    const valorPagado = typeof obligacion.valor_pagado === 'string' 
      ? parseFloat(obligacion.valor_pagado) 
      : obligacion.valor_pagado;
    return valorPagado < valorObligacion;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-50 sticky top-0">
          <tr className="border-b border-gray-200">
            <th className="px-3 py-3 text-left w-10">
              <input
                type="checkbox"
                checked={selectedRows.length === obligaciones.length && obligaciones.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-[#205D83] focus:ring-[#205D83]"
              />
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entidad</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Servicio/Producto</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Factura/Cuenta</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoría</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor Obligación</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor Pagado</th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Saldo</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Soporte Carpeta</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Programada</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Pago</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Soporte Pago</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Observaciones</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {obligaciones.map((obligacion) => {
            const valorObligacion = typeof obligacion.valor_obligacion === 'string' 
              ? parseFloat(obligacion.valor_obligacion) 
              : obligacion.valor_obligacion;
            const valorPagado = typeof obligacion.valor_pagado === 'string' 
              ? parseFloat(obligacion.valor_pagado) 
              : obligacion.valor_pagado;
            const saldo = valorObligacion - valorPagado;
            const noPagado = esNoPagado(obligacion);
            
            return (
              <tr
                key={obligacion.id_obligacion}
                className={`hover:bg-gray-50 transition-colors ${
                  selectedRows.includes(obligacion.id_obligacion) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(obligacion.id_obligacion)}
                    onChange={() => onSelectRow(obligacion.id_obligacion)}
                    className="rounded border-gray-300 text-[#205D83] focus:ring-[#205D83]"
                  />
                 </td>
                <td className="px-3 py-3 text-gray-500 font-mono text-xs">{obligacion.id_obligacion}</td>
                <td className="px-3 py-3 text-gray-700">{formatFecha(obligacion.fecha)}</td>
                <td className="px-3 py-3 font-medium text-gray-900">{obligacion.entidad}</td>
                <td className="px-3 py-3 text-gray-600 max-w-xs truncate">{obligacion.servicio_producto}</td>
                <td className="px-3 py-3 text-gray-600 max-w-xs truncate">{obligacion.factura_cuenta_cobro || '—'}</td>
                <td className="px-3 py-3 text-gray-600">{obligacion.categoria_presupuesto?.nombre_categoria || '—'}</td>
                <td className="px-3 py-3 text-right font-mono text-gray-700">{formatMoneda(obligacion.valor_obligacion)}</td>
                <td className="px-3 py-3 text-right font-mono text-gray-700">{formatMoneda(obligacion.valor_pagado)}</td>
                <td className="px-3 py-3 text-right font-mono font-semibold">
                  <span className={saldo > 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatMoneda(saldo)}
                  </span>
                 </td>
                <td className="px-3 py-3 text-gray-600">{obligacion.soporte_numero_carpeta || '—'}</td>
                <td className="px-3 py-3 text-gray-700">{formatFecha(obligacion.fecha_programada_pago)}</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(obligacion.estado)}`}>
                    {obligacion.estado}
                  </span>
                 </td>
                <td className="px-3 py-3 text-gray-700">{formatFecha(obligacion.fecha_pago)}</td>
                <td className="px-3 py-3 text-gray-600">{obligacion.soporte_pago_numero_carpeta || '—'}</td>
                <td className="px-3 py-3 text-gray-500 max-w-xs truncate">{obligacion.observaciones || '—'}</td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {onTogglePago && noPagado && obligacion.estado !== 'Cancelada' && (
                      <button
                        onClick={() => onTogglePago(obligacion)}
                        disabled={actualizandoEstado === obligacion.id_obligacion}
                        className="p-1.5 rounded-lg transition-all duration-200"
                        style={{ backgroundColor: '#514737' }}
                        title="Marcar como pagado"
                      >
                        {actualizandoEstado === obligacion.id_obligacion ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(obligacion)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(obligacion.id_obligacion)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                 </td>
               </tr>
            );
          })}
        </tbody>
       </table>
    </div>
  );
}