import MyQuoteFeed from "@/pages/Archive/MyQuotes/MyQuoteFeed/MyQuoteFeed";
import * as S from "./MyQuotes.styles";
import { useCallback, useRef, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import { useMyArchivesQuery } from "@/hooks/useArchiveQueries";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";

export default function MyQuotes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedQuoteDate, setSelectedQuoteDate] = useState<string | null>(
    null
  );
  const navigate = useNavigate();
  const { data: myQuotes = [] } = useMyArchivesQuery();

  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();

  const { onShare } = useOutletContext<ArchiveOutletContext>();

  const handleQuoteClick = useCallback((date: string) => {
    setSelectedQuoteDate(date);
    setShowModal(true);
  }, []);

  const moveToDate = useCallback((date: string) => {
    navigate(`/home/${date}`);
    setShowModal(false);
  }, [navigate]);

  const handleConfirmMove = useCallback(() => {
    if (selectedQuoteDate) {
      moveToDate(selectedQuoteDate); // 저장된 날짜로 이동 함수 호출
    } else {
      setShowModal(false);
    }
  }, [selectedQuoteDate, moveToDate]);

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
      {showModal && (
        <ConfirmModal
          question="해당 날짜로 이동할까요?"
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmMove}
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
          onClick={() => handleQuoteClick(feed.createDate.slice(0, 10))}
          onShare={() =>
            handleShare(feed.createDate.slice(0, 10), feed.authorName, index)
          }
        />
      ))}
    </S.Container>
  );
}
