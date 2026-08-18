import { friendApi } from "@/api/friendApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const friendQueryKeys = {
  all: ["friends"] as const,
  list: () => [...friendQueryKeys.all, "list"] as const,
  requests: () => [...friendQueryKeys.all, "requests"] as const,
  pokeStatistics: () => [...friendQueryKeys.all, "poke-statistics"] as const,
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
 * 받은 친구 요청 목록 조회
 */
export function useFriendRequestsQuery(enabled = true) {
  return useQuery({
    queryKey: friendQueryKeys.requests(),
    queryFn: async () => {
      const res = await friendApi.getFriendRequests();
      return res.data;
    },
    enabled,
  });
}

/**
 * 받은 콕 찌르기 횟수 조회
 */
export function usePokeStatisticsQuery() {
  return useQuery({
    queryKey: friendQueryKeys.pokeStatistics(),
    queryFn: async () => {
      const res = await friendApi.getPokeStatistics();
      return res.data;
    },
  });
}

/**
 * 친구 요청 전송 후 친구 관련 캐시 갱신
 */
export function useRequestFriendMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetId: number) => friendApi.requestFriend(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.all });
    },
  });
}

/**
 * @deprecated 친구 즉시 추가 플로우 제거 예정. 새 코드에서는 useRequestFriendMutation 사용.
 */
export const useAddFriendMutation = useRequestFriendMutation;

/**
 * 친구 요청 수락 후 친구 목록과 요청 목록 캐시 갱신
 */
export function useAcceptFriendRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => friendApi.acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.requests() });
    },
  });
}

/**
 * 친구 요청 거절 후 요청 목록 캐시 갱신
 */
export function useRejectFriendRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => friendApi.rejectFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendQueryKeys.requests() });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: number) => friendApi.pokeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendQueryKeys.pokeStatistics(),
      });
    },
  });
}
