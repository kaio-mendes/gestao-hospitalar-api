-- AlterTable
ALTER TABLE `agendamento` ADD COLUMN `finalizado` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `prescricao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pacienteId` INTEGER NOT NULL,
    `medicoResponsavelId` INTEGER NOT NULL,
    `sintomas` VARCHAR(400) NOT NULL,
    `observacao` VARCHAR(400) NOT NULL,
    `prescricao` VARCHAR(400) NOT NULL,
    `dataConsulta` DATETIME(0) NOT NULL,
    `horaConsulta` TIME(0) NULL,

    INDEX `idx_prescricao_pacienteId`(`pacienteId`),
    INDEX `idx_prescricao_medicoResponsavelId`(`medicoResponsavelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `prescricao` ADD CONSTRAINT `prescricao_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescricao` ADD CONSTRAINT `prescricao_medicoResponsavelId_fkey` FOREIGN KEY (`medicoResponsavelId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `paciente` RENAME INDEX `paciente_medicoResponsavelId_fkey` TO `idx_paciente_medicoResponsavelId`;
