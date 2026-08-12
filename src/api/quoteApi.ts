import api from "@/api/api";
import type { MyQuote, OtherQuote } from "@/types/feed.type";

export interface GetQuotesResponse {
  myQuotes: MyQuote[];
  otherQuotes: OtherQuote[];
}

export interface CreateQuoteRequest {
  content: string;
  authorName: string;
  authorBirthYear?: number | null;
  taggedMemberIds: number[];
}

export interface UpdateQuoteTagsRequest {
  taggedMemberIds: number[];
}

export interface SummarizeQuoteRequest {
  content: string;
}

export interface SummarizeQuoteResponse {
  summary: string;
}

/**
 * 명언 관련 API 함수 분리
 */
export const quoteApi = {
  getQuotesByDate: (date: string) =>
    api.get<GetQuotesResponse>("/api/quotes", { params: { date } }),
  createQuote: (payload: CreateQuoteRequest) =>
    api.post("/api/quotes", payload),
  updateTags: (quoteId: number, payload: UpdateQuoteTagsRequest) =>
    api.patch(`/api/quotes/${quoteId}/tags`, payload),
  requestTag: (quoteId: number) =>
    api.post(`/api/quotes/${quoteId}/tag-request`),
  likeQuote: (quoteId: number) => api.post(`/api/quotes/${quoteId}/like`),
  unlikeQuote: (quoteId: number) => api.delete(`/api/quotes/${quoteId}/like`),
  summarizeQuote: (payload: SummarizeQuoteRequest) =>
    api.post<SummarizeQuoteResponse>("/api/quotes/summarize", payload),
};
