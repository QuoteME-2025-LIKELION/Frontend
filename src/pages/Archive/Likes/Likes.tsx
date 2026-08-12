import Feed from "@/components/Feed/Feed";
import * as S from "./Likes.styles";
import { useCallback, useRef, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import { useLikedArchivesQuery } from "@/hooks/useArchiveQueries";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";

export default function Likes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedDate, setSelectedFeedDate] = useState<string | null>(null);
  const navigate = useNavigate();
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();
  const { data: likedFeeds = [] } = useLikedArchivesQuery();

  const { onShare } = useOutletContext<ArchiveOutletContext>();

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
          onConfirm={handleConfirmMove} // 저장된 날짜로 이동 처리
          showOverlay={true}
        />
      )}
      {likedFeeds.map((data, index) => (
        <Feed
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
            handleArchiveClick(data.createDate.slice(0, 10))
          }
          onShare={() =>
            handleShare(data.createDate.slice(0, 10), data.authorName, index)
          }
        />
      ))}
    </S.Container>
  );
}
