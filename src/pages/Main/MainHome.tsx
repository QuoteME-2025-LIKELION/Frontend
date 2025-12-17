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
export default function MainHome() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const { date } = useParams();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"tag" | "poke">("tag");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [myQuote, setMyQuote] = useState<MyQuote | null>(null);
  const [otherQuotes, setOtherQuotes] = useState<OtherQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [friendList, setFriendList] = useState<Friend[]>([]); // 아무것도 쓰지 않은 친구 명언 파악을 위한 친구 리스트 상태

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

      <HomeBox date={date} myQuote={myQuote} />
      <FeedList
        date={date}
        otherQuotes={otherQuotes}
        friendList={friendList}
        onTagRequest={() => {
          //API
          setIsTagModalOpen(true);
        }}
        onPoke={() => {
          //API
          setIsTagModalOpen(true);
        }}
      />
      {isTagModalOpen && (
        <RequestModal type="tag" onClose={() => setIsTagModalOpen(false)} />
      )}
      <HomeBox date={date} myQuote={myQuote} />
    </S.Container>
  );
}
