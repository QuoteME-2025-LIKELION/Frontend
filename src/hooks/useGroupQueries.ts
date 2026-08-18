import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { groupApi } from "@/api/groupApi";

export const groupQueryKeys = {
  all: ["groups"] as const,
  myGroups: () => [...groupQueryKeys.all, "my-groups"] as const,
  invitations: () => [...groupQueryKeys.all, "invitations"] as const,
  detail: (groupId: number | string) =>
    [...groupQueryKeys.all, "detail", String(groupId)] as const,
  joinRequests: (groupId: number | string) =>
    [...groupQueryKeys.detail(groupId), "join-requests"] as const,
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
 * 내게 온 그룹 초대 목록 조회
 */
export function useGroupInvitationsQuery(enabled = true) {
  return useQuery({
    queryKey: groupQueryKeys.invitations(),
    queryFn: async () => {
      const res = await groupApi.getInvitations();
      return res.data;
    },
    enabled,
  });
}

/**
 * 그룹 초대 수락 후 내 그룹과 초대 목록 캐시 갱신
 */
export function useAcceptGroupInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => groupApi.acceptInvitation(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.myGroups() });
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.invitations() });
    },
  });
}

/**
 * 그룹 초대 거절 후 초대 목록 캐시 갱신
 */
export function useRejectGroupInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => groupApi.rejectInvitation(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupQueryKeys.invitations() });
    },
  });
}

/**
 * 그룹 가입 요청 목록 조회
 */
export function useGroupJoinRequestsQuery(
  groupId: number | string | undefined
) {
  return useQuery({
    queryKey: groupQueryKeys.joinRequests(groupId ?? ""),
    queryFn: async () => {
      const res = await groupApi.getJoinRequests(groupId!);
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
 * 그룹 가입 요청 수락 후 그룹 상세와 가입 요청 목록 캐시 갱신
 */
export function useAcceptGroupJoinRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      groupId: number | string;
      requestId: number;
    }) => groupApi.acceptJoinRequest(variables.requestId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupQueryKeys.detail(variables.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: groupQueryKeys.joinRequests(variables.groupId),
      });
    },
  });
}

/**
 * 그룹 가입 요청 거절 후 가입 요청 목록 캐시 갱신
 */
export function useRejectGroupJoinRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      groupId: number | string;
      requestId: number;
    }) => groupApi.rejectJoinRequest(variables.requestId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupQueryKeys.joinRequests(variables.groupId),
      });
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
