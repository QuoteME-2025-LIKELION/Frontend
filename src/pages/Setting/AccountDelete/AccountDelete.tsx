import { useState } from "react";
import { useNavigate } from "react-router-dom";

import tagCheckboxCheckedIcon from "@/assets/icons/quote-feed/tag-checkbox-checked.svg";
import tagCheckboxUncheckedIcon from "@/assets/icons/quote-feed/tag-checkbox-unchecked.svg";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useDeleteAccountMutation } from "@/hooks/useProfileQueries";

import * as S from "./AccountDelete.styles";

const DELETE_REASONS = [
  "더이상 사용하지 않아서",
  "사용이 불편해서",
  "알림이 불필요하게 많아서",
  "비슷한 앱을 찾아서",
  "기타",
] as const;

export default function AccountDelete() {
  const navigate = useNavigate();
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccountMutation();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const isOtherSelected = selectedReasons.includes("기타");
  const canDelete =
    selectedReasons.length > 0 &&
    (!isOtherSelected || otherReason.trim().length > 0) &&
    !isPending;

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((item) => item !== reason)
        : [...prev, reason]
    );
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      await deleteAccount();
      navigate("/account-delete-complete", { replace: true });
    } catch (e) {
      console.error("계정 삭제 실패", e);
      setToastMessage("계정 삭제에 실패했습니다.");
    }
  };

  return (
    <>
      <PageTitle title="계정 관리" />
      <S.Container>
        {toastMessage && (
          <ToastModal
            isVisible={Boolean(toastMessage)}
            onClose={() => setToastMessage("")}
            text={toastMessage}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="계정 관리"
          backgroundColor="secondary"
          onClickBackBtn={() => navigate("/account-setting")}
        />
        <S.Content>
          <S.Title>
            쿼트미 계정을
            <br />
            삭제하시겠어요?
          </S.Title>
          <S.Description>
            계정을 삭제하면 모든 계정 정보와
            <br />
            작성한 글이 삭제되며 복구가 불가능 합니다
          </S.Description>

          <S.ReasonTitle>서비스 탈퇴 사유</S.ReasonTitle>
          <S.ReasonList>
            {DELETE_REASONS.map((reason) => (
              <S.ReasonRow
                key={reason}
                type="button"
                onClick={() => toggleReason(reason)}
              >
                <S.ReasonText>{reason}</S.ReasonText>
                <S.Checkbox>
                  <img
                    src={
                      selectedReasons.includes(reason)
                        ? tagCheckboxCheckedIcon
                        : tagCheckboxUncheckedIcon
                    }
                    alt=""
                  />
                </S.Checkbox>
              </S.ReasonRow>
            ))}
          </S.ReasonList>
          {isOtherSelected && (
            <S.OtherInput
              value={otherReason}
              onChange={(event) => setOtherReason(event.target.value)}
              placeholder="탈퇴 사유를 작성해 주세요"
            />
          )}
        </S.Content>
        <S.DeleteButton
          type="button"
          disabled={!canDelete}
          onClick={handleDelete}
        >
          계정 삭제
        </S.DeleteButton>
      </S.Container>
    </>
  );
}
