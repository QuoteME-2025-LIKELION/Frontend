/**
 * Feed 타입 정의
 * @property {number} id - 피드 고유 ID
 * @property {string} content - 피드 내용
 * @property {string} createDate - 피드 생성 일자
 * @property {number} authorId - 피드 작성자 ID
 * @property {Array<{ id: number; nickname: string }>} taggedUsers - 피드에 태그된 사용자 목록 (선택)
 */
export interface Feed {
  id: number;
  content: string;
  createDate: string;
  authorId: number;
  taggedUsers?: {
    id: number;
    nickname: string;
  }[];
}
