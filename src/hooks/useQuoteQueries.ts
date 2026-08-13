import {
  quoteApi,
  type CreateQuoteRequest,
  type UpdateQuoteTagsRequest,
} from "@/api/quoteApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const quoteQueryKeys = {
  all: ["quotes"] as const,
  byDate: (date: string) => [...quoteQueryKeys.all, "by-date", date] as const,
  summary: (content: string) =>
    [...quoteQueryKeys.all, "summary", content] as const,
};

/**
 * 특정 날짜의 명언 목록 조회
 */
export function useQuotesByDateQuery(date: string | undefined) {
  return useQuery({
    queryKey: quoteQueryKeys.byDate(date ?? ""),
    queryFn: async () => {
      const res = await quoteApi.getQuotesByDate(date!);
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
 * 명언 생성 후 명언 조회 캐시 갱신
 */
export function useCreateQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuoteRequest) => quoteApi.createQuote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all });
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
