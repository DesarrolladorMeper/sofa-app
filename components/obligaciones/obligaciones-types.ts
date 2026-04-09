// obligaciones-types.ts
export type Obligacion = {
    id_obligacion: number;
    fecha: string;
    idCategoria_presupuesto: number | null;
    entidad: string;
    servicio_producto: string;
    factura_cuenta_cobro: string | null;
    valor_obligacion: number | string; // Puede venir como string del backend
    valor_pagado: number | string;
    soporte_numero_carpeta: string | null;
    fecha_programada_pago: string;
    estado: string;
    fecha_pago: string | null;
    soporte_pago_numero_carpeta: string | null;
    observaciones: string | null;
    categoria_presupuesto?: {
        id_categoria_presupuesto: number;
        nombre_categoria: string;
    } | null;
}

export type CategoriaPresupuesto = {
    id_categoria_presupuesto: number;
    nombre_categoria: string;
}

export type FiltrosObligacion = {
    busqueda: string;
    entidad: string;
    estado: string;
    categoria: string;
    fechaDesde: string;
    fechaHasta: string;
}