import * as S from "./SignUpStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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


    return (
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
                <S.WarningMessage>유효하지 않은 이메일 형식입니다.</S.WarningMessage>
            )}
            <S.InputBtn onClick={() => navigate("/profile")}>입력완료</S.InputBtn>
        </S.InputBox>
    </S.Container>
    )
    ;
}
