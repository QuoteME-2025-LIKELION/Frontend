/**
 * 친구(유저) 타입 정의
 * @property {number} id - 친구 고유 ID
 * @property {string} email - 친구 이메일 (선택)
 * @property {string} nickname - 친구 닉네임
 * @property {string} profileImage - 친구 프로필 이미지 URL (선택) - 없으면 회색 바탕을 기본으로 사용하도록 수정 예정
 * @property {string} introduction - 친구 소개글 (선택)
 * @property {boolean} groupMember - 친구가 그룹 멤버인지 여부 (선택)
 */
export interface Friend {
  id: number;
  email?: string;
  nickname: string;
  profileImage?: string;
  introduction?: string;
  groupMember?: boolean;
}
