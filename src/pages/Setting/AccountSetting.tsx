import * as S from "./AccountSettingStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function AccountSetting() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [birth, setBirth] = useState("");  
    const [gender, setGender] = useState("");
    const isValidEmail = (email: string) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };
    const isNumeric = (value: string) => /^\d+$/.test(value);
            

    return (
    <S.Container>
        <Header
            showBackBtn={false}
            showXBtn={true} 
            title="계정 설정"
            backgroundColor="white"
            onClickBackBtn={() => navigate(-1)}
        />
        <S.InputBox>
            <Input
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="성별"
                type="text  "
                name="gender"
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
            <S.TextName>이메일 변경</S.TextName>
            <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 입력"
                type="email"
                name="email"
                required
            />
            {birth.length > 0 && (!isNumeric(birth) || birth.length > 5) && (
                <S.WarningMessage>유효하지 않은 숫자입니다.</S.WarningMessage>
            )}
            {email.length > 0 && !isValidEmail(email) && (
                <S.WarningMessage>유효하지 않은 이메일 형식입니다.</S.WarningMessage>
            )}
            <S.DeleteBtn>계정 삭제하기</S.DeleteBtn>
        </S.InputBox>
    </S.Container>
    )
    ;
}
