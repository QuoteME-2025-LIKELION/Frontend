export function getNotificationFeedPath(createdAt: string | null | undefined) {
  const date = createdAt?.slice(0, 10); // 응답에 명언 작성일이 추가될 경우 그걸로 변경
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "/home";
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    return "/home";
  }

  return `/home/${date}`;
}
