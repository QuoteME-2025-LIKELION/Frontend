import { create } from "zustand";

export const isModerationPreview =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === "true";

// 화면 시안의 임시 사유 코드. 실제 신고 API 계약이 정해지면 교체한다.
export const REPORT_REASONS = [
  { id: "abuse", label: "욕설이나 비하하는 표현이 있어요" },
  { id: "harassment", label: "특정 사람을 저격하거나 괴롭혀요" },
  { id: "sexual", label: "성적인 내용이 있어요" },
  { id: "privacy", label: "개인정보가 드러나 있어요" },
  { id: "danger", label: "자해나 위험한 행동이 걱정돼요" },
  { id: "ai", label: "AI가 만든 문장이 이상해요" },
  { id: "spam", label: "스팸이나 광고에요" },
  { id: "other", label: "기타" },
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number]["id"];

export interface ModerationTarget {
  quoteId: number;
  nickname: string;
  introduction?: string;
  profileImage?: string;
}
export interface PreviewBlockedMember extends ModerationTarget {
  memberId: number;
}
// 기존 MSW 피드 fixture의 명시적 매핑이다. 실제 응답의 이름으로 회원을 추측하지 않는다.
const PREVIEW_AUTHOR_IDS: Record<number, number> = { 2: 2, 3: 6, 4: 3, 5: 4 };
export const EMPTY_BLOCKED_MEMBERS: PreviewBlockedMember[] = [];

interface ModerationPreviewState {
  blockedBySession: Record<number, PreviewBlockedMember[]>;
  block: (session: number, target: ModerationTarget) => boolean;
  unblock: (session: number, memberId: number) => void;
}
export const useModerationPreviewStore = create<ModerationPreviewState>((set) => ({
  blockedBySession: {},
  block: (session, target) => {
    const memberId = PREVIEW_AUTHOR_IDS[target.quoteId];
    if (!isModerationPreview || memberId === undefined) return false;
    set((state) => {
      const current = state.blockedBySession[session] ?? [];
      if (current.some((member) => member.memberId === memberId)) return state;
      return { blockedBySession: {
        ...state.blockedBySession,
        [session]: [...current, { ...target, memberId }],
      } };
    });
    return true;
  },
  unblock: (session, memberId) => {
    if (!isModerationPreview) return;
    set((state) => ({ blockedBySession: {
      ...state.blockedBySession,
      [session]: (state.blockedBySession[session] ?? []).filter((member) => member.memberId !== memberId),
    } }));
  },
}));
