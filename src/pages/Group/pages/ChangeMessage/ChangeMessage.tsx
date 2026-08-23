import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import {
  useGroupQuery,
  useUpdateGroupMottoMutation,
} from "@/hooks/useGroupQueries";

import * as S from "./ChangeMessage.styles";

export default function ChangeMessage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasPushedHistoryGuard = useRef(false);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const { groupId } = useParams();
  const isValidGroupId = Boolean(groupId && !isNaN(Number(groupId)));
  const { data: groupData, error: groupError } = useGroupQuery(
    isValidGroupId ? groupId : undefined
  );
  const { mutateAsync: updateGroupMotto } = useUpdateGroupMottoMutation();

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isMessageFocused, setIsMessageFocused] = useState(false);
  const [hasStartedEditing, setHasStartedEditing] = useState(false);
  const [allowNavigation, setAllowNavigation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const message = draftMessage ?? groupData?.motto ?? "";
  const shouldConfirmExit = hasStartedEditing || draftMessage !== null;

  // groupId 유효성 검사
  useEffect(() => {
    if (!isValidGroupId) {
      navigate("/not-found", { replace: true });
    }
  }, [isValidGroupId, navigate]);

  useEffect(() => {
    if (axios.isAxiosError(groupError) && groupError.response?.status === 500) {
      navigate("/not-found", { replace: true });
    }
  }, [groupError, navigate]);

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}${location.hash}`;

    if (!shouldConfirmExit || allowNavigation) {
      hasPushedHistoryGuard.current = false;
      return;
    }

    if (!hasPushedHistoryGuard.current) {
      window.history.pushState({ changeMessageGuard: true }, "", currentPath);
      hasPushedHistoryGuard.current = true;
    }

    const handlePopState = () => {
      setShowExitModal(true);
      window.history.pushState({ changeMessageGuard: true }, "", currentPath);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    allowNavigation,
    location.hash,
    location.pathname,
    location.search,
    shouldConfirmExit,
  ]);

  const handleSave = async () => {
    const newMotto = message.trim();

    if (newMotto.length > 20) {
      setErrorMessage("메시지는 20자 이내로 입력해 주세요.");
      setShowErrorToast(true);
      return;
    }
    try {
      await updateGroupMotto({ groupId: groupId!, motto: newMotto });
      setAllowNavigation(true);
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate(`/group/${groupId}`);
      }, 1500);
    } catch (err) {
      console.error("그룹 메시지 변경 오류:", err);
      setErrorMessage("그룹 메시지 변경에 실패했습니다.");
      setShowErrorToast(true);
    }
  };

  const handleClose = () => {
    if (shouldConfirmExit) {
      setShowExitModal(true);
      return;
    }
    navigate(`/group/${groupId}`);
  };

  const handleExitModalClose = () => {
    setShowExitModal(false);
  };

  const handleExitConfirm = () => {
    setAllowNavigation(true);
    navigate(`/group/${groupId}`);
  };

  return (
    <>
      <PageTitle title="그룹 메시지 변경" />
      <S.Container>
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => setShowErrorToast(false)}
            text={errorMessage}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        {showSuccessToast && (
          <ToastModal
            isVisible={showSuccessToast}
            onClose={() => setShowSuccessToast(false)}
            text="그룹 메시지가 저장되었습니다"
            showOverlay={false}
            variant="snackbar"
          />
        )}
        {showExitModal && (
          <ConfirmModal
            question=""
            lines={["저장하지 않고 나가시겠어요?"]}
            description="작성한 글은 저장되지 않습니다."
            cancelText="돌아가기"
            confirmText="나가기"
            confirmColor="danger"
            variant="card"
            onClose={handleExitModalClose}
            onConfirm={handleExitConfirm}
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="그룹 메시지 수정"
          backgroundColor="secondary"
          onClickXBtn={handleClose}
        />
        <S.Content>
          <S.MessageField $isFocused={isMessageFocused}>
            <S.QuoteMark aria-hidden="true">“</S.QuoteMark>
            <S.MessageInput
              $isFocused={isMessageFocused}
              placeholder="어떤 이야기를 나눌까요?"
              name="message"
              value={message}
              onChange={(e) => setDraftMessage(e.target.value)}
              onFocus={() => {
                setIsMessageFocused(true);
                setHasStartedEditing(true);
              }}
              onBlur={() => setIsMessageFocused(false)}
              maxLength={20}
            />
            <S.QuoteMark aria-hidden="true">”</S.QuoteMark>
          </S.MessageField>
          <S.Desc>{message.length}/20자</S.Desc>
        </S.Content>
        <S.BottomActionBar>
          <S.ActionButton type="button" onClick={handleSave}>
            저장하기
          </S.ActionButton>
        </S.BottomActionBar>
      </S.Container>
    </>
  );
}
