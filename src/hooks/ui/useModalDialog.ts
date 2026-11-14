import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface ModalDialogOptions {
  initialFocusRef?: RefObject<HTMLElement | null>;
  restoreFocusFallback?: boolean;
}

interface DialogEntry {
  dialog: HTMLDialogElement;
  previousFocus: Element | null;
}

const activeDialogs: DialogEntry[] = [];
let bodyOverflowBeforeDialog = "";

/** 네이티브 모달의 초점·중첩·스크롤 잠금 수명을 함께 관리한다. */
export default function useModalDialog(
  isVisible = true,
  { initialFocusRef, restoreFocusFallback = false }: ModalDialogOptions = {}
) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isVisible) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const entry: DialogEntry = {
      dialog,
      previousFocus: document.activeElement,
    };
    if (!dialog.open) dialog.showModal();

    if (activeDialogs.length === 0) {
      bodyOverflowBeforeDialog = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    activeDialogs.push(entry);

    const initialFocus =
      initialFocusRef?.current ??
      dialog.querySelector<HTMLButtonElement>(
        'button[aria-pressed="true"]:not(:disabled)'
      ) ??
      dialog.querySelector<HTMLButtonElement>("button:not(:disabled)");
    initialFocus?.focus({ preventScroll: true });

    return () => {
      const index = activeDialogs.indexOf(entry);
      const wasTopmost = index === activeDialogs.length - 1;
      // 아래 모달이 먼저 사라져도 최종 복귀 위치를 잃지 않는다.
      for (const other of activeDialogs) {
        if (other !== entry && dialog.contains(other.previousFocus)) {
          other.previousFocus = entry.previousFocus;
        }
      }
      if (dialog.open) dialog.close();
      if (index !== -1) activeDialogs.splice(index, 1);
      const remaining = activeDialogs.at(-1)?.dialog;
      if (!remaining) document.body.style.overflow = bodyOverflowBeforeDialog;
      if (!wasTopmost) return;

      const previous = entry.previousFocus;
      let restored = false;
      if (
        previous instanceof HTMLElement &&
        previous.isConnected &&
        previous !== document.body &&
        (!remaining || remaining.contains(previous))
      ) {
        previous.focus({ preventScroll: true });
        restored = document.activeElement === previous;
      }
      if (!restored && remaining) {
        // 복귀할 버튼이 사라졌다면 열린 모달 안에 초점을 유지한다.
        const target = remaining.querySelector<HTMLElement>(
          "button:not(:disabled)"
        );
        target?.focus({ preventScroll: true });
      } else if (!restored && restoreFocusFallback) {
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
  }, [isVisible, initialFocusRef, restoreFocusFallback]);

  return dialogRef;
}
