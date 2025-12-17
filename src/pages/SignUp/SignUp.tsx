import api from "@/api/api";
import Button from "@/components/Button/Button";
import * as S from "./SignUpStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
import useAuthStore from "@/stores/useAuthStore";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [birth, setBirth] = useState("");
  const isValidEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  const navigate = useNavigate();
  const isNumeric = (value: string) => /^\d+$/.test(value);

  const handleSignUp = async () => {
    if (!isValidEmail(email) || pwd.length < 8 || birth.length !== 4) {
      alert("입력값을 다시 확인해주세요.");
      return;
    }

    try {
      const res = await api.post("/api/auth/signup", {
        email,
        password: pwd,
        birthYear: birth, // ← 명세서 필드명 확인
      });

      // STEP 1 성공 조건
      const accessToken = res.data?.data?.accessToken;

      if (accessToken) {
        // store에 accessToken 저장 (인증 상태 업데이트)
        useAuthStore.getState().login(accessToken);
        // 프로필 설정 페이지로 이동
        navigate("/profile");
      } else {
        // 회원가입은 성공했지만, 토큰이 응답에 없는 경우
        alert(
          "회원가입은 완료되었으나, 인증 정보를 받지 못했습니다. 로그인 페이지로 이동합니다."
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <>
      <PageTitle title="회원가입" />
      <S.Container>
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="회원가입"
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
            minLength={8}
          />
          <Input
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            placeholder="출생년도(yyyy) 입력"
            type="text  "
            name="birth"
            required
            minLength={4}
            maxLength={4}
          />
          {birth.length > 0 && (!isNumeric(birth) || birth.length > 5) && (
            <S.WarningMessage>유효하지 않은 숫자입니다.</S.WarningMessage>
          )}
          {email.length > 0 && !isValidEmail(email) && (
            <S.WarningMessage>
              유효하지 않은 이메일 형식입니다.
            </S.WarningMessage>
          )}
          {pwd.length > 0 && pwd.length < 8 && (
            <S.WarningMessage>
              비밀번호는 최소 8자 이상이어야 합니다.
            </S.WarningMessage>
          )}
        </S.InputBox>
        <S.BtnBox>
          <Button title="입력 완료" onClick={handleSignUp} />
        </S.BtnBox>
      </S.Container>
    </>
  );
}
