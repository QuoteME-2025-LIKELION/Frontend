/**
 * Feed 타입 정의
 * @property {number} id - 피드 고유 ID
 * @property {string} content - 피드 내용
 * @property {string} createDate - 피드 생성 일자
 * @property {number} authorId - 피드 작성자 ID
 * @property {string} authorName - 피드 작성자 이름
 * @property {string} profileImageUrl - 피드 작성자 프로필 이미지 URL (선택)
 * @property {string} bio - 피드 작성자 소개
 * @property {Array<{ id: number; nickname: string }>} taggedUsers - 피드에 태그된 사용자 목록 (선택)
 * @property {boolean} isLiked - 피드에 좋아요를 눌렀는지 여부
 */
export interface Feed {
  id: number;
  content: string;
  createDate: string;
  authorId: number;
  authorName: string;
  profileImageUrl?: string;
  bio?: string;
  taggedUsers?: {
    id: number;
    nickname: string;
  }[];
  isLiked: boolean;
}
