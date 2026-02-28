"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getMonthsList, formatMonthLabel } from "@/lib/month-utils";

export default function MonthSelector({
  currentMonth,
  basePath,
}: {
  currentMonth: string;
  basePath: string;
}) {
  const router = useRouter();
  const months = getMonthsList(12);

  return (
    <select
      value={currentMonth}
      onChange={(e) => router.push(`${basePath}?month=${e.target.value}`)}
      className="!w-auto !px-3 !py-1.5 text-sm bg-bg-card"
    >
      {months.map((m) => (
        <option key={m} value={m}>
          {formatMonthLabel(m)}
        </option>
      ))}
    </select>
  );
}
