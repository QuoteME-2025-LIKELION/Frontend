/**
 * ArchiveFeed 타입 정의
 * @property {number} id - 피드 고유 식별자
 * @property {string} content - 피드 내용
 * @property {string} originalContent - 피드 원본 내용 (선택)
 * @property {string} createDate - 피드 생성 일자
 * @property {string} authorName - 피드 작성자 이름
 * @property {number} authorBirthYear - 피드 작성자 출생 연도
 * @property {string[]} taggedMemberNames - 피드에 태그된 멤버 이름 목록 (선택)
 * @property {boolean} isBookmarked - 북마크 여부 (선택)
 * @property {boolean} isLiked - 좋아요 여부 (선택)
 */
export interface ArchiveFeed {
  id: number;
  quoteId?: number;
  content: string;
  originalContent?: string;
  createDate: string;
  createdAt?: string;
  authorName: string;
  authorNickname?: string;
  authorBirthYear: number;
  taggedMemberNames?: string[];
  taggedMembers?: string[];
  isBookmarked?: boolean;
  isLiked?: boolean;
}
