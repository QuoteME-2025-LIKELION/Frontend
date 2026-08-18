import api from "@/api/api";
import type { Friend } from "@/types/friend.type";
import type { Group } from "@/types/group.type";

export interface SearchFriendsAndGroupsResponse {
  members: Friend[];
  groups: Group[];
}

export interface FriendRequest {
  requestId: number;
  requesterId: number;
  requesterNickname: string;
  requesterProfileImageUrl?: string;
  createdAt: string;
}

export interface PokeStatisticsResponse {
  receivedCount: number;
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
  requestFriend: (targetId: number) =>
    api.post(`/api/friends/request/${targetId}`),
  getFriendRequests: () => api.get<FriendRequest[]>("/api/friends/requests"),
  acceptFriendRequest: (requestId: number) =>
    api.post(`/api/friends/requests/${requestId}/accept`),
  rejectFriendRequest: (requestId: number) =>
    api.post(`/api/friends/requests/${requestId}/reject`),
  deleteFriend: (friendId: number) => api.delete(`/api/friends/${friendId}`),
  pokeFriend: (friendId: number) => api.post(`/api/pokes/${friendId}`),
  getPokeStatistics: () =>
    api.get<PokeStatisticsResponse>("/api/pokes/statistics"),
};
