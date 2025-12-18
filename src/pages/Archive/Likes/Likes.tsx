import Feed from "@/components/Feed/Feed";
import * as S from "./LikesStyle";
import { useCallback, useEffect, useRef, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import api from "@/api/api";
import type { ArchiveFeed } from "@/types/archiveFeed.type";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import { toPng } from "html-to-image";

export default function Likes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedDate, setSelectedFeedDate] = useState<string | null>(null);
  const [likedFeeds, setLikedFeeds] = useState<ArchiveFeed[]>([]);
  const navigate = useNavigate();
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { onShare } = useOutletContext<ArchiveOutletContext>();

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

  const handleShare = (date: string, authorNickname: string, index: number) => {
    const shareProcess = () =>
      new Promise<void>((resolve, reject) => {
        const feedElement = feedRefs.current[index];
        if (feedElement) {
          toPng(feedElement)
            .then((dataUrl) => {
              const link = document.createElement("a");
              link.download = `QuoteMe-${date}-${authorNickname}.png`;
              link.href = dataUrl;
              link.click();
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        }
      });

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
