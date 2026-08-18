import api from "@/api/api";
import type { MyQuote, OtherQuote } from "@/types/feed.type";

export interface GetQuotesResponse {
  myQuotes: MyQuote[];
  otherQuotes: OtherQuote[];
}

export interface QuoteFeedItem {
  quoteId: number;
  authorNickname: string;
  authorIntroduction?: string;
  content: string;
  taggedMembers?: string[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt?: string;
}

export interface GetQuotesFeedResponse {
  content: QuoteFeedItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
}

export interface CreateQuoteRequest {
  content: string;
  originalContent?: string | null;
  summary?: string | null;
  taggedMemberIds: number[];
  authorName?: string;
  authorBirthYear?: number | null;
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

export interface AiUsageResponse {
  usedCount: number;
  remainingCount: number;
  limitPerDay: number;
}

export type MyTagRequestStatus = "NONE" | "PENDING" | "ACCEPTED" | "REJECTED";

export interface MyTagRequestResponse {
  status: MyTagRequestStatus;
}

export interface QuoteTagRequest {
  requestId: number;
  requesterNickname: string;
  status: MyTagRequestStatus;
}

export interface BookmarkQuoteResponse {
  resultCode: string;
  message: string;
}

function createQuotePayload({
  content,
  originalContent,
  summary,
  taggedMemberIds,
}: CreateQuoteRequest) {
  return {
    content,
    originalContent,
    summary,
    taggedMemberIds,
  };
}

/**
 * 명언 관련 API 함수 분리
 */
export const quoteApi = {
  getQuotesByDate: (date: string, groupId?: number | string) =>
    api.get<GetQuotesResponse>("/api/quotes", { params: { date, groupId } }),
  getQuotesFeed: (date: string, groupId?: number | string) =>
    api.get<GetQuotesFeedResponse>("/api/quotes/feed", {
      params: { date, groupId },
    }),
  createQuote: (payload: CreateQuoteRequest) =>
    api.post("/api/quotes", createQuotePayload(payload)),
  updateTags: (quoteId: number, payload: UpdateQuoteTagsRequest) =>
    api.patch(`/api/quotes/${quoteId}/tags`, payload),
  requestTag: (quoteId: number) =>
    api.post(`/api/quotes/${quoteId}/tag-request`),
  getMyTagRequest: (quoteId: number) =>
    api.get<MyTagRequestResponse>(`/api/quotes/${quoteId}/my-tag-request`),
  getTagRequests: (quoteId: number) =>
    api.get<QuoteTagRequest[]>(`/api/quotes/${quoteId}/requests`),
  acceptTagRequest: (requestId: number) =>
    api.post(`/api/quotes/requests/${requestId}/accept`),
  rejectTagRequest: (requestId: number) =>
    api.post(`/api/quotes/requests/${requestId}/reject`),
  likeQuote: (quoteId: number) => api.post(`/api/quotes/${quoteId}/like`),
  unlikeQuote: (quoteId: number) => api.delete(`/api/quotes/${quoteId}/like`),
  bookmarkQuote: (quoteId: number) =>
    api.post<BookmarkQuoteResponse>(`/api/quotes/${quoteId}/bookmark`),
  unbookmarkQuote: (quoteId: number) =>
    api.delete(`/api/quotes/${quoteId}/bookmark`),
  summarizeQuote: (payload: SummarizeQuoteRequest) =>
    api.post<SummarizeQuoteResponse>("/api/quotes/summarize", payload),
  getAiUsage: () => api.get<AiUsageResponse>("/api/quotes/ai-usage"),
};
