import * as S from "./StartStyled";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.TextBox>
        <S.TittleText>Quote</S.TittleText>
        <S.Text>소소한 생각도 쿼트미로 소중하게 모아보세요.</S.Text>
        <S.Button style={{ height: 43 }} onClick={() => navigate("/home")}>
          <S.ButtonText>게스트로 시작</S.ButtonText>
        </S.Button>
        <S.Button onClick={() => navigate("/signup")}>
          <S.ButtonText>회원가입</S.ButtonText>
        </S.Button>
        <S.Button onClick={() => navigate("/login")}>
          <S.ButtonText>로그인</S.ButtonText>
        </S.Button>
      </S.TextBox>
    </S.Container>
  );
}
