import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div<{ $isInArchive?: boolean }>`
  background-color: ${({ $isInArchive }) =>
    $isInArchive ? `${theme.colors.primary}` : "#fff"};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem; /* 28px */
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
  grid-template-columns: 2.8125rem 1fr;
  justify-content: space-between;
  align-items: center;
  gap: 0.6875rem; /* 11px */
  width: 100%;
`;

export const ProfileImg = styled.img`
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const DefaultProfileImg = styled.div`
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  background-color: ${theme.colors.territory};
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem; /* 8px */
  width: 100%;
`;

export const Username = styled.div<{ $isInArchive?: boolean }>`
  ${theme.fonts.dotum}
  color: ${({ $isInArchive }) => ($isInArchive ? "#fff" : "#000")};
  font-weight: 700;
  font-size: 0.9375rem; /* 15px */
  letter-spacing: -0.3px;
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
    font-size: 0.875rem; /* 14px */
    font-weight: 500;
    letter-spacing: -0.28px;
  }
`;

export const TextContainer = styled.div<{
  $isSilenced: boolean;
  $isInArchive?: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.125rem; /* 18px */
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
  letter-spacing: -0.8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0.9rem);
`;

export const Text = styled.div`
  font-size: 1rem; /* 16px */
  letter-spacing: -0.28px;
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
`;

export const PokeBtn = styled(RequestBtn)``;

export const PlusBtn = styled(RequestBtn)``;

export const BtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem; /* 5px */

  button {
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
`;
