import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div<{ $isInArchive?: boolean }>`
  background-color: ${({ $isInArchive }) =>
    $isInArchive ? `${theme.colors.primary}` : "transparent"};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  cursor: ${({ $isInArchive }) => ($isInArchive ? "pointer" : "default")};
`;

export const ArchiveContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  ${theme.fonts.batang}
  font-weight: 700;
  letter-spacing: -0.24px;
  font-size: 0.75rem; /* 12px */
  color: #fff;
`;

export const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  justify-content: space-between;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
`;

export const ProfileImg = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const DefaultProfileImg = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${theme.colors.territory};
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  min-width: 0;
  width: 100%;
`;

export const Username = styled.div<{ $isInArchive?: boolean }>`
  ${theme.fonts.dotum}
  color: ${({ $isInArchive }) => ($isInArchive ? "#fff" : "#000")};
  font-weight: 700;
  font-size: 0.8125rem;
  letter-spacing: 0;
  width: 100%;
`;

export const IntroTimeBox = styled.div<{ $isInArchive?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  div {
    ${theme.fonts.dotum}
    color: ${({ $isInArchive }) =>
      $isInArchive ? "#fff" : theme.colors.territory};
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 120%;
    letter-spacing: 0;

    &:first-of-type {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const TextContainer = styled.div<{
  $isSilenced: boolean;
  $isInArchive?: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 1rem;
  justify-content: ${({ $isInArchive }) =>
    $isInArchive ? "center" : "flex-start"};

  div {
    ${theme.fonts.batang}
    font-weight: 500;
    color: ${({ $isSilenced, $isInArchive }) =>
      $isSilenced
        ? $isInArchive
          ? "#fff"
          : theme.colors.territory
        : $isInArchive
          ? "#fff"
          : "#000"};
  }
`;

export const Quotation = styled.div`
  font-size: 2.5rem; /* 40px */
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0.9rem);
`;

export const Text = styled.div`
  font-size: 1rem; /* 16px */
  letter-spacing: 0;
  line-height: 1.05 !important;
`;

export const TagContainer = styled.div<{ $isInArchive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.375rem 0; /* 6px 0 */
  border-top: 1px solid
    ${({ $isInArchive }) => ($isInArchive ? "#fff" : theme.colors.territory)};
  border-bottom: 1px solid
    ${({ $isInArchive }) => ($isInArchive ? "#fff" : theme.colors.territory)};
  min-height: 1.875rem; /* 30px */
`;

export const TagBox = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.3125rem; /* 5px */
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3125rem; /* 5px */

  ${theme.fonts.pretendard}
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  letter-spacing: -0.24px;
`;

export const Name = styled.div<{ $isInArchive?: boolean }>`
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isInArchive }) => ($isInArchive ? "#fff" : "#000")};
`;

export const RequestBtn = styled.button<{ $isInArchive?: boolean }>`
  color: ${({ $isInArchive }) =>
    $isInArchive ? "#fff" : theme.colors.territory};
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  ${theme.fonts.pretendard}
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  letter-spacing: -0.24px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:disabled {
    color: ${theme.colors.territory};
    cursor: default;
  }
`;

export const PokeBtn = styled(RequestBtn)``;

export const PlusBtn = styled(RequestBtn)``;

export const BtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 0 0 auto;

  button {
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);

    &:active {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      cursor: default;
    }
  }
`;

export const IconImg = styled.img<{ $isInArchive?: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  display: block;
  filter: ${({ $isInArchive }) =>
    $isInArchive ? "brightness(0) invert(1)" : "none"};
`;
