import { http, HttpResponse } from "msw";

import {
  searchableFriends,
  searchableGroups,
  mockFriendIds,
  createFriendListItem,
} from "../state";

export const settingsHandlers = [
  // ==========================================
  // 11. 검색 & 친구목록 (Settings)
  // ==========================================
  http.get("/api/settings/search", ({ request }) => {
    const url = new URL(request.url);
    const keyword = (url.searchParams.get("keyword") || "").trim();
    const isEmptyScenario = ["없음", "empty", "no-result"].includes(
      keyword.toLowerCase()
    );
    const matchedMembers = searchableFriends.filter((friend) =>
      friend.nickname.includes(keyword)
    );
    const matchedGroups = searchableGroups.filter((group) =>
      group.name.includes(keyword)
    );
    return HttpResponse.json({
      members: isEmptyScenario
        ? []
        : matchedMembers.length > 0
          ? matchedMembers
          : searchableFriends,
      groups: isEmptyScenario
        ? []
        : matchedGroups.length > 0
          ? matchedGroups
          : searchableGroups,
    });
  }),
  http.get("/api/settings/friends-list", () => {
    return HttpResponse.json(mockFriendIds.map(createFriendListItem));
  }),
];
