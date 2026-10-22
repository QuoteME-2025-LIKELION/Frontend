export function getNotificationQuoteDate(quoteDate: string | null | undefined) {
  const date = quoteDate;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    return null;
  }

  return date;
}

export function getNotificationFeedPath(quoteDate: string | null | undefined) {
  const date = getNotificationQuoteDate(quoteDate);
  return date ? `/home/${date}` : "/home";
}
