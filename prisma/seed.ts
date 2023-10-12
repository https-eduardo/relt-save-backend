import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const banks = [
  {
    name: 'Itau',
    logo_url: 'https://i.imgur.com/QZEaq6J.png',
  },
  {
    name: 'Bradesco',
    logo_url: 'https://i.imgur.com/ZRLie2t.png',
  },
  {
    name: 'Santander',
    logo_url: 'https://i.imgur.com/cmOUXzh.png',
  },
  {
    name: 'Banco do Brasil',
    logo_url: 'https://i.imgur.com/WQHYWSI.png',
  },
  {
    name: 'BTG Pactual',
    logo_url: 'https://i.imgur.com/6LG2fjA.png',
  },
  {
    name: 'Nubank',
    logo_url: 'https://i.imgur.com/0uNECaK.png',
  },
  {
    name: 'Inter',
    logo_url: 'https://i.imgur.com/z50fcZn.png',
  },
  {
    name: 'Banco Pan',
    logo_url: 'https://i.imgur.com/EZ2kjBT.png',
  },
  {
    name: 'Banco Sofisa',
    logo_url: 'https://i.imgur.com/b9MRxy6.png',
  },
  {
    name: 'BRB Banco de Brasília',
    logo_url: 'https://i.imgur.com/8BqWnfU.png',
  },
  {
    name: 'Outro',
    logo_url: 'https://i.imgur.com/hZaMkJs.png',
  },
];

const prisma = new PrismaClient();

async function populateBanks() {
  const requests = banks.map((bank) => {
    return prisma.bank.upsert({
      create: bank,
      update: { logo_url: bank.logo_url },
      where: { name: bank.name },
    });
  });

  await prisma.$transaction(requests);
}

(async () => {
  try {
    await populateBanks();
    prisma.$disconnect();
  } catch {
    prisma.$disconnect();
    process.exit(1);
  }
})();
