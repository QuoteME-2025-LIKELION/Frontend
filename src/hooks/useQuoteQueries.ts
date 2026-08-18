import {
  quoteApi,
  type CreateQuoteRequest,
  type UpdateQuoteTagsRequest,
} from "@/api/quoteApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const quoteQueryKeys = {
  all: ["quotes"] as const,
  byDate: (date: string, groupId?: number | string) =>
    [...quoteQueryKeys.all, "by-date", date, groupId ?? "all"] as const,
  feed: (date: string, groupId?: number | string) =>
    [...quoteQueryKeys.all, "feed", date, groupId ?? "all"] as const,
  summary: (content: string) =>
    [...quoteQueryKeys.all, "summary", content] as const,
  aiUsage: () => [...quoteQueryKeys.all, "ai-usage"] as const,
  myTagRequest: (quoteId: number) =>
    [...quoteQueryKeys.all, "tag-request", quoteId, "my"] as const,
  tagRequests: (quoteId: number) =>
    [...quoteQueryKeys.all, "tag-requests", quoteId] as const,
};

/**
 * 특정 날짜의 명언 목록 조회
 */
export function useQuotesByDateQuery(
  date: string | undefined,
  groupId?: number | string
) {
  return useQuery({
    queryKey: quoteQueryKeys.byDate(date ?? "", groupId),
    queryFn: async () => {
      const res = await quoteApi.getQuotesByDate(date!, groupId);
      return res.data;
    },
    enabled: date !== undefined,
  });
}

/**
 * 입력한 문장을 기반으로 추천 명언 문장 생성
 */
export function useQuoteSummaryQuery(content: string) {
  return useQuery({
    queryKey: quoteQueryKeys.summary(content),
    queryFn: async () => {
      const res = await quoteApi.summarizeQuote({ content });
      return res.data;
    },
    enabled: Boolean(content),
  });
}

/**
 * 페이지네이션 피드 명언 목록 조회
 */
export function useQuotesFeedQuery(
  date: string | undefined,
  groupId?: number | string
) {
  return useQuery({
    queryKey: quoteQueryKeys.feed(date ?? "", groupId),
    queryFn: async () => {
      const res = await quoteApi.getQuotesFeed(date!, groupId);
      return res.data;
    },
    enabled: date !== undefined,
  });
}

/**
 * AI 추천 명언 사용량 조회
 */
export function useAiUsageQuery() {
  return useQuery({
    queryKey: quoteQueryKeys.aiUsage(),
    queryFn: async () => {
      const res = await quoteApi.getAiUsage();
      return res.data;
    },
  });
}

/**
 * 명언 생성 후 명언 조회 캐시 갱신
 */
export function useCreateQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuoteRequest) => quoteApi.createQuote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.aiUsage() });
    },
  });
}

/**
 * 명언 태그 수정 후 명언 조회 캐시 갱신
 */
export function useUpdateQuoteTagsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quoteId,
      payload,
    }: {
      quoteId: number;
      payload: UpdateQuoteTagsRequest;
    }) => quoteApi.updateTags(quoteId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all });
    },
  });
}

/**
 * 태그 요청 후 명언 조회 캐시 갱신
 */
export function useRequestQuoteTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: number) => quoteApi.requestTag(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all });
    },
  });
}

/**
 * 내 태그 요청 상태 조회
 */
export function useMyQuoteTagRequestQuery(quoteId: number | undefined) {
  return useQuery({
    queryKey: quoteQueryKeys.myTagRequest(quoteId ?? 0),
    queryFn: async () => {
      const res = await quoteApi.getMyTagRequest(quoteId!);
      return res.data;
    },
    enabled: quoteId !== undefined,
  });
}

/**
 * 명언의 태그 요청 목록 조회
 */
export function useQuoteTagRequestsQuery(quoteId: number | undefined) {
  return useQuery({
    queryKey: quoteQueryKeys.tagRequests(quoteId ?? 0),
    queryFn: async () => {
      const res = await quoteApi.getTagRequests(quoteId!);
      return res.data;
    },
    enabled: quoteId !== undefined,
  });
}

/**
 * 태그 요청 수락 후 명언과 태그 요청 캐시 갱신
 */
export function useAcceptQuoteTagRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
    }: {
      quoteId: number;
      requestId: number;
    }) => quoteApi.acceptTagRequest(requestId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: quoteQueryKeys.tagRequests(variables.quoteId),
      });
    },
  });
}

/**
 * 태그 요청 거절 후 태그 요청 캐시 갱신
 */
export function useRejectQuoteTagRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
    }: {
      quoteId: number;
      requestId: number;
    }) => quoteApi.rejectTagRequest(requestId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: quoteQueryKeys.tagRequests(variables.quoteId),
      });
    },
  });
}

/**
 * 명언 좋아요 후 명언 조회 캐시 갱신
 */
export function useLikeQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: number) => quoteApi.likeQuote(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all });
    },
  });
}

/**
 * 명언 좋아요 취소 후 명언 조회 캐시 갱신
 */
export function useUnlikeQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: number) => quoteApi.unlikeQuote(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all });
    },
  });
}

/**
 * 명언 북마크 후 명언/아카이브 캐시 갱신
 */
export function useBookmarkQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: number) => quoteApi.bookmarkQuote(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["archives"] });
    },
  });
}

/**
 * 명언 북마크 취소 후 명언/아카이브 캐시 갱신
 */
export function useUnbookmarkQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: number) => quoteApi.unbookmarkQuote(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["archives"] });
    },
  });
}
