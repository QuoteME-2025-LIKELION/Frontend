import { useMemo, useRef, useState } from "react";

import QuoteFeed from "@/components/QuoteFeed/QuoteFeed";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import { usePokeFriendMutation } from "@/hooks/useFriendQueries";
import {
  useLikeQuoteMutation,
  useRequestQuoteTagMutation,
  useUnlikeQuoteMutation,
} from "@/hooks/useQuoteQueries";
import type { OtherQuote } from "@/types/feed.type";
import type { Friend } from "@/types/friend.type";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";

import * as S from "./FeedList.styles";

interface QuotesItem extends OtherQuote {
  friendId: number;
  isSilenced: boolean;
  quoteId?: number;
}

type FeedListProps = {
  date?: string;
  otherQuotes: OtherQuote[] | [];
  friendList: Friend[] | [];
  onTagRequest?: () => void;
  onPoke?: () => void;
  onShare: (shareProcess: () => Promise<void>) => void;
  isLoading: boolean;
};

export default function FeedList({
  date,
  otherQuotes,
  friendList,
  onTagRequest,
  onPoke,
  onShare,
  isLoading,
}: FeedListProps) {
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();
  const [likeOverrides, setLikeOverrides] = useState<Record<number, boolean>>(
    {}
  );
  const [pendingLikeIds, setPendingLikeIds] = useState<Record<number, boolean>>(
    {}
  );
  const { mutateAsync: requestQuoteTag } = useRequestQuoteTagMutation();
  const { mutateAsync: likeQuote } = useLikeQuoteMutation();
  const { mutateAsync: unlikeQuote } = useUnlikeQuoteMutation();
  const { mutateAsync: pokeFriend } = usePokeFriendMutation();

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const quotes = useMemo<QuotesItem[]>(() => {
    const quotesMap = new Map(
      otherQuotes.map((quote) => [quote.authorNickname, quote])
    );

    return friendList.map((friend) => {
      const friendQuote = quotesMap.get(friend.nickname);
      if (friendQuote) {
        const quoteId = friendQuote.id;

        return {
          ...friendQuote,
          quoteId,
          friendId: friend.id,
          isSilenced: false,
          isLiked: likeOverrides[quoteId] ?? friendQuote.isLiked,
        };
      }

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
    });
  }, [friendList, likeOverrides, otherQuotes]);

  const handleRequest = async (quoteId: number) => {
    try {
      await requestQuoteTag(quoteId);
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
    if (pendingLikeIds[quoteId]) {
      return;
    }

    setPendingLikeIds((prev) => ({ ...prev, [quoteId]: true }));
    setLikeOverrides((prev) => ({ ...prev, [quoteId]: !isLiked }));

    try {
      if (isLiked) {
        await unlikeQuote(quoteId);
      } else {
        await likeQuote(quoteId);
      }
      setLikeOverrides((prev) => {
        const next = { ...prev };
        delete next[quoteId];
        return next;
      });
    } catch (err) {
      setLikeOverrides((prev) => ({ ...prev, [quoteId]: isLiked }));
      console.error("좋아요 처리 실패:", err);
      setErrorMessage("좋아요 처리에 실패했습니다.");
      setShowErrorToast(true);
    } finally {
      setPendingLikeIds((prev) => {
        const next = { ...prev };
        delete next[quoteId];
        return next;
      });
    }
  };

  const handleShare = (authorNickname: string, index: number) => {
    const shareProcess = () =>
      downloadElementImage(
        feedRefs.current[index],
        `QuoteMe-${displayDate}-${authorNickname}.png`
      );

    onShare(shareProcess);
  };

  const handlePoke = async (friendId: number) => {
    try {
      await pokeFriend(friendId);
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
      {quotes.length > 0 ? (
        quotes.map((quote, index) => (
          <QuoteFeed
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
            isLikeDisabled={Boolean(pendingLikeIds[quote.id])}
            onLike={() => handleLike(quote.id, quote.isLiked)}
            // Quote가 있을 때만 공유 버튼 활성화
            onShare={
              !quote.isSilenced
                ? () => handleShare(quote.authorNickname, index)
                : undefined
            }
            onRequest={() => {
              if (quote.quoteId) {
                handleRequest(quote.quoteId);
              }
            }}
            onPoke={() => {
              handlePoke(quote.friendId);
            }}
            isInArchive={false}
            isSilenced={quote.isSilenced}
            timeAgo={quote.timeAgo}
          />
        ))
      ) : !isLoading ? (
        <S.NoFeedbox>
          <S.NoFeedText>태그할 수 있는 친구가 없어요</S.NoFeedText>
          <S.NoFeedSubText>
            친구를 추가하고 나중에 태그를 추가할 수 있어요
          </S.NoFeedSubText>
        </S.NoFeedbox>
      ) : null}
    </S.FeedList>
  );
}
