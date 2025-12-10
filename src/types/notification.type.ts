export interface Notification {
  id: number;
  type: "POKE" | "LIKE" | "TAG" | "GROUP";
  message: string;
  targetId: number;
  senderName: string;
  createDate: string;
  isRead: boolean;
}
