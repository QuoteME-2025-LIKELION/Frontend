import { useEffect, useId, useRef, useState } from "react";

import * as S from "./UserActionsMenu.styles";

interface Props {
  authorName: string;
  onReport?: () => void;
  onDelete?: () => void;
  onBlock: () => void;
}

export default function UserActionsMenu({ authorName, onReport, onDelete, onBlock }: Props) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapper.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const choose = (action: () => void) => {
    // 모달이 열릴 때 복귀할 초점을 더보기 버튼에 남긴다.
    trigger.current?.focus({ preventScroll: true });
    setOpen(false);
    action();
  };

  return (
    <S.MenuWrap ref={wrapper} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }} onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        trigger.current?.focus();
      }
    }}>
      <S.MoreButton ref={trigger} type="button" aria-label={`${authorName} ${onDelete ? "친구" : "명언"} 더보기`}
        aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); }
        }}>
        <svg width="4" height="16" viewBox="0 0 4 16" aria-hidden="true" focusable="false">
          <circle cx="2" cy="2" r="1.25" fill="currentColor" />
          <circle cx="2" cy="8" r="1.25" fill="currentColor" />
          <circle cx="2" cy="14" r="1.25" fill="currentColor" />
        </svg>
      </S.MoreButton>
      {open && <S.Menu ref={menu} id={id} role="menu" aria-label={onDelete ? "친구 관리" : "명언 관리"} onKeyDown={(event) => {
        const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === "ArrowDown" ? (index + 1) % items.length
          : event.key === "ArrowUp" ? (index + items.length - 1) % items.length
            : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : null;
        if (next !== null) { event.preventDefault(); items[next]?.focus(); }
      }}>
        {onReport && <S.MenuItem type="button" role="menuitem" onClick={() => choose(onReport)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
            <path d="M5 17v-4a7 7 0 0 1 14 0v4M3 17h18v4H3zM12 1v2M3 4l2 2M21 4l-2 2M9 13a3 3 0 0 1 3-3" />
          </svg>신고하기
        </S.MenuItem>}
        {onDelete && <S.MenuItem type="button" role="menuitem" onClick={() => choose(onDelete)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
            <path d="m6 6 12 12M6 18 18 6" />
          </svg>삭제하기
        </S.MenuItem>}
        <S.MenuItem type="button" role="menuitem" onClick={() => choose(onBlock)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="10" /><path d="m5 5 14 14" />
          </svg>차단하기
        </S.MenuItem>
      </S.Menu>}
    </S.MenuWrap>
  );
}
