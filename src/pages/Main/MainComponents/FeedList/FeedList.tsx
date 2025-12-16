import Feed from "@/components/Feed/Feed";
import * as S from "./FeedListStyled";
import { MOCK_FEEDS } from "@/data/feeds";
import { useRef } from "react";
import { toPng } from "html-to-image";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import { useState } from "react";

interface FeedListProps {
  date?: string;
  onTagRequest?: () => void;
  onPoke?: () => void;
}

export default function FeedList({
  date,
  onTagRequest,
  onPoke,
}: FeedListProps) {
  // date prop이 없으면(undefined이면) 오늘 날짜를 사용 -> 추후 글 조회를 날짜 기반으로 하도록 요청 예정
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null);

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
          isInArchive={false}
          onRequest={() => {
            setSelectedFeedId(feed.id);
            onTagRequest?.();
          }}
          onPoke={() => {
            setSelectedFeedId(feed.id);
            onPoke?.();
          }}
        />
      ))}
    </S.FeedList>
  );
}
