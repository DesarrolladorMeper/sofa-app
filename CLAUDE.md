@AGENTS.md

# Proyecto SOFA — Contexto para Claude

## ¿Qué es SOFA?
Sistema financiero interno de **MEPER SOLUTIONS SAS / MEPER CONSULTORES**. Digitaliza los datos del área financiera que antes estaban en 12 archivos Excel. Se comunica con **SOMOS** (sistema de operaciones) vía API, no comparte BD.

## Stack
- Next.js 16.2.2 (App Router, no Pages Router)
- React 19, TypeScript strict
- Prisma 7 con `@prisma/adapter-mariadb` (funciona con MySQL 8.0 — el nombre es confuso pero compatible)
- MySQL 8.0 (host: localhost, DB: sofa_db)
- Tailwind 4
- Sonner (toasts)
- Color corporativo: `#514737` (café/oliva)

## Base de datos
- Conexión en `.env`: `DATABASE_URL="mysql://root:12345678@localhost:3306/sofa_db"`
- Cliente Prisma generado en `../generated/prisma` (alias `@/generated/prisma`)
- **Siempre** correr `npx prisma generate` después de cambiar el schema, antes de usar el cliente
- Seed: `npm run seed` → usa `tsx prisma/seed.ts` (NO usar ts-node, falla en PowerShell por JSON escaping)
- BigInt se usa para todos los valores COP; se serializa con `BigInt.prototype.toJSON = function() { return this.toString(); }`

## Módulo Contratos — estado actual
Archivo principal: `app/contratos/page.tsx`
Componentes: `components/contratos/`
API: `app/api/contratos/route.ts` y `app/api/contratos/[id]/route.ts`

**Campos del modelo `contrato`:**
- `id_contrato`, `nit`, `clienteId`, `cliente_nombre_somos`
- `numero_contrato`, `pte` (ej: PTE739, PTE994, PTE998), `tipo_servicio` (Consultoría / Inspectoría / SST)
- `meses_contrato`, `cantidad_horas_contrato`
- `fecha_inicio`, `finalizacion_contrato`
- `valor` (BigInt), `tiene_iva`, `costos`, `auditoria`, `imprevistos`, `rent`, `total_proyecto` (todos BigInt)
- `estado`: ACTIVO | SUSPENDIDO | VENCIDO | CANCELADO
- `observaciones`, `esta_facturado`, `comercialId`
- Relaciones: `comercial` (Comercial), `facturas` (Factura[])

**Columnas visibles en la tabla** (en orden):
checkbox | NIT | Cliente | No. Contrato | PTE | Tipo Servicio | Meses | Horas | Inicio | Venci. | Total Contrato | Factura Mensual | Estado | % Facturado | Comercial | Acciones

**Columnas ocultas** (existen en BD pero no se muestran): Costos, Auditoría, Imprevistos, Rentabilidad

**Factura Mensual**: columna calculada client-side = `total_proyecto / meses_contrato`, no almacenada en BD.

**% Facturado**: barra de progreso visual con `BarraFacturacion` component.

## Reglas de arquitectura
- SOFA no duplica entidades de SOMOS (clientes, consultores, órdenes). Las referencia por ID y consulta via API.
- Parámetros de ruta en Next.js 16 son `Promise<{ id: string }>` — siempre hacer `await params`.
- Todo en español: modelos, rutas, UI, comentarios.

## Módulos planificados (no iniciados aún)
Facturas UI, Comerciales UI, Registro Horas Consultores, Cuentas Cobro Consultores, Viáticos, Caja Menor, Presupuesto, Control ARLs, Rendimiento.

## Dev server
Corre en `http://localhost:4000` (`npm run dev -- -p 4000`).
