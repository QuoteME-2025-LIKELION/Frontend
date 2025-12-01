import Header from "@/components/Header/Header";
import * as S from "./GroupStyle";
import { useNavigate } from "react-router-dom";

export default function Group() {
  const navigate = useNavigate();
  return (
    <S.Container>
      <Header
        showBackBtn={true}
        showXBtn={false}
        title=""
        backgroundColor="secondary"
        onClickBackBtn={() => navigate(-1)}
      />
    </S.Container>
  );
}
