import { archiveApi } from "@/api/archiveApi";
import { useQuery } from "@tanstack/react-query";

export const archiveQueryKeys = {
  all: ["archives"] as const,
  myQuotes: () => [...archiveQueryKeys.all, "my-quotes"] as const,
  likes: () => [...archiveQueryKeys.all, "likes"] as const,
  bookmarks: () => [...archiveQueryKeys.all, "bookmarks"] as const,
  byDate: (date: string) => [...archiveQueryKeys.all, "date", date] as const,
};

/**
 * 내가 작성한 아카이브 명언 목록 조회
 */
export function useMyArchivesQuery() {
  return useQuery({
    queryKey: archiveQueryKeys.myQuotes(),
    queryFn: async () => {
      const res = await archiveApi.getMyArchives();
      return res.data;
    },
  });
}

/**
 * 좋아요한 아카이브 명언 목록 조회
 */
export function useLikedArchivesQuery() {
  return useQuery({
    queryKey: archiveQueryKeys.likes(),
    queryFn: async () => {
      const res = await archiveApi.getLikedArchives();
      return res.data;
    },
  });
}

/**
 * 북마크한 아카이브 명언 목록 조회
 */
export function useBookmarkedArchivesQuery() {
  return useQuery({
    queryKey: archiveQueryKeys.bookmarks(),
    queryFn: async () => {
      const res = await archiveApi.getBookmarkedArchives();
      return res.data;
    },
  });
}

/**
 * 선택한 날짜의 아카이브 명언 목록 조회
 */
export function useArchivesByDateQuery(date: string | null) {
  return useQuery({
    queryKey: archiveQueryKeys.byDate(date || ""),
    queryFn: async () => {
      const res = await archiveApi.getArchivesByDate(date!);
      return res.data;
    },
    enabled: Boolean(date),
  });
}
