import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contratos = await prisma.contrato.findMany({
      include: { comercial: true },
      orderBy: { fecha_generacion_factura: "desc" },
    });
    return NextResponse.json(contratos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener los contratos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const contrato = await prisma.contrato.create({
      data: {
        clienteId: Number(body.clienteId),
        cliente_nombre_somos: body.cliente_nombre_somos,
        numero_contrato: body.numero_contrato,
        mes_contrato: body.mes_contrato,
        fecha_generacion_factura: new Date(body.fecha_generacion_factura),
        fecha_vencimiento_factura: new Date(body.fecha_vencimiento_factura),
        finalizacion_contrato: new Date(body.finalizacion_contrato),
        valor: BigInt(body.valor),
        tiene_iva: Boolean(body.tiene_iva),
        estado: body.estado ?? "ACTIVO",
        observaciones: body.observaciones ?? null,
        esta_facturado: Boolean(body.esta_facturado),
        comercialId: body.comercialId ? Number(body.comercialId) : null,
      },
      include: { comercial: true },
    });

    return NextResponse.json(contrato, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear el contrato" }, { status: 500 });
  }
}
