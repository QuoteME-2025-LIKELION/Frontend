import Button from "@/components/Button/Button";
import * as S from "./ProfileEditStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ToastModal from "@/components/ToastModal/ToastModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import api from "@/api/api";

// TODO: API 연동 및 이미지 문자열 변환 필요
export default function ProfileEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialProfile = location.state?.profile;

  const [showToast, setShowToast] = useState(false);
  const [nickname, setNickname] = useState(initialProfile?.nickname || "");
  const [intro, setIntro] = useState(initialProfile?.intro || "");
  const [preview, setPreview] = useState<string | null>(
    initialProfile?.imageUrl || null
  );
  // 실제 파일 객체를 담을 상태 추가
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleClickUpload = () => {
    fileRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 객체 저장 및 미리보기 URL 생성
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const handleSave = async () => {
    // FormData 객체 생성
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const profileData = {
      nickname: nickname,
      introduction: intro,
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(profileData)], { type: "application/json" })
    );

    try {
      await api.put("/api/settings/profile", formData);
      setShowToast(true);

      setTimeout(() => {
        navigate("/profile-center");
      }, 1500);
    } catch (e) {
      console.error("프로필 저장 실패", e);
      //에러
    }
  };

  return (
    <>
      <PageTitle title="프로필 편집" />
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
          onClickXBtn={() => navigate("/profile-center")}
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
          <S.TextName>닉네임</S.TextName>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 설정"
            type="text"
            name="nickname"
            maxLength={10}
            required
          />
          <S.LimitText>10자 이내</S.LimitText>
          <S.TextName>자기소개</S.TextName>
          <Input
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="자기소개 설정"
            type="text"
            name="intro"
            maxLength={30}
            required
          />
          <S.LimitText>30자 이내</S.LimitText>
          <Button title="저장하기" onClick={handleSave} />
        </S.InputBox>
      </S.Container>
    </>
  );
}
