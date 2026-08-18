import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/Button/Button";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import {
  useAccountProfileQuery,
  useDeleteAccountMutation,
  useUpdateAccountMutation,
} from "@/hooks/useProfileQueries";
import useAuthStore from "@/stores/useAuthStore";

import * as S from "./AccountSetting.styles";

export default function AccountSetting() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { data: accountProfile } = useAccountProfileQuery();
  const { mutateAsync: updateAccount } = useUpdateAccountMutation();
  const { mutateAsync: deleteAccount } = useDeleteAccountMutation();
  const [birthDraft, setBirthDraft] = useState<string | null>(null);
  const [genderDraft, setGenderDraft] = useState<string | null>(null);
  const isNumeric = (value: string) => /^\d+$/.test(value);

  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const birth = birthDraft ?? String(accountProfile?.birthYear ?? "");
  const gender = genderDraft ?? accountProfile?.gender ?? "";

  const handleSave = async () => {
    if (!isNumeric(birth) || birth.length !== 4) {
      setErrorMessage("출생년도를 4자리 숫자로 입력해 주세요.");
      setShowErrorToast(true);
      return;
    }

    const payload = {
      gender,
      birthYear: Number(birth),
    };

    try {
      await updateAccount(payload);

      setShowToast(true);
      setTimeout(() => {
        navigate("/setting-page");
      }, 1500);
    } catch (e) {
      console.error("계정 정보 저장 실패", e);
      setErrorMessage("계정 정보 저장에 실패했습니다.");
      setShowErrorToast(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount();
      logout();
      setShowDeleteModal(false);
      setShowDeleteToast(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (e) {
      console.error("계정 삭제 실패", e);
      setShowDeleteModal(false);
      setErrorMessage("계정 삭제에 실패했습니다.");
      setShowErrorToast(true);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <PageTitle title="계정 설정" />
      <S.Container>
        {showToast && (
          <ToastModal
            isVisible={showToast}
            onClose={() => setShowToast(false)}
            text="계정 정보가 저장되었습니다."
          />
        )}
        {showDeleteModal && (
          <ConfirmModal
            onClose={() => setShowDeleteModal(false)}
            question="정말로 계정을 삭제하시겠습니까?"
            onConfirm={handleConfirmDelete}
          />
        )}
        {showDeleteToast && (
          <ToastModal
            isVisible={showDeleteToast}
            onClose={() => setShowDeleteToast(false)}
            text="계정이 삭제되었습니다."
          />
        )}
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
          title="계정 설정"
          backgroundColor="white"
          onClickXBtn={() => navigate("/setting-page")}
        />
        <S.InputBox>
          <S.Select
            value={gender}
            onChange={(e) => setGenderDraft(e.target.value)}
            name="gender"
          >
            <option value="FEMALE">여성</option>
            <option value="MALE">남성</option>
            <option value="">선택 안함</option>
          </S.Select>
          <Input
            value={birth}
            onChange={(e) => setBirthDraft(e.target.value)}
            placeholder="출생년도(yyyy) 입력"
            type="text  "
            name="birth"
            required
          />
          {birth.length > 0 && (!isNumeric(birth) || birth.length !== 4) && (
            <S.WarningMessage>유효하지 않은 숫자입니다.</S.WarningMessage>
          )}
          <Button title="저장하기" onClick={handleSave} />
          <S.DeleteBtn onClick={handleDelete}>계정 삭제하기</S.DeleteBtn>
        </S.InputBox>
      </S.Container>
    </>
  );
}
