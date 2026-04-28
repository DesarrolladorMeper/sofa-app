import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const comerciales = await prisma.comercial.findMany({
      orderBy: { username: "asc" },
    });
    return NextResponse.json(comerciales);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener los comerciales" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const comercial = await prisma.comercial.create({
      data: {
        username: body.username,
        tiene_comision_comercial: Boolean(body.tiene_comision_comercial),
        porcentaje_comision: body.porcentaje_comision ? Number(body.porcentaje_comision) : null,
      },
    });
    return NextResponse.json(comercial, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear el comercial" }, { status: 500 });
  }
}
