import Button from "@/components/Button/Button";
import * as S from "./ProfileCenterStyled";
import Header from "@/components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useEffect, useState } from "react";
import api from "@/api/api";

export default function ProfileCenter() {
  const navigate = useNavigate();
  const location = useLocation();
  // state에서 from 값을 가져옴 (기본값 null)
  // 주소창에서 그대로 진입하는 경우 뒤로가기 버튼을 보여주도록 수정
  const fromPath = location.state?.from || "default"; // null일 땐 'default' 로 설정
  const showXBtn = fromPath === "/home";
  const showBackBtn = fromPath === "/setting-page" || fromPath === "default"; // 'default'일 때도 true

  const [profile, setProfile] = useState<{
    nickname: string;
    email: string;
    intro: string;
    imageUrl?: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/settings/profile");
        setProfile({
          nickname: res.data.nickname,
          email: res.data.email,
          intro: res.data.introduction,
          imageUrl: res.data.profileImage,
        });
      } catch (e) {
        console.error("프로필 조회 실패", e);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <PageTitle title="프로필 관리" />
      <S.Container>
        <Header
          showBackBtn={showBackBtn}
          showXBtn={showXBtn}
          title="프로필 관리"
          backgroundColor="white"
          onClickXBtn={() => navigate("/home")}
          onClickBackBtn={() => navigate("/setting-page")}
        />
        <S.ProfileWrapper>
          <S.ImgPreview
            style={{
              backgroundImage: profile?.imageUrl
                ? `url(${profile.imageUrl})`
                : "none",
            }}
          />
        </S.ProfileWrapper>
        <S.InputBox>
          <S.InfoBox>{profile?.nickname}</S.InfoBox>
          <S.InfoBox style={{ color: "#959595" }}>{profile?.email}</S.InfoBox>
          <S.TextName>자기소개</S.TextName>
          <S.InfoBox>{profile?.intro}</S.InfoBox>
          <Button
            title="편집하기"
            onClick={() =>
              navigate("/profile-edit", { state: { profile: profile } })
            }
          />
        </S.InputBox>
      </S.Container>
    </>
  );
}
