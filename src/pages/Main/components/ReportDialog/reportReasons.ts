// 화면 시안의 임시 사유 코드. 실제 신고 API 계약이 정해지면 교체한다.
export const REPORT_REASONS = [
  { id: "abuse", label: "욕설이나 비하하는 표현이 있어요" },
  { id: "harassment", label: "특정 사람을 저격하거나 괴롭혀요" },
  { id: "sexual", label: "성적인 내용이 있어요" },
  { id: "privacy", label: "개인정보가 드러나 있어요" },
  { id: "danger", label: "자해나 위험한 행동이 걱정돼요" },
  { id: "ai", label: "AI가 만든 문장이 이상해요" },
  { id: "spam", label: "스팸이나 광고에요" },
  { id: "other", label: "기타" },
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number]["id"];

