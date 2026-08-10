/**
 * API 명세서에 따라 내 명언과 다른 사람 명언으로 구분
 */

/**
 * 내 명언 타입
 * @property {string} content: 명언 내용
 * @property {string} groupName: 내가 속한 그룹 이름
 * @property {string} authorNickname: 명언 작성자 닉네임
 * @property {number} birthYear: 명언 작성자 출생 연도
 * @property {string} createDate: 명언 작성 날짜 (선택적)
 * @property {string[]} taggedNicknames: 명언에 태그된 닉네임 배열 (선택적)
 */
export interface MyQuote {
  id?: number;
  content: string;
  groupName: string;
  authorNickname: string;
  birthYear: number;
  createDate?: string;
  taggedNicknames?: string[];
}

/**
 * 다른 사람 명언 타입
 * @property {number} id: 명언 고유 ID
 * @property {string} content: 명언 내용
 * @property {string[]} taggedNicknames: 명언에 태그된 닉네임 배열
 * @property {string} authorNickname: 명언 작성자 닉네임
 * @property {string} [authorProfileImage]: 명언 작성자 프로필 이미지 URL (선택적)
 * @property {string} [authorIntroduction]: 명언 작성자 소개글 (선택적)
 * @property {string} timeAgo: 명언 작성 시간 (예: "2시간 전")
 * @property {boolean} isLiked: 현재 사용자가 이 명언을 좋아요했는지 여부
 * @property {boolean} isFriendQuote: 작성자가 친구인지 여부
 * @property {string} createDate: 명언 작성 날짜 (선택적)
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
