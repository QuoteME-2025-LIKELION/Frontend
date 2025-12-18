/**
 * 그룹 정보 타입
 * @property {number} id - 그룹 고유 ID
 * @property {string} motto - 그룹 소개 메시지 (선택)
 * @property {string} name - 그룹 이름 (선택)
 * @property {number} memberCount - 그룹 멤버 수 (선택)
 * @property {Array} members - 그룹 멤버 정보 배열 (선택) - 각 멤버는 id, nickname, profileImage, introduction 속성을 가짐 (Friend 타입과 유사)
 * @property {number} totalQuoteCount - 그룹 내 명언 총 개수 (선택)
 * @property {string} createdAt - 그룹 생성 날짜 (선택)
 * @property {string} leaderNickname - 그룹 리더 닉네임 (선택)
 */
export interface Group {
  id: number;
  // leaderNickname: string;
  motto?: string;
  name?: string;
  memberCount?: number;
  members?:
    | [
        {
          id: number;
          nickname: string;
          profileImage: string;
          introduction: string;
        },
      ]
    | [];
  totalQuoteCount?: number;
  createdAt?: string;
  leaderNickname?: string;
}
