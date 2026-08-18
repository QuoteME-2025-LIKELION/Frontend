import api from "@/api/api";
import type { ArchiveFeed } from "@/types/archiveFeed.type";

/**
 * 아카이브 관련 API 함수 분리
 */
export const archiveApi = {
  getArchivesByDate: (date: string) =>
    api.get<ArchiveFeed[]>("/api/archives", { params: { date } }),
  getMyArchives: () => api.get<ArchiveFeed[]>("/api/archives/me"),
  getLikedArchives: () => api.get<ArchiveFeed[]>("/api/archives/likes"),
  getBookmarkedArchives: () =>
    api.get<ArchiveFeed[]>("/api/archives/bookmarks"),
};
