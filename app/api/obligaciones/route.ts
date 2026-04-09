import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/usuarios — obtener todos los usuarios
export async function GET() {
  try {
    const obligaciones = await prisma.obligaciones.findMany();

    return NextResponse.json(obligaciones);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener las obligaciones" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const obligaciones = await prisma.obligaciones.create({
      data: {
        fecha: body.fecha,
        idCategoria_presupuesto: body.idCategoria_presupuesto,
        entidad: body.entidad,
        servicio_producto: body.servicio_producto,
        factura_cuenta_cobro: body.factura_cuenta_cobro,
        valor_obligacion: body.valor_obligacion,
        valor_pagado: body.valor_pagado,
        soporte_numero_carpeta: body.soporte_numero_carpeta,
        fecha_programada_pago: body.fecha_programada_pago,
        estado: body.estado,
        fecha_pago: body.fecha_pago,
        soporte_pago_numero_carpeta: body.soporte_pago_numero_carpeta,
        observaciones: body.observaciones,
      },
    });
    return NextResponse.json(obligaciones, { status: 201 });
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      { error: "Error al crear obligación" },
      { status: 500 },
    );
  }
}
