export type Comercial = {
  id_comercial: number;
  username: string;
  tiene_comision_comercial: boolean;
  porcentaje_comision: number | null;
};

export type Contrato = {
  id_contrato: number;
  clienteId: number;
  cliente_nombre_somos: string;
  numero_contrato: string;
  mes_contrato: string;
  fecha_generacion_factura: string;
  fecha_vencimiento_factura: string;
  finalizacion_contrato: string;
  valor: number | string;
  tiene_iva: boolean;
  estado: string;
  observaciones: string | null;
  esta_facturado: boolean;
  comercialId: number | null;
  comercial: Comercial | null;
};

export type FiltrosContrato = {
  busqueda: string;
  estado: string;
  comercial: string;
  estaFacturado: string;
  fechaDesde: string;
  fechaHasta: string;
};

export const ESTADOS_CONTRATO = ["ACTIVO", "PENDIENTE", "VENCIDO", "CANCELADO"] as const;
