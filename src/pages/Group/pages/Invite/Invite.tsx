import { useNavigate } from "react-router-dom";
import * as S from "./InviteStyle";
import Header from "@/components/Header/Header";

export default function Invite() {
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
