import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 393px;
  background-color: ${theme.colors.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1.5rem 2.4375rem;
  overflow: hidden;
`;

export const TagBox = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

export const TagScrollArea = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Title = styled.div`
  ${theme.fonts.batang}
  color: #000;
  font-size: 20px;
  font-weight: 700;
  line-height: 120%;
  letter-spacing: 0;
  text-align: center;
`;

export const Description = styled.p`
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 135%;
  letter-spacing: 0;
  text-align: center;
`;

export const TagRequestSection = styled.section`
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.75rem 0;
  border-top: 1px solid #dedede;
  border-bottom: 1px solid #dedede;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const TagRequestHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const TagRequestTitle = styled.div`
  ${theme.fonts.dotum}
  color: #000;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 120%;
  letter-spacing: 0;
`;

export const TagRequestCount = styled.span`
  min-width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  ${theme.fonts.pretendard}
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.125rem;
  text-align: center;
`;

export const TagRequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TagRequestItem = styled.div`
  min-height: 3.375rem;
  display: grid;
  grid-template-columns: 2.375rem minmax(0, 1fr) auto;
  gap: 0.625rem;
  align-items: center;
`;

export const RequestProfileImg = styled.img`
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const RequestDefaultProfileImg = styled.div`
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  ${theme.fonts.batang}
  color: #fff;
  font-size: 1.25rem;
  line-height: 100%;
`;

export const TagRequestUserBox = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const TagRequestUsername = styled.div`
  ${theme.fonts.dotum}
  color: #000;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 120%;
  letter-spacing: 0;
`;

export const TagRequestState = styled.div<{
  $decision: "accept" | "reject";
}>`
  ${theme.fonts.dotum}
  color: ${({ $decision }) =>
    $decision === "accept" ? theme.colors.primary : theme.colors.territory};
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 120%;
  letter-spacing: 0;
`;

export const TagRequestActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const TagRequestButton = styled.button<{ $active: boolean }>`
  min-width: 2.75rem;
  min-height: 1.875rem;
  padding: 0 0.625rem;
  border: 1px solid
    ${({ $active }) => ($active ? theme.colors.primary : "#dedede")};
  background-color: ${({ $active }) =>
    $active ? theme.colors.primary : "transparent"};
  ${theme.fonts.pretendard}
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 120%;
  cursor: pointer;
`;

export const SelectedList = styled.div<{ $isEmpty: boolean }>`
  width: calc(100% + 3rem);
  min-height: 4.375rem;
  margin: 0.125rem -1.5rem 0;
  padding: 0.25rem 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  overflow-x: auto;
  overflow-y: hidden;
  opacity: ${({ $isEmpty }) => ($isEmpty ? 0 : 1)};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SelectedUser = styled.div`
  position: relative;
  flex: 0 0 auto;
  min-width: 3.25rem;
  min-height: 3.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  ${theme.fonts.dotum}
  color: #000;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 120%;
  letter-spacing: 0;
`;

export const SelectedAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    ${theme.fonts.batang}
    color: #fff;
    font-size: 1rem;
    line-height: 100%;
  }
`;

export const RemoveSelectedButton = styled.button`
  position: absolute;
  top: 0.125rem;
  right: 0.3125rem;
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 50%;
  background-color: ${theme.colors.territory};
  color: #fff;
  font-size: 0.625rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const TagList = styled.div`
  width: 100%;
  margin-top: 0.625rem;
  display: flex;
  flex-direction: column;
`;

export const TagItem = styled.button<{ $showBorder: boolean }>`
  width: 100%;
  min-height: 3.625rem;
  display: grid;
  grid-template-columns: 2.8125rem minmax(0, 1fr) 1rem;
  gap: 0.6875rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: ${({ $showBorder }) =>
    $showBorder ? "1px solid #dedede" : "0"};
  background-color: transparent;
  cursor: pointer;
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
  background-color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  ${theme.fonts.batang}
  color: #fff;
  font-size: 1.75rem;
  line-height: 100%;
`;

export const UserBox = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
`;

export const Username = styled.div`
  ${theme.fonts.dotum}
  color: #000;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 120%;
  letter-spacing: 0;
`;

export const Intro = styled.div`
  ${theme.fonts.dotum}
  color: ${theme.colors.territory};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 120%;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Checkbox = styled.span<{ $isSelected: boolean }>`
  width: 1rem;
  height: 1rem;
  border: 1.5px solid
    ${({ $isSelected }) => ($isSelected ? "#25282d" : theme.colors.territory)};
  background-color: ${({ $isSelected }) =>
    $isSelected ? "#25282d" : "transparent"};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
`;

export const ActionBar = styled.div<{ $single: boolean }>`
  width: 100%;
  margin-top: auto;
  padding-top: 1.5rem;
  display: grid;
  grid-template-columns: ${({ $single }) =>
    $single ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))"};
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
