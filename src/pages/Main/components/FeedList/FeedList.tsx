import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";

import type { QuoteFeedItem, UnwrittenMember } from "@/api/quoteApi";
import funnelIcon from "@/assets/icons/quote-feed/funnel.svg";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
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
import theme from "@/styles/theme";
import type { Group } from "@/types/group.type";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";

import * as S from "./FeedList.styles";

interface QuotesItem extends QuoteFeedItem {
  createDate?: string;
  memberId?: number;
  isSilenced: boolean;
  quoteId?: number;
}

type FeedListProps = {
  date?: string;
  otherQuotes: QuoteFeedItem[];
  unwrittenMembers: UnwrittenMember[];
  groups: Group[] | [];
  selectedGroupId: number | null;
  myNickname: string;
  myMemberId?: number;
  onSelectGroup: (groupId: number | null) => void;
  onShare: (shareProcess: () => Promise<void>) => void;
  isLoading: boolean;
  isFeedError?: boolean;
  emptyMessage?: string | null;
};

export default function FeedList({
  date,
  otherQuotes,
  unwrittenMembers,
  groups,
  selectedGroupId,
  myNickname,
  myMemberId,
  onSelectGroup,
  onShare,
  isLoading,
  isFeedError = false,
  emptyMessage,
}: FeedListProps) {
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const filterBoxRef = useRef<HTMLDivElement | null>(null);
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
  const [tagRequestQuoteId, setTagRequestQuoteId] = useState<number | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const quotes = useMemo<QuotesItem[]>(
    () => [
      ...otherQuotes.map((quote) => ({
        ...quote,
        quoteId: quote.id,
        isSilenced: false,
        taggedNicknames: quote.taggedNicknames ?? [],
        isBookmarked: bookmarkOverrides[quote.id] ?? Boolean(quote.isBookmarked),
      })),
      ...unwrittenMembers
        .filter((member) => member.memberId !== myMemberId)
        .map((member) => ({
          id: member.memberId,
          memberId: member.memberId,
          authorNickname: member.nickname,
          authorProfileImage: member.profileImage ?? undefined,
          content: "",
          taggedNicknames: [],
          isSilenced: true,
          isBookmarked: false,
        })),
    ],
    [bookmarkOverrides, otherQuotes, unwrittenMembers, myMemberId]
  );

  const tagRequestQuote = quotes.find(
    (quote) => quote.quoteId === tagRequestQuoteId
  );

  const openTagRequestConfirm = (quoteId: number) => {
    setTagRequestQuoteId(quoteId);
  };

  const closeTagRequestConfirm = () => {
    setTagRequestQuoteId(null);
  };

  const handleRequest = async () => {
    if (tagRequestQuoteId === null) {
      return;
    }

    try {
      await requestQuoteTag(tagRequestQuoteId);
      setToastMessage("태그가 요청되었습니다.");
    } catch (err) {
      console.error("태그 요청 실패:", err);
      const status = axios.isAxiosError(err) ? err.response?.status : null;
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "";

      if (status === 409 || String(message).includes("이미")) {
        setToastMessage("이미 태그를 요청했습니다.");
      } else {
        setToastMessage("태그 요청에 실패했습니다.");
      }
    } finally {
      closeTagRequestConfirm();
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
        setBookmarkOverrides((prev) => {
          const next = { ...prev };
          delete next[quoteId];
          return next;
        });
        setToastMessage("북마크가 해제되었습니다.");
      } else {
        await bookmarkQuote(quoteId);
        setBookmarkOverrides((prev) => {
          const next = { ...prev };
          delete next[quoteId];
          return next;
        });
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
        `QuoteMe-${displayDate}-${authorNickname}.png`,
        {
          backgroundColor: theme.colors.secondary,
          horizontalPadding: 24,
          verticalPadding: 9,
        }
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

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handleOutsidePointerDown = (event: MouseEvent | TouchEvent) => {
      if (filterBoxRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsFilterOpen(false);
    };

    document.addEventListener("mousedown", handleOutsidePointerDown);
    document.addEventListener("touchstart", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointerDown);
      document.removeEventListener("touchstart", handleOutsidePointerDown);
    };
  }, [isFilterOpen]);

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
      {tagRequestQuoteId !== null && (
        <ConfirmModal
          variant="card"
          question=""
          lines={[
            `${tagRequestQuote?.authorNickname ?? "친구"}님의 명언에`,
            "태그를 요청할까요?",
          ]}
          cancelText="취소"
          confirmText="요청하기"
          confirmColor="primary"
          onClose={closeTagRequestConfirm}
          onConfirm={handleRequest}
        />
      )}
      <S.FilterBox ref={filterBoxRef}>
        <S.FilterButton
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
        >
          <img src={funnelIcon} alt="" />
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
      {isFeedError ? (
        <S.NoFeedbox>
          <S.NoFeedText>명언을 불러오지 못했어요.</S.NoFeedText>
          <S.NoFeedSubText>잠시 후 다시 시도해 주세요.</S.NoFeedSubText>
        </S.NoFeedbox>
      ) : isLoading ? null : quotes.length > 0 ? (
        quotes.map((quote, index) => (
          <FeedListItem
            key={
              quote.isSilenced ? `member-${quote.memberId}` : `quote-${quote.id}`
            }
            quote={quote}
            index={index}
            refCallback={(el) => {
              feedRefs.current[index] = el;
            }}
            isBookmarkPending={Boolean(pendingBookmarkIds[quote.id])}
            onBookmark={handleBookmark}
            onShare={handleShare}
            onRequest={openTagRequestConfirm}
            onTagRequestInfo={setToastMessage}
            onPoke={handlePoke}
            myNickname={myNickname}
          />
        ))
      ) : !isLoading ? (
        <S.NoFeedbox>
          <S.NoFeedText>
            {emptyMessage ||
              (selectedGroupId === null
                ? "아직 함께 볼 친구 피드가 없어요."
                : "아직 함께 볼 그룹 멤버가 없어요.")}
          </S.NoFeedText>
          <S.NoFeedSubText>
            {selectedGroupId === null
              ? "친구를 추가하면 서로의 명언을 이곳에서 볼 수 있어요."
              : "다른 멤버가 참여하면 서로의 명언을 이곳에서 볼 수 있어요."}
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
  onTagRequestInfo: (message: string) => void;
  onPoke: (friendId: number) => void;
  myNickname: string;
}

function FeedListItem({
  quote,
  index,
  refCallback,
  isBookmarkPending,
  onBookmark,
  onShare,
  onRequest,
  onTagRequestInfo,
  onPoke,
  myNickname,
}: FeedListItemProps) {
  const isAlreadyTagged = Boolean(quote.taggedNicknames?.includes(myNickname));
  const canRequestTag =
    !quote.isSilenced && quote.quoteId !== undefined && !isAlreadyTagged;
  const shouldCheckTagRequest = canRequestTag && quote.quoteId !== undefined;
  const {
    data: tagRequest,
    isFetching: isTagRequestFetching,
    isError: isTagRequestError,
  } = useMyQuoteTagRequestQuery(
    shouldCheckTagRequest ? quote.quoteId : undefined
  );
  const isTagRequestLoading =
    shouldCheckTagRequest && (isTagRequestFetching || tagRequest === undefined);

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
      isShareDisabled={quote.isSilenced}
      onBookmark={() => onBookmark(quote.id, Boolean(quote.isBookmarked))}
      onShare={
        !quote.isSilenced
          ? () => onShare(quote.authorNickname, index)
          : undefined
      }
      onRequest={() => {
        if (
          canRequestTag &&
          !isTagRequestLoading &&
          !isTagRequestError &&
          tagRequest?.status === "NONE" &&
          quote.quoteId !== undefined
        ) {
          onRequest(quote.quoteId);
        }
      }}
      canRequestTag={canRequestTag}
      onTagRequestInfo={onTagRequestInfo}
      tagRequestStatus={tagRequest?.status ?? "NONE"}
      isTagRequestLoading={isTagRequestLoading}
      isTagRequestError={isTagRequestError}
      onPoke={() => {
        if (quote.isSilenced && quote.memberId !== undefined) {
          onPoke(quote.memberId);
        }
      }}
      isInArchive={false}
      isSilenced={quote.isSilenced}
      timeAgo={quote.timeAgo}
    />
  );
}
