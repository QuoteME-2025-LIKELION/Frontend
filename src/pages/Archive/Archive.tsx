import Header from "@/components/Header/Header";
import * as S from "./ArchiveStyle";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Archive() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/").pop();
  return (
    <S.Container>
      <Header
        showBackBtn={false}
        showXBtn={true}
        title="아카이브"
        backgroundColor="secondary"
        onClickXBtn={() => navigate(-1)}
      />
      <S.Menu>
        <S.Btn
          onClick={() => navigate("/archive")}
          $active={path === "archive"}
        >
          전체보기
        </S.Btn>
        <S.Btn
          onClick={() => navigate("/archive/my-quotes")}
          $active={path === "my-quotes"}
        >
          나의 명언
        </S.Btn>
        <S.Btn
          onClick={() => navigate("/archive/likes")}
          $active={path === "likes"}
        >
          좋아요
        </S.Btn>
      </S.Menu>
      <Outlet />
    </S.Container>
  );
}
