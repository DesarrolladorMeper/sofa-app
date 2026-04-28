-- CreateTable
CREATE TABLE `propuesta` (
    `id_propuesta` INTEGER NOT NULL AUTO_INCREMENT,
    `nit` VARCHAR(191) NULL,
    `clienteId` INTEGER NOT NULL DEFAULT 0,
    `cliente_nombre_somos` VARCHAR(191) NOT NULL,
    `numero_propuesta` VARCHAR(191) NOT NULL,
    `pte` VARCHAR(191) NULL,
    `tipo_servicio` VARCHAR(191) NULL,
    `meses_propuesta` INTEGER NULL,
    `cantidad_horas` DOUBLE NULL,
    `fecha_propuesta` DATE NULL,
    `fecha_vencimiento` DATE NULL,
    `valor_propuesta` BIGINT NOT NULL DEFAULT 0,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'PENDIENTE',
    `observaciones` TEXT NULL,
    `comercialId` INTEGER NULL,
    `contratoId` INTEGER NULL,

    UNIQUE INDEX `propuesta_numero_propuesta_key`(`numero_propuesta`),
    INDEX `propuesta_comercialId_fkey`(`comercialId`),
    PRIMARY KEY (`id_propuesta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `propuesta` ADD CONSTRAINT `propuesta_comercialId_fkey` FOREIGN KEY (`comercialId`) REFERENCES `comercial`(`id_comercial`) ON DELETE SET NULL ON UPDATE CASCADE;
