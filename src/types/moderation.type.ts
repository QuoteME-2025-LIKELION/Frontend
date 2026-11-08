export interface ModerationTarget {
  quoteId: number;
  nickname: string;
  introduction?: string;
  profileImage?: string;
}
export interface PreviewBlockedMember extends Omit<ModerationTarget, "quoteId"> {
  memberId: number;
}
