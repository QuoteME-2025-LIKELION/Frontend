import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import bookmarkOutlineIcon from "@/assets/icons/archive/bookmark-outline.svg";
import shareIcon from "@/assets/icons/archive/share.svg";
import userIcon from "@/assets/icons/archive/user.svg";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { MyQuote } from "@/types/feed.type";
import { formatCustomDate } from "@/utils/formatCustomDate";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";

import * as S from "./HomeBox.styles";

interface HomeBoxProps {
  date?: string;
  myQuote: MyQuote | null;
  onShare?: (shareProcess: () => Promise<void>) => void; // EditQuoteTags에서는 전달 X
}

export default function HomeBox({ date, myQuote, onShare }: HomeBoxProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const downloadElementImage = useElementImageDownload();
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const formattedDate = formatCustomDate(displayDate);
  const [month, day, weekday] = formattedDate.split(" ");

  const hasFeed = !!myQuote;
  const taggedNicknames = myQuote?.taggedNicknames ?? [];
  let line1: string, line2: string;

  // 내 피드 내용이 존재한다면 두 줄로 분리
  // 존재하지 않는다면 피드 작성하도록 유도
  if (hasFeed) {
    const text = myQuote.content;
    if (text.length <= 10) {
      [line1, line2] = [text, ""];
    } else {
      const middle = Math.floor(text.length / 2);
      const splitPoint = text.lastIndexOf(" ", middle);
      if (splitPoint !== -1) {
        line1 = text.substring(0, splitPoint);
        line2 = text.substring(splitPoint + 1);
      } else {
        line1 = text.substring(0, middle);
        line2 = text.substring(middle);
      }
    }
  } else {
    line1 = "오늘 있었던 일을 바탕으로";
    line2 = "나만의 명언을 남겨보세요.";
  }

  const handleShare = () => {
    const shareProcess = () =>
      downloadElementImage(
        containerRef.current,
        `QuoteMe-${displayDate}-${myQuote?.authorNickname}.png`
      );

    onShare?.(shareProcess); // 부모의 executeShare 함수 실행
  };
  const handleEditTags = () => {
    navigate("/fix", { state: { date: displayDate } });
  };

  const handleTagButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsTagMenuOpen((prev) => !prev);
  };

  const handleTagEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleEditTags();
  };

  return (
    <S.Container ref={containerRef} onClick={() => setIsTagMenuOpen(false)}>
      <S.DateBox>
        <S.Month>{month}</S.Month>
        <S.Weekday>{weekday}</S.Weekday>
      </S.DateBox>
      {/* 내 피드가 존재하지 않는다면 글 쓰기 페이지로 이동 */}
      {/* 내 피드가 존재한다면 태그 수정 페이지로 이동 */}
      <S.Wrapper
        type="button"
        onClick={() => {
          if (hasFeed) {
            navigate("/fix", { state: { date: displayDate } });
            return;
          }

          navigate("/write");
        }}
      >
        <S.Day>{day}</S.Day>
        <S.QuoteArea>
          <S.Text hasFeed={hasFeed}>{line1}</S.Text>
          <S.Text hasFeed={hasFeed}>{line2 ? line2 : ""}</S.Text>
        </S.QuoteArea>
      </S.Wrapper>
      <S.Bottom>
        {hasFeed && (
          <S.TagBox>
            <S.TagButton type="button" onClick={handleTagButtonClick}>
              <img src={userIcon} alt="" />
              {taggedNicknames.length}
            </S.TagButton>
            {isTagMenuOpen && (
              <S.TagMenu>
                {taggedNicknames.length > 0 ? (
                  taggedNicknames.map((nickname) => (
                    <S.TagName key={nickname}>{nickname}</S.TagName>
                  ))
                ) : (
                  <S.TagName>추가하기</S.TagName>
                )}
                <S.TagEditButton type="button" onClick={handleTagEditClick}>
                  {taggedNicknames.length > 0 ? "수정하기" : "추가하기"}
                </S.TagEditButton>
              </S.TagMenu>
            )}
          </S.TagBox>
        )}
        <S.AuthorBox>
          {hasFeed && (
            <>
              <S.AuthorDivider />
              <S.AuthorText>
                {myQuote.authorNickname}({myQuote.birthYear}~)
              </S.AuthorText>
            </>
          )}
        </S.AuthorBox>
        <S.BottomActions>
          <S.IconButton type="button" aria-label="북마크" disabled={!hasFeed}>
            <img src={bookmarkOutlineIcon} alt="" />
          </S.IconButton>
          <S.IconButton
            type="button"
            aria-label="공유하기"
            onClick={handleShare}
            disabled={!hasFeed}
          >
            <img src={shareIcon} alt="" />
          </S.IconButton>
        </S.BottomActions>
      </S.Bottom>
    </S.Container>
  );
}
