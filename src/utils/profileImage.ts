export const PROFILE_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/heic,.jpg,.jpeg,.png,.webp,.gif,.heic";

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
]);

export function validateProfileImage(file: Pick<File, "name" | "type" | "size">) {
  // MIME 정보를 제공하지 않는 브라우저에서는 확장자로 사전 검사한다.
  // 실제 파일 형식의 최종 검증은 서버에서 수행한다.
  const isAllowed = file.type
    ? ALLOWED_MIME_TYPES.has(file.type.toLowerCase())
    : /\.(jpe?g|png|webp|gif|heic)$/i.test(file.name);

  if (!isAllowed) return "이미지는 JPEG, PNG, WebP, GIF, HEIC 형식만 선택할 수 있어요.";
  if (file.size > MAX_PROFILE_IMAGE_BYTES) return "이미지는 5MB 이하로 선택해 주세요.";
  return null;
}
