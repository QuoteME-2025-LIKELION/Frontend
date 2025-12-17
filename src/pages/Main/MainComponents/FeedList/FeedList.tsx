import Feed from "@/components/Feed/Feed";
import * as S from "./FeedListStyled";
import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import type { OtherQuote } from "@/types/feed.type";
import type { Friend } from "@/types/friend.type";
import api from "@/api/api";

export default function FeedList({
  date,
  otherQuotes,
  friendList,
  onTagRequest,
  onPoke,
  onShare,
}: {
  date?: string;
  otherQuotes: OtherQuote[] | [];
  friendList: Friend[] | [];
  onTagRequest?: (quoteId: number) => void;
  onPoke?: (friendId: number) => void;
  onShare: (shareProcess: () => Promise<void>) => void;
}) {
  // date prop이 없으면(undefined이면) 오늘 날짜를 사용 -> 추후 글 조회를 날짜 기반으로 하도록 요청 예정
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [shareStatus, setShareStatus] = useState<
    "nothing" | "sharing" | "completed"
  >("nothing");

  // completed 상태가 되면 1.5초 후에 nothing 상태로 되돌리는 로직
  useEffect(() => {
    if (shareStatus === "completed") {
      const timer = setTimeout(() => {
        setShareStatus("nothing");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [shareStatus]);

  // 친구 목록과 명언 목록 조합
  const combinedFeeds = useMemo(() => {
    // otherQuotes를 닉네임으로 쉽게 찾을 수 있도록 Map으로 변환
    const quotesMap = new Map(
      otherQuotes.map((quote) => [quote.authorNickname, quote])
    );

    // 친구 목록을 기준으로 최종 피드 배열 생성
    return friendList.map((friend) => {
      const friendQuote = quotesMap.get(friend.nickname);

      if (friendQuote) {
        // 친구가 오늘 명언을 썼다면, 해당 명언 정보와 isSilenced: false를 반환
        return {
          ...friendQuote,
          friendId: friend.id, // friendId를 별도 속성으로 추가 (명언 안 쓴 경우와 구분)
          isSilenced: false,
        };
      } else {
        // 친구가 명언을 안 썼다면, 친구 정보 기반으로 빈 명언 객체 생성
        return {
          id: friend.id, // key로 사용하기 위한 고유 ID
          friendId: friend.id, // friendId를 명시적으로 추가
          authorNickname: friend.nickname,
          authorProfileImage: friend.profileImage,
          authorIntroduction: friend.introduction,
          isSilenced: true, // isSilenced 플래그를 true로 설정
          // 나머지 Feed 컴포넌트가 필요로 하는 기본값들
          content: "",
          taggedNicknames: [],
          timeAgo: "",
          isLiked: false,
          createDate: "",
          isFriendQuote: true,
        };
      }
    });
  }, [otherQuotes, friendList]);

  const handleRequest = async (quoteId: number) => {
    try {
      await api.post(`/api/quotes/${quoteId}/tag-request`);
      // API 호출 성공 후, 부모에게 받은 onTagRequest 함수 호출
      onTagRequest?.(quoteId);
    } catch (err) {
      console.error("태그 요청 실패:", err);
      // 실패 시 사용자에게 알림
      alert("태그 요청에 실패했습니다.");
    }
  };
  const handleLike = async (quoteId: number, isLiked: boolean) => {
    if (isLiked) {
      try {
        await api.delete(`/api/quotes/${quoteId}/like`);
      } catch (err) {
        console.error("좋아요 취소 실패:", err);
        alert("좋아요를 취소하지 못했습니다.");
      }
    } else {
      try {
        await api.post(`/api/quotes/${quoteId}/like`);
      } catch (err) {
        console.error("좋아요 실패:", err);
        alert("좋아요에 실패했습니다.");
      }
    }
  };
  const handleShare = (authorNickname: string, index: number) => {
    const shareProcess = () =>
      new Promise<void>((resolve, reject) => {
        const feedElement = feedRefs.current[index];
        if (feedElement) {
          toPng(feedElement)
            .then((dataUrl) => {
              const link = document.createElement("a");
              link.download = `QuoteMe-${displayDate}-${authorNickname}.png`;
              link.href = dataUrl;
              link.click();
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        }
      });

    onShare(shareProcess);
  };
  const handlePoke = async (friendId: number) => {
    try {
      await api.post(`/api/pokes/${friendId}`);
      // API 호출 성공 후, 부모에게 받은 onPoke 함수 호출
      onPoke?.(friendId);
    } catch (err) {
      console.error("콕 찌르기 실패:", err);
      // 실패 시 사용자에게 알림
      alert("콕 찌르기에 실패했습니다.");
    }
  };

  return (
    <S.FeedList>
      {combinedFeeds.length > 0 ? (
        combinedFeeds.map((quote, index) => (
          <Feed
            key={quote.id}
            ref={(el: HTMLDivElement | null) => {
              feedRefs.current[index] = el;
            }}
            profileImageUrl={quote.authorProfileImage}
            authorName={quote.authorNickname}
            bio={quote.authorIntroduction}
            createDate={quote.createDate}
            content={quote.content}
            tag={quote.taggedNicknames}
            isLiked={quote.isLiked}
            onLike={() => handleLike(quote.id, quote.isLiked)}
            // Quote가 있을 때만 공유 버튼 활성화
            onShare={
              !quote.isSilenced
                ? () => handleShare(quote.authorNickname, index)
                : undefined
            }
            onRequest={() => {
              handleRequest(quote.id);
            }}
            onPoke={() => {
              handlePoke(quote.friendId);
            }}
            isInArchive={false}
            isSilenced={quote.isSilenced}
            timeAgo={quote.timeAgo}
          />
        ))
      ) : (
        <S.NoFeedText>명언을 나눌 친구가 없습니다.</S.NoFeedText>
      )}
    </S.FeedList>
  );
}
