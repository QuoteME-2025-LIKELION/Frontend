import type { AiUsageApiResponse, AiUsageResponse } from "@/api/quoteApi";

export type AiRequestState =
  | "loading"
  | "unavailable"
  | "exhausted"
  | "available";

/**
 * 서버의 정식 필드와 별칭 필드를 화면에서 사용하는 사용량 형식으로 통일한다.
 * 누락되거나 잘못된 수치를 0으로 대체하면 소진 상태로 오인할 수 있어 오류로 처리한다.
 * @throws 수치가 음이 아닌 정수가 아니거나 남은 횟수가 일일 한도를 초과한 경우
 */
export function normalizeAiUsage(data: AiUsageApiResponse): AiUsageResponse {
  const usedCount = data.usedCount ?? data.used;
  const remainingCount = data.remainingCount ?? data.remaining;
  const limitPerDay = data.limitPerDay ?? data.limit;
  // 횟수로 사용할 수 있는 숫자인지 검사하고, 통과한 값의 타입을 number로 좁힌다.
  const isCount = (value: unknown): value is number =>
    typeof value === "number" && Number.isInteger(value) && value >= 0;
  if (
    !isCount(usedCount) ||
    !isCount(remainingCount) ||
    !isCount(limitPerDay) ||
    remainingCount > limitPerDay
  ) {
    throw new Error("Invalid AI usage response");
  }
  return { usedCount, remainingCount, limitPerDay };
}

/**
 * 검증된 사용량과 조회 상태를 AI 요청 버튼의 상태로 변환한다.
 * 재조회 중에는 기존 데이터가 있어도 loading, 조회 실패·데이터 없음은 unavailable로 구분한다.
 * 조회가 끝난 유효한 사용량의 남은 횟수가 0일 때만 exhausted를 반환한다.
 */
export function getAiRequestState(
  usage: AiUsageResponse | undefined,
  isFetching: boolean,
  isError: boolean
): AiRequestState {
  if (isFetching) return "loading";
  if (isError || !usage) return "unavailable";
  return usage.remainingCount > 0 ? "available" : "exhausted";
}
