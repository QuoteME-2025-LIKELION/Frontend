export function getOAuthFailureMessage(reason: string | null) {
  switch (reason) {
    case "account_not_found": return "가입된 계정을 찾을 수 없어요. 회원가입 후 다시 시도해 주세요.";
    case "email_not_verified": return "소셜 계정의 이메일 인증을 완료한 뒤 다시 시도해 주세요.";
    case "already_linked": return "이미 연동된 계정이에요.";
    case "provider_already_linked": return "계정 연동을 진행할 수 없어요. 기존 연동 상태를 확인해 주세요.";
    default: return "소셜 로그인을 완료하지 못했어요. 다시 시도해 주세요.";
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
  return { path: params.get("isNewUser") === "true" ? "/profile" : "/home", token };
}
