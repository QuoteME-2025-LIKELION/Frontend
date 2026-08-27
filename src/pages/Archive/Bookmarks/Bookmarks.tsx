import { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useBookmarkedArchivesQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import * as S from "@/pages/Archive/components/ArchiveFeedList.styles";
import ArchiveQuoteCard from "@/pages/Archive/components/ArchiveQuoteCard";

export default function Bookmarks() {
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();
  const {
    isDateNavigationConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  } = useConfirmNavigationToDate();
  const { data: bookmarkedFeeds = [] } = useBookmarkedArchivesQuery();

  const { onShare } = useOutletContext<ArchiveOutletContext>();

  const handleShare = (date: string, authorNickname: string, index: number) => {
    const shareProcess = () =>
      downloadElementImage(
        feedRefs.current[index],
        `QuoteMe-${date}-${authorNickname}.png`
      );

    onShare(shareProcess);
  };

  return (
    <S.Container>
      {isDateNavigationConfirmOpen && (
        <ConfirmModal
          question="해당 날짜로 이동할까요?"
          onClose={closeDateNavigationConfirm}
          onConfirm={confirmDateNavigation}
          showOverlay={true}
        />
      )}
      {bookmarkedFeeds.length === 0 && (
        <S.EmptyMessage>북마크한 명언이 없습니다.</S.EmptyMessage>
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
              isBookmarked: true,
              taggedMemberNames: taggedNames,
            }}
            onClick={() => openDateNavigationConfirm(date)}
            onShare={() => handleShare(date, authorName, index)}
          />
        );
      })}
    </S.Container>
  );
}
