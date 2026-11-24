import styled from "@emotion/styled";
import { Component } from "react";
import type { ReactNode } from "react";

import ToastModal from "@/components/ToastModal/ToastModal";
import theme from "@/styles/theme";

const ErrorScreen = styled.div`
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
        <ToastModal errorMessage="화면을 불러오지 못했어요." />
        <a href="/">처음으로</a>
      </ErrorScreen>
    );
  }
}
