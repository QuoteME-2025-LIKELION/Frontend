import DateHeader from "./MainComponents/DateHeader/DateHeader";
import HomeBox from "./MainComponents/HomeBox/HomeBox";
import FeedList from "./MainComponents/FeedList/FeedList";
import * as S from "@/pages/Main/MainStyled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function MainHome() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  return (
    <S.Container>
      <DateHeader active={active} setActive={setActive} />

      {active && (
        <S.Toggle>
          <S.ToggleBtn onClick={() => navigate("/friend-group")}>
            친구 및 그룹
          </S.ToggleBtn>
          <S.ToggleBtn
            onClick={() =>
              navigate("/profile-center", {
                state: { from: "/home" }, // home 페이지(메인 화면에서 바로 왔다고 표시)
              })
            }
          >
            프로필 관리
          </S.ToggleBtn>
          <S.ToggleBtn onClick={() => navigate("/setting-page")}>
            환경 설정
          </S.ToggleBtn>
        </S.Toggle>
      )}

      <HomeBox />
      <FeedList />
    </S.Container>
  );
}
