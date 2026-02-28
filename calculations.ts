export function calculateNet(grossAmount: number, vatRate: number): number {
  const net = grossAmount / (1 + vatRate / 100);
  return Math.round(net * 100) / 100;
}

export function calculateVat(grossAmount: number, vatRate: number): number {
  const net = calculateNet(grossAmount, vatRate);
  return Math.round((grossAmount - net) * 100) / 100;
}

export interface MonthSummary {
  totalIncomeGross: number;
  totalExpenseGross: number;
  operatingResult: number;
  vatDue: number;       // VAT from income
  vatInput: number;     // VAT from expenses
  vatAdjustment: number;
  vatToPay: number;     // vatDue - vatInput + adjustment
  zusAmount: number;
  pitAmount: number;
  netForecast: number;  // operatingResult - max(vatToPay,0) - zus - pit
}

export function computeMonthSummary(
  transactions: Array<{
    type: string;
    grossAmount: number | { toString(): string };
    vatAmount: number | { toString(): string };
  }>,
  params: {
    zusAmount: number;
    pitAmount: number;
    vatAdjustmentAmount: number;
  }
): MonthSummary {
  let totalIncomeGross = 0;
  let totalExpenseGross = 0;
  let vatDue = 0;
  let vatInput = 0;

  for (const t of transactions) {
    const gross = Number(t.grossAmount);
    const vat = Number(t.vatAmount);
    if (t.type === "INCOME") {
      totalIncomeGross += gross;
      vatDue += vat;
    } else {
      totalExpenseGross += gross;
      vatInput += vat;
    }
  }

  totalIncomeGross = round2(totalIncomeGross);
  totalExpenseGross = round2(totalExpenseGross);
  vatDue = round2(vatDue);
  vatInput = round2(vatInput);

  const vatAdjustment = params.vatAdjustmentAmount;
  const vatToPay = round2(vatDue - vatInput + vatAdjustment);
  const operatingResult = round2(totalIncomeGross - totalExpenseGross);
  const netForecast = round2(
    operatingResult - Math.max(vatToPay, 0) - params.zusAmount - params.pitAmount
  );

  return {
    totalIncomeGross,
    totalExpenseGross,
    operatingResult,
    vatDue,
    vatInput,
    vatAdjustment,
    vatToPay,
    zusAmount: params.zusAmount,
    pitAmount: params.pitAmount,
    netForecast,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
