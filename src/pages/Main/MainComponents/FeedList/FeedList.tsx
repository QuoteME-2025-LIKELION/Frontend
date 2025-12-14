import Feed from "@/components/Feed/Feed";
import * as S from "./FeedListStyled";
import { MOCK_FEEDS } from "@/data/feeds";
import { useRef } from "react";
import { toPng } from "html-to-image";

export default function FeedList({ date }: { date?: string }) {
  // date prop이 없으면(undefined이면) 오늘 날짜를 사용 -> 추후 글 조회를 날짜 기반으로 하도록 요청 예정
  const displayDate = date ? new Date(date) : new Date();
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleLike = () => {
    console.log("좋아요 클릭");
  };

  const handleShare = (
    createDate: string,
    authorName: string,
    index: number
  ) => {
    const feedElement = feedRefs.current[index];
    if (feedElement) {
      toPng(feedElement)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `QuoteMe-${createDate.slice(0, 10)}-${authorName}.png`;
          link.href = dataUrl;
          link.click();
          alert("명언 이미지가 다운로드되었습니다.");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleRequest = () => {
    console.log("태그 요청하기");
  };
  const handlePoke = () => {
    console.log("콕 찌르기");
  };

  return (
    <S.FeedList>
      {MOCK_FEEDS.map((feed, index) => (
        <Feed
          key={feed.id}
          ref={(el: HTMLDivElement | null) => {
            feedRefs.current[index] = el;
          }}
          profileImageUrl={feed.profileImageUrl}
          authorName={feed.authorName}
          bio={feed.bio}
          createDate={feed.createDate}
          content={feed.content}
          tag={feed.taggedUsers?.map((user) => user.nickname)}
          isLiked={feed.isLiked}
          onLike={handleLike}
          onShare={() => handleShare(feed.createDate, feed.authorName, index)}
          onRequest={handleRequest}
          onPoke={handlePoke}
          isInArchive={false}
        />
      ))}
    </S.FeedList>
  );
}
