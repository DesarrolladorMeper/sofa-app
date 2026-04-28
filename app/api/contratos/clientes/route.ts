import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Retorna lista de clientes únicos (nit + nombre) registrados en contratos
export async function GET() {
  try {
    const rows = await prisma.contrato.findMany({
      select: { nit: true, cliente_nombre_somos: true },
      distinct: ["cliente_nombre_somos"],
      orderBy: { cliente_nombre_somos: "asc" },
    });

    const clientes = rows.map((r) => ({
      nit: r.nit ?? "",
      nombre: r.cliente_nombre_somos,
    }));

    return NextResponse.json(clientes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al buscar clientes" }, { status: 500 });
  }
}
