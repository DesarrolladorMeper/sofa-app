import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/usuarios — obtener todos los usuarios
export async function GET() {
  try {
    const usuarios = await prisma.usuarios.findMany();

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const usuario = await prisma.usuarios.create({
      data: {
        email: body.email,
        numero_documento: body.numeroDocumento
      }
    });
    return NextResponse.json(usuario, { status: 201 });
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      { error: "Error al crear usuario y sus relaciones" },
      { status: 500 }
    );
  }
}