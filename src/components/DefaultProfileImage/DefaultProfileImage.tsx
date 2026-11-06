/** public에 있는 기존 남색 Q 이미지를 기본 프로필로 재사용한다. */
export default function DefaultProfileImage({ size = 80 }: { size?: number }) {
  return (
    <img
      src="/favicons/favicon-96x96.png"
      width={size}
      height={size}
      style={{ borderRadius: "50%", display: "block" }}
      alt=""
      aria-hidden="true"
    />
  );
}
