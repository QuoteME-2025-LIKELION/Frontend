/** JWT exp는 검증용이 아니라 서버 재확인 시점을 정하는 데만 사용한다. */
export function getAccessTokenExpiry(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(normalized)) as { exp?: unknown };
    return typeof exp === "number" && Number.isFinite(exp) && exp > 0
      ? exp * 1000 : null;
  } catch {
    return null;
  }
}

export function getSessionCheckDelay(expiresAt: number | null, now = Date.now()) {
  // 만료 직후 서버에 확인한다. exp를 읽을 수 없는 토큰도 주기적으로 확인한다.
  return expiresAt === null ? 60_000 : Math.max(1_000, Math.min(expiresAt - now + 1_000, 60_000));
}
