import Button from "@/components/Button/Button";
import * as S from "./GroupCardStyle";
import type { Group } from "@/types/group.type";
import { useEffect, useState } from "react";
import api from "@/api/api";

interface GroupCardProps {
  group: Group;
  onBtnClick: () => void;
  isButton?: boolean;
  onCardClick?: () => void;
}

/**
 * 그룹 관련 페이지에서 쓰이는 카드형 그룹 컴포넌트
 * @param props
 * @param props.group 그룹 정보 객체
 * @param props.onBtnClick 하단 버튼 클릭 시 실행되는 함수
 * - join-group 페이지: 그룹 참여 요청 모달 띄우기 (텍스트도 "그룹 참여하기")
 * - my-groups 페이지: 그룹 탈퇴 확인 모달 띄우기 (텍스트도 "그룹 탈퇴하기")
 * @param props.isButton 그룹 카드가 버튼 형태인지 div인지 여부 (기본값 false) (my-groups 페이지에서만 true)
 * @param props.onCardClick 카드 클릭 시 실행되는 함수 (isButton이 true일 때만 사용 -> 해당 그룹 그룹 페이지로 이동)
 */
export default function GroupCard({
  group,
  onBtnClick,
  isButton = false,
  onCardClick,
}: GroupCardProps) {
  // API에서 since 정보를 제공하지 않으므로 별도 요청
  const [since, setSince] = useState("");
  useEffect(() => {
    const fetchSince = async () => {
      const res = await api.get(`/api/groups/${group.id}`);
      setSince(res.data.createdAt.slice(0, 4));
    };
    fetchSince();
  }, [group.id]);
  return (
    <S.Container>
      {isButton ? (
        <>
          <S.Btn onClick={onCardClick}>
            <S.TextBox>
              <S.Title>{group?.name}</S.Title>
              <S.InfoBox>
                <S.InfoLine>
                  <div>멤버</div>
                  <div>{group?.memberCount}명</div>
                </S.InfoLine>
                <S.InfoLine>
                  <div>since</div>
                  <div>{since}</div>
                </S.InfoLine>
              </S.InfoBox>
            </S.TextBox>
            <S.Count>{group?.memberCount}</S.Count>
          </S.Btn>
          <Button title="그룹 탈퇴하기" onClick={onBtnClick} />
        </>
      ) : (
        <>
          <S.GroupBox>
            <S.TextBox>
              <S.Title>{group?.name}</S.Title>
              <S.InfoBox>
                <S.InfoLine>
                  <div>멤버</div>
                  <div>{group?.memberCount}명</div>
                </S.InfoLine>
                <S.InfoLine>
                  <div>since</div>
                  <div>{group?.createdAt?.slice(0, 4)}</div>
                </S.InfoLine>
              </S.InfoBox>
            </S.TextBox>
            <S.Count>{group?.memberCount}</S.Count>
          </S.GroupBox>
          <Button title="그룹 참여하기" onClick={onBtnClick} />
        </>
      )}
    </S.Container>
  );
}
