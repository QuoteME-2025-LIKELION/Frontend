import DateHeader from "./MainComponents/DateHeader/DateHeader";
import HomeBox from "./MainComponents/HomeBox/HomeBox";
import FeedList from "./MainComponents/FeedList/FeedList";
import * as S from "@/pages/Main/MainStyled";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequestModal from "./MainComponents/Modal/RequestModal";
import XHeader from "@/pages/Main/MainComponents/XHeader/XHeader";

import type { MyQuote, OtherQuote } from "@/types/feed.type";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import api from "@/api/api";
import type { Friend } from "@/types/friend.type";
import ToastModal from "@/components/ToastModal/ToastModal";
import Spinner from "@/components/Spinner/Spinner";
export default function MainHome() {
  const navigate = useNavigate();

  // 토글 상태 관리
  const [active, setActive] = useState(false);
  const [isToggleVisible, setIsToggleVisible] = useState(false);

  const { date } = useParams();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"tag" | "poke">("tag");

  const [myQuote, setMyQuote] = useState<MyQuote | null>(null);
  const [otherQuotes, setOtherQuotes] = useState<OtherQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [friendList, setFriendList] = useState<Friend[]>([]); // 아무것도 쓰지 않은 친구 명언 파악을 위한 친구 리스트 상태

  const [showErrorToast, setShowErrorToast] = useState(false);

  // handleShare 상태 관리
  const [shareStatus, setShareStatus] = useState<
    "nothing" | "sharing" | "completed"
  >("nothing");

  useEffect(() => {
    // date 파라미터 유효성 검사
    if (date) {
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
      if (!isValidDate) {
        navigate("/*", { replace: true }); // 잘못된 형식이면 NotFound 페이지로 이동
        return; // 유효하지 않으면 데이터 요청 등 아래 로직을 실행하지 않음
      }
    }

    const displayDate = date ? date : formatDateToYYYYMMDD(new Date());

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 두 API를 병렬로 호출
        const [quotesResponse, friendsResponse] = await Promise.all([
          api.get(`/api/quotes?date=${displayDate}`),
          api.get("/api/settings/friends-list"),
        ]);
        setMyQuote(quotesResponse.data.myQuotes[0] || null);
        setOtherQuotes(quotesResponse.data.otherQuotes);
        setFriendList(friendsResponse.data);
      } catch (err) {
        console.error("메인화면 조회 실패", err);
        setMyQuote(null);
        setOtherQuotes([]);
        setFriendList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [date, navigate]);

  // 토글 애니메이션 및 렌더링 관련 로직
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (active) {
      setIsToggleVisible(true);
    } else {
      timer = setTimeout(() => {
        setIsToggleVisible(false);
      }, 300); // 애니메이션 시간과 동일하게 설정
    }

    // 컴포넌트가 언마운트되거나 active 상태가 바뀌면 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [active]);

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
    <S.Container>
      {isLoading && <Spinner />}

      {/* 아카이브 기능으로 다른 날짜로 이동했을 땐 홈으로 돌아가는 버튼 있는 헤더가 뜨는 게 나을 것 같아서 수정 */}
      {date ? (
        <XHeader />
      ) : (
        <DateHeader active={active} setActive={setActive} />
      )}

      {isToggleVisible && (
        <S.Toggle $active={active}>
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
    </S.Container>
  );
}
