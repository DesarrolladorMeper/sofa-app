import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const comercial = await prisma.comercial.update({
      where: { id_comercial: Number(id) },
      data: {
        username: body.username,
        tiene_comision_comercial: Boolean(body.tiene_comision_comercial),
        porcentaje_comision: body.porcentaje_comision ? Number(body.porcentaje_comision) : null,
      },
    });
    return NextResponse.json(comercial);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar el comercial" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.comercial.delete({ where: { id_comercial: Number(id) } });
    return NextResponse.json({ message: "Eliminado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
