import Feed from "@/components/Feed/Feed";
import * as S from "./FeedListStyled";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import type { OtherQuote } from "@/types/feed.type";
import type { Friend } from "@/types/friend.type";
import api from "@/api/api";
import ToastModal from "@/components/ToastModal/ToastModal";

interface QuotesItem extends OtherQuote {
  friendId: number;
  isSilenced: boolean;
}

export default function FeedList({
  date,
  otherQuotes,
  friendList,
  onTagRequest,
  onPoke,
  onShare,
  isLoading,
}: {
  date?: string;
  otherQuotes: OtherQuote[] | [];
  friendList: Friend[] | [];
  onTagRequest?: () => void;
  onPoke?: () => void;
  onShare: (shareProcess: () => Promise<void>) => void;
  isLoading: boolean;
}) {
  // date prop이 없으면(undefined이면) 오늘 날짜를 사용 -> 추후 글 조회를 날짜 기반으로 하도록 요청 예정
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [quotes, setQuotes] = useState<QuotesItem[]>([]); // 피드 목록을 상태로 관리

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // otherQuotes나 friendList가 변경될 때 feeds 상태를 업데이트
  useEffect(() => {
    const quotesMap = new Map(
      otherQuotes.map((quote) => [quote.authorNickname, quote])
    );

    const combined = friendList.map((friend) => {
      const friendQuote = quotesMap.get(friend.nickname);
      if (friendQuote) {
        return {
          ...friendQuote,
          friendId: friend.id,
          isSilenced: false,
        };
      } else {
        return {
          id: friend.id,
          friendId: friend.id,
          authorNickname: friend.nickname,
          authorProfileImage: friend.profileImage,
          authorIntroduction: friend.introduction,
          isSilenced: true,
          content: "",
          taggedNicknames: [],
          timeAgo: "",
          isLiked: false,
          createDate: "",
          isFriendQuote: true,
        };
      }
    });
    setQuotes(combined);
  }, [otherQuotes, friendList]);

  const handleRequest = async (quoteId: number) => {
    try {
      await api.post(`/api/quotes/${quoteId}/tag-request`);
      // API 호출 성공 후, 부모에게 받은 onTagRequest 함수 호출
      onTagRequest?.();
    } catch (err) {
      console.error("태그 요청 실패:", err);
      // 실패 시 사용자에게 알림
      setErrorMessage("태그 요청에 실패했습니다.");
      setShowErrorToast(true);
    }
  };

  const handleLike = async (quoteId: number, isLiked: boolean) => {
    // 먼저 UI를 낙관적으로 업데이트
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote) =>
        quote.id === quoteId ? { ...quote, isLiked: !isLiked } : quote
      )
    );

    try {
      if (isLiked) {
        await api.delete(`/api/quotes/${quoteId}/like`);
      } else {
        await api.post(`/api/quotes/${quoteId}/like`);
      }
    } catch (err) {
      // API 호출 실패 시 UI를 원래 상태로 되돌림
      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === quoteId ? { ...quote, isLiked: isLiked } : quote
        )
      );
      console.error("좋아요 처리 실패:", err);
      setErrorMessage("좋아요 처리에 실패했습니다.");
      setShowErrorToast(true);
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
      onPoke?.();
    } catch (err) {
      console.error("콕 찌르기 실패:", err);
      // 실패 시 사용자에게 알림
      setErrorMessage("콕 찌르기에 실패했습니다.");
      setShowErrorToast(true);
    }
  };

  return (
    <S.FeedList>
      {showErrorToast && (
        <ToastModal
          isVisible={showErrorToast}
          onClose={() => {
            setShowErrorToast(false);
          }}
          text={errorMessage}
        />
      )}
      {
        quotes.length > 0 ? (
          quotes.map((quote, index) => (
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
        ) : !isLoading ? ( // 로딩이 끝났고, quotes가 비어있을 때만 메시지 표시
          <S.NoFeedText>명언을 나눌 친구가 없습니다.</S.NoFeedText>
        ) : null /* 로딩 중일 때는 아무것도 표시하지 않음 */
      }
    </S.FeedList>
  );
}
