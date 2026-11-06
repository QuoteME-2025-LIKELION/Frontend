import api from "@/api/api";

export type NoticeType = "IMPORTANT" | "UPDATE" | "NOTICE" | "EVENT";

export interface NoticeSummary {
  id: number;
  type: NoticeType;
  title: string;
  content?: string;
  createDate: string;
  important: boolean;
}

export interface NoticeDetail extends NoticeSummary {
  content: string;
}

/**
 * 공지사항 관련 API 함수 분리
 */
export const noticeApi = {
  getNotices: (type?: NoticeType) =>
    api.get<NoticeSummary[]>("/api/notices", { params: { type } }),
  getNotice: (id: number | string) =>
    api.get<NoticeDetail>(`/api/notices/${id}`),
};
