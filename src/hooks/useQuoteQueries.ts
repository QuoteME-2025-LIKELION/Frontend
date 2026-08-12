import {
  quoteApi,
  type CreateQuoteRequest,
  type UpdateQuoteTagsRequest,
} from "@/api/quoteApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const quoteQueryKeys = {
  all: ["quotes"] as const,
  byDate: (date: string) => [...quoteQueryKeys.all, "by-date", date] as const,
};

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
