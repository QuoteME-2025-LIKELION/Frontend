import MyQuoteFeed from "@/pages/Archive/MyQuotes/MyQuoteFeed/MyQuoteFeed";
import * as S from "./MyQuotes.styles";
import { useRef } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useOutletContext } from "react-router-dom";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import { useMyArchivesQuery } from "@/hooks/useArchiveQueries";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";

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
      {myQuotes.map((feed, index) => (
        <MyQuoteFeed
          key={feed.id}
          ref={(el: HTMLDivElement | null) => {
            feedRefs.current[index] = el;
          }}
          archiveFeed={feed}
          onClick={() =>
            openDateNavigationConfirm(feed.createDate.slice(0, 10))
          }
          onShare={() =>
            handleShare(feed.createDate.slice(0, 10), feed.authorName, index)
          }
        />
      ))}
    </S.Container>
  );
}
