import Header from "@/components/Header/Header";
import * as S from "./CreateGroupStyle";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
  const navigate = useNavigate();
  return (
    <S.Container>
      <Header
        showBackBtn={false}
        showXBtn={true}
        title="그룹 만들기"
        backgroundColor="primary"
        onClickXBtn={() => navigate(-1)}
      />
    </S.Container>
  );
}
