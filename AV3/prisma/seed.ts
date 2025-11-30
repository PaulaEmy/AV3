import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.nivelPermissao.createMany({
    data: [
      { nivel: "Administrador" },
      { nivel: "Engenheiro" },
      { nivel: "Operador" },
    ],
    skipDuplicates: true
  });

  await prisma.funcionario.createMany({
    data: [
      {
        nome: "Maria",
        telefone: "12989899898",
        endereco: "Rua 1",
        usuario: "admin@aero.com",
        senha: "123",
        nivelPermissaoID: "Administrador"
      },
      {
        nome: "João",
        telefone: "12999887766",
        endereco: "Rua 2",
        usuario: "eng@aero.com",
        senha: "123",
        nivelPermissaoID: "Engenheiro"
      },
      {
        nome: "Carlos",
        telefone: "12990001122",
        endereco: "Rua 3",
        usuario: "op@aero.com",
        senha: "123",
        nivelPermissaoID: "Operador"
      }
    ],
    skipDuplicates: true
  });

  await prisma.tipoAeronave.createMany({
    data: [
      { tipo_aeronave: "Comercial" },
      { tipo_aeronave: "Militar" },
    ],
    skipDuplicates: true
  });

  await prisma.tipoPeca.createMany({
    data: [
      { tipo_peca: "Nacional" },
      { tipo_peca: "Importada" },
    ],
    skipDuplicates: true
  });

  await prisma.statusPeca.createMany({
    data: [
      { status_peca: "Em Produção" },
      { status_peca: "Em Transporte" },
      { status_peca: "Pronta" },
    ],
    skipDuplicates: true
  });

    await prisma.resultadoTeste.createMany({
    data: [
      { resultado_teste: "Aprovado" },
      { resultado_teste: "Reprovado" },
    ],
    skipDuplicates: true
  });

  await prisma.statusEtapa.createMany({
    data: [
      { status_etapa: "Pendente" },
      { status_etapa: "Andamento" },
      { status_etapa: "Concluída" },
    ],
    skipDuplicates: true
  });

  await prisma.tipoTeste.createMany({
    data: [
      { tipo_teste: "Elétrico" },
      { tipo_teste: "Hidráulico" },
      { tipo_teste: "Aerodinâmico" },
    ],
    skipDuplicates: true
  });

  console.log("✔ Dados iniciais inseridos!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());