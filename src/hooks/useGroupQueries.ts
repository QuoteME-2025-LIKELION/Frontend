import { groupApi } from "@/api/groupApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const groupQueryKeys = {
  all: ["groups"] as const,
  myGroups: () => [...groupQueryKeys.all, "my-groups"] as const,
  detail: (groupId: number | string) =>
    [...groupQueryKeys.all, "detail", String(groupId)] as const,
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
 * 그룹 생성 후 내 그룹 목록 캐시 갱신
 */
export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      motto,
    }: {
      name: string;
      motto: string;
    }) => groupApi.createGroup({ name, motto }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.myGroups() });
    },
  });
}

/**
 * 그룹 상세 정보 조회
 */
export function useGroupQuery(groupId: number | string | undefined) {
  return useQuery({
    queryKey: groupQueryKeys.detail(groupId ?? ""),
    queryFn: async () => {
      const res = await groupApi.getGroup(groupId!);
      return res.data;
    },
    enabled: groupId !== undefined,
  });
}

/**
 * 그룹 멤버 제거 후 그룹 관련 캐시 갱신
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.myGroups() });
      queryClient.invalidateQueries({
        queryKey: groupQueryKeys.detail(variables.groupId),
      });
    },
  });
}

/**
 * 그룹 메시지 변경 후 그룹 상세 캐시 갱신
 */
export function useUpdateGroupMottoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      motto,
    }: {
      groupId: number | string;
      motto: string;
    }) => groupApi.updateMotto(groupId, { motto }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupQueryKeys.detail(variables.groupId),
      });
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.myGroups() });
    },
  });
}

/**
 * 그룹원 초대 후 그룹 관련 캐시 갱신
 */
export function useInviteGroupMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      friendId,
    }: {
      groupId: number | string;
      friendId: number;
    }) => groupApi.inviteMember(groupId, friendId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupQueryKeys.detail(variables.groupId),
      });
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.myGroups() });
    },
  });
}

/**
 * 그룹 참여 요청 전송 후 그룹 관련 캐시 갱신
 */
export function useRequestJoinGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number | string) => groupApi.requestJoin(groupId),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({
        queryKey: groupQueryKeys.detail(groupId),
      });
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.myGroups() });
    },
  });
}

/**
 * 그룹 삭제 후 내 그룹 목록 캐시 갱신
 */
export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number | string) => groupApi.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.myGroups() });
    },
  });
}
