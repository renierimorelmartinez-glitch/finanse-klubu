export function getCurrentMonth(): string {
  // Use Intl to get Warsaw timezone date
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
  });
  // sv-SE gives "YYYY-MM" format
  return formatter.format(new Date());
}

export function dateToMonth(date: Date): string {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
  });
  return formatter.format(date);
}

export function formatMonthLabel(month: string): string {
  const [year, m] = month.split("-");
  const monthNames = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
  ];
  return `${monthNames[parseInt(m, 10) - 1]} ${year}`;
}

export function getMonthsList(count: number = 12): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${mo}`);
  }
  return months;
}
