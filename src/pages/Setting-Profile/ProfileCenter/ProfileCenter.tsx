import Button from "@/components/Button/Button";
import * as S from "./ProfileCenterStyled";
import Header from "@/components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
//import { useEffect, useState } from "react";

export default function ProfileCenter() {
  const navigate = useNavigate();
  const location = useLocation();
  // state에서 from 값을 가져옴 (기본값 null)
  // 주소창에서 그대로 진입하는 경우 뒤로가기 버튼을 보여주도록 수정
  const fromPath = location.state?.from || "default"; // null일 땐 'default' 로 설정
  const showXBtn = fromPath === "/home";
  const showBackBtn = fromPath === "/setting-page" || fromPath === "default"; // 'default'일 때도 true

  /*
  const [profile, setProfile] = useState<{
    nickname: string;
    email: string;
    intro: string;
    imageUrl?: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: GET /api/profile
        // const res = await api.get("/api/profile");
        // setProfile(res.data);
      } catch (e) {
        console.error("프로필 조회 실패", e);
      }
    };

    fetchProfile();
  }, []);
  */
  return (
    <>
      <PageTitle title="프로필 관리" />
      <S.Container>
        <Header
          showBackBtn={showBackBtn}
          showXBtn={showXBtn}
          title="프로필 관리"
          backgroundColor="white"
          onClickXBtn={() => navigate(-1)}
          onClickBackBtn={() => navigate(-1)}
        />
        <S.ProfileWrapper>
          <S.ImgPreview />
          <S.ImgInput>이미지 등록</S.ImgInput>
        </S.ProfileWrapper>
        <S.InputBox>
          <S.InfoBox>이름</S.InfoBox>
          <S.InfoBox style={{ color: "#959595" }}>이메일</S.InfoBox>
          <S.TextName>자기소개</S.TextName>
          <S.InfoBox>안녕하세욤</S.InfoBox>
          <Button title="편집하기" onClick={() => navigate("/profile-edit")} />
        </S.InputBox>
      </S.Container>
    </>
  );
}
