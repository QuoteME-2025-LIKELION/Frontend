import type { MyQuote } from "@/types/feed.type";

/** 오래된 작성 알림도 클릭한 오늘을 기준으로 기존 작성/태그 수정 경로에 연결한다. */
export function getWritingNotificationDestination(
  quotes: MyQuote[],
  today: string
) {
  if (!Array.isArray(quotes)) throw new Error("Invalid myQuotes response");

  const writtenQuote = quotes.find(
    (quote) =>
      typeof quote.content === "string" && quote.content.trim().length > 0
  );

  return writtenQuote
    ? {
        path: "/fix",
        state: {
          returnTo: "/notification",
          date: today,
          quoteId: writtenQuote.id,
        },
      }
    : { path: "/write", state: { returnTo: "/notification" } };
}
