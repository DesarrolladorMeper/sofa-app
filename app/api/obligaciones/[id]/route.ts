import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/obligaciones/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Definir como Promise
) {
  try {
    const { id } = await params; // 2. Esperar a que se resuelva
    
    const obligaciones = await prisma.obligaciones.findUnique({
      where: { id_obligacion: Number(id) }, // Usar la variable 'id' extraída
      include: {
        categoria_presupuesto: true,
      },
    });

    if (!obligaciones) {
      return NextResponse.json({ error: "Obligación no encontrada" }, { status: 404 });
    }

    return NextResponse.json(obligaciones);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener obligación" }, { status: 500 });
  }
}

// /api/obligaciones/[id]/route.ts - Actualizar PUT
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const obligaciones = await prisma.obligaciones.update({
      where: { id_obligacion: Number(id) },
      data: {
        fecha: new Date(body.fecha),
        idCategoria_presupuesto: body.idCategoria_presupuesto,
        entidad: body.entidad,
        servicio_producto: body.servicio_producto,
        factura_cuenta_cobro: body.factura_cuenta_cobro,
        valor_obligacion: body.valor_obligacion,
        valor_pagado: body.valor_pagado,
        soporte_numero_carpeta: body.soporte_numero_carpeta,
        fecha_programada_pago: body.fecha_programada_pago ? new Date(body.fecha_programada_pago) : undefined,
        estado: body.estado,
        fecha_pago: body.fecha_pago ? new Date(body.fecha_pago) : undefined,
        soporte_pago_numero_carpeta: body.soporte_pago_numero_carpeta,
        observaciones: body.observaciones,
      },
      include: {
        categoria_presupuesto: true,
      },
    });

    return NextResponse.json(obligaciones);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar obligación" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.obligaciones.delete({
      where: { id_obligacion: Number(id) },
    });

    return NextResponse.json({ message: "Obligación eliminada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar obligación" },
      { status: 500 }
    );
  }
}