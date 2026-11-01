import styled from "@emotion/styled";
import { Component } from "react";
import type { ReactNode } from "react";

import theme from "@/styles/theme";

const ErrorScreen = styled.main`
  min-height: 100vh;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  text-align: center;
  color: ${theme.colors.primary};
  ${theme.fonts.pretendard}

  h1 {
    margin: 0;
    font-size: 20px;
    line-height: 1.5;
  }

  p {
    margin: 0;
    line-height: 1.5;
  }

  button,
  a {
    padding: 12px 16px;
    border: 1px solid currentColor;
    border-radius: 4px;
    line-height: 1.5;
  }
`;

export default class RouteErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <ErrorScreen>
        <div role="alert">
          <h1>화면을 불러오지 못했습니다.</h1>
          <p>연결 상태를 확인한 뒤 다시 시도해 주세요.</p>
        </div>
        {/* React.lazy가 보관한 실패 결과도 초기화하도록 문서를 다시 불러온다. */}
        <button type="button" onClick={() => window.location.reload()}>
          다시 시도
        </button>
        <a href="/">처음으로</a>
      </ErrorScreen>
    );
  }
}
