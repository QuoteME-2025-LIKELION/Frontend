import Button from "@/components/Button/Button";
import * as S from "./ProfileEditStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ToastModal from "@/components/ToastModal/ToastModal";

export default function ProfileEdit() {
  const navigate = useNavigate();

  const [email, setNickname] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [pwd, setIntro] = useState("");
  const [showToast, setShowToast] = useState(false);

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
    // 프로필 변경 저장 로직 추가
    setShowToast(true);
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };

  return (
    <S.Container>
      {showToast && (
        <ToastModal
          text="변경된 프로필이 저장되었습니다."
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
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
        <S.ImgInput onClick={handleClickUpload}>이미지 등록</S.ImgInput>
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
        <Button title="저장하기" onClick={handleSave} />
      </S.InputBox>
    </S.Container>
  );
}
