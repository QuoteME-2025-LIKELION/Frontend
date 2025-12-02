import Header from "@/components/Header/Header";
import * as S from "./PagesStyle";
import { useNavigate } from "react-router-dom";

export default function MyGroups() {
  const navigate = useNavigate();
  return (
    <S.Container>
      <Header
        showBackBtn={false}
        showXBtn={true}
        title="나의 그룹 관리"
        backgroundColor="white"
        onClickXBtn={() => navigate(-1)}
      />
    </S.Container>
  );
}
