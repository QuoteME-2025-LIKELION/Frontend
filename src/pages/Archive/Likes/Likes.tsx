import Feed from "@/components/Feed/Feed";
import * as S from "./LikesStyle";
import { useCallback, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";

const MockData = [
  {
    username: "이민형",
    date: "2025-11-05",
    year: 1999,
    text: "자유로운 우리를 봐\n자유로워",
    tag: ["말랑이"],
  },
  {
    username: "김말랑",
    date: "2025-11-05",
    year: 2005,
    text: "말랑말랑",
    tag: ["말랑이", "몰랑이"],
  },
];

export default function Likes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedDate, setSelectedFeedDate] = useState<string | null>(null);

  const handleArchiveClick = useCallback((date: string) => {
    setSelectedFeedDate(date); // 날짜 저장
    setShowModal(true); // 모달 열기
  }, []);

  const moveToDate = useCallback((date: string) => {
    console.log(date, "날짜로 이동");
    // 실제 이동 로직을 추후 여기에 구현
    setShowModal(false); // 이동 후 모달 닫기
  }, []);

  const handleConfirmMove = useCallback(() => {
    if (selectedFeedDate) {
      moveToDate(selectedFeedDate); // 저장된 날짜로 이동 함수 호출
    } else {
      setShowModal(false);
    }
  }, [selectedFeedDate, moveToDate]);

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
      {MockData.map((data, index) => (
        <Feed
          username={data.username}
          year={data.year}
          tag={data.tag}
          text={data.text}
          key={index}
          isInArchive={true}
          isLiked={true}
          onArchiveClick={() => handleArchiveClick(data.date)}
        />
      ))}
    </S.Container>
  );
}
