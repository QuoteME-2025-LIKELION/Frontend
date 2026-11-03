import { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useArchiveBookmarks } from "@/hooks/useArchiveBookmarks";
import { useArchivesByDateQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import * as List from "@/pages/Archive/components/ArchiveFeedList.styles";
import ArchiveQuoteCard from "@/pages/Archive/components/ArchiveQuoteCard";

export default function CalendarPage() {
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

  const { onShare, selectedDateString } =
    useOutletContext<ArchiveOutletContext>();
  const { data: filteredFeeds = [], isSuccess } =
    useArchivesByDateQuery(selectedDateString);

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
    <List.Container>
      <ToastModal
        isVisible={Boolean(toastMessage)}
        text={toastMessage}
        onClose={closeBookmarkToast}
      />
      {isBookmarkError && (
        <List.StatusMessage role="status">
          북마크 상태를 확인하지 못했습니다.
          <List.RetryButton type="button" onClick={retryBookmarks}>
            다시 확인
          </List.RetryButton>
        </List.StatusMessage>
      )}
      {isDateNavigationConfirmOpen && (
        <ConfirmModal
          question="해당 날짜로 이동할까요?"
          onClose={closeDateNavigationConfirm}
          onConfirm={confirmDateNavigation}
          showOverlay={true}
        />
      )}
      {isSuccess && filteredFeeds.length === 0 && (
        <List.EmptyMessage>이날 작성된 명언이 없어요</List.EmptyMessage>
      )}
      {filteredFeeds.map((feed, index) => {
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
            onClick={() => openDateNavigationConfirm(date)}
            onShare={() => handleShare(date, authorName, index)}
          />
        );
      })}
    </List.Container>
  );
}
