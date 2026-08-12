import api from "@/api/api";
import type { Friend } from "@/types/friend.type";
import type { Group } from "@/types/group.type";

export interface SearchFriendsAndGroupsResponse {
  members: Friend[];
  groups: Group[];
}

/**
 * 친구/사용자 관련 API 함수 분리
 */
export const friendApi = {
  getFriends: () => api.get<Friend[]>("/api/settings/friends-list"),
  searchFriendsAndGroups: (keyword: string) =>
    api.get<SearchFriendsAndGroupsResponse>("/api/settings/search", {
      params: { keyword },
    }),
  addFriend: (userId: number) => api.post(`/api/friends/add/${userId}`),
  deleteFriend: (friendId: number) => api.delete(`/api/friends/${friendId}`),
  pokeFriend: (friendId: number) => api.post(`/api/pokes/${friendId}`),
};
