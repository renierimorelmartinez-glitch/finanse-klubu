import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  console.log("Seeding categories...");

  // INCOME categories
  const incomeCategories = [
    { name: "OPEN", defaultVatRate: 8, isFrequent: true, sortOrder: 1 },
    { name: "10/10", defaultVatRate: 8, isFrequent: true, sortOrder: 2 },
    { name: "Jednorazowe", defaultVatRate: 8, isFrequent: true, sortOrder: 3 },
    { name: "Napoje", defaultVatRate: 8, isFrequent: true, sortOrder: 4 },
    { name: "Batony", defaultVatRate: 8, isFrequent: false, sortOrder: 5 },
    { name: "Merch", defaultVatRate: 23, isFrequent: false, sortOrder: 6 },
  ];

  const createdIncomeCategories: Record<string, string> = {};
  for (const cat of incomeCategories) {
    const c = await prisma.category.create({
      data: { ...cat, type: "INCOME" },
    });
    createdIncomeCategories[cat.name] = c.id;
  }

  // EXPENSE categories - fixed
  const fixedExpenseCategories = [
    { name: "Czynsz", defaultVatRate: 23, isFrequent: false, sortOrder: 10 },
    { name: "WodGuru", defaultVatRate: 23, isFrequent: false, sortOrder: 11 },
    { name: "MailerLite", defaultVatRate: 23, isFrequent: false, sortOrder: 12 },
    { name: "Canva", defaultVatRate: 23, isFrequent: false, sortOrder: 13 },
    { name: "Affiliate", defaultVatRate: 23, isFrequent: false, sortOrder: 14 },
    { name: "SerwerSMS", defaultVatRate: 23, isFrequent: false, sortOrder: 15 },
    { name: "Hosting", defaultVatRate: 23, isFrequent: false, sortOrder: 16 },
    { name: "Domena", defaultVatRate: 23, isFrequent: false, sortOrder: 17 },
    { name: "Księgowość", defaultVatRate: 23, isFrequent: false, sortOrder: 18 },
    { name: "Prowizje płatności", defaultVatRate: 23, isFrequent: false, sortOrder: 19 },
  ];

  const createdFixedCategories: Record<string, string> = {};
  for (const cat of fixedExpenseCategories) {
    const c = await prisma.category.create({
      data: { ...cat, type: "EXPENSE" },
    });
    createdFixedCategories[cat.name] = c.id;
  }

  // EXPENSE categories - variable
  const variableExpenseCategories = [
    { name: "Chemia", defaultVatRate: 23, isFrequent: true, sortOrder: 20 },
    { name: "Serwis/Naprawy", defaultVatRate: 23, isFrequent: true, sortOrder: 21 },
    { name: "Marketing", defaultVatRate: 23, isFrequent: false, sortOrder: 22 },
    { name: "Sprzęt<1000", defaultVatRate: 23, isFrequent: false, sortOrder: 23 },
    { name: "Eventy", defaultVatRate: 23, isFrequent: false, sortOrder: 24 },
  ];

  for (const cat of variableExpenseCategories) {
    await prisma.category.create({
      data: { ...cat, type: "EXPENSE" },
    });
  }

  console.log("Seeding recurring rules...");

  const recurringRules = [
    { name: "Czynsz", category: "Czynsz", grossAmount: 7200, vatRate: 23, dayOfMonth: 1 },
    { name: "WodGuru", category: "WodGuru", grossAmount: 299, vatRate: 23, dayOfMonth: 1 },
    { name: "MailerLite", category: "MailerLite", grossAmount: 150, vatRate: 23, dayOfMonth: 5 },
    { name: "Canva", category: "Canva", grossAmount: 55, vatRate: 23, dayOfMonth: 10 },
    { name: "Affiliate", category: "Affiliate", grossAmount: 100, vatRate: 23, dayOfMonth: 15 },
    { name: "SerwerSMS", category: "SerwerSMS", grossAmount: 50, vatRate: 23, dayOfMonth: 1 },
    { name: "Hosting", category: "Hosting", grossAmount: 80, vatRate: 23, dayOfMonth: 1 },
    { name: "Domena", category: "Domena", grossAmount: 15, vatRate: 23, dayOfMonth: 1 },
    { name: "Księgowość", category: "Księgowość", grossAmount: 600, vatRate: 23, dayOfMonth: 10 },
    { name: "Prowizje płatności", category: "Prowizje płatności", grossAmount: 200, vatRate: 23, dayOfMonth: 28 },
  ];

  for (const rule of recurringRules) {
    await prisma.recurringRule.create({
      data: {
        name: rule.name,
        categoryId: createdFixedCategories[rule.category],
        grossAmount: rule.grossAmount,
        vatRate: rule.vatRate,
        dayOfMonth: rule.dayOfMonth,
        isActive: true,
        startMonth: currentMonth,
      },
    });
  }

  // Create current month params
  await prisma.monthParams.create({
    data: {
      month: currentMonth,
      zusAmount: 0,
      pitAmount: 0,
      vatAdjustmentAmount: 0,
    },
  });

  console.log(`Seed completed. Current month: ${currentMonth}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
