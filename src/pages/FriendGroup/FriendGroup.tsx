import Header from "@/components/Header/Header";
import * as S from "./FriendGroupStyle";
import { useNavigate } from "react-router-dom";
import Search from "@/components/Search/Search";

export default function FriendGroup() {
  const navigate = useNavigate();
  return (
    <S.Container>
      <Header
        showBackBtn={false}
        showXBtn={true}
        title="친구 및 그룹"
        backgroundColor="white"
        onClickXBtn={() => navigate(-1)}
      />
      <S.Content>
        <Search
          placeholder="검색"
          desc="이메일, 닉네임, 그룹명으로 계정을 검색할 수 있어요."
        />
      </S.Content>
    </S.Container>
  );
}
