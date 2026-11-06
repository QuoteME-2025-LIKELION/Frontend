export const GROUP_CAPACITY_MESSAGE = "최대 인원 5명이 가득 차 들어갈 수 없어요";
const DEFAULT_MESSAGE = "그룹 초대 수락에 실패했습니다.";

/** 실서버에서 확인한 HTTP 400 + 정원 초과 문구만 구분한다. */
export function getGroupInvitationErrorMessage(status: number | undefined, data: unknown): string {
  if (status !== 400 || typeof data !== "object" || data === null) return DEFAULT_MESSAGE;
  const body = data as { message?: unknown; msg?: unknown };
  const isCapacityError = [body.message, body.msg].some(
    (message) => typeof message === "string" &&
      message.replace(/^400-1\s*-\s*/, "").trim() === GROUP_CAPACITY_MESSAGE
  );
  return isCapacityError ? GROUP_CAPACITY_MESSAGE : DEFAULT_MESSAGE;
}
