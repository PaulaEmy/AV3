-- CreateTable
CREATE TABLE `TipoAeronave` (
    `tipo_aeronave` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`tipo_aeronave`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoPeca` (
    `tipo_peca` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`tipo_peca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StatusPeca` (
    `status_peca` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`status_peca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StatusEtapa` (
    `status_etapa` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`status_etapa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NivelPermissao` (
    `nivel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`nivel`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoTeste` (
    `tipo_teste` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`tipo_teste`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResultadoTeste` (
    `resultado_teste` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`resultado_teste`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aeronave` (
    `codigo` INTEGER NOT NULL AUTO_INCREMENT,
    `modelo` VARCHAR(191) NOT NULL,
    `tipoAeronaveID` VARCHAR(191) NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `alcance` DOUBLE NOT NULL,
    `cliente` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peca` (
    `id_peca` INTEGER NOT NULL AUTO_INCREMENT,
    `nomePeca` VARCHAR(191) NOT NULL,
    `tipoPecaID` VARCHAR(191) NOT NULL,
    `fornecedor` VARCHAR(191) NOT NULL,
    `statusPecaID` VARCHAR(191) NOT NULL,
    `aeronaveID` INTEGER NULL,

    PRIMARY KEY (`id_peca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funcionario` (
    `funcionario_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `usuario` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nivelPermissaoID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`funcionario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etapa` (
    `id_etapa` INTEGER NOT NULL AUTO_INCREMENT,
    `prazo` VARCHAR(191) NOT NULL,
    `statusEtapaID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_etapa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teste` (
    `id_teste` INTEGER NOT NULL AUTO_INCREMENT,
    `resultadoTesteID` VARCHAR(191) NOT NULL,
    `aeronaveID` INTEGER NOT NULL,
    `tipoTesteID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_teste`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FuncionariosEtapas` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FuncionariosEtapas_AB_unique`(`A`, `B`),
    INDEX `_FuncionariosEtapas_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Aeronave` ADD CONSTRAINT `Aeronave_tipoAeronaveID_fkey` FOREIGN KEY (`tipoAeronaveID`) REFERENCES `TipoAeronave`(`tipo_aeronave`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peca` ADD CONSTRAINT `Peca_tipoPecaID_fkey` FOREIGN KEY (`tipoPecaID`) REFERENCES `TipoPeca`(`tipo_peca`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peca` ADD CONSTRAINT `Peca_statusPecaID_fkey` FOREIGN KEY (`statusPecaID`) REFERENCES `StatusPeca`(`status_peca`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peca` ADD CONSTRAINT `Peca_aeronaveID_fkey` FOREIGN KEY (`aeronaveID`) REFERENCES `Aeronave`(`codigo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_nivelPermissaoID_fkey` FOREIGN KEY (`nivelPermissaoID`) REFERENCES `NivelPermissao`(`nivel`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Etapa` ADD CONSTRAINT `Etapa_statusEtapaID_fkey` FOREIGN KEY (`statusEtapaID`) REFERENCES `StatusEtapa`(`status_etapa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teste` ADD CONSTRAINT `Teste_resultadoTesteID_fkey` FOREIGN KEY (`resultadoTesteID`) REFERENCES `ResultadoTeste`(`resultado_teste`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teste` ADD CONSTRAINT `Teste_aeronaveID_fkey` FOREIGN KEY (`aeronaveID`) REFERENCES `Aeronave`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teste` ADD CONSTRAINT `Teste_tipoTesteID_fkey` FOREIGN KEY (`tipoTesteID`) REFERENCES `TipoTeste`(`tipo_teste`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionariosEtapas` ADD CONSTRAINT `_FuncionariosEtapas_A_fkey` FOREIGN KEY (`A`) REFERENCES `Etapa`(`id_etapa`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionariosEtapas` ADD CONSTRAINT `_FuncionariosEtapas_B_fkey` FOREIGN KEY (`B`) REFERENCES `Funcionario`(`funcionario_id`) ON DELETE CASCADE ON UPDATE CASCADE;
