import * as S from "./ProfileCenterStyled";
import Header from "@/components/Header/Header";
import { useNavigate } from "react-router-dom";


export default function ProfileCenter() {
    const navigate = useNavigate();

    return (
    <S.Container>
        <Header
            showBackBtn={false}
            showXBtn={true} 
            title="프로필 관리"
            backgroundColor="white"
            onClickXBtn={() => navigate("")}
        />
        <S.ProfileWrapper>
            <S.ImgPreview/>
            <S.ImgInput>
                이미지 등록
            </S.ImgInput>
        </S.ProfileWrapper>
        <S.InputBox>
            <S.InfoBox>이름</S.InfoBox>
            <S.InfoBox style={{ color: "#959595" }}>이메일</S.InfoBox>
            <S.TextName>자기소개</S.TextName>
            <S.InfoBox>안녕하세욤</S.InfoBox>
            <S.InputBtn onClick={()=>navigate("/profile-edit")}>편집하기</S.InputBtn>
        </S.InputBox>
    </S.Container>
    )
    ;
}
