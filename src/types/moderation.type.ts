export interface ModerationTarget {
  isAiGenerated?: boolean;
  quoteId: number;
  nickname: string;
  introduction?: string;
  profileImage?: string;
}
export interface PreviewBlockedMember extends Omit<ModerationTarget, "quoteId"> {
  memberId: number;
}
