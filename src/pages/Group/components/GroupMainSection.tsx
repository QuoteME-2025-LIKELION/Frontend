import Button from "@/components/Button/Button";
import UserListItem from "@/components/UserListItem/UserListItem";
import type { Friend } from "@/types/friend.type";
import type { Group } from "@/types/group.type";
import * as S from "../Group.styles";

interface GroupMainSectionProps {
  group?: Group;
  members: Friend[];
  isLeader: boolean;
  onEditMessage: () => void;
  onDeleteMember: (nickname: string, id: number) => void;
  onInviteGroup: () => void;
  onQuitGroup: () => void;
  onDeleteGroup: () => void;
}

/**
 * 그룹 메시지, 그룹원 목록, 초대/탈퇴/삭제 액션을 렌더링
 */
export default function GroupMainSection({
  group,
  members,
  isLeader,
  onEditMessage,
  onDeleteMember,
  onInviteGroup,
  onQuitGroup,
  onDeleteGroup,
}: GroupMainSectionProps) {
  return (
    <S.Main>
      <S.Section>
        <S.Title>그룹 메시지</S.Title>
        <S.MessageBox onClick={onEditMessage}>
          <S.Quotation>“</S.Quotation>
          {group?.motto ? (
            <S.Text>{group.motto}</S.Text>
          ) : (
            <S.EmptyText>메시지를 입력하세요</S.EmptyText>
          )}
          <S.Quotation>”</S.Quotation>
        </S.MessageBox>
      </S.Section>
      <S.Section>
        <S.Title>그룹원</S.Title>
        {members.map((friend) => (
          <UserListItem
            key={friend.id}
            friend={friend}
            actionButton={{
              type: "delete",
              text: "삭제",
              onClick: () => onDeleteMember(friend.nickname, friend.id),
            }}
          />
        ))}
      </S.Section>
      <S.BtnBox>
        <Button title="그룹 초대하기" onClick={onInviteGroup} />
        {isLeader ? (
          <S.QuitBtn onClick={onDeleteGroup}>그룹 삭제하기</S.QuitBtn>
        ) : (
          <S.QuitBtn onClick={onQuitGroup}>그룹 탈퇴하기</S.QuitBtn>
        )}
      </S.BtnBox>
    </S.Main>
  );
}
