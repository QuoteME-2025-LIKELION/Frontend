import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import * as S from "./ConfirmModal.styles";

const activeDialogs = new Set<HTMLDialogElement>();
let bodyOverflowBeforeDialog = "";

interface ConfirmModalProps {
  question: string;
  onClose: () => void;
  onConfirm: () => void;
  nickname?: string;
  nickname2?: string;
  question2?: string;
  showOverlay?: boolean;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: "primary" | "danger";
  confirmDisabled?: boolean;
  variant?: "default" | "card";
  description?: string;
  descriptionLines?: string[];
  lines?: string[];
}

/**
 * 취소, 확인 버튼이 있는 모달 컴포넌트
 * 실제 페이지에 사용할 땐 isVisible 등의 상태로 조건부 렌더링
 * @param props
 * @param props.question - 모달에 표시될 질문 텍스트
 * @param props.onClose - 모달 외부 및 취소 버튼 클릭 시 호출되는 모달 닫기 함수 (setIsVisible(false) 등)
 * @param props.onConfirm - 확인 버튼 클릭 시 호출되는 함수
 * @param props.nickname - 텍스트 중 앞쪽에 표시될 닉네임 or 그룹명 (선택 사항)
 * @param props.nickname2 - 텍스트 중 뒤쪽에 표시될 닉네임 or 그룹명 (선택 사항)
 * @param props.question2 - nickname2가 있을 때 그 뒤에 표시될 질문 텍스트 (선택 사항)
 * @param props.showOverlay - 오버레이 표시 여부 (기본값: true)
 * @example
 * <ConfirmModal
 *   nickname="듀듀"
 *   question="님을"
 *   nickname2="무니니"
 *   question2="에 초대할까요?"
 *   onClose={() => {}}
 *   onConfirm={() => {}}
 * />
 */
export default function ConfirmModal({
  question,
  onClose,
  onConfirm,
  nickname,
  nickname2,
  question2,
  showOverlay = true,
  cancelText = "취소",
  confirmText = "확인",
  confirmColor = "primary",
  confirmDisabled = false,
  variant = "card",
  description,
  descriptionLines,
  lines,
}: ConfirmModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const closingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const hasDescription = Boolean(description || descriptionLines?.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement;
    if (!dialog.open) dialog.showModal();
    cancelRef.current?.focus();

    if (activeDialogs.size === 0) {
      bodyOverflowBeforeDialog = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    activeDialogs.add(dialog);

    return () => {
      if (closingTimer.current !== null) {
        clearTimeout(closingTimer.current);
        closingTimer.current = null;
      }
      if (dialog.open) dialog.close();
      activeDialogs.delete(dialog);
      if (activeDialogs.size === 0) {
        document.body.style.overflow = bodyOverflowBeforeDialog;
      }

      let focusRestored = false;
      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected &&
        previousFocus !== document.body &&
        (activeDialogs.size === 0 ||
          [...activeDialogs].some((active) => active.contains(previousFocus)))
      ) {
        previousFocus.focus({ preventScroll: true });
        focusRestored = document.activeElement === previousFocus;
      }
      if (!focusRestored && activeDialogs.size === 0) {
        // 트리거가 삭제된 경우 페이지 제목/본문을 우선하고, 없으면 앱으로 복귀한다.
        const fallback =
          document.querySelector<HTMLElement>("main, h1") ??
          document.getElementById("root");
        if (!fallback) return;
        const previousTabIndex = fallback.getAttribute("tabindex");
        fallback.setAttribute("tabindex", "-1");
        fallback.focus({ preventScroll: true });
        if (previousTabIndex === null) fallback.removeAttribute("tabindex");
        else fallback.setAttribute("tabindex", previousTabIndex);
      }
    };
  }, []);

  const scheduleAction = (action: () => void) => {
    if (isClosing || closingTimer.current !== null) return;

    setIsClosing(true);
    closingTimer.current = setTimeout(() => {
      closingTimer.current = null;
      action();
    }, 300);
  };

  const handleClose = () => scheduleAction(onClose);
  const handleConfirm = () => {
    if (!confirmDisabled) scheduleAction(onConfirm);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;

    const buttons = [cancelRef.current, confirmRef.current].filter(
      (button): button is HTMLButtonElement =>
        button !== null && !button.disabled
    );
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (!first || !last) return;

    const focused = document.activeElement;
    const isOutside = !dialogRef.current?.contains(focused);
    if (event.shiftKey && (focused === first || isOutside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (focused === last || isOutside)) {
      event.preventDefault();
      first.focus();
    }
  };
  return (
    <S.Overlay
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={hasDescription ? descriptionId : undefined}
      $showOverlay={showOverlay}
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <S.Container $isClosing={isClosing} $variant={variant}>
        <S.Question id={titleId} $variant={variant}>
          {lines ? (
            lines.map((line) => <span key={line}>{line}</span>)
          ) : (
            <>
              {nickname && <div>{nickname}</div>}
              {question}&nbsp;{nickname2 && <div>{nickname2}</div>}
              {question2 && question2}
            </>
          )}
        </S.Question>
        {hasDescription && (
          <S.Description id={descriptionId}>
            {descriptionLines
              ? descriptionLines.map((line) => <span key={line}>{line}</span>)
              : description}
          </S.Description>
        )}
        <S.BtnBox $variant={variant}>
          <S.Btn
            ref={cancelRef}
            type="button"
            $variant={variant}
            aria-disabled={isClosing}
            onClick={handleClose}
          >
            {cancelText}
          </S.Btn>
          <S.Div $variant={variant}></S.Div>
          <S.Btn
            ref={confirmRef}
            type="button"
            aria-disabled={isClosing || confirmDisabled}
            $variant={variant}
            $confirmColor={confirmColor}
            disabled={confirmDisabled}
            onClick={handleConfirm}
          >
            {confirmText}
          </S.Btn>
        </S.BtnBox>
      </S.Container>
    </S.Overlay>
  );
}
