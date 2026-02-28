import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { calculateNet, calculateVat } from "@/lib/calculations";
import { dateToMonth } from "@/lib/month-utils";
import { transactionSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const type = searchParams.get("type");
  const categoryId = searchParams.get("categoryId");

  const where: Record<string, unknown> = {};
  if (month) where.month = month;
  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;

  const transactions = await prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { occurredAt: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = transactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { type, categoryId, grossAmount, vatRate, occurredAt, note } = parsed.data;
  const occurDate = new Date(occurredAt);
  const month = dateToMonth(occurDate);

  // Check if month is closed
  const monthParams = await prisma.monthParams.findUnique({ where: { month } });
  if (monthParams?.status === "CLOSED") {
    return NextResponse.json(
      { error: "Miesiąc jest zamknięty. Nie można dodawać transakcji." },
      { status: 403 }
    );
  }

  const netAmount = calculateNet(grossAmount, vatRate);
  const vatAmount = calculateVat(grossAmount, vatRate);

  const transaction = await prisma.transaction.create({
    data: {
      type,
      categoryId,
      grossAmount,
      vatRate,
      netAmount,
      vatAmount,
      occurredAt: occurDate,
      month,
      note: note || null,
    },
    include: { category: true },
  });

  return NextResponse.json(transaction, { status: 201 });
}
