import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  background-color: ${() => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  min-height: 244px;
  padding-bottom: 1rem;
`;

export const Datebox = styled.div`
  padding: 10px;
  padding-top: 0px;
  gap: 8px;
  align-items: center;
`;
export const Month = styled.div`
  color: #fff;
  text-align: center;
  ${theme.fonts.chonburi};
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 36px */
  letter-spacing: 0;
`;

export const Weekend = styled.div`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  ${theme.fonts.batang}
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  margin-top: 5px;
  line-height: 100%; /* 12px */
  letter-spacing: 0;
`;

export const Guide = styled.div`
  color: ${theme.colors.territory};
  text-align: center;
  ${theme.fonts.pretendard}
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 165%;
  letter-spacing: 0;
  width: 100%;
`;

export const WriteBox = styled.div<{ $isResultMode: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  position: relative;

  width: 100%;
  height: 7.625rem;
`;

export const LineWrap = styled.div<{ $isResultMode: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
  width: 100%;
  padding: 0 33px;
`;

export const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #fff;
`;

export const TextArea = styled.textarea<{
  $isResultMode: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 2rem 33px 0;

  color: #fff;
  font-size: 0.875rem;
  line-height: 1.875rem !important;
  ${theme.fonts.batang}
  text-align: center;

  overflow: hidden;
  z-index: 2;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const CountText = styled.div`
  align-self: center;
  margin-top: 0.375rem;
  ${theme.fonts.pretendard}
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 120%;
  letter-spacing: 0;
`;

export const BtnText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  ${theme.fonts.batang};
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 13.2px */
  letter-spacing: 0;
`;
export const WriteBody = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  background-color: ${theme.colors.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem 2.4375rem;
`;

export const GuideBox = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-bottom: 4.75rem;
`;

export const InfoWrap = styled.div`
  position: absolute;
  right: 0.5rem;
  bottom: -5rem;
  flex: 0 0 auto;
`;

export const InfoButton = styled.button`
  width: 0.875rem;
  height: 0.875rem;
  border: 1px solid ${theme.colors.territory};
  border-radius: 50%;
  padding: 0;
  background-color: transparent;
  color: ${theme.colors.territory};
  ${theme.fonts.pretendard}
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const InfoBubble = styled.div`
  position: absolute;
  right: 0;
  bottom: 1.375rem;
  width: 13.5rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.25rem;
  background-color: ${theme.colors.primary};
  color: #fff;
  ${theme.fonts.pretendard}
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: 0;
  text-align: left;
  word-break: keep-all;
  z-index: 3;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.12);

  &::after {
    content: "";
    position: absolute;
    right: 0.25rem;
    bottom: -0.375rem;
    border-width: 0.375rem 0.3125rem 0 0.3125rem;
    border-style: solid;
    border-color: ${theme.colors.primary} transparent transparent transparent;
  }
`;

export const ActionBar = styled.div`
  width: calc(100% - 3rem);
  position: absolute;
  left: 1.5rem;
  bottom: 2.4375rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`;

export const ActionButton = styled.button`
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 0.5px solid ${theme.colors.primary};
  border-bottom: 0.5px solid ${theme.colors.primary};
  background-color: transparent;
  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 120%;
  cursor: pointer;

  &:disabled {
    border-color: #dedede;
    color: #c3c5c9;
    cursor: default;
  }

  &:active:not(:disabled) {
    background-color: rgba(20, 56, 88, 0.08);
  }
`;
