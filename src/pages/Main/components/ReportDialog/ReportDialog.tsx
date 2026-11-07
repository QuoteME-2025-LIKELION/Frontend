import { useId, useRef, useState } from "react";

import useModalDialog from "@/hooks/ui/useModalDialog";

import * as S from "./ReportDialog.styles";
import { REPORT_REASONS, type ReportReason } from "./reportReasons";


interface Props {
  authorName: string;
  onClose: () => void;
  onSubmit: (reasons: ReportReason[], details: string) => void;
}

export default function ReportDialog({ authorName, onClose, onSubmit }: Props) {
  const firstReasonRef = useRef<HTMLInputElement>(null);
  const ref = useModalDialog(true, { initialFocusRef: firstReasonRef, restoreFocusFallback: true });
  const titleId = useId();
  const detailsId = useId();
  const [reasons, setReasons] = useState<ReportReason[]>([]);
  const [details, setDetails] = useState("");
  const hasOther = reasons.includes("other");

  return (
    <S.Overlay ref={ref} aria-labelledby={titleId} aria-modal="true"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <S.ReportPanel onSubmit={(event) => {
        event.preventDefault();
        if (reasons.length) onSubmit(reasons, hasOther ? details.trim() : "");
      }}>
        <S.Title id={titleId}>신고사유</S.Title>
        <S.ReasonList>
          <legend>{authorName}님의 명언 신고 사유</legend>
          {REPORT_REASONS.map((reason) => <S.Reason key={reason.id}>
            <span>{reason.label}</span>
            <input ref={reason.id === REPORT_REASONS[0].id ? firstReasonRef : undefined}
              type="checkbox" checked={reasons.includes(reason.id)} onChange={(event) => {
              setReasons((current) => event.target.checked
                ? [...current, reason.id] : current.filter((value) => value !== reason.id));
            }} />
          </S.Reason>)}
        </S.ReasonList>
        {hasOther && <S.Details id={detailsId} aria-label="기타 신고 사유" placeholder="신고 사유를 작성해 주세요"
          value={details} maxLength={500} onChange={(event) => setDetails(event.target.value)} />}
        <S.Actions>
          <button type="button" onClick={onClose}>돌아가기</button>
          <button type="submit" disabled={reasons.length === 0}>신고하기</button>
        </S.Actions>
      </S.ReportPanel>
    </S.Overlay>
  );
}
