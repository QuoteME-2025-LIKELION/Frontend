import { groupApi } from "@/api/groupApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const groupQueryKeys = {
  all: ["groups"] as const,
  myGroups: () => [...groupQueryKeys.all, "my-groups"] as const,
};

/**
 * 내가 참여 중인 그룹 목록 조회
 */
export function useMyGroupsQuery() {
  return useQuery({
    queryKey: groupQueryKeys.myGroups(),
    queryFn: async () => {
      const res = await groupApi.getMyGroups();
      return res.data;
    },
  });
}

/**
 * 그룹 멤버 제거 후 내 그룹 목록 캐시 갱신
 */
export function useRemoveGroupMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      memberId,
    }: {
      groupId: number | string;
      memberId: number;
    }) => groupApi.removeMember(groupId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.myGroups() });
    },
  });
}
