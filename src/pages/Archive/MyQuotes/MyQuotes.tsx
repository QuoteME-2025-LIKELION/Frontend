import MyQuoteFeed from "@/pages/Archive/MyQuotes/MyQuoteFeed/MyQuoteFeed";
import * as S from "./MyQuotesStyle";
import { useCallback, useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useNavigate } from "react-router-dom";
import type { ArchiveFeed } from "@/types/archiveFeed.type";
import api from "@/api/api";

export default function MyQuotes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedQuoteDate, setSelectedQuoteDate] = useState<string | null>(
    null
  );
  const [myQuotes, setMyQuotes] = useState<ArchiveFeed[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyQuotes = async () => {
      try {
        const res = await api.get("/api/archives/me");
        setMyQuotes(res.data);
      } catch (err) {
        console.error(err);
        setMyQuotes([]);
      }
    };

    fetchMyQuotes();
  }, []);

  const handleQuoteClick = useCallback((date: string) => {
    setSelectedQuoteDate(date);
    setShowModal(true);
  }, []);

  const moveToDate = useCallback((date: string) => {
    navigate(`/home/${date}`);
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
      {myQuotes.map((feed) => (
        <MyQuoteFeed
          key={feed.id}
          archiveFeed={feed}
          onClick={() => handleQuoteClick(feed.createDate.slice(0, 10))}
        />
      ))}
    </S.Container>
  );
}
