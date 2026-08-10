import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const FeedList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 17.5px;
  max-width: 393px;
  background-color: ${theme.colors.secondary};
  height: 100%;

  /* 명언 이미지 저장을 감안해 각 Feed에 padding 추가 */
  & > div {
    width: 100%;
    padding: 10px 17.5px;
  }
`;

export const NoFeedText = styled.div`
  width: 100%;
  height: 100%;
  padding: 16pz 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  ${theme.fonts.batang}
  color: ${theme.colors.territory};
  letter-spacing: -0.28px;
`;

export const NoFeedbox = styled.div`
  margin-top: 50%;
`;

export const NoFeedSubText = styled.div`
  width: 100%;
  color: var(--fg-subtle, #9599a1);
  text-align: center;

  /* caption/description/md */
  font-family: Pretendard;
  font-size: var(--font-size-t2, 14px);
  font-style: normal;
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--line-height-t2, 21px); /* 150% */
  letter-spacing: -0.28px;
`;

export const GroupList = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const GroupText = styled.div`
  color: ${theme.colors["fg-primary"]};
  text-align: center;

  font-family: Pretendard;
  font-size: var(--font-size-t1, 12px);
  font-style: normal;
  font-weight: var(--font-weight-medium, 500);
  line-height: var(--line-height-t1, 18px); /* 150% */
  letter-spacing: -0.24px;
  padding: 4px 8px;
`;

export const TagModalWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
`;

export const TagModal = styled.div`
  position: absolute;
  top: 330px;
  left: 670px;

  background: white;
  border-radius: 10px;

  display: inline-flex;
  padding: 15px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;

  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.61);
`;

export const TagModalItem = styled.div`
  color: var(--fg-primary, #21242b);
  text-align: center;

  /* body/medium/md */
  font-family: Pretendard;
  font-size: var(--font-size-t2, 14px);
  font-style: normal;
  font-weight: var(--font-weight-medium, 500);
  line-height: var(--line-height-t2, 21px); /* 150% */
  letter-spacing: -0.28px;

  padding: 4px 8px;
  border-radius: var(--spacing-radius-sm, 4px 4px 0px 0px);
  border-bottom: 1px solid ${theme.colors["fg-subtle"]};
`;
