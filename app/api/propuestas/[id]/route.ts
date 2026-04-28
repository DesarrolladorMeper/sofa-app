import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propuesta = await prisma.propuesta.findUnique({
      where: { id_propuesta: Number(id) },
      include: { comercial: true },
    });
    if (!propuesta) return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 });
    return NextResponse.json(propuesta);
  } catch {
    return NextResponse.json({ error: "Error al obtener la propuesta" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const idNum = Number(id);

    const actual = await prisma.propuesta.findUnique({ where: { id_propuesta: idNum } });
    if (!actual) return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 });

    let contratoId = actual.contratoId;

    // Si se aprueba y aún no tiene contrato, crear contrato automáticamente
    if (body.estado === "APROBADO" && actual.estado !== "APROBADO" && !actual.contratoId) {
      const nuevoContrato = await prisma.contrato.create({
        data: {
          nit: actual.nit,
          clienteId: actual.clienteId,
          cliente_nombre_somos: actual.cliente_nombre_somos,
          numero_contrato: `CNT-${actual.numero_propuesta}`,
          pte: actual.pte,
          tipo_servicio: actual.tipo_servicio,
          meses_contrato: actual.meses_propuesta,
          cantidad_horas_contrato: actual.cantidad_horas,
          fecha_inicio: new Date(),
          valor: actual.valor_propuesta,
          total_proyecto: actual.valor_propuesta,
          tiene_iva: false,
          estado: "ACTIVO",
          observaciones: `Generado desde propuesta ${actual.numero_propuesta}`,
          comercialId: actual.comercialId,
        },
      });
      contratoId = nuevoContrato.id_contrato;
    }

    const propuesta = await prisma.propuesta.update({
      where: { id_propuesta: idNum },
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
        estado: body.estado,
        observaciones: body.observaciones || null,
        comercialId: body.comercialId ? Number(body.comercialId) : null,
        contratoId,
      },
      include: { comercial: true },
    });

    return NextResponse.json({ propuesta, contratoCreado: contratoId !== actual.contratoId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar la propuesta" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.propuesta.delete({ where: { id_propuesta: Number(id) } });
    return NextResponse.json({ message: "Propuesta eliminada" });
  } catch {
    return NextResponse.json({ error: "Error al eliminar la propuesta" }, { status: 500 });
  }
}
