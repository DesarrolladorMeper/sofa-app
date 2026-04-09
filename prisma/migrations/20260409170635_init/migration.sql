-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `numero_documento` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_numero_documento_key`(`numero_documento`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id_roles` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `roles_nombre_rol_key`(`nombre_rol`),
    PRIMARY KEY (`id_roles`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios_roles` (
    `id_roles` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,

    INDEX `usuariosroles_id_roles_fkey`(`id_roles`),
    PRIMARY KEY (`id_usuario`, `id_roles`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permisos_roles` (
    `idPermiso` INTEGER NOT NULL AUTO_INCREMENT,
    `id_roles` INTEGER NOT NULL,
    `modulo` VARCHAR(50) NOT NULL,
    `ver` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `unique_rol_modulo`(`id_roles`, `modulo`),
    PRIMARY KEY (`idPermiso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seccion_categoria_presupuesto` (
    `id_seccion_categoria_presupuesto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_seccion_categoria` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `seccion_categoria_presupuesto_nombre_seccion_categoria_key`(`nombre_seccion_categoria`),
    PRIMARY KEY (`id_seccion_categoria_presupuesto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria_presupuesto` (
    `id_categoria_presupuesto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_categoria` VARCHAR(191) NOT NULL,
    `seccion_categoria_presupuestoId` INTEGER NULL,
    `activa` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `categoria_presupuesto_nombre_categoria_key`(`nombre_categoria`),
    INDEX `categoria_presupuesto_seccion_categoria_presupuestoId_fkey`(`seccion_categoria_presupuestoId`),
    PRIMARY KEY (`id_categoria_presupuesto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comercial` (
    `id_comercial` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `tiene_comision_comercial` BOOLEAN NOT NULL,
    `porcentaje_comision` DOUBLE NULL,

    UNIQUE INDEX `comercial_username_key`(`username`),
    PRIMARY KEY (`id_comercial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contrato` (
    `id_contrato` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `cliente_nombre_somos` VARCHAR(191) NOT NULL,
    `numero_contrato` VARCHAR(191) NOT NULL,
    `mes_contrato` VARCHAR(191) NOT NULL,
    `fecha_vencimiento_factura` DATE NOT NULL,
    `fecha_generacion_factura` DATE NOT NULL,
    `finalizacion_contrato` DATE NOT NULL,
    `comercialId` INTEGER NOT NULL,

    UNIQUE INDEX `contrato_numero_contrato_key`(`numero_contrato`),
    INDEX `contrato_comercialId_fkey`(`comercialId`),
    PRIMARY KEY (`id_contrato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factura` (
    `id_factura` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_factura` VARCHAR(191) NOT NULL,
    `tipo_servicio` VARCHAR(191) NOT NULL,
    `fecha_vencimiento` DATE NOT NULL,
    `fecha_generacion_factura` DATE NOT NULL,
    `va_con_iva` BOOLEAN NOT NULL,
    `valor_sin_iva` BIGINT NOT NULL,
    `valor_iva` BIGINT NOT NULL,
    `valor_total` BIGINT NOT NULL,
    `estado_factura` VARCHAR(191) NOT NULL,
    `fecha_pago_factura` DATE NULL,
    `valor_comision` BIGINT NULL,
    `comercialId` INTEGER NULL,
    `contratoId` INTEGER NULL,

    UNIQUE INDEX `factura_numero_factura_key`(`numero_factura`),
    INDEX `factura_comercialId_fkey`(`comercialId`),
    INDEX `factura_contratoId_fkey`(`contratoId`),
    PRIMARY KEY (`id_factura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `obligaciones` (
    `id_obligacion` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATE NOT NULL,
    `idCategoria_presupuesto` INTEGER NULL,
    `entidad` VARCHAR(191) NOT NULL,
    `servicio_producto` VARCHAR(191) NOT NULL,
    `factura_cuenta_cobro` VARCHAR(191) NULL,
    `valor_obligacion` BIGINT NOT NULL,
    `valor_pagado` BIGINT NULL,
    `soporte_numero_carpeta` VARCHAR(191) NULL,
    `fecha_programada_pago` DATE NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `fecha_pago` DATE NULL,
    `soporte_pago_numero_carpeta` VARCHAR(191) NULL,
    `observaciones` VARCHAR(191) NULL,

    PRIMARY KEY (`id_obligacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios_roles` ADD CONSTRAINT `usuarios_roles_id_roles_fkey` FOREIGN KEY (`id_roles`) REFERENCES `roles`(`id_roles`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios_roles` ADD CONSTRAINT `usuarios_roles_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permisos_roles` ADD CONSTRAINT `fk_permisosrol_rol` FOREIGN KEY (`id_roles`) REFERENCES `roles`(`id_roles`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `categoria_presupuesto` ADD CONSTRAINT `categoria_presupuesto_seccion_categoria_presupuestoId_fkey` FOREIGN KEY (`seccion_categoria_presupuestoId`) REFERENCES `seccion_categoria_presupuesto`(`id_seccion_categoria_presupuesto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contrato` ADD CONSTRAINT `contrato_comercialId_fkey` FOREIGN KEY (`comercialId`) REFERENCES `comercial`(`id_comercial`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factura` ADD CONSTRAINT `factura_comercialId_fkey` FOREIGN KEY (`comercialId`) REFERENCES `comercial`(`id_comercial`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factura` ADD CONSTRAINT `factura_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `contrato`(`id_contrato`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `obligaciones` ADD CONSTRAINT `obligaciones_idCategoria_presupuesto_fkey` FOREIGN KEY (`idCategoria_presupuesto`) REFERENCES `categoria_presupuesto`(`id_categoria_presupuesto`) ON DELETE SET NULL ON UPDATE CASCADE;
