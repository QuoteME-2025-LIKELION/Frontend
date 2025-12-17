import * as S from "./RequestModalStyled";

interface RequestModalProps {
  type: "tag" | "poke";
  onClose: () => void;
  onPoke?: () => void;
}

export default function RequestModal({ type, onClose }: RequestModalProps) {
  const isTag = type === "tag";
  const isPoke = type === "poke";

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
