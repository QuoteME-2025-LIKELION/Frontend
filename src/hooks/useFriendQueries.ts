import { friendApi } from "@/api/friendApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const friendQueryKeys = {
  all: ["friends"] as const,
  list: () => [...friendQueryKeys.all, "list"] as const,
  search: (keyword: string) =>
    [...friendQueryKeys.all, "search", keyword] as const,
};

/**
 * 내 친구 목록 조회
 */
export function useFriendsQuery(enabled = true) {
  return useQuery({
    queryKey: friendQueryKeys.list(),
    queryFn: async () => {
      const res = await friendApi.getFriends();
      return res.data;
    },
    enabled,
  });
}

/**
 * 친구/그룹 검색 결과 조회
 */
export function useFriendSearchQuery(keyword: string, enabled = true) {
  return useQuery({
    queryKey: friendQueryKeys.search(keyword),
    queryFn: async () => {
      const res = await friendApi.searchFriendsAndGroups(keyword);
      return res.data;
    },
    enabled,
  });
}

/**
 * 친구 추가 후 친구 관련 캐시 갱신
 */
export function useAddFriendMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => friendApi.addFriend(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.all });
    },
  });
}

/**
 * 친구 삭제 후 친구 관련 캐시 갱신
 */
export function useDeleteFriendMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: number) => friendApi.deleteFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.all });
    },
  });
}

/**
 * 친구 콕 찌르기 요청
 */
export function usePokeFriendMutation() {
  return useMutation({
    mutationFn: (friendId: number) => friendApi.pokeFriend(friendId),
  });
}
