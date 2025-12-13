import api from "@/api/api";
import Button from "@/components/Button/Button";
import * as S from "./SignUpStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";

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
    // 회원가입 로직 추가
    // 정확히는 여기서 회원가입 API 호출하는 게 아니라 profile 설정까지 하고 호출해야 할 듯
    // 여기서는 입력값 저장하는 로직만 구현하면 될 것 같아용
    console.log("SIGNUP CLICKED");
    if (!isValidEmail(email) || pwd.length === 0 || birth.length !== 4) {
      alert("입력값을 다시 확인해주세요.");
      return;
    }

    try {
      await api.post("/api/auth/signup", {
        email,
        password: pwd,
        birthYear: birth, // ← 명세서 필드명 확인
      });

      // STEP 1 성공 조건
      navigate("/profile");
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
          />
          <Input
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            placeholder="출생년도(yyyy) 입력"
            type="text  "
            name="birth"
            required
          />
          {birth.length > 0 && (!isNumeric(birth) || birth.length > 5) && (
            <S.WarningMessage>유효하지 않은 숫자입니다.</S.WarningMessage>
          )}
          {email.length > 0 && !isValidEmail(email) && (
            <S.WarningMessage>
              유효하지 않은 이메일 형식입니다.
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
