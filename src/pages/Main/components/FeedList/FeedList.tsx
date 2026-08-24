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
import type { Group } from "@/types/group.type";
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
  groups: Group[] | [];
  selectedGroupId: number | null;
  myNickname: string;
  onSelectGroup: (groupId: number | null) => void;
  onShare: (shareProcess: () => Promise<void>) => void;
  isLoading: boolean;
};

export default function FeedList({
  date,
  otherQuotes,
  friendList,
  groups,
  selectedGroupId,
  myNickname,
  onSelectGroup,
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

  const [toastMessage, setToastMessage] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const selectedGroupMembers = useMemo(() => {
    if (!selectedGroup?.members) {
      return null;
    }

    return selectedGroup.members
      .filter((member) => member.nickname !== myNickname)
      .map((member) => ({
        id: member.id,
        nickname: member.nickname,
        profileImage: member.profileImage,
        introduction: member.introduction,
      }));
  }, [myNickname, selectedGroup]);
  const visibleFriends = selectedGroupMembers ?? friendList;

  const quotes = useMemo<QuotesItem[]>(() => {
    const quotesMap = new Map(
      otherQuotes.map((quote) => [quote.authorNickname, quote])
    );

    return visibleFriends.map((friend) => {
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
  }, [bookmarkOverrides, otherQuotes, visibleFriends]);

  const handleRequest = async (quoteId: number) => {
    try {
      await requestQuoteTag(quoteId);
      setToastMessage("태그가 요청되었습니다.");
    } catch (err) {
      console.error("태그 요청 실패:", err);
      setToastMessage("태그 요청에 실패했습니다.");
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
        setToastMessage("북마크가 해제되었습니다.");
      } else {
        await bookmarkQuote(quoteId);
        setToastMessage("북마크에 추가되었습니다.");
      }
    } catch (err) {
      setBookmarkOverrides((prev) => ({ ...prev, [quoteId]: isBookmarked }));
      console.error("북마크 처리 실패:", err);
      setToastMessage("북마크 처리에 실패했습니다.");
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
      setToastMessage("콕 찔렀습니다.");
    } catch (err) {
      console.error("콕 찌르기 실패:", err);
      setToastMessage("콕 찌르기에 실패했습니다.");
    }
  };

  return (
    <S.FeedList>
      {toastMessage && (
        <ToastModal
          isVisible={Boolean(toastMessage)}
          onClose={() => {
            setToastMessage("");
          }}
          text={toastMessage}
          showOverlay={false}
          variant="snackbar"
        />
      )}
      <S.FilterBox>
        <S.FilterButton
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 3H10M3.5 6H8.5M5 9H7"
              stroke="#21242B"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          {selectedGroup?.name ?? "전체보기"}
        </S.FilterButton>
        {isFilterOpen && (
          <S.FilterMenu>
            <S.FilterOption
              type="button"
              $active={selectedGroupId === null}
              onClick={() => {
                onSelectGroup(null);
                setIsFilterOpen(false);
              }}
            >
              전체보기
            </S.FilterOption>
            {groups.map((group) => (
              <S.FilterOption
                key={group.id}
                type="button"
                $active={selectedGroupId === group.id}
                onClick={() => {
                  onSelectGroup(group.id);
                  setIsFilterOpen(false);
                }}
              >
                {group.name ?? "그룹"}
              </S.FilterOption>
            ))}
          </S.FilterMenu>
        )}
      </S.FilterBox>
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
          <S.NoFeedText>아직 함께 볼 친구 피드가 없어요.</S.NoFeedText>
          <S.NoFeedSubText>
            친구를 추가하면 서로의 명언을 이곳에서 볼 수 있어요.
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
