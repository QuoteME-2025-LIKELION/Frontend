import type { QuoteTagRequest } from "@/api/quoteApi";
import type { QuoteTag } from "@/types/feed.type";
import type { Friend } from "@/types/friend.type";

export function getTagCandidates(
  friends: Friend[],
  tags: QuoteTag[],
  selfId?: number,
  requests: QuoteTagRequest[] = []
): Friend[] {
  const candidates = new Map(friends.map((friend) => [friend.id, friend]));
  for (const tag of tags) {
    candidates.set(tag.memberId, {
      ...candidates.get(tag.memberId),
      id: tag.memberId,
      nickname: tag.nickname,
      profileImage: tag.profileImage ?? undefined,
    });
  }
  for (const request of requests) {
    if (!candidates.has(request.requesterId)) {
      candidates.set(request.requesterId, {
        id: request.requesterId, nickname: request.requesterName,
      });
    }
  }
  const requesterIds = new Set(requests.map((request) => request.requesterId));
  return [...candidates.values()]
    .sort((a, b) => Number(requesterIds.has(b.id)) - Number(requesterIds.has(a.id)))
    .filter((member) => member.id !== selfId);
}

export function hasInvalidTagSelection(
  selectedIds: number[], friends: Friend[], tags: QuoteTag[], selfId: number
) {
  const allowed = new Set(getTagCandidates(friends, tags, selfId).map((member) => member.id));
  return selectedIds.some((id) => !allowed.has(id));
}
