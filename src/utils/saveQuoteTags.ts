import type { QuoteTagRequest } from "@/api/quoteApi";

/** 선택한 요청만 수락한 후 최종 태그 목록을 저장한다. */
export async function saveQuoteTags(
  selectedIds: number[],
  requests: QuoteTagRequest[],
  accept: (requestId: number) => Promise<unknown>,
  update: (memberIds: number[]) => Promise<unknown>
) {
  const selected = new Set(selectedIds);
  for (const request of requests) {
    if (selected.has(request.requesterId)) await accept(request.requestId);
  }
  await update([...selected]);
}
