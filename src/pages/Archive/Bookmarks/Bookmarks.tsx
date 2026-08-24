import { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import QuoteFeed from "@/components/QuoteFeed/QuoteFeed";
import { useBookmarkedArchivesQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";

import * as S from "../Likes/Likes.styles";

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
      {bookmarkedFeeds.map((data, index) => {
        const date = (data.createDate ?? data.createdAt ?? "").slice(0, 10);
        const authorName = data.authorName ?? data.authorNickname ?? "닉네임";
        const taggedNames = data.taggedMemberNames ?? data.taggedMembers ?? [];

        return (
          <QuoteFeed
            ref={(el: HTMLDivElement | null) => {
              feedRefs.current[index] = el;
            }}
            authorName={authorName}
            year={data.authorBirthYear}
            tag={taggedNames}
            content={data.content}
            key={data.quoteId ?? data.id}
            isInArchive={true}
            isBookmarked={true}
            onArchiveClick={() => openDateNavigationConfirm(date)}
            onShare={() => handleShare(date, authorName, index)}
          />
        );
      })}
    </S.Container>
  );
}
