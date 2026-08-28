import { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useMyArchivesQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import * as S from "@/pages/Archive/components/ArchiveFeedList.styles";
import ArchiveQuoteCard from "@/pages/Archive/components/ArchiveQuoteCard";

export default function MyQuotes() {
  const { data: myQuotes = [] } = useMyArchivesQuery();

  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();
  const {
    isDateNavigationConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  } = useConfirmNavigationToDate();

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
      {myQuotes.length === 0 && (
        <S.EmptyMessage>작성된 명언이 없습니다.</S.EmptyMessage>
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
            showOriginalContent={true}
            onClick={() => openDateNavigationConfirm(date)}
            onShare={() => handleShare(date, authorName, index)}
          />
        );
      })}
    </S.Container>
  );
}
