import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useLikedArchivesQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useQuoteImageDownload } from "@/hooks/useQuoteImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import * as S from "@/pages/Archive/components/ArchiveFeedList.styles";
import ArchiveQuoteCard from "@/pages/Archive/components/ArchiveQuoteCard";

export default function Likes() {
  const downloadQuoteImage = useQuoteImageDownload();
  const {
    isDateNavigationConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  } = useConfirmNavigationToDate();
  const { data: likedFeeds = [] } = useLikedArchivesQuery();

  const { onShare } = useOutletContext<ArchiveOutletContext>();

  const handleShare = (date: string, authorNickname: string, index: number) => {
    const feed = likedFeeds[index];
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
      {isDateNavigationConfirmOpen && (
        <ConfirmModal
          question="해당 날짜로 이동할까요?"
          onClose={closeDateNavigationConfirm}
          onConfirm={confirmDateNavigation}
          showOverlay={true}
        />
      )}
      {likedFeeds.length === 0 && (
        <S.EmptyMessage>스크랩된 명언이 없습니다.</S.EmptyMessage>
      )}
      {likedFeeds.map((feed, index) => {
        const date = (feed.createDate ?? feed.createdAt ?? "").slice(0, 10);
        const authorName = feed.authorName ?? feed.authorNickname ?? "닉네임";

        return (
          <ArchiveQuoteCard
            feed={feed}
            key={feed.id ?? feed.quoteId}
            onClick={() => openDateNavigationConfirm(date)}
            onShare={() => handleShare(date, authorName, index)}
          />
        );
      })}
    </S.Container>
  );
}
