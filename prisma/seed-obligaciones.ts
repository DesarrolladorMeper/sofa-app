import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🗑️ Limpiando datos antiguos...");
  await prisma.obligaciones.deleteMany({});

  console.log("💳 Iniciando migración de OBLIGACIONES con formato BigInt...");

  const workbook = XLSX.readFile(
    path.join(__dirname, "./data/base_de_datos_financiera.xlsx"),
    { cellDates: true },
  );

  const sheet = workbook.Sheets["OBLIGACIONES"];
  if (!sheet) {
    throw new Error("No se encontró la pestaña OBLIGACIONES");
  }

  const obligacionesData = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
  }) as any[];

  // 1. MIGRAR CATEGORÍAS
  console.log("📂 Sincronizando categorías...");
  const nombresCategorias = Array.from(
    new Set(obligacionesData.map((o) => o.categoria_presupuesto)),
  ).filter(Boolean);

  for (const nombre of nombresCategorias) {
    await prisma.categoria_presupuesto.upsert({
      where: { nombre_categoria: String(nombre) },
      update: {},
      create: {
        nombre_categoria: String(nombre),
        activa: true,
      },
    });
  }

  // 2. MIGRAR OBLIGACIONES
  console.log(`📝 Procesando ${obligacionesData.length} registros...`);

  for (const o of obligacionesData) {
    const categoria = await prisma.categoria_presupuesto.findUnique({
      where: { nombre_categoria: String(o.categoria_presupuesto) },
    });

    try {
      /**
       * MEJORADO: Normaliza fechas y devuelve null si el valor es inválido
       */
      const normalizarFecha = (fecha: any) => {
        if (!fecha) return null;
        const d = new Date(fecha);
        
        // Si el objeto Date no es válido (ej. texto aleatorio), getTime() devuelve NaN
        if (isNaN(d.getTime())) return null;

        d.setUTCHours(0, 0, 0, 0);
        return d;
      };

      /**
       * Procesa montos grandes y notación científica
       */
      const procesarMonto = (valor: any): bigint => {
        if (valor === null || valor === undefined || valor === "") return BigInt(0);
        const stringLimpio = String(valor).replace(",", ".");
        const numeroExpandido = Number(stringLimpio);
        if (isNaN(numeroExpandido)) return BigInt(0);
        return BigInt(Math.round(numeroExpandido));
      };

      const valorFinal = procesarMonto(o.valor);

      // Log para valores grandes (como tus 100 mil millones)
      if (valorFinal > BigInt(1000000000)) {
        console.log(`✅ Monto detectado: ${valorFinal.toString()} - Entidad: ${o.entidad}`);
      }

      await prisma.obligaciones.create({
        data: {
          fecha: normalizarFecha(o.fecha) || new Date(),
          entidad: String(o.entidad || "N/A"),
          servicio_producto: String(o.servicio_producto || "N/A"),
          factura_cuenta_cobro: o.factura_cuenta_cobro ? String(o.factura_cuenta_cobro) : null,

          // Montos procesados como BigInt
          valor_obligacion: valorFinal,
          valor_pagado: procesarMonto(o.valor_pagado),

          soporte_numero_carpeta: o.soporte_numero_carpeta ? String(o.soporte_numero_carpeta) : null,
          fecha_programada_pago: normalizarFecha(o.fecha_programada_pago) || new Date(),
          estado: String(o.estado || "Pendiente"),

          // Si la fecha en Excel está mal, aquí se guardará como NULL
          fecha_pago: normalizarFecha(o.fecha_pago),

          soporte_pago_numero_carpeta: o.soporte_pago_numero_carpeta ? String(o.soporte_pago_numero_carpeta) : null,
          observaciones: o.observaciones ? String(o.observaciones) : null,
          idCategoria_presupuesto: categoria?.id_categoria_presupuesto,
        },
      });
    } catch (error) {
      console.error(`❌ Error en registro de la entidad: ${o.entidad}, Factura: ${o.factura_cuenta_cobro}`);
      console.error(`Causa: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Error crítico en la migración:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });