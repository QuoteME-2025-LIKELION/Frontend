import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { NoticeSummary } from "@/api/noticeApi";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useNoticesQuery } from "@/hooks/useNoticeQueries";

import * as S from "./Notice.styles";

const INITIAL_NEWS_COUNT = 3;

function formatNoticeDate(date: string) {
  return date.slice(0, 10).replaceAll("-", ".");
}

function isImportantNotice(notice: NoticeSummary) {
  return notice.type === "IMPORTANT" || notice.type === "NOTICE";
}

export default function Notice() {
  const navigate = useNavigate();
  const { data: notices = [] } = useNoticesQuery();
  const [visibleNewsCount, setVisibleNewsCount] = useState(INITIAL_NEWS_COUNT);

  const importantNotices = useMemo(
    () => notices.filter(isImportantNotice),
    [notices]
  );
  const newsNotices = useMemo(
    () => notices.filter((notice) => !isImportantNotice(notice)),
    [notices]
  );
  const visibleNews = newsNotices.slice(0, visibleNewsCount);

  return (
    <>
      <PageTitle title="공지사항" />
      <S.Container>
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="공지사항"
          backgroundColor="primary"
          onClickBackBtn={() => navigate("/setting-page")}
        />
        <S.TopSection>
          <S.SectionTitle $light>중요 공지</S.SectionTitle>
          {importantNotices.length > 0 ? (
            <S.ImportantList>
              {importantNotices.map((notice) => (
                <S.ImportantItem key={notice.noticeId}>
                  <S.ImportantTitle>{notice.title}</S.ImportantTitle>
                  <S.ImportantDate>
                    {formatNoticeDate(notice.createdAt)}
                  </S.ImportantDate>
                </S.ImportantItem>
              ))}
            </S.ImportantList>
          ) : (
            <S.Empty>등록된 중요 공지가 없습니다.</S.Empty>
          )}
        </S.TopSection>
        <S.NewsSection>
          <S.SectionTitle>소식</S.SectionTitle>
          {visibleNews.length > 0 ? (
            <S.NewsList>
              {visibleNews.map((notice) => (
                <S.NewsItem key={notice.noticeId}>
                  <S.NewsTitle>{notice.title}</S.NewsTitle>
                  <S.NewsDate>{formatNoticeDate(notice.createdAt)}</S.NewsDate>
                  <S.NewsContent>
                    {notice.content ?? "공지 내용을 확인해 주세요."}
                  </S.NewsContent>
                </S.NewsItem>
              ))}
            </S.NewsList>
          ) : (
            <S.Empty>등록된 소식이 없습니다.</S.Empty>
          )}
          {visibleNewsCount < newsNotices.length && (
            <S.MoreButton
              type="button"
              onClick={() =>
                setVisibleNewsCount((prev) => prev + INITIAL_NEWS_COUNT)
              }
            >
              더보기
            </S.MoreButton>
          )}
        </S.NewsSection>
      </S.Container>
    </>
  );
}
