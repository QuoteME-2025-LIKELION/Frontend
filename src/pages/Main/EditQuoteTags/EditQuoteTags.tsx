import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Spinner from "@/components/Spinner/Spinner";
import useAnimatedToggle from "@/hooks/useAnimatedToggle";
import { useQuotesByDateQuery } from "@/hooks/useQuoteQueries";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";

import * as S from "./EditQuoteTags.styles";
import DateHeader from "../components/DateHeader/DateHeader";
import HomeBox from "../components/HomeBox/HomeBox";
import NewQuote from "../components/NewQuote/NewQuote";
import XHeader from "../components/XHeader/XHeader";

export default function EditQuoteTags() {
  const navigate = useNavigate();
  const location = useLocation();
  const date = location.state?.date as string | undefined;

  const { active, toggle: toggleMenu, isVisible: isToggleVisible } = useAnimatedToggle();

  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const { data: quotesData, isLoading } = useQuotesByDateQuery(displayDate);
  const myQuote = quotesData?.myQuotes[0] || null;

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
      {date ? (
        <XHeader />
      ) : (
        <DateHeader onToggleMenu={toggleMenu} />
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
