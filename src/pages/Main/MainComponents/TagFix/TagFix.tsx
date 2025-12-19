import DateHeader from "../DateHeader/DateHeader";
import HomeBox from "../HomeBox/HomeBox";
import * as S from "@/pages/Main/MainStyled";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import XHeader from "@/pages/Main/MainComponents/XHeader/XHeader";
import type { MyQuote } from "@/types/feed.type";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import api from "@/api/api";
import Spinner from "@/components/Spinner/Spinner";
import NewQuote from "@/pages/Main/MainComponents/NewQuote/NewQuote";

export default function TagFix() {
  const navigate = useNavigate();
  const location = useLocation();
  const date = location.state?.date as string | undefined;

  // 토글 상태 관리
  const [active, setActive] = useState(false);
  const [isToggleVisible, setIsToggleVisible] = useState(false);

  const [myQuote, setMyQuote] = useState<MyQuote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        const res = await api.get(`/api/quotes?date=${displayDate}`);
        setMyQuote(res.data.myQuotes[0] || null);
      } catch (err) {
        console.error("메인화면 조회 실패", err);
        setMyQuote(null);
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

      <HomeBox date={date} myQuote={myQuote} />
      {myQuote && (
        <NewQuote
          quote={{
            id: myQuote.id,
            content: myQuote.content,
            authorName: myQuote.authorNickname,
            authorBirthYear: myQuote.birthYear,
            taggedNicknames: myQuote.taggedNicknames,
          }}
          mode="fix"
        />
      )}
    </S.Container>
  );
}
