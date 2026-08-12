import {
  quoteApi,
  type CreateQuoteRequest,
  type UpdateQuoteTagsRequest,
} from "@/api/quoteApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const quoteQueryKeys = {
  all: ["quotes"] as const,
  byDate: (date: string) => [...quoteQueryKeys.all, "by-date", date] as const,
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
