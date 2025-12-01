import * as S from "./SettingPageStyled";
import Header from "@/components/Header/Header";
import { useNavigate } from "react-router-dom";


export default function SettingPage() {
    const navigate = useNavigate();

    return (
    <S.Container>
        <Header
            showBackBtn={false}
            showXBtn={true} 
            title="환경설정"
            backgroundColor="white"
            onClickXBtn={() => navigate("")}
        />
        <S.SettingList>
            <S.SettingBtn>프로필</S.SettingBtn>
            <S.SettingBtn>계정</S.SettingBtn>
            <S.SettingBtn>알림</S.SettingBtn>
            <S.SettingBtn style={{ borderBottom: "1px solid #DDD" }}>
            공지사항
            </S.SettingBtn>
            <S.SettingWordLine>
                <S.SettingWord>버전</S.SettingWord>
                <S.SettingWord>1.0</S.SettingWord>
            </S.SettingWordLine>
            <S.LogOutBtn>로그아웃</S.LogOutBtn>
        </S.SettingList>
    </S.Container>
    )
    ;
}
