import { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import QuoteFeed from "@/components/QuoteFeed/QuoteFeed";
import { useLikedArchivesQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";

import * as S from "./Likes.styles";

export default function Likes() {
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();
  const {
    isDateNavigationConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  } = useConfirmNavigationToDate();
  const { data: likedFeeds = [] } = useLikedArchivesQuery();

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
      {likedFeeds.map((data, index) => (
        <QuoteFeed
          ref={(el: HTMLDivElement | null) => {
            feedRefs.current[index] = el;
          }}
          authorName={data.authorName}
          year={data.authorBirthYear}
          tag={data.taggedMemberNames}
          content={data.content}
          key={index}
          isInArchive={true}
          isLiked={true}
          onArchiveClick={() =>
            openDateNavigationConfirm(data.createDate.slice(0, 10))
          }
          onShare={() =>
            handleShare(data.createDate.slice(0, 10), data.authorName, index)
          }
        />
      ))}
    </S.Container>
  );
}
