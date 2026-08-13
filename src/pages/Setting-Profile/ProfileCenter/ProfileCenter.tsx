import Button from "@/components/Button/Button";
import * as S from "./ProfileCenter.styles";
import Header from "@/components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useSettingsProfileQuery } from "@/hooks/useProfileQueries";

export default function ProfileCenter() {
  const navigate = useNavigate();
  const location = useLocation();
  // state에서 from 값을 가져옴 (기본값 null)
  // 주소창에서 그대로 진입하는 경우 뒤로가기 버튼을 보여주도록 수정
  const fromPath = location.state?.from || "default"; // null일 땐 'default' 로 설정
  const showXBtn = fromPath === "/home";
  const showBackBtn = fromPath === "/setting-page" || fromPath === "default"; // 'default'일 때도 true

  const { data } = useSettingsProfileQuery();
  const profile = data
    ? {
        nickname: data.nickname,
        email: data.email,
        intro: data.introduction,
        imageUrl: data.profileImage,
      }
    : null;

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
