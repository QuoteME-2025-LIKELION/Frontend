import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 393px;
  min-height: 100vh;
  background-color: ${theme.colors.secondary};
`;

export const Content = styled.main`
  width: 100%;
  padding: 3.5rem 1.5rem 0;
`;

export const Title = styled.h1`
  margin: 0;
  ${theme.fonts.batang};
  color: #21242b;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: -0.48px;
`;

export const Description = styled.p`
  margin: 0.75rem 0 0;
  ${theme.fonts.pretendard};
  color: #9599a1;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.28px;
`;

export const ReasonTitle = styled.h2`
  margin: 2.75rem 0 1.25rem;
  ${theme.fonts.batang};
  color: #21242b;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: -0.4px;
`;

export const ReasonList = styled.div`
  width: 100%;
`;

export const ReasonRow = styled.button`
  width: 100%;
  min-height: 3.3125rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1.25rem;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #d8dadd;
  text-align: left;
`;

export const ReasonText = styled.span`
  ${theme.fonts.pretendard};
  color: #21242b;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;
`;

export const Checkbox = styled.span`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
  }
`;

export const OtherInput = styled.input`
  width: 100%;
  height: 2.75rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: #fff;
  ${theme.fonts.pretendard};
  color: #21242b;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;

  &::placeholder {
    color: #9599a1;
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  bottom: 4.25rem;
  ${theme.fonts.pretendard};
  color: ${theme.colors.red};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;

  &:disabled {
    color: #c3c5c9;
    cursor: not-allowed;
  }
`;

export const DoneContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 393px;
  min-height: 100vh;
  background-color: ${theme.colors.primary};
`;

export const DoneContent = styled.div`
  position: absolute;
  top: 34.5%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DoneTitle = styled.h1`
  margin: 0;
  ${theme.fonts.batang};
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: -0.48px;
`;

export const DoneDescription = styled.p`
  margin: 1.25rem 0 0;
  ${theme.fonts.pretendard};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.28px;
  text-align: center;
`;

export const HomeButton = styled.button`
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  bottom: 4.25rem;
  height: 2.875rem;
  ${theme.fonts.pretendard};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;
`;
