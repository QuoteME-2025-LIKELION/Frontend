import api from "@/api/api";
import Button from "@/components/Button/Button";
import * as S from "./AccountSettingStyled";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";

export default function AccountSetting() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const isValidEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  const isNumeric = (value: string) => /^\d+$/.test(value);

  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = () => {
    // 저장 로직 추가
    const payload = {
      gender,
      birthYear: birth,
      email,
    };

    try {
      // TODO: POST /api/profile/account
      // await api.post("", payload);

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
      await api.delete("/api/profile/account");
      localStorage.removeItem("accessToken");
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
          <Input
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="성별"
            type="text  "
            name="gender"
            required
          />
          <Input
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            placeholder="출생년도(yyyy) 입력"
            type="text  "
            name="birth"
            required
          />
          <S.TextName>이메일 변경</S.TextName>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
            type="email"
            name="email"
            required
          />
          {birth.length > 0 && (!isNumeric(birth) || birth.length > 5) && (
            <S.WarningMessage>유효하지 않은 숫자입니다.</S.WarningMessage>
          )}
          {email.length > 0 && !isValidEmail(email) && (
            <S.WarningMessage>
              유효하지 않은 이메일 형식입니다.
            </S.WarningMessage>
          )}
          <Button title="저장하기" onClick={handleSave} />
          <S.DeleteBtn onClick={handleDelete}>계정 삭제하기</S.DeleteBtn>
        </S.InputBox>
      </S.Container>
    </>
  );
}
