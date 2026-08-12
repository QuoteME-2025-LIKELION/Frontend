import type { Group } from "@/types/group.type";
import * as S from "../Group.styles";

interface GroupSummaryCardProps {
  group?: Group;
}

/**
 * 그룹명, 멤버 수, 명언 수, 생성 연도를 보여주는 상단 요약 카드
 */
export default function GroupSummaryCard({ group }: GroupSummaryCardProps) {
  return (
    <S.GrayBox>
      <S.GroupCard>
        <S.TextBox>
          <S.Title>{group?.name}</S.Title>
          <S.InfoBox>
            <S.InfoLine>
              <div>멤버</div>
              <div>{group?.memberCount}명</div>
            </S.InfoLine>
            <S.InfoLine>
              <div>명언</div>
              <div>{group?.totalQuoteCount}개</div>
            </S.InfoLine>
            <S.InfoLine>
              <div>since</div>
              <S.Chonburi>{group?.createdAt?.slice(0, 4)}</S.Chonburi>
            </S.InfoLine>
          </S.InfoBox>
        </S.TextBox>
        <S.Count>{group?.memberCount}</S.Count>
      </S.GroupCard>
    </S.GrayBox>
  );
}
