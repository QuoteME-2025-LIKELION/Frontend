import DateHeader from "./MainComponents/DateHeader/DateHeader";
import HomeBox from "./MainComponents/HomeBox/HomeBox";
import FeedList from "./MainComponents/FeedList/FeedList";
import * as S from "@/pages/Main/MainStyled";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequestModal from "./MainComponents/Modal/RequestModal";

import type { MyQuote, OtherQuote } from "@/types/feed.type";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import api from "@/api/api";
import type { Friend } from "@/types/friend.type";
import ToastModal from "@/components/ToastModal/ToastModal";
export default function MainHome() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const { date } = useParams();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"tag" | "poke">("tag");

  const [myQuote, setMyQuote] = useState<MyQuote | null>(null);
  const [otherQuotes, setOtherQuotes] = useState<OtherQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [friendList, setFriendList] = useState<Friend[]>([]); // 아무것도 쓰지 않은 친구 명언 파악을 위한 친구 리스트 상태

  // handleShare 상태 관리
  const [shareStatus, setShareStatus] = useState<
    "nothing" | "sharing" | "completed"
  >("nothing");

  useEffect(() => {
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
  }, [date]);

  // 태그 요청 - quoteId를 받아 모달 상태 설정
  const handleTagRequest = (quoteId: number) => {
    setRequestType("tag");
    setIsTagModalOpen(true);
  };

  // 콕 찌르기 - friendId를 받아 모달 상태 설정
  const handlePoke = (friendId: number) => {
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
      alert("이미지 저장에 실패했습니다.");
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

      <HomeBox date={date} myQuote={myQuote} onShare={executeShare} />
      <FeedList
        date={date}
        otherQuotes={otherQuotes}
        friendList={friendList}
        onTagRequest={handleTagRequest}
        onPoke={handlePoke}
        onShare={executeShare}
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
    </S.Container>
  );
}
