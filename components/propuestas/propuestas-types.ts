export type Propuesta = {
  id_propuesta: number;
  nit: string | null;
  clienteId: number;
  cliente_nombre_somos: string;
  numero_propuesta: string;
  pte: string | null;
  tipo_servicio: string | null;
  meses_propuesta: number | null;
  cantidad_horas: number | null;
  fecha_propuesta: string | null;
  fecha_vencimiento: string | null;
  valor_propuesta: number | string;
  estado: string;
  observaciones: string | null;
  comercialId: number | null;
  comercial: { id_comercial: number; username: string } | null;
  contratoId: number | null;
};

export type FiltrosPropuesta = {
  busqueda: string;
  estado: string;
  comercial: string;
  fechaDesde: string;
  fechaHasta: string;
};

export const ESTADOS_PROPUESTA = ["PENDIENTE", "APROBADO", "RECHAZADO"] as const;
export const TIPOS_SERVICIO_PROP = ["Consultoría", "Inspectoría", "SST"] as const;
