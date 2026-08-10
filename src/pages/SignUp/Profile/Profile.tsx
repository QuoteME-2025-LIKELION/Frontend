import api from "@/api/api";
import Button from "@/components/Button/Button";
import * as S from "./ProfileStyled";
import Input from "@/components/Input/Input";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import useAuthStore from "@/stores/useAuthStore";

export default function Profile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [intro, setIntro] = useState("");
  const { login } = useAuthStore();
  const [showErrorToast, setShowErrorToast] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleSignUp = async () => {
    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const profileData = {
        nickname: nickname,
        introduction: intro,
      };

      formData.append(
        "data",
        new Blob([JSON.stringify(profileData)], { type: "application/json" })
      );
      await api.post("/api/settings/profile", formData);

      login("test");

      navigate("/start");
    } catch (error: any) {
      console.error("프로필 저장 실패:", error);
      console.log(JSON.stringify(error.response?.data));
      setShowErrorToast(true);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSignUp();
    }
  };

  return (
    <>
      <PageTitle title="회원가입" />
      <S.Container>
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => setShowErrorToast(false)}
            text="프로필 저장에 실패했습니다."
          />
        )}
        <S.InputBox>
          {step === 1 && (
            <>
              <S.StepText>1/3</S.StepText>

              <S.TextBox>
                <S.ExText>
                  쿼트미에서 사용할 <br />
                  닉네임을 설정해 주세요
                </S.ExText>

                <S.exText>닉네임은 언제든 수정할 수 있어요</S.exText>
              </S.TextBox>

              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해 주세요"
                type="text"
                name="nickname"
                maxLength={10}
                required
              />
            </>
          )}

          {step === 2 && (
            <>
              <S.StepText>2/3</S.StepText>

              <S.TextBox>
                <S.ExText>
                  다른 사람들에게 보여줄 <br />
                  자기소개를 설정해 주세요
                </S.ExText>

                <S.exText>자기소개는 언제든 수정할 수 있어요</S.exText>
              </S.TextBox>

              <Input
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="자기소개 설정"
                type="text"
                name="intro"
                maxLength={30}
                required
              />

              <S.LimitText>30자 이내</S.LimitText>
            </>
          )}

          {step === 3 && (
            <>
              <S.StepText>3/3</S.StepText>

              <S.TextBox>
                <S.ExText>
                  다른 사람들에게 보여줄 <br />
                  프로필 이미지를 설정해 주세요
                </S.ExText>

                <S.exText>이미지는 언제든 수정할 수 있어요</S.exText>
              </S.TextBox>

              <S.ProfileWrapper>
                <S.ImgPreview
                  style={{
                    backgroundImage: preview ? `url(${preview})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!preview && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="80"
                      viewBox="0 0 80 80"
                      fill="none"
                    >
                      <circle cx="40" cy="40" r="40" fill="#143858" />

                      <g transform="translate(22,18)">
                        <path
                          d="M14.3027 35.4218C11.5784 35.032 9.12973 34.09 6.95676 32.5958C4.81622 31.0692 3.11351 29.104 1.84865 26.7003C0.616216 24.2966 0 21.5844 0 18.5635C0 15.8675 0.47027 13.3989 1.41081 11.1576C2.38378 8.88386 3.71351 6.91869 5.4 5.2621C7.11892 3.57303 9.11351 2.27375 11.3838 1.36425C13.6541 0.45475 16.0865 0 18.6811 0C21.1459 0 23.4 0.438509 25.4432 1.31553C27.5189 2.16006 29.3027 3.34566 30.7946 4.87232C32.2865 6.39898 33.4378 8.20174 34.2486 10.2806C35.0919 12.327 35.5135 14.5682 35.5135 17.0044C35.5135 20.3176 34.8162 23.3059 33.4216 25.9695C32.027 28.6005 30.0973 30.7606 27.6324 32.4496C25.2 34.1062 22.3784 35.0969 19.1676 35.4218C20.9189 36.5586 22.8324 37.5006 24.9081 38.2477C27.0162 38.9623 29.0108 39.3196 30.8919 39.3196C31.7027 39.3196 32.4486 39.2384 33.1297 39.076C33.8432 38.9136 34.4919 38.67 35.0757 38.3451C35.3351 38.5725 35.5459 38.9136 35.7081 39.3683C35.9027 39.8231 36 40.1804 36 40.4402C35.2865 41.2848 34.3946 41.9831 33.3243 42.5353C32.2541 43.0875 31.1027 43.3636 29.8703 43.3636C28.7027 43.3636 27.4054 43.1038 25.9784 42.5841C24.5513 42.0644 22.8811 41.2198 20.9676 40.0505C19.0865 38.8811 16.8649 37.3382 14.3027 35.4218ZM18.0486 32.5958C20.5459 32.5958 22.7351 31.9949 24.6162 30.7931C26.4973 29.5912 27.9568 27.9184 28.9946 25.7746C30.0324 23.6307 30.5513 21.1621 30.5513 18.3686C30.5513 15.3478 30 12.6843 28.8973 10.378C27.827 8.07181 26.3027 6.26905 24.3243 4.96976C22.3459 3.638 20.027 2.97211 17.3676 2.97211C15.0324 2.97211 12.9243 3.58927 11.0432 4.82359C9.19459 6.02543 7.71892 7.69826 6.61622 9.84208C5.51351 11.9859 4.96216 14.4383 4.96216 17.1993C4.96216 20.2526 5.52973 22.9324 6.66486 25.2386C7.83243 27.5448 9.40541 29.3476 11.3838 30.6469C13.3622 31.9462 15.5838 32.5958 18.0486 32.5958Z"
                          fill="#FAFAFA"
                        />
                      </g>
                    </svg>
                  )}
                </S.ImgPreview>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleChangeFile}
                  style={{ display: "none" }}
                />

                <S.ImgInput onClick={handleClickUpload}>
                  이미지 업로드하기
                </S.ImgInput>
              </S.ProfileWrapper>
            </>
          )}
        </S.InputBox>
        <S.BtnBox>
          <Button
            title={step === 3 ? "쿼트미 시작하기" : "다음으로"}
            onClick={handleNext}
          />
        </S.BtnBox>
      </S.Container>
    </>
  );
}
