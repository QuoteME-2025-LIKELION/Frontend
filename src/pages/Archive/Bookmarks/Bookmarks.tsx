import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useArchiveBookmarks } from "@/hooks/archive/useArchiveBookmarks";
import { useConfirmNavigationToDate } from "@/hooks/archive/useConfirmNavigationToDate";
import { useBookmarkedArchivesQuery } from "@/hooks/queries/useArchiveQueries";
import { useQuoteImageDownload } from "@/hooks/share/useQuoteImageDownload";
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
  } = useArchiveBookmarks(selectedMonthString);
  const downloadQuoteImage = useQuoteImageDownload();
  const {
    isDateNavigationConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  } = useConfirmNavigationToDate();
  const { data: bookmarkedFeeds = [], isSuccess, isError } =
    useBookmarkedArchivesQuery(selectedMonthString);

  const handleShare = (date: string, authorNickname: string, index: number) => {
    const feed = bookmarkedFeeds[index];
    if (!feed) return;
    onShare(() => downloadQuoteImage(
      {
        date,
        content: feed.content,
        authorName: authorNickname,
        authorBirthYear: feed.authorBirthYear,
        taggedNames: feed.tags?.map((tag) => tag.nickname) ?? feed.taggedMemberNames ?? feed.taggedMembers,
      },
      `QuoteMe-${date}-${authorNickname}.png`
    ));
  };

  return (
    <S.Container>
      <ToastModal
        isVisible={Boolean(toastMessage)}
        text={toastMessage}
        errorMessage={isBookmarkError || isError ? "아카이브 정보를 불러오지 못했어요." : ""}
        onClose={closeBookmarkToast}
      />
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
