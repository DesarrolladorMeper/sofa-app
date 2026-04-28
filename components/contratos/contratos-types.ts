export type Comercial = {
  id_comercial: number;
  username: string;
  tiene_comision_comercial: boolean;
  porcentaje_comision: number | null;
};

export type Contrato = {
  id_contrato: number;
  nit: string | null;
  clienteId: number;
  cliente_nombre_somos: string;
  numero_contrato: string;
  pte: string | null;
  mes_contrato: string | null;
  meses_contrato: number | null;
  cantidad_horas_contrato: number | null;
  fecha_inicio: string | null;
  fecha_generacion_factura: string | null;
  fecha_vencimiento_factura: string | null;
  finalizacion_contrato: string | null;
  valor: number | string;
  tiene_iva: boolean;
  costos: number | string | null;
  auditoria: number | string | null;
  imprevistos: number | string | null;
  rent: number | string | null;
  total_proyecto: number | string | null;
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
