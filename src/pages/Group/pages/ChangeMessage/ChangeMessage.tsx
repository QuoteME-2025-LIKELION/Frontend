import Header from "@/components/Header/Header";
import * as S from "./ChangeMessageStyle";
import { useNavigate } from "react-router-dom";

export default function ChangeMessage() {
  const navigate = useNavigate();
  return (
    <S.Container>
      <Header
        showBackBtn={false}
        showXBtn={true}
        title=""
        backgroundColor="white"
        onClickXBtn={() => navigate(-1)}
      />
    </S.Container>
  );
}
