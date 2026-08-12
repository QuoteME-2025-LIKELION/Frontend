import api from "@/api/api";
import type { Group } from "@/types/group.type";

export interface CreateGroupRequest {
  name: string;
  motto: string;
}

export interface CreateGroupResponse extends Group {
  id: number;
}

export interface UpdateGroupMottoRequest {
  motto: string;
}

/**
 * 그룹 관련 API 함수 분리
 */
export const groupApi = {
  getMyGroups: () => api.get<Group[]>("/api/groups/me"),
  getGroup: (groupId: number | string) =>
    api.get<Group>(`/api/groups/${groupId}`),
  createGroup: (payload: CreateGroupRequest) =>
    api.post<CreateGroupResponse>("/api/groups", payload),
  inviteMember: (groupId: number | string, friendId: number) =>
    api.post(`/api/groups/${groupId}/invite/${friendId}`),
  requestJoin: (groupId: number | string) =>
    api.post(`/api/groups/${groupId}/join-request`),
  updateMotto: (groupId: number | string, payload: UpdateGroupMottoRequest) =>
    api.patch(`/api/groups/${groupId}/motto`, payload),
  removeMember: (groupId: number | string, memberId: number) =>
    api.delete(`/api/groups/${groupId}/members/${memberId}`),
  deleteGroup: (groupId: number | string) =>
    api.delete(`/api/groups/${groupId}`),
};
