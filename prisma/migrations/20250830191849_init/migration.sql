-- DropForeignKey
ALTER TABLE `paciente` DROP FOREIGN KEY `Paciente_medicoResponsavelId_fkey`;

-- CreateTable
CREATE TABLE `agendamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pacienteId` INTEGER NOT NULL,
    `medicoResponsavelId` INTEGER NULL,
    `observacao` VARCHAR(255) NULL,
    `dataConsulta` DATETIME(0) NOT NULL,
    `horaConsulta` TIME(0) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_agendamento_pacienteId`(`pacienteId`),
    INDEX `idx_agendamento_medicoResponsavelId`(`medicoResponsavelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `paciente` ADD CONSTRAINT `paciente_medicoResponsavelId_fkey` FOREIGN KEY (`medicoResponsavelId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendamento` ADD CONSTRAINT `agendamento_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendamento` ADD CONSTRAINT `agendamento_medicoResponsavelId_fkey` FOREIGN KEY (`medicoResponsavelId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
