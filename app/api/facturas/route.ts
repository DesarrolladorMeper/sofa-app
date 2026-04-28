import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const facturas = await prisma.factura.findMany({
      include: {
        comercial: true,
        contrato: { select: { numero_contrato: true, cliente_nombre_somos: true } },
      },
      orderBy: { id_factura: "desc" },
    });
    return NextResponse.json(facturas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener las facturas" }, { status: 500 });
  }
}
