import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { LinkedProvider } from "@/api/profileApi";
import googleIcon from "@/assets/icons/account/google.png";
import kakaoIcon from "@/assets/icons/account/kakao.png";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useLogoutMutation } from "@/hooks/useAuthQueries";
import useModalDialog from "@/hooks/useModalDialog";
import {
  useAccountProfileQuery,
  useUpdateAccountMutation,
} from "@/hooks/useProfileQueries";
import { getPreferredScrollBehavior } from "@/utils/getPreferredScrollBehavior";

import * as S from "./AccountSetting.styles";

type SheetType = "gender" | "birth" | null;
type GenderValue = "FEMALE" | "MALE" | "ETC";

const GENDER_OPTIONS: Array<{ value: GenderValue; label: string }> = [
  { value: "FEMALE", label: "여성" },
  { value: "MALE", label: "남성" },
  { value: "ETC", label: "선택 안 함" },
];
const DEFAULT_GENDER: GenderValue = "ETC";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_BIRTH_YEAR = 1900;
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - MIN_BIRTH_YEAR + 1 },
  (_, index) => CURRENT_YEAR - index
);

function normalizeGender(gender: string | null | undefined): GenderValue {
  return gender === "FEMALE" || gender === "MALE" || gender === "ETC"
    ? gender
    : DEFAULT_GENDER;
}

function parseBirthYear(year: string | number | null | undefined) {
  const parsed = typeof year === "number" ? year : Number(year);

  return /^\d{4}$/.test(String(year)) &&
    Number.isInteger(parsed) && parsed >= MIN_BIRTH_YEAR && parsed <= CURRENT_YEAR
    ? parsed : null;
}

function formatGender(gender: GenderValue) {
  return GENDER_OPTIONS.find((option) => option.value === gender)?.label ?? "";
}

function formatBirthYear(year: number | null) {
  return year ? `${year}년` : "";
}

export default function AccountSetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogoutMutation();
  const {
    data: accountProfile,
    isError: isAccountProfileError,
    isPending: isAccountProfilePending,
  } = useAccountProfileQuery();
  const updateAccountMutation = useUpdateAccountMutation();
  const [genderDraft, setGenderDraft] = useState<GenderValue | null>(null);
  const [birthYearDraft, setBirthYearDraft] = useState<number | null>(null);
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [toastMessage, setToastMessage] = useState(
    typeof location.state?.oauthMessage === "string" ? location.state.oauthMessage : ""
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const sheetRef = useModalDialog(sheetType !== null);
  const selectedYearRef = useRef<HTMLButtonElement | null>(null);
  const selectedBirthYearRef = useRef<number | null>(null);
  const currentGender = genderDraft ?? normalizeGender(accountProfile?.gender);
  const currentBirthYear: number | null =
    birthYearDraft ?? parseBirthYear(accountProfile?.birthYear);

  const getProviderStatus = (provider: LinkedProvider) => {
    if (isAccountProfilePending) return "확인 중";
    if (isAccountProfileError || !accountProfile) return "확인 불가";
    if (Array.isArray(accountProfile.linkedAccounts)) {
      return accountProfile.linkedAccounts.some((account) => account.provider === provider)
        ? "연동됨" : "미연동";
    }
    // 이전 응답에서는 확인 가능한 단일 provider만 연동으로 표시한다.
    return accountProfile.provider === provider ? "연동됨" : "확인 불가";
  };

  useEffect(() => {
    if (sheetType !== "birth") return;
    const frame = window.requestAnimationFrame(() => {
      selectedYearRef.current?.scrollIntoView({
        block: "center",
        behavior: "auto",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [sheetType]);

  const saveAccount = async (
    nextGender = currentGender,
    nextBirthYear = currentBirthYear
  ) => {
    const resetDrafts = () => {
      selectedBirthYearRef.current = null;
      setGenderDraft(normalizeGender(accountProfile?.gender));
      setBirthYearDraft(parseBirthYear(accountProfile?.birthYear));
    };

    if (isAccountProfilePending || !accountProfile) {
      resetDrafts();
      setToastMessage("계정 정보를 불러온 뒤 다시 시도해 주세요.");
      return;
    }

    if (nextBirthYear === null || parseBirthYear(nextBirthYear) === null) {
      resetDrafts();
      setToastMessage("출생연도를 선택해 주세요.");
      return;
    }

    if (!accountProfile.email) {
      resetDrafts();
      setToastMessage("계정 이메일을 불러오지 못했습니다.");
      return;
    }

    try {
      await updateAccountMutation.mutateAsync({
        email: accountProfile.email,
        gender: nextGender,
        birthYear: String(nextBirthYear),
      });
      setToastMessage("계정 정보가 저장되었습니다.");
    } catch (e) {
      resetDrafts();
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
    void saveAccount(
      currentGender,
      selectedBirthYearRef.current ?? currentBirthYear
    );
  };

  const centerSelectedOption = (element: HTMLButtonElement) => {
    element.scrollIntoView({
      block: "center",
      behavior: getPreferredScrollBehavior(),
    });
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      setShowLogoutConfirm(false);
      setToastMessage("로그아웃에 실패했습니다. 다시 시도해 주세요.");
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
        {showLogoutConfirm && (
          <ConfirmModal
            question="로그아웃하시겠어요?"
            variant="card"
            onClose={() => setShowLogoutConfirm(false)}
            onConfirm={handleLogout}
            confirmDisabled={isLoggingOut}
          />
        )}
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="계정 관리"
          backgroundColor="secondary"
          onClickBackBtn={() => navigate("/home")}
        />
        <S.Content>
          <S.Section>
            <S.SectionTitle>계정 정보</S.SectionTitle>
            <S.InfoList>
              <S.InfoRow
                type="button"
                aria-haspopup="dialog"
                aria-expanded={sheetType === "gender"}
                onClick={() => setSheetType("gender")}
              >
                <S.RowLabel>성별</S.RowLabel>
                <S.RowValue>{formatGender(currentGender)}</S.RowValue>
              </S.InfoRow>
              <S.InfoRow
                type="button"
                aria-haspopup="dialog"
                aria-expanded={sheetType === "birth"}
                onClick={() => {
                  selectedBirthYearRef.current = currentBirthYear;
                  setSheetType("birth");
                }}
              >
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
                <S.ProviderName>구글</S.ProviderName>
                <S.ProviderStatus>
                  {getProviderStatus("GOOGLE")}
                </S.ProviderStatus>
              </S.LinkedRow>
              <S.LinkedRow>
                <S.ProviderIconFrame>
                  <S.ProviderIcon src={kakaoIcon} alt="" />
                </S.ProviderIconFrame>
                <S.ProviderName>카카오</S.ProviderName>
                <S.ProviderStatus>
                  {getProviderStatus("KAKAO")}
                </S.ProviderStatus>
              </S.LinkedRow>
            </S.LinkedList>
          </S.Section>
        </S.Content>

        <S.BottomActions>
          <S.LogoutButton
            type="button"
            disabled={isLoggingOut}
            onClick={() => setShowLogoutConfirm(true)}
          >
            로그아웃
          </S.LogoutButton>
          <S.DeleteButton
            type="button"
            onClick={() => navigate("/account-delete")}
          >
            계정삭제
          </S.DeleteButton>
        </S.BottomActions>

        {sheetType === "gender" && (
          <S.SheetOverlay
            ref={sheetRef}
            aria-label="성별 선택"
            aria-modal="true"
            onCancel={(event) => {
              event.preventDefault();
              setSheetType(null);
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSheetType(null);
            }}
          >
            <S.Sheet onClick={(event) => event.stopPropagation()}>
              <S.GenderList>
                {GENDER_OPTIONS.map((option) => (
                  <S.GenderOption
                    key={option.label}
                    type="button"
                    aria-pressed={currentGender === option.value}
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
          <S.SheetOverlay
            ref={sheetRef}
            aria-label="출생연도 선택"
            aria-modal="true"
            onCancel={(event) => {
              event.preventDefault();
              setSheetType(null);
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSheetType(null);
            }}
          >
            <S.Sheet onClick={(event) => event.stopPropagation()}>
              <S.YearPicker>
                {YEAR_OPTIONS.map((year) => (
                  <S.PickerOption
                    key={year}
                    ref={
                      currentBirthYear === year ? selectedYearRef : undefined
                    }
                    type="button"
                    aria-pressed={currentBirthYear === year}
                    $selected={currentBirthYear === year}
                    onClick={(event) => {
                      selectedBirthYearRef.current = year;
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
