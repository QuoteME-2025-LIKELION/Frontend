import Button from "@/components/Button/Button";
import * as S from "./StartStyled";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.TextBox>
        <S.TitleText>QuoteMe</S.TitleText>
        <S.Text>소소한 생각도 쿼트미로 소중하게 모아보세요.</S.Text>
      </S.TextBox>
      <S.BtnBox>
        <S.Button style={{ height: 43 }} onClick={() => navigate("/home")}>
          게스트로 시작
        </S.Button>
        <Button title="회원가입" onClick={() => navigate("/signup")} />
        <Button title="로그인" onClick={() => navigate("/login")} />
      </S.BtnBox>
    </S.Container>
  );
}
