// NuevaObligacionModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CategoriaPresupuesto } from './obligaciones-types';

type NuevaObligacionModalProps = {
  onClose: () => void;
  onCreado: () => void;
  obligacionEditar?: any;
  categorias: CategoriaPresupuesto[];
};

export default function NuevaObligacionModal({
  onClose,
  onCreado,
  obligacionEditar,
  categorias,
}: NuevaObligacionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    idCategoria_presupuesto: '',
    entidad: '',
    servicio_producto: '',
    factura_cuenta_cobro: '',
    valor_obligacion: '',
    valor_pagado: '0',
    soporte_numero_carpeta: '',
    fecha_programada_pago: '',
    estado: 'Por Pagar',
    fecha_pago: '',
    soporte_pago_numero_carpeta: '',
    observaciones: '',
  });

  useEffect(() => {
    if (obligacionEditar) {
      // Limpiar valores de fecha para el input date (solo YYYY-MM-DD)
      const fechaFormateada = obligacionEditar.fecha?.split('T')[0] || '';
      const fechaProgramadaFormateada = obligacionEditar.fecha_programada_pago?.split('T')[0] || '';
      const fechaPagoFormateada = obligacionEditar.fecha_pago?.split('T')[0] || '';
      
      setFormData({
        fecha: fechaFormateada,
        idCategoria_presupuesto: obligacionEditar.idCategoria_presupuesto?.toString() || '',
        entidad: obligacionEditar.entidad || '',
        servicio_producto: obligacionEditar.servicio_producto || '',
        factura_cuenta_cobro: obligacionEditar.factura_cuenta_cobro || '',
        valor_obligacion: obligacionEditar.valor_obligacion?.toString() || '',
        valor_pagado: obligacionEditar.valor_pagado?.toString() || '0',
        soporte_numero_carpeta: obligacionEditar.soporte_numero_carpeta || '',
        fecha_programada_pago: fechaProgramadaFormateada,
        estado: obligacionEditar.estado || 'Por Pagar',
        fecha_pago: fechaPagoFormateada,
        soporte_pago_numero_carpeta: obligacionEditar.soporte_pago_numero_carpeta || '',
        observaciones: obligacionEditar.observaciones || '',
      });
    }
  }, [obligacionEditar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      fecha: formData.fecha,
      idCategoria_presupuesto: formData.idCategoria_presupuesto ? Number(formData.idCategoria_presupuesto) : null,
      entidad: formData.entidad,
      servicio_producto: formData.servicio_producto,
      factura_cuenta_cobro: formData.factura_cuenta_cobro || null,
      valor_obligacion: Number(formData.valor_obligacion),
      valor_pagado: Number(formData.valor_pagado),
      soporte_numero_carpeta: formData.soporte_numero_carpeta || null,
      fecha_programada_pago: formData.fecha_programada_pago || null,
      estado: formData.estado,
      fecha_pago: formData.fecha_pago || null,
      soporte_pago_numero_carpeta: formData.soporte_pago_numero_carpeta || null,
      observaciones: formData.observaciones || null,
    };

    const url = obligacionEditar
      ? `/api/obligaciones/${obligacionEditar.id_obligacion}`
      : '/api/obligaciones';
    const method = obligacionEditar ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error();

      toast.success(obligacionEditar ? 'Obligación actualizada' : 'Obligación creada');
      onCreado();
      onClose();
    } catch (error) {
      toast.error('Error al guardar la obligación');
    } finally {
      setLoading(false);
    }
  };

  const estados = ['Por Pagar', 'Cancelada'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {obligacionEditar ? 'Editar Obligación' : 'Nueva Obligación'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
              <input
                type="date"
                required
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría Presupuesto</label>
              <select
                value={formData.idCategoria_presupuesto}
                onChange={(e) => setFormData({ ...formData, idCategoria_presupuesto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria_presupuesto} value={cat.id_categoria_presupuesto}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Entidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entidad *</label>
              <input
                type="text"
                required
                value={formData.entidad}
                onChange={(e) => setFormData({ ...formData, entidad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Servicio/Producto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Servicio/Producto *</label>
              <input
                type="text"
                required
                value={formData.servicio_producto}
                onChange={(e) => setFormData({ ...formData, servicio_producto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Factura/Cuenta de Cobro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Factura/Cuenta de Cobro</label>
              <input
                type="text"
                value={formData.factura_cuenta_cobro}
                onChange={(e) => setFormData({ ...formData, factura_cuenta_cobro: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Valor Obligación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Obligación *</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.valor_obligacion}
                onChange={(e) => setFormData({ ...formData, valor_obligacion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Valor Pagado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Pagado</label>
              <input
                type="number"
                step="0.01"
                value={formData.valor_pagado}
                onChange={(e) => setFormData({ ...formData, valor_pagado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Soporte Número Carpeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soporte Número Carpeta</label>
              <input
                type="text"
                value={formData.soporte_numero_carpeta}
                onChange={(e) => setFormData({ ...formData, soporte_numero_carpeta: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Fecha Programada Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Programada de Pago</label>
              <input
                type="date"
                value={formData.fecha_programada_pago}
                onChange={(e) => setFormData({ ...formData, fecha_programada_pago: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              >
                {estados.map((est) => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
            </div>

            {/* Fecha Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Pago</label>
              <input
                type="date"
                value={formData.fecha_pago}
                onChange={(e) => setFormData({ ...formData, fecha_pago: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Soporte Pago Número Carpeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soporte Pago Número Carpeta</label>
              <input
                type="text"
                value={formData.soporte_pago_numero_carpeta}
                onChange={(e) => setFormData({ ...formData, soporte_pago_numero_carpeta: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none"
              />
            </div>

            {/* Observaciones */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                rows={3}
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205D83]/20 focus:border-[#205D83] outline-none resize-none"
                placeholder="Observaciones adicionales..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#514737] rounded-lg hover:bg-[#615542] transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : obligacionEditar ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}