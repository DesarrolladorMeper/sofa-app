import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contratos = await prisma.contrato.findMany({
      include: {
        comercial: true,
        facturas: { select: { valor_total: true } },
      },
      orderBy: { id_contrato: "desc" },
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
    const total = body.total_proyecto ? BigInt(body.total_proyecto) : null;

    const contrato = await prisma.contrato.create({
      data: {
        nit: body.nit || null,
        clienteId: Number(body.clienteId) || 0,
        cliente_nombre_somos: body.cliente_nombre_somos,
        numero_contrato: body.numero_contrato,
        pte: body.pte || null,
        meses_contrato: body.meses_contrato ? Number(body.meses_contrato) : null,
        cantidad_horas_contrato: body.cantidad_horas_contrato ? Number(body.cantidad_horas_contrato) : null,
        fecha_inicio: body.fecha_inicio ? new Date(body.fecha_inicio) : null,
        finalizacion_contrato: body.finalizacion_contrato ? new Date(body.finalizacion_contrato) : null,
        valor: total ?? BigInt(0),
        tiene_iva: Boolean(body.tiene_iva),
        costos: body.costos ? BigInt(body.costos) : null,
        auditoria: body.auditoria ? BigInt(body.auditoria) : null,
        imprevistos: body.imprevistos ? BigInt(body.imprevistos) : null,
        rent: body.rent ? BigInt(body.rent) : null,
        total_proyecto: total,
        estado: body.estado ?? "ACTIVO",
        observaciones: body.observaciones || null,
        comercialId: body.comercialId ? Number(body.comercialId) : null,
      },
      include: { comercial: true, facturas: { select: { valor_total: true } } },
    });

    return NextResponse.json(contrato, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear el contrato" }, { status: 500 });
  }
}
