-- DropForeignKey
ALTER TABLE `contrato` DROP FOREIGN KEY `contrato_comercialId_fkey`;

-- AlterTable
ALTER TABLE `contrato` ADD COLUMN `auditoria` BIGINT NULL,
    ADD COLUMN `cantidad_horas_contrato` DOUBLE NULL,
    ADD COLUMN `costos` BIGINT NULL,
    ADD COLUMN `esta_facturado` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `estado` VARCHAR(191) NOT NULL DEFAULT 'ACTIVO',
    ADD COLUMN `fecha_inicio` DATE NULL,
    ADD COLUMN `imprevistos` BIGINT NULL,
    ADD COLUMN `meses_contrato` INTEGER NULL,
    ADD COLUMN `nit` VARCHAR(191) NULL,
    ADD COLUMN `observaciones` TEXT NULL,
    ADD COLUMN `pte` VARCHAR(191) NULL,
    ADD COLUMN `rent` BIGINT NULL,
    ADD COLUMN `tiene_iva` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `total_proyecto` BIGINT NULL,
    ADD COLUMN `valor` BIGINT NOT NULL DEFAULT 0,
    MODIFY `mes_contrato` VARCHAR(191) NULL,
    MODIFY `fecha_vencimiento_factura` DATE NULL,
    MODIFY `fecha_generacion_factura` DATE NULL,
    MODIFY `finalizacion_contrato` DATE NULL,
    MODIFY `comercialId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `contrato` ADD CONSTRAINT `contrato_comercialId_fkey` FOREIGN KEY (`comercialId`) REFERENCES `comercial`(`id_comercial`) ON DELETE SET NULL ON UPDATE CASCADE;
