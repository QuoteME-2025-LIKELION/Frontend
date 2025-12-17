/**
 * API 명세서에 따라 내 명언과 다른 사람 명언으로 구분
 */

/**
 * 내 명언 타입
 * - content: 명언 내용
 * - groupName: 내가 속한 그룹 이름
 * - authorNickname: 명언 작성자 닉네임
 * - birthYear: 명언 작성자 출생 연도
 */
export interface MyQuote {
  content: string;
  groupName: string;
  authorNickname: string;
  birthYear: number;
  createDate?: string;
}

/**
 * 다른 사람 명언 타입
 * - id: 명언 고유 ID
 * - content: 명언 내용
 * - taggedNicknames: 명언에 태그된 닉네임 배열
 * - authorNickname: 명언 작성자 닉네임
 * - authorProfileImage: 명언 작성자 프로필 이미지 URL (선택적)
 * - authorIntroduction: 명언 작성자 소개글 (선택적)
 * - timeAgo: 명언 작성 시간 (예: "2시간 전")
 * - isLiked: 현재 사용자가 이 명언을 좋아요했는지 여부
 * - isFriendQuote: 작성자가 친구인지 여부
 */
export interface OtherQuote {
  id: number;
  content: string;
  taggedNicknames: string[];
  authorNickname: string;
  authorProfileImage?: string;
  authorIntroduction?: string;
  timeAgo: string;
  isLiked: boolean;
  isFriendQuote: boolean;
  createDate?: string;
}
