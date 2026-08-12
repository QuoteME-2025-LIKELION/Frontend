import DateHeader from "./MainComponents/DateHeader/DateHeader";
import HomeBox from "./MainComponents/HomeBox/HomeBox";
import FeedList from "./MainComponents/FeedList/FeedList";
import * as S from "@/pages/Main/Main.styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequestModal from "./MainComponents/Modal/RequestModal";
import XHeader from "@/pages/Main/MainComponents/XHeader/XHeader";

import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import ToastModal from "@/components/ToastModal/ToastModal";
import Spinner from "@/components/Spinner/Spinner";
import { useFriendsQuery } from "@/hooks/useFriendQueries";
import { useQuotesByDateQuery } from "@/hooks/useQuoteQueries";
import { useImageShare } from "@/hooks/useImageShare";
import { useMyProfileQuery } from "@/hooks/useProfileQueries";

export default function MainHome() {
  const navigate = useNavigate();

  // 토글 상태 관리
  const [active, setActive] = useState(false);
  const [isToggleVisible, setIsToggleVisible] = useState(false);

  const { date } = useParams();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"tag" | "poke">("tag");
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const { data: quotesData, isLoading: isQuotesLoading } =
    useQuotesByDateQuery(displayDate);
  const { data: friendList = [], isLoading: isFriendsLoading } =
    useFriendsQuery();
  const { data: myProfile } = useMyProfileQuery();
  const myQuote = quotesData?.myQuotes[0] || null;
  const otherQuotes = quotesData?.otherQuotes || [];
  const isLoading = isQuotesLoading || isFriendsLoading;
  const profileImage = myProfile?.profileImage;
  const profileNickname = myProfile?.nickname || "사용자";
  const profileIntroduction = myProfile?.introduction || "자기소개가 없습니다.";

  const [isCopied, setIsCopied] = useState(false);
  const {
    shareStatus,
    showShareErrorToast,
    executeShare,
    resetShareStatus,
    closeShareErrorToast,
  } = useImageShare();

  useEffect(() => {
    // date 파라미터 유효성 검사
    if (date) {
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
      if (!isValidDate) {
        navigate("/not-found", { replace: true }); // 잘못된 형식이면 NotFound 페이지로 이동
        return; // 유효하지 않으면 데이터 요청 등 아래 로직을 실행하지 않음
      }
    }

  }, [date, navigate]);

  // 토글 애니메이션 및 렌더링 관련 로직
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (active) {
      setIsToggleVisible(true);
    } else {
      timer = setTimeout(() => {
        setIsToggleVisible(false);
      }, 300); // 애니메이션 시간과 동일하게 설정
    }

    // 컴포넌트가 언마운트되거나 active 상태가 바뀌면 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [active]);

  // 태그 요청
  const handleTagRequest = () => {
    setRequestType("tag");
    setIsTagModalOpen(true);
  };

  // 콕 찌르기
  const handlePoke = () => {
    setRequestType("poke");
    setIsTagModalOpen(true);
  };

  //문의 메일 복사
  const handleCopy = async () => {
    await navigator.clipboard.writeText("aaaa@gmail.com");
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <S.Container>
      {isLoading && <Spinner />}

      {/* 아카이브 기능으로 다른 날짜로 이동했을 땐 홈으로 돌아가는 버튼 있는 헤더가 뜨는 게 나을 것 같아서 수정 */}
      {date ? (
        <XHeader />
      ) : (
        <DateHeader active={active} setActive={setActive} />
      )}

      {isToggleVisible && (
        <S.ToggleWrapper onClick={() => setIsToggleVisible(false)}>
          <S.Toggle $active={active}>
            <S.ImgBox>
              <S.ImgPreview
                style={{
                  backgroundImage: profileImage
                    ? `url(${profileImage})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!profileImage && (
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  onClick={() => navigate("/friend-group")}
                >
                  <path
                    d="M9.99871 5.8709C9.18231 5.8709 8.38424 6.113 7.70542 6.56656C7.02661 7.02013 6.49754 7.66481 6.18511 8.41907C5.87269 9.17332 5.79095 10.0033 5.95022 10.804C6.10949 11.6047 6.50263 12.3402 7.07991 12.9175C7.65719 13.4948 8.3927 13.8879 9.19341 14.0472C9.99413 14.2065 10.8241 14.1247 11.5784 13.8123C12.3326 13.4999 12.9773 12.9708 13.4309 12.292C13.8844 11.6132 14.1265 10.8151 14.1265 9.99871C14.1254 8.9043 13.6901 7.85503 12.9163 7.08117C12.1424 6.3073 11.0931 5.87204 9.99871 5.8709ZM9.99871 12.7506C9.45444 12.7506 8.9224 12.5892 8.46985 12.2868C8.01731 11.9844 7.66459 11.5546 7.45631 11.0518C7.24803 10.549 7.19353 9.99566 7.29972 9.46185C7.4059 8.92804 7.66799 8.4377 8.05284 8.05284C8.4377 7.66799 8.92804 7.4059 9.46185 7.29972C9.99566 7.19353 10.549 7.24803 11.0518 7.45631C11.5546 7.66459 11.9844 8.01731 12.2868 8.46985C12.5892 8.9224 12.7506 9.45444 12.7506 9.99871C12.7506 10.7286 12.4607 11.4285 11.9446 11.9446C11.4285 12.4607 10.7286 12.7506 9.99871 12.7506ZM17.5664 10.1845C17.5698 10.0606 17.5698 9.93679 17.5664 9.81296L18.8494 8.20999C18.9167 8.12583 18.9633 8.02704 18.9854 7.92159C19.0075 7.81613 19.0045 7.70696 18.9767 7.60286C18.7663 6.81222 18.4517 6.05309 18.041 5.34547C17.9873 5.25287 17.9126 5.17409 17.8231 5.11542C17.7335 5.05675 17.6314 5.0198 17.5251 5.0075L15.4853 4.78048C15.4004 4.69104 15.3144 4.60504 15.2273 4.52249L14.9865 2.4775C14.9741 2.37105 14.937 2.26896 14.8782 2.17938C14.8194 2.0898 14.7404 2.0152 14.6476 1.96153C13.9398 1.55163 13.1807 1.2373 12.3903 1.02675C12.2861 0.999058 12.1769 0.996226 12.0714 1.01848C11.966 1.04074 11.8672 1.08746 11.7831 1.15489L10.1845 2.43107C10.0606 2.43107 9.93679 2.43107 9.81296 2.43107L8.20999 1.15059C8.12583 1.08331 8.02704 1.03674 7.92159 1.01464C7.81613 0.992529 7.70696 0.995501 7.60286 1.02331C6.81234 1.23403 6.05326 1.54865 5.34547 1.95895C5.25287 2.01272 5.17409 2.08736 5.11542 2.17694C5.05675 2.26651 5.0198 2.36855 5.0075 2.47492L4.78048 4.51819C4.69104 4.60361 4.60504 4.68961 4.52249 4.77618L2.4775 5.01094C2.37105 5.02333 2.26896 5.06041 2.17938 5.11924C2.0898 5.17806 2.0152 5.25701 1.96153 5.34977C1.55163 6.05766 1.2373 6.81672 1.02675 7.60716C0.999058 7.71132 0.996226 7.82054 1.01848 7.92599C1.04074 8.03145 1.08746 8.13021 1.15489 8.21429L2.43107 9.81296C2.43107 9.93679 2.43107 10.0606 2.43107 10.1845L1.15059 11.7874C1.08331 11.8716 1.03674 11.9704 1.01464 12.0758C0.992529 12.1813 0.995501 12.2905 1.02331 12.3946C1.23365 13.1852 1.54829 13.9443 1.95895 14.6519C2.01272 14.7446 2.08736 14.8233 2.17694 14.882C2.26651 14.9407 2.36855 14.9776 2.47492 14.9899L4.51475 15.2169C4.60017 15.3064 4.68617 15.3924 4.77274 15.4749L5.01094 17.5199C5.02333 17.6264 5.06041 17.7285 5.11924 17.818C5.17806 17.9076 5.25701 17.9822 5.34977 18.0359C6.05766 18.4458 6.81672 18.7601 7.60716 18.9707C7.71132 18.9984 7.82054 19.0012 7.92599 18.9789C8.03145 18.9567 8.13021 18.91 8.21429 18.8425L9.81296 17.5664C9.93679 17.5698 10.0606 17.5698 10.1845 17.5664L11.7874 18.8494C11.8716 18.9167 11.9704 18.9633 12.0758 18.9854C12.1813 19.0075 12.2905 19.0045 12.3946 18.9767C13.1852 18.7663 13.9443 18.4517 14.6519 18.041C14.7446 17.9873 14.8233 17.9126 14.882 17.8231C14.9407 17.7335 14.9776 17.6314 14.9899 17.5251L15.2169 15.4853C15.3064 15.4004 15.3924 15.3144 15.4749 15.2273L17.5199 14.9865C17.6264 14.9741 17.7285 14.937 17.818 14.8782C17.9076 14.8194 17.9822 14.7404 18.0359 14.6476C18.4458 13.9398 18.7601 13.1807 18.9707 12.3903C18.9984 12.2861 19.0012 12.1769 18.9789 12.0714C18.9567 11.966 18.91 11.8672 18.8425 11.7831L17.5664 10.1845ZM16.1818 9.62549C16.1964 9.87409 16.1964 10.1233 16.1818 10.3719C16.1716 10.5421 16.2249 10.7101 16.3315 10.8432L17.5517 12.3679C17.4117 12.8129 17.2324 13.2446 17.016 13.6578L15.0725 13.878C14.9032 13.8968 14.7469 13.9777 14.6339 14.105C14.4684 14.2912 14.292 14.4675 14.1059 14.633C13.9785 14.7461 13.8976 14.9024 13.8788 15.0716L13.663 17.0134C13.2498 17.2299 12.8181 17.4092 12.3731 17.5492L10.8475 16.3289C10.7254 16.2313 10.5738 16.1783 10.4175 16.1784H10.3762C10.1276 16.193 9.87839 16.193 9.62979 16.1784C9.45959 16.1681 9.29164 16.2215 9.15853 16.328L7.62952 17.5492C7.18452 17.4091 6.75284 17.2298 6.33958 17.0134L6.11943 15.0725C6.10064 14.9032 6.01975 14.7469 5.8924 14.6339C5.70623 14.4684 5.52992 14.292 5.36439 14.1059C5.25133 13.9785 5.09506 13.8976 4.92581 13.8788L2.98402 13.6621C2.76747 13.2489 2.58818 12.8172 2.44826 12.3722L3.66855 10.8466C3.7751 10.7135 3.82843 10.5456 3.81818 10.3754C3.80356 10.1268 3.80356 9.87753 3.81818 9.62893C3.82843 9.45872 3.7751 9.29078 3.66855 9.15767L2.44826 7.62952C2.58829 7.18452 2.76758 6.75284 2.98402 6.33958L4.92495 6.11943C5.0942 6.10064 5.25047 6.01975 5.36353 5.8924C5.52906 5.70623 5.70537 5.52992 5.89154 5.36439C6.0194 5.25126 6.10062 5.09463 6.11943 4.92495L6.33528 2.98402C6.7485 2.76747 7.18018 2.58818 7.62522 2.44826L9.15079 3.66855C9.2839 3.7751 9.45185 3.82843 9.62205 3.81818C9.87065 3.80356 10.1199 3.80356 10.3685 3.81818C10.5387 3.82843 10.7066 3.7751 10.8397 3.66855L12.3679 2.44826C12.8129 2.58829 13.2446 2.76758 13.6578 2.98402L13.878 4.92495C13.8968 5.0942 13.9777 5.25047 14.105 5.36353C14.2912 5.52906 14.4675 5.70537 14.633 5.89154C14.7461 6.01889 14.9024 6.09978 15.0716 6.11857L17.0134 6.33442C17.2299 6.74763 17.4092 7.17932 17.5492 7.62436L16.3289 9.14993C16.2213 9.28417 16.1679 9.45384 16.1792 9.62549H16.1818Z"
                    fill="#9599A1"
                  />
                </svg>
              </S.ImgPreview>
              <S.UserName>{profileNickname}</S.UserName>
              <S.UserIntro>{profileIntroduction}</S.UserIntro>
            </S.ImgBox>
            <S.ToggleBtnBox>
              <S.ToggleBtn onClick={() => navigate("/friend-group")}>
                친구 및 그룹
              </S.ToggleBtn>
              <S.ToggleBtn
                onClick={() =>
                  navigate("/profile-center", {
                    state: { from: "/home" }, // home 페이지(메인 화면에서 바로 왔다고 표시)
                  })
                }
              >
                계정 관리
              </S.ToggleBtn>
              <S.ToggleBtn onClick={() => navigate("/setting-page")}>
                알람 설정
              </S.ToggleBtn>
              <S.ToggleBtn onClick={() => navigate("/setting-page")}>
                공지사항
              </S.ToggleBtn>
            </S.ToggleBtnBox>
            <S.ToggleInfoBox>
              <S.ToggleInfoText>이용약관 및 개인정보 처리</S.ToggleInfoText>
              <div style={{ display: "flex", gap: "4px" }}>
                <S.ToggleInfoText>문의</S.ToggleInfoText>
                <S.ToggleInfoText
                  onClick={handleCopy}
                  style={{ cursor: "pointer" }}
                >
                  aaaa@gmail.com
                </S.ToggleInfoText>
              </div>
              <S.ToggleInfoText>버전 1.0</S.ToggleInfoText>
            </S.ToggleInfoBox>
          </S.Toggle>
        </S.ToggleWrapper>
      )}

      {isCopied && <S.CopyToast>복사되었습니다.</S.CopyToast>}

      <HomeBox date={date} myQuote={myQuote} onShare={executeShare} />
      <FeedList
        date={date}
        otherQuotes={otherQuotes}
        friendList={friendList}
        onTagRequest={handleTagRequest}
        onPoke={handlePoke}
        onShare={executeShare}
        isLoading={isLoading}
      />
      {isTagModalOpen && (
        <RequestModal
          type={requestType}
          onClose={() => setIsTagModalOpen(false)}
          isVisible={isTagModalOpen}
        />
      )}
      {shareStatus !== "nothing" && (
        <ToastModal
          isVisible={true}
          onClose={resetShareStatus}
          text={
            shareStatus === "sharing"
              ? "명언 이미지를 저장중입니다."
              : "명언 이미지를 저장했습니다."
          }
          isOnShare={shareStatus === "sharing"}
          showOverlay={true}
        />
      )}

      {showShareErrorToast && (
        <ToastModal
          isVisible={showShareErrorToast}
          onClose={closeShareErrorToast}
          text="이미지 저장에 실패했습니다."
        />
      )}
    </S.Container>
  );
}
