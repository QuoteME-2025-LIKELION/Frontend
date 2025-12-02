import Header from "@/components/Header/Header";
import * as S from "./PagesStyle";
import { useNavigate } from "react-router-dom";

export default function JoinGroup() {
  const navigate = useNavigate();
  return (
    <S.Container>
      <Header
        showBackBtn={true}
        showXBtn={false}
        title=""
        backgroundColor="white"
        onClickBackBtn={() => navigate(-1)}
      />
    </S.Container>
  );
}
