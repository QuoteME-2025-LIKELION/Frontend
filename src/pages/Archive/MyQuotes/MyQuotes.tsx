import MyQuoteFeed from "@/pages/Archive/MyQuotes/MyQuoteFeed/MyQuoteFeed";
import * as S from "./MyQuotesStyle";
import { useCallback, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { MOCK_ARCHIVE_FEEDS } from "@/data/archiveFeeds";

export default function MyQuotes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedQuoteDate, setSelectedQuoteDate] = useState<string | null>(
    null
  );

  const handleQuoteClick = useCallback((date: string) => {
    setSelectedQuoteDate(date);
    setShowModal(true);
  }, []);

  const moveToDate = useCallback((date: string) => {
    console.log(date, "날짜로 이동");
    // 실제 이동 로직을 추후 여기에 구현
    setShowModal(false); // 이동 후 모달 닫기
  }, []);

  const handleConfirmMove = useCallback(() => {
    if (selectedQuoteDate) {
      moveToDate(selectedQuoteDate); // 저장된 날짜로 이동 함수 호출
    } else {
      setShowModal(false);
    }
  }, [selectedQuoteDate, moveToDate]);

  return (
    <S.Container>
      {showModal && (
        <ConfirmModal
          question="해당 날짜로 이동할까요?"
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmMove} // 저장된 날짜로 이동 처리
          showOverlay={true}
        />
      )}
      {MOCK_ARCHIVE_FEEDS.map((feed) => (
        <MyQuoteFeed
          key={feed.id}
          archiveFeed={feed}
          onClick={() => handleQuoteClick(feed.createDate)}
        />
      ))}
    </S.Container>
  );
}
