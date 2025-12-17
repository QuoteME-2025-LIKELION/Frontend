import { useEffect } from "react";
import * as S from "./RequestModalStyled";

interface RequestModalProps {
  type: "tag" | "poke";
  onClose: () => void;
  onPoke?: () => void;
  isVisible?: boolean;
}

export default function RequestModal({
  type,
  onClose,
  isVisible,
}: RequestModalProps) {
  const isTag = type === "tag";
  const isPoke = type === "poke";
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500); // 1.5초 후에 모달 닫기

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal>
        <S.Message>
          {isTag ? "태그 요청이 전송되었습니다." : ""}
          {isPoke ? "콕 찔렀습니다!" : ""}
        </S.Message>
      </S.Modal>
    </S.Overlay>
  );
}
