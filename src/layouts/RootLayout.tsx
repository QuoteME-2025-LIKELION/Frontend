// 앱 전체의 기본 레이아웃 정의
import styled from "@emotion/styled";

const MainWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  margin: 0 auto;
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainWrapper>{children}</MainWrapper>;
}
