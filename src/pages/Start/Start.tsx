import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Button from "@/components/Button/Button";
import PageTitle from "@/components/PageTitle/PageTitle";
import Spinner from "@/components/Spinner/Spinner";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useOAuthRedirect } from "@/hooks/useAuthQueries";
import useModalDialog from "@/hooks/useModalDialog";
import useAuthStore from "@/stores/useAuthStore";
import theme from "@/styles/theme";
import { getOAuthFailureMessage } from "@/utils/oauthCallback";

import * as S from "./Start.styles";

export default function Start() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const reason = searchParams.get("reason");
  const oauthMessage = typeof location.state?.oauthMessage === "string"
    ? location.state.oauthMessage : reason ? getOAuthFailureMessage(reason) : "";
  const redirectToOAuthProvider = useOAuthRedirect();
  const [showErrorToast, setShowErrorToast] = useState(true);

  const { isAuthenticated, isLoading } = useAuthStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSheetClosing, setIsSheetClosing] = useState(false);
  const isSheetVisible = isSheetOpen || isSheetClosing;

  const dialogRef = useModalDialog(
    isSheetVisible && !isLoading && !isAuthenticated
  );
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    },
    []
  );

  const closeSheet = () => {
    if (closeTimer.current !== null) return;
    setIsSheetClosing(true);
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setIsSheetOpen(false);
      setIsSheetClosing(false);
    }, 180);
  };

  const openSheet = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setIsSheetClosing(false);
    setIsSheetOpen(true);
  };
  useEffect(() => {
    // 인증 상태 로딩이 끝나고, 로그인된 상태라면 /home으로 이동
    if (!isLoading && isAuthenticated && !(showErrorToast && oauthMessage)) {
      navigate("/home", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, showErrorToast, oauthMessage]);

  const handleSignup = (provider: string) => {
    redirectToOAuthProvider(provider, "signup");
  };

  const handleLogin = (provider: string) => {
    redirectToOAuthProvider(provider, "login");
  };

  // 로딩 중이거나 리디렉션 될 사용자에게는 페이지 내용을 보여주지 않음
  if (isLoading || (isAuthenticated && !(showErrorToast && oauthMessage))) {
    return <Spinner />;
  }

  return (
    <S.Container>
      <PageTitle title="시작" heading />
      {showErrorToast && oauthMessage && (
        <ToastModal
          isVisible={showErrorToast}
          onClose={() => {
            setShowErrorToast(false);
            if (reason) {
              const nextParams = new URLSearchParams(searchParams);
              nextParams.delete("reason");
              setSearchParams(nextParams, { replace: true });
            }
          }}
          text={oauthMessage}
        />
      )}
      <S.TextBox>
        <S.TitleText>QuoteMe</S.TitleText>
        <S.Text>소소한 생각도 쿼트미로 소중하게 모아보세요.</S.Text>
      </S.TextBox>
      <S.BtnBox>
        <Button
          title="구글로 회원가입"
          font="pretendard"
          onClick={() => handleSignup("google")}
          bgColor="#F2F2F2"
          border={`1px solid ${theme.colors["grey-200"]}`}
          children={
            <svg
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <mask
                id="mask0_1227_14514"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="20"
                height="20"
              >
                <path d="M20 0H0V20H20V0Z" fill={theme.colors.white} />
              </mask>
              <g mask="url(#mask0_1227_14514)">
                <path
                  d="M19.6 10.2274C19.6 9.51828 19.5364 8.83648 19.4182 8.18188H10V12.0501H15.3818C15.15 13.3001 14.4455 14.3592 13.3864 15.0683V17.5774H16.6182C18.5091 15.8365 19.6 13.2728 19.6 10.2274Z"
                  fill="#4285F4"
                />
                <path
                  d="M9.99988 19.9999C12.6999 19.9999 14.9635 19.1044 16.618 17.5772L13.3862 15.0681C12.4908 15.6681 11.3453 16.0226 9.99988 16.0226C7.39528 16.0226 5.19078 14.2635 4.40438 11.8999H1.06348V14.4908C2.70898 17.759 6.09078 19.9999 9.99988 19.9999Z"
                  fill="#34A853"
                />
                <path
                  d="M4.4045 11.8999C4.2045 11.2999 4.0909 10.659 4.0909 9.99993C4.0909 9.34083 4.2045 8.69993 4.4045 8.09993V5.50903H1.0636C0.3864 6.85903 0 8.38633 0 9.99993C0 11.6135 0.3864 13.1408 1.0636 14.4908L4.4045 11.8999Z"
                  fill="#FBBC04"
                />
                <path
                  d="M9.99988 3.9773C11.468 3.9773 12.7862 4.4818 13.8226 5.4727L16.6908 2.6045C14.959 0.9909 12.6953 0 9.99988 0C6.09078 0 2.70898 2.2409 1.06348 5.5091L4.40438 8.1C5.19078 5.7364 7.39528 3.9773 9.99988 3.9773Z"
                  fill="#E94235"
                />
              </g>
            </svg>
          }
        ></Button>
        <Button
          title="카카오로 회원가입"
          font="pretendard"
          onClick={() => handleSignup("kakao")}
          bgColor="#FEE500"
          border="none"
          children={
            <svg
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_1227_14550)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 0.666748C4.47686 0.666748 0 4.12559 0 8.39151C0 11.0446 1.73156 13.3834 4.36836 14.7745L3.25892 18.8273C3.1609 19.1854 3.57046 19.4708 3.88496 19.2633L8.74816 16.0536C9.15856 16.0932 9.57564 16.1164 10 16.1164C15.5227 16.1164 19.9999 12.6576 19.9999 8.39151C19.9999 4.12559 15.5227 0.666748 10 0.666748Z"
                  fill={theme.colors.black}
                />
              </g>
              <defs>
                <clipPath id="clip0_1227_14550">
                  <rect width="19.9999" height="20" fill={theme.colors.white} />
                </clipPath>
              </defs>
            </svg>
          }
        ></Button>
        <S.LogButton>
          <S.Text>기존 회원이신가요?</S.Text>
          <Button
            title="로그인"
            aria-haspopup="dialog"
            aria-expanded={isSheetVisible}
            font="pretendard"
            onClick={openSheet}
            bgColor="transparent"
            border="none"
            fontcolor={theme.colors.white}
            disableActive
          />
        </S.LogButton>
        {/* 로그인 버튼 */}
      </S.BtnBox>
      {isSheetVisible && (
        <S.LoginDialog
          ref={dialogRef}
          aria-label="로그인 방법 선택"
          aria-modal="true"
          onCancel={(event) => {
            event.preventDefault();
            closeSheet();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeSheet();
          }}
        >
          <S.Overlay $isClosing={isSheetClosing} onClick={closeSheet} />
          <S.Loginbox $isClosing={isSheetClosing}>
            <Button
              title="구글로 로그인"
              font="pretendard"
              onClick={() => handleLogin("google")}
              bgColor="#F2F2F2"
              border={`1px solid ${theme.colors["grey-200"]}`}
              children={
                <svg
                  aria-hidden="true"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <mask
                    id="mask0_1227_14514"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                  >
                    <path d="M20 0H0V20H20V0Z" fill={theme.colors.white} />
                  </mask>
                  <g mask="url(#mask0_1227_14514)">
                    <path
                      d="M19.6 10.2274C19.6 9.51828 19.5364 8.83648 19.4182 8.18188H10V12.0501H15.3818C15.15 13.3001 14.4455 14.3592 13.3864 15.0683V17.5774H16.6182C18.5091 15.8365 19.6 13.2728 19.6 10.2274Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M9.99988 19.9999C12.6999 19.9999 14.9635 19.1044 16.618 17.5772L13.3862 15.0681C12.4908 15.6681 11.3453 16.0226 9.99988 16.0226C7.39528 16.0226 5.19078 14.2635 4.40438 11.8999H1.06348V14.4908C2.70898 17.759 6.09078 19.9999 9.99988 19.9999Z"
                      fill="#34A853"
                    />
                    <path
                      d="M4.4045 11.8999C4.2045 11.2999 4.0909 10.659 4.0909 9.99993C4.0909 9.34083 4.2045 8.69993 4.4045 8.09993V5.50903H1.0636C0.3864 6.85903 0 8.38633 0 9.99993C0 11.6135 0.3864 13.1408 1.0636 14.4908L4.4045 11.8999Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M9.99988 3.9773C11.468 3.9773 12.7862 4.4818 13.8226 5.4727L16.6908 2.6045C14.959 0.9909 12.6953 0 9.99988 0C6.09078 0 2.70898 2.2409 1.06348 5.5091L4.40438 8.1C5.19078 5.7364 7.39528 3.9773 9.99988 3.9773Z"
                      fill="#E94235"
                    />
                  </g>
                </svg>
              }
            ></Button>
            <Button
              title="카카오로 로그인"
              font="pretendard"
              onClick={() => handleLogin("kakao")}
              bgColor="#FEE500"
              border="none"
              children={
                <svg
                  aria-hidden="true"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_1227_14550)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 0.666748C4.47686 0.666748 0 4.12559 0 8.39151C0 11.0446 1.73156 13.3834 4.36836 14.7745L3.25892 18.8273C3.1609 19.1854 3.57046 19.4708 3.88496 19.2633L8.74816 16.0536C9.15856 16.0932 9.57564 16.1164 10 16.1164C15.5227 16.1164 19.9999 12.6576 19.9999 8.39151C19.9999 4.12559 15.5227 0.666748 10 0.666748Z"
                      fill={theme.colors.black}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1227_14550">
                      <rect
                        width="19.9999"
                        height="20"
                        fill={theme.colors.white}
                      />
                    </clipPath>
                  </defs>
                </svg>
              }
            ></Button>
          </S.Loginbox>
        </S.LoginDialog>
      )}
    </S.Container>
  );
}
