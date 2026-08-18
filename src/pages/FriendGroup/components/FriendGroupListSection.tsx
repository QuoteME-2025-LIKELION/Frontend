import type { Group } from "@/types/group.type";

import * as S from "../FriendGroup.styles";

interface FriendGroupListSectionProps {
  keyword: string;
  groups: Group[];
  searchGroups: Group[];
  myGroupIdSet: Set<number>;
  onCreateGroup: () => void;
  onManageGroups: () => void;
  onOpenGroup: (groupId: number) => void;
  onJoinGroup: (groupId: number) => void;
  showManagementButtons?: boolean;
}

/**
 * 내 그룹 목록 또는 검색된 그룹 목록을 렌더링
 */
export default function FriendGroupListSection({
  keyword,
  groups,
  searchGroups,
  myGroupIdSet,
  onCreateGroup,
  onManageGroups,
  onOpenGroup,
  onJoinGroup,
  showManagementButtons = true,
}: FriendGroupListSectionProps) {
  const visibleGroups = keyword ? searchGroups : groups;
  const emptyText = keyword ? "검색 결과가 없습니다." : "가입한 그룹이 없습니다.";

  return (
    <S.Section>
      <S.Title>
        <div>{keyword ? "그룹" : "나의 그룹"}</div>
        {showManagementButtons && (
          <S.BtnBox>
            <button onClick={onCreateGroup}>그룹 만들기</button>
            <button onClick={onManageGroups}>관리</button>
          </S.BtnBox>
        )}
      </S.Title>
      <S.GroupContainer>
        {visibleGroups.length > 0 ? (
          visibleGroups.map((group) => {
            const isMyGroup = myGroupIdSet.has(group.id);
            const handleClick = () =>
              isMyGroup || !keyword
                ? onOpenGroup(group.id)
                : onJoinGroup(group.id);

            return (
              <S.GroupBox key={group.id} onClick={handleClick}>
                <S.GroupName>{group.name}</S.GroupName>
                <S.GroupCount>{group.memberCount}</S.GroupCount>
              </S.GroupBox>
            );
          })
        ) : (
          <S.EmptyBox>{emptyText}</S.EmptyBox>
        )}
      </S.GroupContainer>
    </S.Section>
  );
}
