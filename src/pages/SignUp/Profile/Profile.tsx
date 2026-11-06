import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/Button/Button";
import DefaultProfileImage from "@/components/DefaultProfileImage/DefaultProfileImage";
import Input from "@/components/Input/Input";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useSetupProfileMutation } from "@/hooks/useProfileQueries";
import { codePointInputProps, countCodePoints } from "@/utils/codePoint";
import { PROFILE_IMAGE_ACCEPT, validateProfileImage } from "@/utils/profileImage";

import * as S from "./Profile.styles";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_BIRTH_YEAR = 1900;

export default function Profile() {
  const navigate = useNavigate();
  const { mutateAsync: setupProfile, isPending } = useSetupProfileMutation();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [intro, setIntro] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [touched, setTouched] = useState({
    nickname: false,
    intro: false,
    birthYear: false,
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const stepInputRef = useRef<HTMLInputElement>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const previousStepRef = useRef(step);
  const submittingRef = useRef(false);
  const birthYearNumber = Number(birthYear);
  const isValidBirthYear =
    /^\d{4}$/.test(birthYear) &&
    birthYearNumber >= MIN_BIRTH_YEAR &&
    birthYearNumber <= CURRENT_YEAR;
  const isNextDisabled =
    (step === 1 && nickname.trim().length === 0) ||
    (step === 2 && intro.trim().length === 0) ||
    (step === 3 && !isValidBirthYear);

  const nicknameError = touched.nickname && nickname.trim().length === 0;
  const introError = touched.intro && intro.trim().length === 0;
  const birthYearError =
    (touched.birthYear || birthYear.length === 4) && !isValidBirthYear;

  useEffect(() => {
    if (previousStepRef.current === step) return;
    previousStepRef.current = step;

    if (step === 4) {
      uploadButtonRef.current?.focus();
    } else {
      stepInputRef.current?.focus();
    }
  }, [step]);

  const handleClickUpload = () => {
    fileRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const error = validateProfileImage(file);
    if (error) {
      setSubmitError(error);
      return;
    }
    setSubmitError("");
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSignUp = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitError("");

    try {
      await setupProfile({
        nickname: nickname,
        introduction: intro,
        birthYear: Number(birthYear),
        image: selectedFile,
      });

      navigate("/home");
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      setSubmitError(
        axios.isAxiosError(error) && error.response?.status === 413
          ? "이미지는 5MB 이하로 선택해 주세요."
          : "프로필 설정을 완료하지 못했어요. 일부 정보가 저장됐을 수 있으니 다시 시도해 주세요."
      );
    } finally {
      submittingRef.current = false;
    }
  };

  const handleNext = () => {
    if (isNextDisabled || isPending) {
      stepInputRef.current?.focus();
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSignUp();
    }
  };

  return (
    <>
      <PageTitle title="회원가입" heading />
      <S.Container>
        <S.InputBox>
          {step === 1 && (
            <>
              <S.StepText id="profile-step">1/4</S.StepText>

              <S.TextBox>
                <S.FieldLabel htmlFor="profile-nickname">
                  쿼트미에서 사용할 <br />
                  닉네임을 설정해 주세요.
                </S.FieldLabel>

                <S.exText id="profile-nickname-help">
                  닉네임은 언제든 수정할 수 있어요.
                </S.exText>
              </S.TextBox>

              <S.Field>
                <Input
                  id="profile-nickname"
                  ref={stepInputRef}
                  aria-describedby={`profile-step profile-nickname-help profile-nickname-limit${nicknameError ? " profile-nickname-error" : ""}`}
                  aria-invalid={nicknameError || undefined}
                  onBlur={() =>
                    setTouched((previous) => ({ ...previous, nickname: true }))
                  }
                  value={nickname}
                  {...codePointInputProps(setNickname, 10)}
                  placeholder="닉네임을 입력해 주세요"
                  type="text"
                  name="nickname"
                  autoComplete="nickname"
                  required
                />
                <S.VisuallyHidden id="profile-nickname-limit">
                  공백을 포함해 최대 10자까지 입력할 수 있습니다.
                </S.VisuallyHidden>
                {nicknameError && (
                  <S.ErrorMessage id="profile-nickname-error">
                    닉네임을 입력해 주세요.
                  </S.ErrorMessage>
                )}
              </S.Field>
            </>
          )}

          {step === 2 && (
            <>
              <S.StepText id="profile-step">2/4</S.StepText>

              <S.TextBox>
                <S.FieldLabel htmlFor="profile-intro">
                  다른 사람들에게 보여줄 <br />
                  자기소개를 설정해 주세요.
                </S.FieldLabel>

                <S.exText id="profile-intro-help">
                  자기소개는 언제든 수정할 수 있어요.
                </S.exText>
              </S.TextBox>

              <S.Field>
                <Input
                  id="profile-intro"
                  ref={stepInputRef}
                  aria-describedby={`profile-step profile-intro-help profile-intro-limit${introError ? " profile-intro-error" : ""}`}
                  aria-invalid={introError || undefined}
                  onBlur={() =>
                    setTouched((previous) => ({ ...previous, intro: true }))
                  }
                  value={intro}
                  {...codePointInputProps(setIntro, 20)}
                  placeholder="자기소개를 입력해주세요"
                  type="text"
                  name="intro"
                  required
                />

                <S.VisuallyHidden id="profile-intro-limit">
                  공백을 포함해 최대 20자까지 입력할 수 있습니다.
                </S.VisuallyHidden>
                <S.FieldMeta>
                  {introError && (
                    <S.ErrorMessage id="profile-intro-error">
                      자기소개를 입력해 주세요.
                    </S.ErrorMessage>
                  )}
                  <S.LimitText>{countCodePoints(intro)}/20자</S.LimitText>
                </S.FieldMeta>
              </S.Field>
            </>
          )}

          {step === 3 && (
            <>
              <S.StepText id="profile-step">3/4</S.StepText>

              <S.TextBox>
                <S.FieldLabel htmlFor="profile-birth-year">
                  명언 카드에 표시할 <br />
                  출생연도를 입력해 주세요.
                </S.FieldLabel>

                <S.exText id="profile-birth-year-help">
                  출생연도는 계정 관리에서 수정할 수 있어요.
                </S.exText>
              </S.TextBox>

              <S.Field>
                <Input
                  id="profile-birth-year"
                  ref={stepInputRef}
                  aria-describedby={`profile-step profile-birth-year-help profile-birth-year-limit${birthYearError ? " profile-birth-year-error" : ""}`}
                  aria-invalid={birthYearError || undefined}
                  onBlur={() =>
                    setTouched((previous) => ({ ...previous, birthYear: true }))
                  }
                  value={birthYear}
                  onChange={(e) =>
                    setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="출생연도(yyyy) 입력"
                  type="text"
                  name="birthYear"
                  autoComplete="bday-year"
                  maxLength={4}
                  inputMode="numeric"
                  required
                />
                <S.VisuallyHidden id="profile-birth-year-limit">
                  출생연도를 숫자 4자리로 입력해 주세요. {MIN_BIRTH_YEAR}년부터{" "}
                  {CURRENT_YEAR}년까지 입력할 수 있습니다.
                </S.VisuallyHidden>
                {birthYearError && (
                  <S.ErrorMessage id="profile-birth-year-error">
                    {MIN_BIRTH_YEAR}년부터 {CURRENT_YEAR}년 사이의 출생연도를
                    숫자 4자리로 입력해 주세요.
                  </S.ErrorMessage>
                )}
              </S.Field>
            </>
          )}

          {step === 4 && (
            <>
              <S.StepText id="profile-step">4/4</S.StepText>

              <S.TextBox>
                <S.ExText>
                  다른 사람들에게 보여줄 <br />
                  프로필 이미지를 설정해 주세요.
                </S.ExText>

                <S.exText>이미지는 언제든 수정할 수 있어요.</S.exText>
              </S.TextBox>

              <S.ProfileWrapper>
                <S.ImgPreview
                  role="img"
                  aria-label={
                    selectedFile
                      ? `선택한 프로필 이미지: ${selectedFile.name}`
                      : "기본 프로필 이미지"
                  }
                  style={{
                    backgroundImage: preview ? `url(${preview})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!preview && (
                    <DefaultProfileImage />
                  )}
                </S.ImgPreview>
                <input
                  id="profile-image"
                  type="file"
                  aria-label="프로필 이미지 파일 선택"
                  accept={PROFILE_IMAGE_ACCEPT}
                  disabled={isPending}
                  ref={fileRef}
                  onChange={handleChangeFile}
                  style={{ display: "none" }}
                />

                <S.ImgInput
                  type="button"
                  ref={uploadButtonRef}
                  aria-describedby="profile-step profile-image-selection"
                  onClick={handleClickUpload}
                  disabled={isPending}
                >
                  이미지 업로드하기
                </S.ImgInput>
                <S.VisuallyHidden id="profile-image-selection" role="status">
                  {selectedFile
                    ? `${selectedFile.name} 파일을 선택했습니다.`
                    : "이미지를 선택하지 않으면 기본 프로필 이미지를 사용합니다."}
                </S.VisuallyHidden>
              </S.ProfileWrapper>
            </>
          )}
        </S.InputBox>
        <S.VisuallyHidden role="status">
          {isPending ? "프로필을 저장하는 중입니다." : ""}
        </S.VisuallyHidden>
        {submitError && (
          <S.SaveError id="profile-save-error" role="alert">
            {submitError}
          </S.SaveError>
        )}
        <S.BtnBox>
          <Button
            title={step === 4 ? "쿼트미 시작하기" : "다음으로"}
            onClick={handleNext}
            disabled={isNextDisabled || isPending}
            aria-busy={isPending}
            aria-describedby={submitError ? "profile-save-error" : undefined}
          />
        </S.BtnBox>
      </S.Container>
    </>
  );
}
