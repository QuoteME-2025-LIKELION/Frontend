import { useEffect, useRef, useState } from "react";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import type { QuoteDraft } from "@/types/feed.type";

import * as S from "./WriteBox.styles";

interface WriteBoxProps {
  value: string;
  isRecommendMode?: boolean;
  isResultMode?: boolean;
  onChange: (value: string) => void;
  onComplete: (data: QuoteDraft) => void;
  onAI: (text: string) => void;
}

export default function WriteBox({
  value,
  isRecommendMode = false,
  isResultMode = false,
  onChange,
  onComplete,
  onAI,
}: WriteBoxProps) {
  const infoWrapRef = useRef<HTMLDivElement | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showShortAiConfirm, setShowShortAiConfirm] = useState(false);
  const today = new Date();

  const month = today.getMonth() + 1; // 0부터 시작
  const date = today.getDate();

  const dayNames = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const day = dayNames[today.getDay()];
  const trimmedText = value.trim();
  const canUseAi = trimmedText.length > 0;
  const canGoNext = trimmedText.length > 0 && trimmedText.length <= 30;
  const isShortAiText = trimmedText.length <= 15;
  const handleAiClick = () => {
    if (!canUseAi) return;

    if (isShortAiText) {
      setShowShortAiConfirm(true);
      return;
    }

    onAI(value);
  };
  const handleSubmit = () => {
    onComplete({
      content: trimmedText,
      authorName: "", // 서버 저장 전이므로 비워도 됨
      authorBirthYear: undefined,
    });
  };

  useEffect(() => {
    if (!showInfo) return;

    const handleOutsidePointerDown = (event: MouseEvent | TouchEvent) => {
      if (infoWrapRef.current?.contains(event.target as Node)) return;
      setShowInfo(false);
    };

    document.addEventListener("mousedown", handleOutsidePointerDown);
    document.addEventListener("touchstart", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointerDown);
      document.removeEventListener("touchstart", handleOutsidePointerDown);
    };
  }, [showInfo]);

  return (
    <>
      <S.Container>
        <S.Datebox>
          <S.Month>
            {month}/{date}
          </S.Month>
          <S.Weekend>{day}</S.Weekend>
        </S.Datebox>
        <S.WriteBox>
          <S.TextArea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={isRecommendMode || isResultMode}
            placeholder={
              isResultMode
                ? ""
                : "오늘 있었던 일을 바탕으로\n나만의 명언을 남겨보세요."
            }
            maxLength={50}
          />
          <S.LineWrap>
            <S.Line />
            <S.Line />
            <S.Line />
          </S.LineWrap>
        </S.WriteBox>
        <S.CountText>{value.length}자/50자</S.CountText>
      </S.Container>
      {!isRecommendMode && !isResultMode && (
        <S.WriteBody>
          <S.GuideBox>
            <S.Guide>
              오늘의 명언을 직접 적고 <br />
              그대로 게시하거나 <br />
              AI에게 명언을 추천 받을 수 있어요.
            </S.Guide>
            <S.InfoWrap ref={infoWrapRef}>
              <S.InfoButton
                type="button"
                aria-label="명언 작성 안내"
                aria-expanded={showInfo}
                onClick={() => setShowInfo((prev) => !prev)}
              >
                i
              </S.InfoButton>
              {showInfo && (
                <S.InfoBubble role="status">
                  30자가 넘어가는 글은 AI추천 받기를 사용해야 등록할 수
                  있습니다.
                </S.InfoBubble>
              )}
            </S.InfoWrap>
          </S.GuideBox>
          <S.ActionBar>
            <S.ActionButton
              type="button"
              disabled={!canUseAi}
              onClick={handleAiClick}
            >
              AI 추천 받기
            </S.ActionButton>
            <S.ActionButton
              type="button"
              disabled={!canGoNext}
              onClick={handleSubmit}
            >
              다음으로
            </S.ActionButton>
          </S.ActionBar>
        </S.WriteBody>
      )}
      {showShortAiConfirm && (
        <ConfirmModal
          variant="card"
          question=""
          lines={["이대로 AI추천을", "받으시겠어요?"]}
          descriptionLines={[
            "15자 이하의 글은 추천이 제대로",
            "나오지 않을 수 있습니다.",
          ]}
          cancelText="돌아가기"
          confirmText="추천 받기"
          onClose={() => setShowShortAiConfirm(false)}
          onConfirm={() => {
            setShowShortAiConfirm(false);
            onAI(value);
          }}
        />
      )}
    </>
  );
}
