import Header from "@/components/Header/Header";
import * as S from "./ArchiveStyle";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useEffect, useState } from "react";
import ToastModal from "@/components/ToastModal/ToastModal";

export default function Archive() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/").pop();

  // handleShare 상태 관리
  const [shareStatus, setShareStatus] = useState<
    "nothing" | "sharing" | "completed"
  >("nothing");

  const [showErrorToast, setShowErrorToast] = useState(false);

  // 공유 프로세스를 실행하는 래퍼 함수
  const executeShare = async (shareProcess: () => Promise<void>) => {
    setShareStatus("sharing");
    try {
      await shareProcess(); // 자식에게 받은 이미지 생성 로직 실행
      setShareStatus("completed");
    } catch (error) {
      console.error("Share failed", error);
      setShowErrorToast(true);
      setShareStatus("nothing"); // 실패 시 초기화
    }
  };

  // completed 상태가 되면 1.5초 후에 nothing 상태로 되돌리는 로직
  useEffect(() => {
    if (shareStatus === "completed") {
      const timer = setTimeout(() => {
        setShareStatus("nothing");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [shareStatus]);

  return (
    <>
      <PageTitle title="아카이브" />
      <S.Container>
        {shareStatus !== "nothing" && (
          <ToastModal
            isVisible={true}
            onClose={() => setShareStatus("nothing")}
            text={
              shareStatus === "sharing"
                ? "명언 이미지를 저장중입니다."
                : "명언 이미지를 저장했습니다."
            }
            isOnShare={shareStatus === "sharing"}
            showOverlay={true}
          />
        )}

        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => setShowErrorToast(false)}
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
