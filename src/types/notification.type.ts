/**
 * 알림 타입 정의
 * @property {number} id - 알림 고유 ID
 * @property {"POKE" | "LIKE" | "TAG" | "GROUP"} type - 알림 유형
 * @property {string} message - 알림 메시지
 * @property {number} targetId - 알림 대상 ID
 * - POKE: 찌른 사람의 Member ID
 * - GROUP: Group ID
 * - TAG: 태그 요청하는 Quote ID
 * - LIKE: 삭제 요청 예정
 * @property {string} senderName - 알림 발신자 이름
 * @property {string} createDate - 알림 생성 일자
 * @property {boolean} isRead - 알림 읽음 여부
 */
export interface Notification {
  id: number;
  type: "POKE" | "LIKE" | "TAG" | "GROUP";
  message: string;
  targetId: number;
  senderName: string;
  createDate: string;
  isRead: boolean;
}
