import Header from "@/components/Header/Header";
import * as S from "./Archive.styles";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useImageShare } from "@/hooks/useImageShare";

export default function Archive() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/").pop();
  const {
    shareStatus,
    showShareErrorToast,
    executeShare,
    resetShareStatus,
    closeShareErrorToast,
  } = useImageShare();

  return (
    <>
      <PageTitle title="아카이브" />
      <S.Container>
        {shareStatus !== "nothing" && (
          <ToastModal
            isVisible={true}
            onClose={resetShareStatus}
            text={
              shareStatus === "sharing"
                ? "명언 이미지를 저장중입니다."
                : "명언 이미지를 저장했습니다."
            }
            isOnShare={shareStatus === "sharing"}
            showOverlay={true}
          />
        )}

        {showShareErrorToast && (
          <ToastModal
            isVisible={showShareErrorToast}
            onClose={closeShareErrorToast}
            text="이미지 저장에 실패했습니다."
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="아카이브"
          backgroundColor="secondary"
          onClickXBtn={() => navigate("/home")}
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
        <Outlet context={{ onShare: executeShare }} />
      </S.Container>
    </>
  );
}
