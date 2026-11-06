import { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useArchiveBookmarks } from "@/hooks/useArchiveBookmarks";
import { useMyArchivesQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import * as S from "@/pages/Archive/components/ArchiveFeedList.styles";
import ArchiveQuoteCard from "@/pages/Archive/components/ArchiveQuoteCard";

export default function MyQuotes() {
  const { onShare, selectedMonthString } = useOutletContext<ArchiveOutletContext>();
  const { data: allMyQuotes = [], isSuccess } = useMyArchivesQuery();
  const myQuotes = allMyQuotes.filter((quote) =>
    (quote.createDate ?? quote.createdAt ?? "").slice(0, 7) === selectedMonthString
  );

  const {
    getBookmarkProps,
    toastMessage,
    closeBookmarkToast,
    isBookmarkError,
    retryBookmarks,
  } = useArchiveBookmarks();
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();
  const {
    isDateNavigationConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  } = useConfirmNavigationToDate();

  const handleShare = (date: string, authorNickname: string, index: number) => {
    const shareProcess = () =>
      downloadElementImage(
        feedRefs.current[index],
        `QuoteMe-${date}-${authorNickname}.png`,
        { horizontalPadding: 24, paddingBottom: 9 }
      );

    onShare(shareProcess);
  };

  return (
    <S.Container>
      <ToastModal
        isVisible={Boolean(toastMessage)}
        text={toastMessage}
        onClose={closeBookmarkToast}
      />
      {isBookmarkError && (
        <S.StatusMessage role="status">
          북마크 상태를 확인하지 못했습니다.
          <S.RetryButton type="button" onClick={retryBookmarks}>
            다시 확인
          </S.RetryButton>
        </S.StatusMessage>
      )}
      {isDateNavigationConfirmOpen && (
        <ConfirmModal
          question="해당 날짜로 이동할까요?"
          onClose={closeDateNavigationConfirm}
          onConfirm={confirmDateNavigation}
          showOverlay={true}
        />
      )}
      {isSuccess && myQuotes.length === 0 && (
        <S.EmptyMessage>작성된 명언이 없어요</S.EmptyMessage>
      )}
      {myQuotes.map((feed, index) => {
        const date = (feed.createDate ?? feed.createdAt ?? "").slice(0, 10);
        const authorName = feed.authorName ?? feed.authorNickname ?? "닉네임";

        return (
          <ArchiveQuoteCard
            key={feed.id ?? feed.quoteId}
            ref={(el: HTMLDivElement | null) => {
              feedRefs.current[index] = el;
            }}
            feed={feed}
            {...getBookmarkProps(feed)}
            showOriginalContent={true}
            onClick={() => openDateNavigationConfirm(date)}
            onShare={() => handleShare(date, authorName, index)}
          />
        );
      })}
    </S.Container>
  );
}
