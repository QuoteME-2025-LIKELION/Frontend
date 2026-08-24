import { useMemo, useRef, useState } from "react";

import QuoteFeed from "@/components/QuoteFeed/QuoteFeed";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import { usePokeFriendMutation } from "@/hooks/useFriendQueries";
import {
  useBookmarkQuoteMutation,
  useMyQuoteTagRequestQuery,
  useRequestQuoteTagMutation,
  useUnbookmarkQuoteMutation,
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
  const [bookmarkOverrides, setBookmarkOverrides] = useState<
    Record<number, boolean>
  >({});
  const [pendingBookmarkIds, setPendingBookmarkIds] = useState<
    Record<number, boolean>
  >({});
  const { mutateAsync: requestQuoteTag } = useRequestQuoteTagMutation();
  const { mutateAsync: bookmarkQuote } = useBookmarkQuoteMutation();
  const { mutateAsync: unbookmarkQuote } = useUnbookmarkQuoteMutation();
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
        const quoteId = friendQuote.quoteId ?? friendQuote.id;
        const taggedNicknames =
          friendQuote.taggedNicknames ?? friendQuote.taggedMembers ?? [];

        return {
          ...friendQuote,
          id: quoteId,
          quoteId,
          friendId: friend.id,
          isSilenced: false,
          taggedNicknames,
          isLiked: Boolean(friendQuote.isLiked),
          isBookmarked:
            bookmarkOverrides[quoteId] ?? Boolean(friendQuote.isBookmarked),
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
        isBookmarked: false,
        createDate: "",
        isFriendQuote: true,
      };
    });
  }, [bookmarkOverrides, friendList, otherQuotes]);

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

  const handleBookmark = async (quoteId: number, isBookmarked: boolean) => {
    if (pendingBookmarkIds[quoteId]) {
      return;
    }

    setPendingBookmarkIds((prev) => ({ ...prev, [quoteId]: true }));
    setBookmarkOverrides((prev) => ({ ...prev, [quoteId]: !isBookmarked }));

    try {
      if (isBookmarked) {
        await unbookmarkQuote(quoteId);
      } else {
        await bookmarkQuote(quoteId);
      }
    } catch (err) {
      setBookmarkOverrides((prev) => ({ ...prev, [quoteId]: isBookmarked }));
      console.error("북마크 처리 실패:", err);
      setErrorMessage("북마크 처리에 실패했습니다.");
      setShowErrorToast(true);
    } finally {
      setPendingBookmarkIds((prev) => {
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
          <FeedListItem
            key={quote.id}
            quote={quote}
            index={index}
            refCallback={(el) => {
              feedRefs.current[index] = el;
            }}
            isBookmarkPending={Boolean(pendingBookmarkIds[quote.id])}
            onBookmark={handleBookmark}
            onShare={handleShare}
            onRequest={handleRequest}
            onPoke={handlePoke}
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

interface FeedListItemProps {
  quote: QuotesItem;
  index: number;
  refCallback: (el: HTMLDivElement | null) => void;
  isBookmarkPending: boolean;
  onBookmark: (quoteId: number, isBookmarked: boolean) => void;
  onShare: (authorNickname: string, index: number) => void;
  onRequest: (quoteId: number) => void;
  onPoke: (friendId: number) => void;
}

function FeedListItem({
  quote,
  index,
  refCallback,
  isBookmarkPending,
  onBookmark,
  onShare,
  onRequest,
  onPoke,
}: FeedListItemProps) {
  const shouldCheckTagRequest =
    !quote.isSilenced &&
    Boolean(quote.quoteId) &&
    (!quote.taggedNicknames || quote.taggedNicknames.length === 0);
  const { data: tagRequest } = useMyQuoteTagRequestQuery(
    shouldCheckTagRequest ? quote.quoteId : undefined
  );

  return (
    <QuoteFeed
      ref={refCallback}
      profileImageUrl={quote.authorProfileImage}
      authorName={quote.authorNickname}
      bio={quote.authorIntroduction}
      createDate={quote.createDate}
      content={quote.content}
      tag={quote.taggedNicknames}
      isBookmarked={quote.isBookmarked}
      isBookmarkDisabled={quote.isSilenced || isBookmarkPending}
      onBookmark={() => onBookmark(quote.id, Boolean(quote.isBookmarked))}
      onShare={
        !quote.isSilenced
          ? () => onShare(quote.authorNickname, index)
          : undefined
      }
      onRequest={() => {
        if (quote.quoteId) {
          onRequest(quote.quoteId);
        }
      }}
      tagRequestStatus={tagRequest?.status ?? "NONE"}
      onPoke={() => {
        onPoke(quote.friendId);
      }}
      isInArchive={false}
      isSilenced={quote.isSilenced}
      timeAgo={quote.timeAgo}
    />
  );
}
