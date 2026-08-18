import { noticeApi, type NoticeType } from "@/api/noticeApi";
import { useQuery } from "@tanstack/react-query";

export const noticeQueryKeys = {
  all: ["notices"] as const,
  list: (type?: NoticeType) =>
    [...noticeQueryKeys.all, "list", type ?? "all"] as const,
  detail: (noticeId: number | string) =>
    [...noticeQueryKeys.all, "detail", String(noticeId)] as const,
};

/**
 * 공지사항 목록 조회
 */
export function useNoticesQuery(type?: NoticeType) {
  return useQuery({
    queryKey: noticeQueryKeys.list(type),
    queryFn: async () => {
      const res = await noticeApi.getNotices(type);
      return res.data;
    },
  });
}

/**
 * 공지사항 상세 조회
 */
export function useNoticeQuery(noticeId: number | string | undefined) {
  return useQuery({
    queryKey: noticeQueryKeys.detail(noticeId ?? ""),
    queryFn: async () => {
      const res = await noticeApi.getNotice(noticeId!);
      return res.data;
    },
    enabled: noticeId !== undefined,
  });
}
