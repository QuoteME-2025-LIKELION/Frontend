import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useSetupProfileMutation } from "@/hooks/useProfileQueries";
import theme from "@/styles/theme";

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
    if (!file) return;

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
      setSubmitError("프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
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
      <PageTitle title="회원가입" />
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
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력해 주세요"
                  type="text"
                  name="nickname"
                  autoComplete="nickname"
                  maxLength={10}
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
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="자기소개를 입력해주세요"
                  type="text"
                  name="intro"
                  maxLength={20}
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
                  <S.LimitText>{intro.length}/20자</S.LimitText>
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
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="80"
                      viewBox="0 0 80 80"
                      fill="none"
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="40"
                        fill={theme.colors.primary}
                      />

                      <g transform="translate(22,18)">
                        <path
                          d="M14.3027 35.4218C11.5784 35.032 9.12973 34.09 6.95676 32.5958C4.81622 31.0692 3.11351 29.104 1.84865 26.7003C0.616216 24.2966 0 21.5844 0 18.5635C0 15.8675 0.47027 13.3989 1.41081 11.1576C2.38378 8.88386 3.71351 6.91869 5.4 5.2621C7.11892 3.57303 9.11351 2.27375 11.3838 1.36425C13.6541 0.45475 16.0865 0 18.6811 0C21.1459 0 23.4 0.438509 25.4432 1.31553C27.5189 2.16006 29.3027 3.34566 30.7946 4.87232C32.2865 6.39898 33.4378 8.20174 34.2486 10.2806C35.0919 12.327 35.5135 14.5682 35.5135 17.0044C35.5135 20.3176 34.8162 23.3059 33.4216 25.9695C32.027 28.6005 30.0973 30.7606 27.6324 32.4496C25.2 34.1062 22.3784 35.0969 19.1676 35.4218C20.9189 36.5586 22.8324 37.5006 24.9081 38.2477C27.0162 38.9623 29.0108 39.3196 30.8919 39.3196C31.7027 39.3196 32.4486 39.2384 33.1297 39.076C33.8432 38.9136 34.4919 38.67 35.0757 38.3451C35.3351 38.5725 35.5459 38.9136 35.7081 39.3683C35.9027 39.8231 36 40.1804 36 40.4402C35.2865 41.2848 34.3946 41.9831 33.3243 42.5353C32.2541 43.0875 31.1027 43.3636 29.8703 43.3636C28.7027 43.3636 27.4054 43.1038 25.9784 42.5841C24.5513 42.0644 22.8811 41.2198 20.9676 40.0505C19.0865 38.8811 16.8649 37.3382 14.3027 35.4218ZM18.0486 32.5958C20.5459 32.5958 22.7351 31.9949 24.6162 30.7931C26.4973 29.5912 27.9568 27.9184 28.9946 25.7746C30.0324 23.6307 30.5513 21.1621 30.5513 18.3686C30.5513 15.3478 30 12.6843 28.8973 10.378C27.827 8.07181 26.3027 6.26905 24.3243 4.96976C22.3459 3.638 20.027 2.97211 17.3676 2.97211C15.0324 2.97211 12.9243 3.58927 11.0432 4.82359C9.19459 6.02543 7.71892 7.69826 6.61622 9.84208C5.51351 11.9859 4.96216 14.4383 4.96216 17.1993C4.96216 20.2526 5.52973 22.9324 6.66486 25.2386C7.83243 27.5448 9.40541 29.3476 11.3838 30.6469C13.3622 31.9462 15.5838 32.5958 18.0486 32.5958Z"
                          fill={theme.colors["grey-00"]}
                        />
                      </g>
                    </svg>
                  )}
                </S.ImgPreview>
                <input
                  id="profile-image"
                  type="file"
                  aria-label="프로필 이미지 파일 선택"
                  accept="image/*"
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
