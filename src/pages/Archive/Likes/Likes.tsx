import Feed from "@/components/Feed/Feed";
import * as S from "./LikesStyle";
import { useCallback, useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import api from "@/api/api";
import type { ArchiveFeed } from "@/types/archiveFeed.type";
import { useNavigate } from "react-router-dom";

export default function Likes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedDate, setSelectedFeedDate] = useState<string | null>(null);
  const [likedFeeds, setLikedFeeds] = useState<ArchiveFeed[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedArchives = async () => {
      try {
        const res = await api.get("/api/archives/likes");
        setLikedFeeds(res.data);
      } catch (err) {
        console.error(err);
        setLikedFeeds([]);
      }
    };

    fetchLikedArchives();
  }, []);

  const handleArchiveClick = useCallback((date: string) => {
    setSelectedFeedDate(date); // 날짜 저장
    setShowModal(true); // 모달 열기
  }, []);

  const moveToDate = useCallback((date: string) => {
    navigate(`/home/${date}`);
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
      {likedFeeds.map((data, index) => (
        <Feed
          authorName={data.authorName}
          year={data.authorBirthYear}
          tag={data.taggedMemberNames}
          content={data.content}
          key={index}
          isInArchive={true}
          isLiked={true}
          onArchiveClick={() =>
            handleArchiveClick(data.createDate.slice(0, 10))
          }
        />
      ))}
    </S.Container>
  );
}
