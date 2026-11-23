import axios from "axios";

export const GROUP_JOIN_REQUEST_PENDING_MESSAGE =
  "이미 가입 요청 중인 그룹입니다.";

export function getGroupJoinRequestErrorMessage(error: unknown) {
  if (
    axios.isAxiosError<{ resultCode?: string; message?: string }>(error) &&
    error.response?.status === 400 &&
    (error.response.data?.resultCode === "400-4" ||
      (typeof error.response.data?.message === "string" &&
        error.response.data.message.startsWith("400-4 - ")))
  ) {
    return GROUP_JOIN_REQUEST_PENDING_MESSAGE;
  }

  return "그룹 가입 요청에 실패했습니다.";
}
