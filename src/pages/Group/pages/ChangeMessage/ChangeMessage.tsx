import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import {
  useGroupQuery,
  useUpdateGroupMottoMutation,
} from "@/hooks/useGroupQueries";

import * as S from "./ChangeMessage.styles";

export default function ChangeMessage() {
  const navigate = useNavigate();
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const { groupId } = useParams();
  const isValidGroupId = Boolean(groupId && !isNaN(Number(groupId)));
  const { data: groupData, error: groupError } = useGroupQuery(
    isValidGroupId ? groupId : undefined
  );
  const { mutateAsync: updateGroupMotto } = useUpdateGroupMottoMutation();

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const message = draftMessage ?? groupData?.motto ?? "";

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

  const handleSave = async () => {
    const newMotto = message.trim();

    if (newMotto.length > 20) {
      setErrorMessage("메시지는 20자 이내로 입력해 주세요.");
      setShowErrorToast(true);
      return;
    }
    try {
      await updateGroupMotto({ groupId: groupId!, motto: newMotto });
      navigate(`/group/${groupId}`);
    } catch (err) {
      console.error("그룹 메시지 변경 오류:", err);
      setErrorMessage("그룹 메시지 변경에 실패했습니다.");
      setShowErrorToast(true);
    }
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
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title=""
          backgroundColor="white"
          onClickXBtn={() => navigate(`/group/${groupId}`)}
        />
        <S.Content>
          <S.Title>그룹 메시지</S.Title>
          <S.InputBox>
            <Input
              placeholder="메시지를 입력하세요"
              name="message"
              value={message}
              onChange={(e) => setDraftMessage(e.target.value)}
              maxLength={20}
            />
            <S.Desc>20자 이내</S.Desc>
          </S.InputBox>
          <Button title="저장 완료" onClick={handleSave} />
        </S.Content>
      </S.Container>
    </>
  );
}
