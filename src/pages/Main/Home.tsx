import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Spinner from "@/components/Spinner/Spinner";
import ToastModal from "@/components/ToastModal/ToastModal";
import useAnimatedToggle from "@/hooks/useAnimatedToggle";
import { useFriendsQuery } from "@/hooks/useFriendQueries";
import { useMyGroupsQuery } from "@/hooks/useGroupQueries";
import { useImageShare } from "@/hooks/useImageShare";
import { useMyProfileQuery } from "@/hooks/useProfileQueries";
import { useQuotesByDateQuery } from "@/hooks/useQuoteQueries";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";

import DateHeader from "./components/DateHeader/DateHeader";
import FeedList from "./components/FeedList/FeedList";
import HomeBox from "./components/HomeBox/HomeBox";
import HomeSideMenu from "./components/HomeSideMenu/HomeSideMenu";
import XHeader from "./components/XHeader/XHeader";
import * as S from "./Main.styles";

export default function Home() {
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const {
    active,
    toggle: toggleMenu,
    isVisible: isToggleVisible,
    close: closeToggle,
  } = useAnimatedToggle();

  const { date } = useParams();
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const { data: quotesData, isLoading: isQuotesLoading } = useQuotesByDateQuery(
    displayDate,
    selectedGroupId ?? undefined
  );
  const { data: friendList = [], isLoading: isFriendsLoading } =
    useFriendsQuery();
  const { data: myProfile, isLoading: isProfileLoading } = useMyProfileQuery();
  const { data: groups = [], isLoading: isGroupsLoading } = useMyGroupsQuery();
  const myQuote = quotesData?.myQuotes[0] || null;
  const otherQuotes = quotesData?.otherQuotes || [];
  const isLoading =
    isQuotesLoading || isFriendsLoading || isGroupsLoading || isProfileLoading;
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

  return (
    <S.Container>
      {isLoading && <Spinner />}

      {/* 아카이브 기능으로 다른 날짜로 이동했을 땐 홈으로 돌아가는 버튼 있는 헤더가 뜨는 게 나을 것 같아서 수정 */}
      {date ? <XHeader /> : <DateHeader onToggleMenu={toggleMenu} />}

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
        groups={groups}
        selectedGroupId={selectedGroupId}
        myNickname={profileNickname}
        onSelectGroup={setSelectedGroupId}
        onShare={executeShare}
        isLoading={isLoading}
      />
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
          showOverlay={false}
          variant="snackbar"
        />
      )}

      {showShareErrorToast && (
        <ToastModal
          isVisible={showShareErrorToast}
          onClose={closeShareErrorToast}
          text="이미지 저장에 실패했습니다."
          showOverlay={false}
          variant="snackbar"
        />
      )}
    </S.Container>
  );
}
