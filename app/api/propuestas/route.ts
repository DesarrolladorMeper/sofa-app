import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const propuestas = await prisma.propuesta.findMany({
      include: { comercial: true },
      orderBy: { id_propuesta: "desc" },
    });
    return NextResponse.json(propuestas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener las propuestas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const propuesta = await prisma.propuesta.create({
      data: {
        nit: body.nit || null,
        clienteId: Number(body.clienteId) || 0,
        cliente_nombre_somos: body.cliente_nombre_somos,
        numero_propuesta: body.numero_propuesta,
        pte: body.pte || null,
        tipo_servicio: body.tipo_servicio || null,
        meses_propuesta: body.meses_propuesta ? Number(body.meses_propuesta) : null,
        cantidad_horas: body.cantidad_horas ? Number(body.cantidad_horas) : null,
        fecha_propuesta: body.fecha_propuesta ? new Date(body.fecha_propuesta) : null,
        fecha_vencimiento: body.fecha_vencimiento ? new Date(body.fecha_vencimiento) : null,
        valor_propuesta: body.valor_propuesta ? BigInt(body.valor_propuesta) : BigInt(0),
        estado: body.estado ?? "PENDIENTE",
        observaciones: body.observaciones || null,
        comercialId: body.comercialId ? Number(body.comercialId) : null,
      },
      include: { comercial: true },
    });
    return NextResponse.json(propuesta, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear la propuesta" }, { status: 500 });
  }
}
