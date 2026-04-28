import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contrato = await prisma.contrato.findUnique({
      where: { id_contrato: Number(id) },
      include: { comercial: true, facturas: true },
    });
    if (!contrato) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 });
    }
    return NextResponse.json(contrato);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el contrato" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const contrato = await prisma.contrato.update({
      where: { id_contrato: Number(id) },
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
        estado: body.estado,
        observaciones: body.observaciones ?? null,
        esta_facturado: Boolean(body.esta_facturado),
        comercialId: body.comercialId ? Number(body.comercialId) : null,
      },
      include: { comercial: true },
    });

    return NextResponse.json(contrato);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar el contrato" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.contrato.delete({ where: { id_contrato: Number(id) } });
    return NextResponse.json({ message: "Contrato eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el contrato" }, { status: 500 });
  }
}
