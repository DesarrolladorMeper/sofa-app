import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

BigInt.prototype.toJSON = function () { return this.toString(); };

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

// ─── helpers ────────────────────────────────────────────────────────────────
const M = 1_000_000n;
const d = (s: string) => new Date(s);

async function main() {
  console.log("🗑️  Limpiando datos de demo...");
  await prisma.propuesta.deleteMany();
  await prisma.factura.deleteMany();
  await prisma.contrato.deleteMany();
  await prisma.comercial.deleteMany();
  await prisma.obligaciones.deleteMany();
  await prisma.categoria_presupuesto.deleteMany();
  await prisma.seccion_categoria_presupuesto.deleteMany();

  // ── 1. COMERCIALES ────────────────────────────────────────────────────────
  console.log("👤 Creando comerciales...");
  const [com1, com2, com3] = await Promise.all([
    prisma.comercial.create({ data: { username: "Juan Tejada",      tiene_comision_comercial: true,  porcentaje_comision: 5.0 } }),
    prisma.comercial.create({ data: { username: "María Ospina",     tiene_comision_comercial: true,  porcentaje_comision: 4.0 } }),
    prisma.comercial.create({ data: { username: "Carlos Bermúdez",  tiene_comision_comercial: false, porcentaje_comision: null } }),
  ]);

  // ── 2. CATEGORÍAS DE PRESUPUESTO ──────────────────────────────────────────
  console.log("📂 Creando categorías...");
  const secIngreso = await prisma.seccion_categoria_presupuesto.create({ data: { nombre_seccion_categoria: "INGRESOS" } });
  const secEgreso  = await prisma.seccion_categoria_presupuesto.create({ data: { nombre_seccion_categoria: "EGRESOS" } });

  const cats = await Promise.all([
    prisma.categoria_presupuesto.create({ data: { nombre_categoria: "Honorarios Consultores",  activa: true,  seccion_categoria_presupuestoId: secEgreso.id_seccion_categoria_presupuesto } }),
    prisma.categoria_presupuesto.create({ data: { nombre_categoria: "Arrendamiento Oficina",   activa: true,  seccion_categoria_presupuestoId: secEgreso.id_seccion_categoria_presupuesto } }),
    prisma.categoria_presupuesto.create({ data: { nombre_categoria: "Servicios Públicos",       activa: true,  seccion_categoria_presupuestoId: secEgreso.id_seccion_categoria_presupuesto } }),
    prisma.categoria_presupuesto.create({ data: { nombre_categoria: "Nómina Empleados",         activa: true,  seccion_categoria_presupuestoId: secEgreso.id_seccion_categoria_presupuesto } }),
    prisma.categoria_presupuesto.create({ data: { nombre_categoria: "Software y Licencias",     activa: true,  seccion_categoria_presupuestoId: secEgreso.id_seccion_categoria_presupuesto } }),
    prisma.categoria_presupuesto.create({ data: { nombre_categoria: "Viáticos y Transporte",    activa: true,  seccion_categoria_presupuestoId: secEgreso.id_seccion_categoria_presupuesto } }),
    prisma.categoria_presupuesto.create({ data: { nombre_categoria: "Ingresos por Servicios",   activa: true,  seccion_categoria_presupuestoId: secIngreso.id_seccion_categoria_presupuesto } }),
    prisma.categoria_presupuesto.create({ data: { nombre_categoria: "Papelería y Suministros",  activa: true,  seccion_categoria_presupuestoId: secEgreso.id_seccion_categoria_presupuesto } }),
  ]);
  const [catHonorarios, catArrendamiento, catServicios, catNomina, catSoftware, catViaticos, , catPapeleria] = cats;

  // ── 3. CONTRATOS ──────────────────────────────────────────────────────────
  console.log("📄 Creando contratos...");
  const contratos = await Promise.all([
    prisma.contrato.create({ data: {
      nit: "860.007.373-1", cliente_nombre_somos: "ARL Colmena", numero_contrato: "OS-COLMENA-2026-001",
      pte: "PTE739", tipo_servicio: "SST", meses_contrato: 12, cantidad_horas_contrato: 144,
      fecha_inicio: d("2026-01-01"), finalizacion_contrato: d("2026-12-31"),
      costos: 38_400_000n, auditoria: 2_880_000n, imprevistos: 1_920_000n, rent: 9_600_000n,
      total_proyecto: 52_800_000n, valor: 52_800_000n,
      tiene_iva: false, estado: "ACTIVO", comercialId: com1.id_comercial, clienteId: 1,
    }}),
    prisma.contrato.create({ data: {
      nit: "800.255.616-0", cliente_nombre_somos: "ARL Bolívar", numero_contrato: "OS-BOLIVAR-2026-001",
      pte: "PTE994", tipo_servicio: "SST", meses_contrato: 6, cantidad_horas_contrato: 72,
      fecha_inicio: d("2026-01-01"), finalizacion_contrato: d("2026-06-30"),
      costos: 18_000_000n, auditoria: 1_440_000n, imprevistos: 900_000n, rent: 4_500_000n,
      total_proyecto: 24_840_000n, valor: 24_840_000n,
      tiene_iva: false, estado: "ACTIVO", comercialId: com2.id_comercial, clienteId: 2,
    }}),
    prisma.contrato.create({ data: {
      nit: "890.903.810-5", cliente_nombre_somos: "ARL Colpatria", numero_contrato: "OS-COLPATRIA-2026-001",
      pte: "PTE994", tipo_servicio: "SST", meses_contrato: 12, cantidad_horas_contrato: 96,
      fecha_inicio: d("2026-02-01"), finalizacion_contrato: d("2026-12-31"),
      costos: 24_000_000n, auditoria: 1_800_000n, imprevistos: 1_200_000n, rent: 6_000_000n,
      total_proyecto: 33_000_000n, valor: 33_000_000n,
      tiene_iva: false, estado: "ACTIVO", comercialId: com1.id_comercial, clienteId: 3,
    }}),
    prisma.contrato.create({ data: {
      nit: "901.234.567-3", cliente_nombre_somos: "Constructora Colseguros S.A.S", numero_contrato: "OS-COLSEGUROS-2026-001",
      pte: "PTE998", tipo_servicio: "Consultoría", meses_contrato: 3, cantidad_horas_contrato: 36,
      fecha_inicio: d("2026-03-01"), finalizacion_contrato: d("2026-05-31"),
      costos: 8_400_000n, auditoria: 630_000n, imprevistos: 420_000n, rent: 2_100_000n,
      total_proyecto: 11_550_000n, valor: 11_550_000n,
      tiene_iva: true, estado: "ACTIVO", comercialId: com2.id_comercial, clienteId: 4,
    }}),
    prisma.contrato.create({ data: {
      nit: "900.456.789-2", cliente_nombre_somos: "Industrias Metálicas del Valle S.A.", numero_contrato: "OS-METALICAS-2026-001",
      pte: "PTE998", tipo_servicio: "Inspectoría", meses_contrato: 4, cantidad_horas_contrato: 48,
      fecha_inicio: d("2026-01-15"), finalizacion_contrato: d("2026-05-15"),
      costos: 11_520_000n, auditoria: 864_000n, imprevistos: 576_000n, rent: 2_880_000n,
      total_proyecto: 15_840_000n, valor: 15_840_000n,
      tiene_iva: true, estado: "ACTIVO", comercialId: com3.id_comercial, clienteId: 5,
    }}),
    prisma.contrato.create({ data: {
      nit: "800.123.456-7", cliente_nombre_somos: "Hospital Universitario del Norte", numero_contrato: "OS-HUN-2026-001",
      pte: "PTE739", tipo_servicio: "SST", meses_contrato: 12, cantidad_horas_contrato: 120,
      fecha_inicio: d("2026-01-01"), finalizacion_contrato: d("2026-12-31"),
      costos: 30_000_000n, auditoria: 2_250_000n, imprevistos: 1_500_000n, rent: 7_500_000n,
      total_proyecto: 41_250_000n, valor: 41_250_000n,
      tiene_iva: false, estado: "ACTIVO", comercialId: com1.id_comercial, clienteId: 6,
    }}),
    prisma.contrato.create({ data: {
      nit: "900.321.654-1", cliente_nombre_somos: "Petroléos del Caribe S.A.S", numero_contrato: "OS-PETROCARI-2025-003",
      pte: "PTE994", tipo_servicio: "SST", meses_contrato: 12, cantidad_horas_contrato: 240,
      fecha_inicio: d("2025-01-01"), finalizacion_contrato: d("2025-12-31"),
      costos: 60_000_000n, auditoria: 4_500_000n, imprevistos: 3_000_000n, rent: 15_000_000n,
      total_proyecto: 82_500_000n, valor: 82_500_000n,
      tiene_iva: false, estado: "VENCIDO", comercialId: com2.id_comercial, clienteId: 7,
    }}),
    prisma.contrato.create({ data: {
      nit: "900.112.233-4", cliente_nombre_somos: "Cementos Andinos S.A.", numero_contrato: "OS-CEMAND-2026-001",
      pte: "PTE998", tipo_servicio: "SST", meses_contrato: 6, cantidad_horas_contrato: 60,
      fecha_inicio: d("2026-04-01"), finalizacion_contrato: d("2026-09-30"),
      costos: 15_000_000n, auditoria: 1_125_000n, imprevistos: 750_000n, rent: 3_750_000n,
      total_proyecto: 20_625_000n, valor: 20_625_000n,
      tiene_iva: true, estado: "SUSPENDIDO", comercialId: com3.id_comercial, clienteId: 8,
    }}),
    prisma.contrato.create({ data: {
      nit: "890.807.123-5", cliente_nombre_somos: "Clínica del Country", numero_contrato: "OS-COUNTRY-2026-001",
      pte: "PTE739", tipo_servicio: "Consultoría", meses_contrato: 12, cantidad_horas_contrato: 168,
      fecha_inicio: d("2026-01-01"), finalizacion_contrato: d("2026-12-31"),
      costos: 42_000_000n, auditoria: 3_150_000n, imprevistos: 2_100_000n, rent: 10_500_000n,
      total_proyecto: 57_750_000n, valor: 57_750_000n,
      tiene_iva: false, estado: "ACTIVO", comercialId: com1.id_comercial, clienteId: 9,
    }}),
    prisma.contrato.create({ data: {
      nit: "900.567.891-0", cliente_nombre_somos: "Transportes Rápidos del Sur Ltda.", numero_contrato: "OS-TRSUR-2025-002",
      pte: "PTE998", tipo_servicio: "Inspectoría", meses_contrato: 8, cantidad_horas_contrato: 80,
      fecha_inicio: d("2025-05-01"), finalizacion_contrato: d("2025-12-31"),
      costos: 20_000_000n, auditoria: 1_500_000n, imprevistos: 1_000_000n, rent: 5_000_000n,
      total_proyecto: 27_500_000n, valor: 27_500_000n,
      tiene_iva: true, estado: "VENCIDO", comercialId: com2.id_comercial, clienteId: 10,
    }}),
  ]);

  const [cColmena, cBolivar, cColpatria, cColseguros, cMetalicas, cHUN, cPetrocari, cCemand, cCountry, cTRSur] = contratos;

  // ── 4. FACTURAS ───────────────────────────────────────────────────────────
  console.log("🧾 Creando facturas...");

  // ARL Colmena — 4 de 12 meses (33%)
  for (let mes = 1; mes <= 4; mes++) {
    const base = 4_400_000n;
    const iva  = 0n;
    await prisma.factura.create({ data: {
      numero_factura: `FAC-2026-COLMENA-${String(mes).padStart(3,"0")}`,
      tipo_servicio: "Asesoría SST",
      fecha_generacion_factura: d(`2026-0${mes}-05`),
      fecha_vencimiento: d(`2026-0${mes}-20`),
      va_con_iva: false, valor_sin_iva: base, valor_iva: iva, valor_total: base,
      estado_factura: mes < 3 ? "PAGADA" : "PENDIENTE",
      fecha_pago_factura: mes < 3 ? d(`2026-0${mes}-19`) : null,
      valor_comision: 220_000n,
      contratoId: cColmena.id_contrato, comercialId: com1.id_comercial,
    }});
  }

  // ARL Bolívar — 6 de 6 meses (100%)
  for (let mes = 1; mes <= 6; mes++) {
    const base = 4_140_000n;
    await prisma.factura.create({ data: {
      numero_factura: `FAC-2026-BOLIVAR-${String(mes).padStart(3,"0")}`,
      tipo_servicio: "Asesoría SG-SST",
      fecha_generacion_factura: d(`2026-0${mes}-01`),
      fecha_vencimiento: d(`2026-0${mes}-15`),
      va_con_iva: false, valor_sin_iva: base, valor_iva: 0n, valor_total: base,
      estado_factura: "PAGADA",
      fecha_pago_factura: d(`2026-0${mes}-14`),
      valor_comision: 165_600n,
      contratoId: cBolivar.id_contrato, comercialId: com2.id_comercial,
    }});
  }

  // ARL Colpatria — 2 de 11 meses (18%)
  for (let mes = 2; mes <= 3; mes++) {
    const base = 3_000_000n;
    await prisma.factura.create({ data: {
      numero_factura: `FAC-2026-COLPATRIA-${String(mes).padStart(3,"0")}`,
      tipo_servicio: "Asesoría SST",
      fecha_generacion_factura: d(`2026-0${mes}-01`),
      fecha_vencimiento: d(`2026-0${mes}-20`),
      va_con_iva: false, valor_sin_iva: base, valor_iva: 0n, valor_total: base,
      estado_factura: mes === 2 ? "PAGADA" : "PENDIENTE",
      fecha_pago_factura: mes === 2 ? d("2026-02-19") : null,
      valor_comision: 150_000n,
      contratoId: cColpatria.id_contrato, comercialId: com1.id_comercial,
    }});
  }

  // Constructora Colseguros — 1 de 3 meses (33%)
  await prisma.factura.create({ data: {
    numero_factura: "FAC-2026-COLSEGUROS-001",
    tipo_servicio: "Consultoría SST",
    fecha_generacion_factura: d("2026-03-05"), fecha_vencimiento: d("2026-03-25"),
    va_con_iva: true, valor_sin_iva: 3_150_000n, valor_iva: 598_500n, valor_total: 3_748_500n,
    estado_factura: "PAGADA", fecha_pago_factura: d("2026-03-24"),
    valor_comision: 187_425n,
    contratoId: cColseguros.id_contrato, comercialId: com2.id_comercial,
  }});

  // Hospital del Norte — 3 de 12 meses (25%)
  for (let mes = 1; mes <= 3; mes++) {
    const base = 3_437_500n;
    await prisma.factura.create({ data: {
      numero_factura: `FAC-2026-HUN-${String(mes).padStart(3,"0")}`,
      tipo_servicio: "Asesoría SST",
      fecha_generacion_factura: d(`2026-0${mes}-02`),
      fecha_vencimiento: d(`2026-0${mes}-22`),
      va_con_iva: false, valor_sin_iva: base, valor_iva: 0n, valor_total: base,
      estado_factura: mes < 3 ? "PAGADA" : "PENDIENTE",
      fecha_pago_factura: mes < 3 ? d(`2026-0${mes}-20`) : null,
      valor_comision: 171_875n,
      contratoId: cHUN.id_contrato, comercialId: com1.id_comercial,
    }});
  }

  // Petróleos del Caribe — 100% (12 meses)
  for (let mes = 1; mes <= 12; mes++) {
    const base = 6_875_000n;
    const mm   = String(mes).padStart(2, "0");
    await prisma.factura.create({ data: {
      numero_factura: `FAC-2025-PETROCARI-${String(mes).padStart(3,"0")}`,
      tipo_servicio: "Asesoría HSE",
      fecha_generacion_factura: new Date(`2025-${mm}-01`),
      fecha_vencimiento: new Date(`2025-${mm}-20`),
      va_con_iva: false, valor_sin_iva: base, valor_iva: 0n, valor_total: base,
      estado_factura: "PAGADA", fecha_pago_factura: new Date(`2025-${mm}-19`),
      valor_comision: 275_000n,
      contratoId: cPetrocari.id_contrato, comercialId: com2.id_comercial,
    }});
  }

  // Clínica del Country — 1 de 12 meses (8%)
  await prisma.factura.create({ data: {
    numero_factura: "FAC-2026-COUNTRY-001",
    tipo_servicio: "Auditoría SST",
    fecha_generacion_factura: d("2026-01-05"), fecha_vencimiento: d("2026-01-25"),
    va_con_iva: false, valor_sin_iva: 4_812_500n, valor_iva: 0n, valor_total: 4_812_500n,
    estado_factura: "PAGADA", fecha_pago_factura: d("2026-01-24"),
    valor_comision: 240_625n,
    contratoId: cCountry.id_contrato, comercialId: com1.id_comercial,
  }});

  // Transportes del Sur — 100% (8 meses)
  for (let mes = 5; mes <= 12; mes++) {
    const base = 3_437_500n;
    const mm   = String(mes).padStart(2, "0");
    await prisma.factura.create({ data: {
      numero_factura: `FAC-2025-TRSUR-${String(mes).padStart(3,"0")}`,
      tipo_servicio: "Consultoría SST",
      fecha_generacion_factura: new Date(`2025-${mm}-01`),
      fecha_vencimiento: new Date(`2025-${mm}-20`),
      va_con_iva: true,
      valor_sin_iva: base,
      valor_iva: base * 19n / 100n,
      valor_total: base + base * 19n / 100n,
      estado_factura: "PAGADA", fecha_pago_factura: new Date(`2025-${mm}-19`),
      valor_comision: 171_875n,
      contratoId: cTRSur.id_contrato, comercialId: com2.id_comercial,
    }});
  }

  // ── 5. OBLIGACIONES ───────────────────────────────────────────────────────
  console.log("💳 Creando obligaciones...");

  const oblData = [
    { fecha: "2026-01-05", cat: catNomina,       entidad: "Nómina Empleados Enero",         servicio: "Pago nómina mensual",           valor: 12_500_000n, pagado: 12_500_000n, estado: "PAGADA",   fPago: "2026-01-05", fProg: "2026-01-05" },
    { fecha: "2026-02-05", cat: catNomina,       entidad: "Nómina Empleados Febrero",        servicio: "Pago nómina mensual",           valor: 12_500_000n, pagado: 12_500_000n, estado: "PAGADA",   fPago: "2026-02-05", fProg: "2026-02-05" },
    { fecha: "2026-03-05", cat: catNomina,       entidad: "Nómina Empleados Marzo",          servicio: "Pago nómina mensual",           valor: 12_500_000n, pagado: 12_500_000n, estado: "PAGADA",   fPago: "2026-03-05", fProg: "2026-03-05" },
    { fecha: "2026-04-05", cat: catNomina,       entidad: "Nómina Empleados Abril",          servicio: "Pago nómina mensual",           valor: 12_500_000n, pagado: null,         estado: "PENDIENTE", fPago: null,         fProg: "2026-04-05" },
    { fecha: "2026-01-02", cat: catArrendamiento, entidad: "Inmobiliaria Torres & Mora",      servicio: "Arrendamiento oficina enero",   valor: 3_800_000n,  pagado: 3_800_000n,  estado: "PAGADA",   fPago: "2026-01-03", fProg: "2026-01-02" },
    { fecha: "2026-02-02", cat: catArrendamiento, entidad: "Inmobiliaria Torres & Mora",      servicio: "Arrendamiento oficina febrero",  valor: 3_800_000n,  pagado: 3_800_000n,  estado: "PAGADA",   fPago: "2026-02-02", fProg: "2026-02-02" },
    { fecha: "2026-03-02", cat: catArrendamiento, entidad: "Inmobiliaria Torres & Mora",      servicio: "Arrendamiento oficina marzo",   valor: 3_800_000n,  pagado: 3_800_000n,  estado: "PAGADA",   fPago: "2026-03-03", fProg: "2026-03-02" },
    { fecha: "2026-04-02", cat: catArrendamiento, entidad: "Inmobiliaria Torres & Mora",      servicio: "Arrendamiento oficina abril",   valor: 3_800_000n,  pagado: null,         estado: "PENDIENTE", fPago: null,         fProg: "2026-04-02" },
    { fecha: "2026-01-10", cat: catServicios,    entidad: "EPM - Empresas Públicas",         servicio: "Servicios públicos enero",      valor: 450_000n,    pagado: 450_000n,    estado: "PAGADA",   fPago: "2026-01-12", fProg: "2026-01-15" },
    { fecha: "2026-02-10", cat: catServicios,    entidad: "EPM - Empresas Públicas",         servicio: "Servicios públicos febrero",    valor: 480_000n,    pagado: 480_000n,    estado: "PAGADA",   fPago: "2026-02-11", fProg: "2026-02-15" },
    { fecha: "2026-03-10", cat: catServicios,    entidad: "EPM - Empresas Públicas",         servicio: "Servicios públicos marzo",      valor: 420_000n,    pagado: 420_000n,    estado: "PAGADA",   fPago: "2026-03-12", fProg: "2026-03-15" },
    { fecha: "2026-01-15", cat: catSoftware,     entidad: "Microsoft Colombia",              servicio: "Licencia Microsoft 365",        valor: 1_250_000n,  pagado: 1_250_000n,  estado: "PAGADA",   fPago: "2026-01-15", fProg: "2026-01-15" },
    { fecha: "2026-01-20", cat: catHonorarios,   entidad: "Andrés Pedraza - Consultor",      servicio: "Honorarios consultoría enero",  valor: 4_200_000n,  pagado: 4_200_000n,  estado: "PAGADA",   fPago: "2026-01-22", fProg: "2026-01-22" },
    { fecha: "2026-02-20", cat: catHonorarios,   entidad: "Andrés Pedraza - Consultor",      servicio: "Honorarios consultoría febrero", valor: 4_200_000n,  pagado: 4_200_000n,  estado: "PAGADA",   fPago: "2026-02-22", fProg: "2026-02-22" },
    { fecha: "2026-03-20", cat: catHonorarios,   entidad: "Andrés Pedraza - Consultor",      servicio: "Honorarios consultoría marzo",  valor: 4_200_000n,  pagado: null,         estado: "PENDIENTE", fPago: null,         fProg: "2026-03-22" },
    { fecha: "2026-01-25", cat: catViaticos,     entidad: "Laura Gómez - Inspectora",        servicio: "Viáticos visita Barranquilla",  valor: 380_000n,    pagado: 380_000n,    estado: "PAGADA",   fPago: "2026-01-26", fProg: "2026-01-26" },
    { fecha: "2026-02-14", cat: catViaticos,     entidad: "Marco Ríos - Inspector",          servicio: "Viáticos visita Cali",          valor: 520_000n,    pagado: 520_000n,    estado: "PAGADA",   fPago: "2026-02-15", fProg: "2026-02-15" },
    { fecha: "2026-03-08", cat: catViaticos,     entidad: "Laura Gómez - Inspectora",        servicio: "Viáticos visita Medellín",      valor: 290_000n,    pagado: null,         estado: "PENDIENTE", fPago: null,         fProg: "2026-03-10" },
    { fecha: "2026-02-28", cat: catPapeleria,    entidad: "Papelería La Económica",          servicio: "Resmas, esferos, carpetas",     valor: 185_000n,    pagado: 185_000n,    estado: "PAGADA",   fPago: "2026-03-01", fProg: "2026-03-01" },
    { fecha: "2026-04-10", cat: catServicios,    entidad: "Claro Empresas",                  servicio: "Internet y telefonía abril",    valor: 320_000n,    pagado: null,         estado: "PENDIENTE", fPago: null,         fProg: "2026-04-15" },
  ];

  for (const o of oblData) {
    await prisma.obligaciones.create({ data: {
      fecha: d(o.fecha),
      idCategoria_presupuesto: o.cat.id_categoria_presupuesto,
      entidad: o.entidad,
      servicio_producto: o.servicio,
      valor_obligacion: o.valor,
      valor_pagado: o.pagado ?? undefined,
      fecha_programada_pago: d(o.fProg),
      estado: o.estado,
      fecha_pago: o.fPago ? d(o.fPago) : null,
      observaciones: null,
    }});
  }

  // ── 6. PROPUESTAS ─────────────────────────────────────────────────────────
  console.log("📋 Creando propuestas...");
  await Promise.all([
    // APROBADAS — con contrato ya creado
    prisma.propuesta.create({ data: {
      nit: "900.321.654-1", clienteId: 7, cliente_nombre_somos: "Petroléos del Caribe S.A.S",
      numero_propuesta: "PROP-2024-001", pte: "PTE994", tipo_servicio: "SST",
      meses_propuesta: 12, cantidad_horas: 240,
      fecha_propuesta: d("2024-11-10"), fecha_vencimiento: d("2024-12-10"),
      valor_propuesta: 82_500_000n, estado: "APROBADO",
      observaciones: "Propuesta aprobada. Contrato generado en enero 2025.",
      comercialId: com2.id_comercial, contratoId: cPetrocari.id_contrato,
    }}),
    prisma.propuesta.create({ data: {
      nit: "900.567.891-0", clienteId: 10, cliente_nombre_somos: "Transportes Rápidos del Sur Ltda.",
      numero_propuesta: "PROP-2025-001", pte: "PTE998", tipo_servicio: "Inspectoría",
      meses_propuesta: 8, cantidad_horas: 80,
      fecha_propuesta: d("2025-04-01"), fecha_vencimiento: d("2025-04-30"),
      valor_propuesta: 27_500_000n, estado: "APROBADO",
      observaciones: "Cliente aceptó condiciones. Inicio en mayo 2025.",
      comercialId: com2.id_comercial, contratoId: cTRSur.id_contrato,
    }}),
    prisma.propuesta.create({ data: {
      nit: "860.007.373-1", clienteId: 1, cliente_nombre_somos: "ARL Colmena",
      numero_propuesta: "PROP-2025-002", pte: "PTE739", tipo_servicio: "SST",
      meses_propuesta: 12, cantidad_horas: 144,
      fecha_propuesta: d("2025-11-15"), fecha_vencimiento: d("2025-12-15"),
      valor_propuesta: 52_800_000n, estado: "APROBADO",
      observaciones: "Renovación de contrato anual aprobada por el cliente.",
      comercialId: com1.id_comercial, contratoId: cColmena.id_contrato,
    }}),

    // PENDIENTES — en evaluación
    prisma.propuesta.create({ data: {
      nit: "830.114.200-5", clienteId: 0, cliente_nombre_somos: "Almacenes Éxito S.A.",
      numero_propuesta: "PROP-2026-001", pte: "PTE739", tipo_servicio: "SST",
      meses_propuesta: 6, cantidad_horas: 72,
      fecha_propuesta: d("2026-03-10"), fecha_vencimiento: d("2026-04-10"),
      valor_propuesta: 28_000_000n, estado: "PENDIENTE",
      observaciones: "En revisión por el área de compras del cliente.",
      comercialId: com1.id_comercial,
    }}),
    prisma.propuesta.create({ data: {
      nit: "900.777.123-6", clienteId: 0, cliente_nombre_somos: "Mineros del Pacífico SAS",
      numero_propuesta: "PROP-2026-002", pte: "PTE998", tipo_servicio: "Inspectoría",
      meses_propuesta: 3, cantidad_horas: 60,
      fecha_propuesta: d("2026-04-01"), fecha_vencimiento: d("2026-04-30"),
      valor_propuesta: 15_600_000n, estado: "PENDIENTE",
      observaciones: "Pendiente firma de acuerdo de confidencialidad.",
      comercialId: com3.id_comercial,
    }}),
    prisma.propuesta.create({ data: {
      nit: "800.654.321-9", clienteId: 0, cliente_nombre_somos: "Constructora Palonegro Ltda.",
      numero_propuesta: "PROP-2026-003", pte: "PTE994", tipo_servicio: "Consultoría",
      meses_propuesta: 4, cantidad_horas: 48,
      fecha_propuesta: d("2026-04-15"), fecha_vencimiento: d("2026-05-15"),
      valor_propuesta: 22_400_000n, estado: "PENDIENTE",
      observaciones: "Primera reunión agendada para el 22 de abril.",
      comercialId: com2.id_comercial,
    }}),

    // RECHAZADAS
    prisma.propuesta.create({ data: {
      nit: "900.444.888-2", clienteId: 0, cliente_nombre_somos: "Acerías del Norte S.A.",
      numero_propuesta: "PROP-2025-003", pte: "PTE998", tipo_servicio: "SST",
      meses_propuesta: 12, cantidad_horas: 200,
      fecha_propuesta: d("2025-06-01"), fecha_vencimiento: d("2025-06-30"),
      valor_propuesta: 65_000_000n, estado: "RECHAZADO",
      observaciones: "Cliente optó por proveedor local con menor costo.",
      comercialId: com1.id_comercial,
    }}),
    prisma.propuesta.create({ data: {
      nit: "890.500.111-7", clienteId: 0, cliente_nombre_somos: "Lácteos del Llano S.A.S",
      numero_propuesta: "PROP-2026-004", pte: "PTE739", tipo_servicio: "SST",
      meses_propuesta: 6, cantidad_horas: 60,
      fecha_propuesta: d("2026-02-20"), fecha_vencimiento: d("2026-03-20"),
      valor_propuesta: 18_000_000n, estado: "RECHAZADO",
      observaciones: "Presupuesto del cliente no cubre el alcance propuesto.",
      comercialId: com3.id_comercial,
    }}),
  ]);

  console.log(`
✅ Seed completado:
   • 3 comerciales
   • 2 secciones + 8 categorías de presupuesto
   • 10 contratos (7 activos, 2 vencidos, 1 suspendido)
   • ${await prisma.factura.count()} facturas
   • ${await prisma.obligaciones.count()} obligaciones
   • ${await prisma.propuesta.count()} propuestas (3 aprobadas, 3 pendientes, 2 rechazadas)
  `);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
