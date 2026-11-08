import { create } from "zustand";

import { PREVIEW_AUTHOR_IDS } from "@/data/mock/moderation";
import type { Friend } from "@/types/friend.type";
import type { ModerationTarget, PreviewBlockedMember } from "@/types/moderation.type";

export const isModerationPreview =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === "true";

export const EMPTY_BLOCKED_MEMBERS: PreviewBlockedMember[] = [];

interface ModerationPreviewState {
  blockedBySession: Record<number, PreviewBlockedMember[]>;
  block: (session: number, target: ModerationTarget) => boolean;
  blockMember: (session: number, member: Friend) => boolean;
  unblock: (session: number, memberId: number) => void;
}
export const useModerationPreviewStore = create<ModerationPreviewState>((set, get) => ({
  blockedBySession: {},
  block: (session, target) => {
    const memberId = PREVIEW_AUTHOR_IDS[target.quoteId];
    if (!isModerationPreview || memberId === undefined) return false;
    return get().blockMember(session, { ...target, id: memberId });
  },
  blockMember: (session, member) => {
    if (!isModerationPreview) return false;
    const memberId = member.id;
    set((state) => {
      const current = state.blockedBySession[session] ?? [];
      if (current.some((member) => member.memberId === memberId)) return state;
      return { blockedBySession: {
        ...state.blockedBySession,
        [session]: [...current, { memberId, nickname: member.nickname, introduction: member.introduction, profileImage: member.profileImage }],
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
