import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import googleIcon from "@/assets/icons/account/google.png";
import kakaoIcon from "@/assets/icons/account/kakao.png";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import {
  useAccountProfileQuery,
  useDeleteAccountMutation,
  useUpdateAccountMutation,
} from "@/hooks/useProfileQueries";
import useAuthStore from "@/stores/useAuthStore";

import * as S from "./AccountSetting.styles";

type SheetType = "gender" | "birth" | null;

const GENDER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "FEMALE", label: "여성" },
  { value: "MALE", label: "남성" },
  { value: "", label: "선택 안 함" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: 121 },
  (_, index) => CURRENT_YEAR - index
);

function formatGender(gender: string) {
  return GENDER_OPTIONS.find((option) => option.value === gender)?.label ?? "";
}

function formatBirthYear(year: number | null) {
  return year ? `${year}년` : "";
}

export default function AccountSetting() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const {
    data: accountProfile,
    isError: isAccountProfileError,
    isPending: isAccountProfilePending,
  } = useAccountProfileQuery();
  const updateAccountMutation = useUpdateAccountMutation();
  const { mutateAsync: deleteAccount } = useDeleteAccountMutation();
  const [genderDraft, setGenderDraft] = useState<string | null>(null);
  const [birthYearDraft, setBirthYearDraft] = useState<number | null>(null);
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const selectedYearRef = useRef<HTMLButtonElement | null>(null);
  const currentGender = genderDraft ?? accountProfile?.gender ?? "";
  const currentBirthYear: number | null =
    birthYearDraft ??
    (Number.isFinite(accountProfile?.birthYear)
      ? (accountProfile?.birthYear ?? null)
      : null);

  useEffect(() => {
    if (sheetType !== "birth") {
      return;
    }

    window.requestAnimationFrame(() => {
      selectedYearRef.current?.scrollIntoView({
        block: "center",
        behavior: "auto",
      });
    });
  }, [sheetType]);

  const saveAccount = async (
    nextGender = currentGender,
    nextBirthYear = currentBirthYear
  ) => {
    if (isAccountProfilePending || !accountProfile) {
      setToastMessage("계정 정보를 불러온 뒤 다시 시도해 주세요.");
      return;
    }

    if (!nextBirthYear) {
      setToastMessage("출생연도를 선택해 주세요.");
      return;
    }

    try {
      await updateAccountMutation.mutateAsync({
        gender: nextGender,
        birthYear: nextBirthYear,
      });
      setToastMessage("계정 정보가 저장되었습니다.");
    } catch (e) {
      console.error("계정 정보 저장 실패", e);
      setToastMessage("계정 정보 저장에 실패했습니다.");
    }
  };

  const handleGenderDone = () => {
    setSheetType(null);
    void saveAccount(currentGender);
  };

  const handleBirthDone = () => {
    setSheetType(null);
    void saveAccount(currentGender, currentBirthYear);
  };

  const centerSelectedOption = (element: HTMLButtonElement) => {
    element.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount();
      logout();
      setShowDeleteModal(false);
      setToastMessage("계정이 삭제되었습니다.");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (e) {
      console.error("계정 삭제 실패", e);
      setShowDeleteModal(false);
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
        {showDeleteModal && (
          <ConfirmModal
            onClose={() => setShowDeleteModal(false)}
            question="정말로 계정을 삭제하시겠습니까?"
            onConfirm={handleConfirmDelete}
          />
        )}
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="계정 관리"
          backgroundColor="secondary"
          onClickBackBtn={() => navigate("/setting-page")}
        />
        <S.Content>
          <S.Section>
            <S.SectionTitle>계정 정보</S.SectionTitle>
            <S.InfoList>
              <S.InfoRow type="button" onClick={() => setSheetType("gender")}>
                <S.RowLabel>성별</S.RowLabel>
                <S.RowValue>{formatGender(currentGender)}</S.RowValue>
              </S.InfoRow>
              <S.InfoRow type="button" onClick={() => setSheetType("birth")}>
                <S.RowLabel>출생연도</S.RowLabel>
                <S.RowValue>{formatBirthYear(currentBirthYear)}</S.RowValue>
              </S.InfoRow>
            </S.InfoList>
            {isAccountProfileError && (
              <S.WarningMessage>
                계정 정보를 불러오지 못했습니다.
              </S.WarningMessage>
            )}
          </S.Section>

          <S.Section>
            <S.SectionTitle>계정 연동</S.SectionTitle>
            <S.LinkedList>
              <S.LinkedRow>
                <S.ProviderIconFrame>
                  <S.ProviderIcon src={googleIcon} alt="" />
                </S.ProviderIconFrame>
                <S.ProviderName>Google 계정</S.ProviderName>
                <S.ProviderStatus>연동됨</S.ProviderStatus>
              </S.LinkedRow>
              <S.LinkedActionRow
                type="button"
                onClick={() => setToastMessage("아직 구현되지 않은 기능입니다.")}
              >
                <S.ProviderIconFrame>
                  <S.ProviderIcon src={kakaoIcon} alt="" />
                </S.ProviderIconFrame>
                <S.ProviderName>카카오</S.ProviderName>
                <S.ProviderStatus>연동하기</S.ProviderStatus>
              </S.LinkedActionRow>
            </S.LinkedList>
          </S.Section>
        </S.Content>

        <S.BottomActions>
          <S.LogoutButton type="button" onClick={handleLogout}>
            로그아웃
          </S.LogoutButton>
          <S.DeleteButton type="button" onClick={() => setShowDeleteModal(true)}>
            계정삭제
          </S.DeleteButton>
        </S.BottomActions>

        {sheetType === "gender" && (
          <S.SheetOverlay onClick={() => setSheetType(null)}>
            <S.Sheet onClick={(event) => event.stopPropagation()}>
              <S.GenderList>
                {GENDER_OPTIONS.map((option) => (
                  <S.GenderOption
                    key={option.label}
                    type="button"
                    onClick={() => setGenderDraft(option.value)}
                  >
                    <span>{option.label}</span>
                    {currentGender === option.value && <S.CheckMark />}
                  </S.GenderOption>
                ))}
              </S.GenderList>
              <S.SheetDoneButton type="button" onClick={handleGenderDone}>
                완료
              </S.SheetDoneButton>
            </S.Sheet>
          </S.SheetOverlay>
        )}

        {sheetType === "birth" && (
          <S.SheetOverlay onClick={() => setSheetType(null)}>
            <S.Sheet onClick={(event) => event.stopPropagation()}>
              <S.YearPicker>
                {YEAR_OPTIONS.map((year) => (
                  <S.PickerOption
                    key={year}
                    ref={currentBirthYear === year ? selectedYearRef : undefined}
                    type="button"
                    $selected={currentBirthYear === year}
                    onClick={(event) => {
                      setBirthYearDraft(year);
                      centerSelectedOption(event.currentTarget);
                    }}
                  >
                    {year}년
                  </S.PickerOption>
                ))}
              </S.YearPicker>
              <S.SheetDoneButton type="button" onClick={handleBirthDone}>
                완료
              </S.SheetDoneButton>
            </S.Sheet>
          </S.SheetOverlay>
        )}
      </S.Container>
    </>
  );
}
