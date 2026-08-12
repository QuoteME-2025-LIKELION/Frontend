import DateHeader from "@/pages/Main/components/DateHeader/DateHeader";
import HomeBox from "@/pages/Main/components/HomeBox/HomeBox";
import FeedList from "@/pages/Main/components/FeedList/FeedList";
import * as S from "@/pages/Main/Main.styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequestModal from "@/pages/Main/components/Modal/RequestModal";
import XHeader from "@/pages/Main/components/XHeader/XHeader";
import HomeSideMenu from "@/pages/Main/components/HomeSideMenu/HomeSideMenu";

import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import ToastModal from "@/components/ToastModal/ToastModal";
import Spinner from "@/components/Spinner/Spinner";
import { useFriendsQuery } from "@/hooks/useFriendQueries";
import { useQuotesByDateQuery } from "@/hooks/useQuoteQueries";
import { useImageShare } from "@/hooks/useImageShare";
import { useMyProfileQuery } from "@/hooks/useProfileQueries";
import useAnimatedToggle from "@/hooks/useAnimatedToggle";

export default function Home() {
  const navigate = useNavigate();

  const {
    active,
    setActive,
    isVisible: isToggleVisible,
    close: closeToggle,
  } = useAnimatedToggle();

  const { date } = useParams();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"tag" | "poke">("tag");
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const { data: quotesData, isLoading: isQuotesLoading } =
    useQuotesByDateQuery(displayDate);
  const { data: friendList = [], isLoading: isFriendsLoading } =
    useFriendsQuery();
  const { data: myProfile } = useMyProfileQuery();
  const myQuote = quotesData?.myQuotes[0] || null;
  const otherQuotes = quotesData?.otherQuotes || [];
  const isLoading = isQuotesLoading || isFriendsLoading;
  const profileImage = myProfile?.profileImage;
  const profileNickname = myProfile?.nickname || "사용자";
  const profileIntroduction = myProfile?.introduction || "자기소개가 없습니다.";
  const {
    shareStatus,
    showShareErrorToast,
    executeShare,
    resetShareStatus,
    closeShareErrorToast,
  } = useImageShare();

  useEffect(() => {
    // date 파라미터 유효성 검사
    if (date) {
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
      if (!isValidDate) {
        navigate("/not-found", { replace: true }); // 잘못된 형식이면 NotFound 페이지로 이동
        return; // 유효하지 않으면 데이터 요청 등 아래 로직을 실행하지 않음
      }
    }

  }, [date, navigate]);

  // 태그 요청
  const handleTagRequest = () => {
    setRequestType("tag");
    setIsTagModalOpen(true);
  };

  // 콕 찌르기
  const handlePoke = () => {
    setRequestType("poke");
    setIsTagModalOpen(true);
  };

  return (
    <S.Container>
      {isLoading && <Spinner />}

      {/* 아카이브 기능으로 다른 날짜로 이동했을 땐 홈으로 돌아가는 버튼 있는 헤더가 뜨는 게 나을 것 같아서 수정 */}
      {date ? (
        <XHeader />
      ) : (
        <DateHeader setActive={setActive} />
      )}

      {isToggleVisible && (
        <HomeSideMenu
          active={active}
          profileImage={profileImage}
          nickname={profileNickname}
          introduction={profileIntroduction}
          onClose={closeToggle}
        />
      )}

      <HomeBox date={date} myQuote={myQuote} onShare={executeShare} />
      <FeedList
        date={date}
        otherQuotes={otherQuotes}
        friendList={friendList}
        onTagRequest={handleTagRequest}
        onPoke={handlePoke}
        onShare={executeShare}
        isLoading={isLoading}
      />
      {isTagModalOpen && (
        <RequestModal
          type={requestType}
          onClose={() => setIsTagModalOpen(false)}
          isVisible={isTagModalOpen}
        />
      )}
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
    </S.Container>
  );
}
