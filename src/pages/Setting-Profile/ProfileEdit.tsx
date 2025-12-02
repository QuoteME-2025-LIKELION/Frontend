import * as S from "./ProfileEditStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function ProfileEdit() {
    const navigate = useNavigate();

    const [email, setNickname] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [pwd, setIntro] = useState("");    
    const [showBanner, setShowBanner] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);

    const handleClickUpload = () => {
        fileRef.current?.click();
    };

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);
    };
    const handleSave = () => {
        setShowBanner(true);

        setTimeout(() => setShowBanner(false), 1000);
    };


    return (
    <S.Container>
        <Header
            showBackBtn={false}
            showXBtn={true}     
            title="프로필 편집"
            backgroundColor="white"
            onClickXBtn={() => navigate("")}
        />
        <S.ProfileWrapper>
            <S.ImgPreview
                style={{
                    backgroundImage: preview ? `url(${preview})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleChangeFile}
                style={{ display: "none" }}
                />
            <S.ImgInput onClick={handleClickUpload}>
                이미지 등록
            </S.ImgInput>
        </S.ProfileWrapper>
        <S.InputBox>
            <S.TextName>자기소개</S.TextName>
            <Input
                value={email}   
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 설정"
                type="text"
                name="nickname"
                maxLength={10}
                required
            />
            <S.LimitText>10자 내외</S.LimitText>
            <S.TextName>자기소개</S.TextName>
            <Input
                value={pwd}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="자기소개 설정"
                type="text"
                name="intro"
                maxLength={30}
                required
            />
            <S.LimitText>30자 내외</S.LimitText>
            <S.InputBtn onClick={handleSave}>저장 완료</S.InputBtn>
            {showBanner && <S.SaveBanner>저장되었습니다</S.SaveBanner>}        </S.InputBox>
    </S.Container>
    )
    ;
}
