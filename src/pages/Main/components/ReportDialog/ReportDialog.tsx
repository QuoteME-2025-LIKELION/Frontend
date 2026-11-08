import { useId, useRef, useState } from "react";

import useModalDialog from "@/hooks/ui/useModalDialog";

import * as S from "./ReportDialog.styles";
import { REPORT_REASONS, type ReportReason } from "./reportReasons";


interface Props {
  authorName: string;
  isAiGenerated?: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, details: string) => void;
}

export default function ReportDialog({ authorName, isAiGenerated = false, onClose, onSubmit }: Props) {
  const firstReasonRef = useRef<HTMLInputElement>(null);
  const ref = useModalDialog(true, { initialFocusRef: firstReasonRef, restoreFocusFallback: true });
  const titleId = useId();
  const detailsId = useId();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const visibleReasons = REPORT_REASONS.filter((item) => item.id !== "ai" || isAiGenerated);
  const hasOther = reason === "other";
  const canSubmit = reason !== null && visibleReasons.some((item) => item.id === reason)
    && (!hasOther || details.trim().length > 0);

  return (
    <S.Overlay ref={ref} aria-labelledby={titleId} aria-modal="true"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <S.ReportPanel onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit && reason !== null) onSubmit(reason, hasOther ? details.trim() : "");
      }}>
        <S.Title id={titleId}>신고사유</S.Title>
        <S.ReasonList>
          <legend>{authorName}님의 명언 신고 사유</legend>
          {visibleReasons.map((item) => <S.Reason key={item.id}>
            <span>{item.label}</span>
            <input ref={item.id === visibleReasons[0].id ? firstReasonRef : undefined}
              type="checkbox" checked={reason === item.id} onChange={(event) => {
              setReason(event.target.checked ? item.id : null);
            }} />
          </S.Reason>)}
        </S.ReasonList>
        {hasOther && <S.Details id={detailsId} aria-label="기타 신고 사유" required placeholder="신고 사유를 작성해 주세요"
          value={details} maxLength={500} onChange={(event) => setDetails(event.target.value)} />}
        <S.Actions>
          <button type="button" onClick={onClose}>취소</button>
          <button type="submit" disabled={!canSubmit}>신고하기</button>
        </S.Actions>
      </S.ReportPanel>
    </S.Overlay>
  );
}
