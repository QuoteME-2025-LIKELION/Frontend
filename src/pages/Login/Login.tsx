import api from "@/api/api";
import * as S from "./LoginStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/Button";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const isValidEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  const correctPassword = ""; //백 연동 필요

  /**
   * - 로그인 버튼 클릭 시 실행될 로직의 예시입니다.
   * - api.post를 사용하여 서버에 로그인 요청을 보냅니다.
   * - 요청이 성공하면, 응답 데이터(response.data.accessToken)에서 accessToken을 추출하여 localStorage에 저장합니다.
   * - 'accessToken'이라는 키로 저장해야 api.ts의 인터셉터가 정상적으로 토큰을 헤더에 추가할 수 있습니다.
   * - 로그인 성공 후 메인 페이지('/')로 이동시키거나 원하는 경로로 리다이렉트 해 주세요.
   * - 만약 제대로 실행이 되지 않는다면, 백엔드 응답 형식을 확인해 주세요! (res.data.data.accessToken 일 수도 있음)
   */
  const handleLogin = async () => {
    if (!isValidEmail(email) || pwd.length === 0) {
      alert("이메일과 비밀번호를 올바르게 입력해주세요.");
      return;
    }
    try {
      const res = await api.post("/api/auth/login", {
        email: email,
        password: pwd,
      });

      // axios는 HTTP 상태 코드를 res.status로 제공 -> API 명세서와 무관
      if (res.status === 200 && res.data.accessToken) {
        const { accessToken } = res.data;
        localStorage.setItem("accessToken", accessToken);
        navigate("/"); // 로그인 성공 후 이동할 경로
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      // res.status에 따라 에러 처리 로직 구현
    }
  };

  return (
    <>
      <PageTitle title="로그인" />
      <S.Container>
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="로그인"
          backgroundColor="white"
          onClickBackBtn={() => navigate(-1)}
        />
        <S.InputBox>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
            type="email"
            name="email"
            required
          />
          <Input
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="비밀번호 입력"
            type="password"
            name="password"
            required
          />
          {email.length > 0 && !isValidEmail(email) && (
            <S.WarningMessage>
              유효하지 않은 이메일 형식입니다.
            </S.WarningMessage>
          )}
          {pwd.length > 0 && pwd !== correctPassword && (
            <S.WarningMessage>잘못된 비밀번호입니다.</S.WarningMessage>
          )}
          <S.MissingBtn> 비밀번호를 잊었다면?</S.MissingBtn>
        </S.InputBox>
        <S.BtnBox>
          {/* 추후 onClick 이벤트 추가(handleLogin) */}
          <Button title="입력 완료" onClick={() => {}} />
        </S.BtnBox>
      </S.Container>
    </>
  );
}
