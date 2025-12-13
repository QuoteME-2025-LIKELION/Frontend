/**
 * ArchiveFeed 타입 정의
 * @property {number} id - 피드 고유 식별자
 * @property {string} content - 피드 내용
 * @property {string} originalContent - 피드 원본 내용 (선택)
 * @property {string} createDate - 피드 생성 일자
 * @property {string} authorName - 피드 작성자 이름
 * @property {string[]} taggedMemberNames - 피드에 태그된 멤버 이름 목록 (선택)
 */
export interface ArchiveFeed {
  id: number;
  content: string;
  originalContent?: string;
  createDate: string;
  authorName: string;
  taggedMemberNames?: string[];
}
