export function getOAuthFailureMessage(reason: string | null) {
  switch (reason) {
    case "account_not_found": return "가입된 계정이 없어요.";
    case "email_not_verified": return "소셜 계정의 이메일 인증이 필요해요.";
    case "already_linked": return "이미 연동된 계정이에요.";
    case "provider_already_linked": return "이미 연동된 계정이에요.";
    default: return "소셜 로그인에 실패했어요.";
  }
}

export function resolveOAuthCallback(params: URLSearchParams) {
  const linked = params.get("linked");
  if (linked === "google" || linked === "kakao") {
    return { path: "/account-setting", linked: true, message: "계정이 연동되었습니다." };
  }
  const reason = params.get("reason");
  if (reason) {
    return {
      path: reason === "already_linked" || reason === "provider_already_linked" ? "/account-setting" : "/",
      message: getOAuthFailureMessage(reason),
    };
  }
  const token = params.get("accessToken");
  if (!token?.trim()) return { path: "/", message: getOAuthFailureMessage(null) };
  // 완료 상태는 보호 라우트의 GET /api/profile로 확인한다.
  return { path: "/home", token };
}
