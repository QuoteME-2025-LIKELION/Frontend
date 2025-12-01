import * as S from "./LoginStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");    
    const isValidEmail = (email: string) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
        };
    const correctPassword = ""; //백 연동 필요

    return (
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
                <S.WarningMessage>유효하지 않은 이메일 형식입니다.</S.WarningMessage>
            )}
            {pwd.length > 0 && pwd !== correctPassword && (
                <S.WarningMessage>잘못된 비밀번호입니다.</S.WarningMessage>
            )}
            <S.MissingBtn> 비밀번호를 잊었다면?</S.MissingBtn>
            <S.InputBtn>입력 완료</S.InputBtn>
        </S.InputBox>
    </S.Container>
    )
    ;
}
