import DateHeader from "./MainComponents/DateHeader";
import MainHomeBox from "./MainComponents/HomeBox";
import FeedList from "./MainComponents/FeddList";
import * as S from "@/pages/Main/MainStyled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function MainHome() {
    const navigate = useNavigate();
    const [active, setActive] = useState(false); 

    return (
        <S.Container>

            <DateHeader active={active} setActive={setActive} />

            {active && 
                <S.Toggle>
                    <S.ToggleBtn onClick={() => navigate("")}>친구 및 그룹</S.ToggleBtn>
                    <S.ToggleBtn onClick={() => navigate("/profile-centerX")}>프로필 관리</S.ToggleBtn>
                    <S.ToggleBtn onClick={() => navigate("/setting-page")}>환경 설정</S.ToggleBtn>
                </S.Toggle>
            }

            <MainHomeBox />
            <FeedList />
        </S.Container>
    );
}
