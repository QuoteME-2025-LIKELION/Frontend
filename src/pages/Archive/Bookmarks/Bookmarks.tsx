import { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useArchiveBookmarks } from "@/hooks/useArchiveBookmarks";
import { useBookmarkedArchivesQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import * as S from "@/pages/Archive/components/ArchiveFeedList.styles";
import ArchiveQuoteCard from "@/pages/Archive/components/ArchiveQuoteCard";

export default function Bookmarks() {
  const { onShare, selectedMonthString } = useOutletContext<ArchiveOutletContext>();
  const {
    getBookmarkProps,
    toastMessage,
    closeBookmarkToast,
    isBookmarkError,
    retryBookmarks,
  } = useArchiveBookmarks(selectedMonthString);
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();
  const {
    isDateNavigationConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  } = useConfirmNavigationToDate();
  const { data: bookmarkedFeeds = [], isSuccess } =
    useBookmarkedArchivesQuery(selectedMonthString);

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
      {isSuccess && bookmarkedFeeds.length === 0 && (
        <S.EmptyMessage>
          마음에 드는 명언은 북마크를 통해 모아보세요
        </S.EmptyMessage>
      )}
      {bookmarkedFeeds.map((data, index) => {
        const date = (data.createDate ?? data.createdAt ?? "").slice(0, 10);
        const authorName = data.authorName ?? data.authorNickname ?? "닉네임";
        const taggedNames = data.taggedMemberNames ?? data.taggedMembers ?? [];

        return (
          <ArchiveQuoteCard
            ref={(el: HTMLDivElement | null) => {
              feedRefs.current[index] = el;
            }}
            key={data.quoteId ?? data.id}
            feed={{
              ...data,
              taggedMemberNames: taggedNames,
            }}
            {...getBookmarkProps(data)}
            onClick={() => openDateNavigationConfirm(date)}
            onShare={() => handleShare(date, authorName, index)}
          />
        );
      })}
    </S.Container>
  );
}
