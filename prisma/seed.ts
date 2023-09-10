import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const banks = [
  {
    name: 'Itau',
    logo_url: 'https://imgur.com/QZEaq6J',
  },
  {
    name: 'Bradesco',
    logo_url: 'https://imgur.com/ZRLie2t',
  },
  {
    name: 'Santander',
    logo_url: 'https://imgur.com/cmOUXzh',
  },
  {
    name: 'Banco do Brasil',
    logo_url: 'https://imgur.com/WQHYWSI',
  },
  {
    name: 'BTG Pactual',
    logo_url: 'https://imgur.com/6LG2fjA',
  },
  {
    name: 'Nubank',
    logo_url: 'https://imgur.com/0uNECaK',
  },
  {
    name: 'Inter',
    logo_url: 'https://imgur.com/z50fcZn',
  },
  {
    name: 'Banco Pan',
    logo_url: 'https://imgur.com/EZ2kjBT',
  },
  {
    name: 'Banco Sofisa',
    logo_url: 'https://imgur.com/b9MRxy6',
  },
  {
    name: 'BRB Banco de Brasília',
    logo_url: 'https://imgur.com/8BqWnfU',
  },
  {
    name: 'Outro',
    logo_url: 'https://imgur.com/hZaMkJs',
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
