import api from "@/api/api";
import Button from "@/components/Button/Button";
import * as S from "./ProfileStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function Profile() {
  const navigate = useNavigate();

  const [email, setNickname] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pwd, setIntro] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const handleClickUpload = () => {
    fileRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSignUp = async () => {
    // 회원가입 및 프로필 설정 로직 추가
    try {
      const formData = new FormData();

      formData.append("nickname", email);
      formData.append("intro", pwd);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.post("/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/login"); // 프로필 저장 후 로그인
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      alert("프로필 저장에 실패했습니다.");
    }
  };

  return (
    <>
      <PageTitle title="회원가입" />
      <S.Container>
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="프로필 설정"
          backgroundColor="white"
          onClickBackBtn={() => navigate(-1)}
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
        </S.InputBox>
        <S.BtnBox>
          <Button title="저장 완료" onClick={handleSignUp} />
        </S.BtnBox>
      </S.Container>
    </>
  );
}
