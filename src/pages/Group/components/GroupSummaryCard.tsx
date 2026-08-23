import type { Group } from "@/types/group.type";

import * as S from "../Group.styles";

interface GroupSummaryCardProps {
  group?: Group;
}

/**
 * 그룹명, 멤버 수, 명언 수, 생성 연도를 보여주는 상단 요약 카드
 */
export default function GroupSummaryCard({ group }: GroupSummaryCardProps) {
  const createdYear = group?.createdAt?.slice(0, 4) ?? "2025";
  const memberCount = group?.memberCount ?? group?.members?.length ?? 0;
  const totalQuoteCount = group?.totalQuoteCount ?? 0;

  return (
    <S.GrayBox>
      <S.GroupCard>
        <S.TextBox>
          <S.GroupTitle>{group?.name}</S.GroupTitle>
          <S.InfoBox>
            <S.InfoLine>
              <strong>멤버 수</strong>
              <span>{memberCount}명</span>
            </S.InfoLine>
            <S.InfoLine>
              <strong>작성된 명언</strong>
              <span>{totalQuoteCount}개</span>
            </S.InfoLine>
          </S.InfoBox>
        </S.TextBox>
        <S.Since>Since {createdYear}</S.Since>
        <S.Count>{memberCount}</S.Count>
      </S.GroupCard>
    </S.GrayBox>
  );
}
