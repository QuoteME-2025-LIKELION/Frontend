import { forwardRef, type MouseEvent } from "react";

import type { MyTagRequestStatus } from "@/api/quoteApi";
import bookmarkFilledIcon from "@/assets/icons/quote-feed/bookmark-filled.svg";
import bookmarkOutlineIcon from "@/assets/icons/quote-feed/bookmark-outline.svg";
import nudgeOutlineIcon from "@/assets/icons/quote-feed/nudge-outline.svg";
import shareIcon from "@/assets/icons/quote-feed/share.svg";
import userActiveIcon from "@/assets/icons/quote-feed/user-active.svg";
import userDisabledIcon from "@/assets/icons/quote-feed/user-disabled.svg";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

import * as S from "./QuoteFeed.styles";

interface QuoteFeedProps {
  profileImageUrl?: string;
  authorName: string;
  bio?: string;
  createDate?: string;
  content: string;
  tag?: string[];
  isSilenced?: boolean;
  isBookmarked?: boolean;
  isBookmarkDisabled?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  onRequest?: () => void;
  canRequestTag?: boolean;
  tagRequestStatus?: MyTagRequestStatus;
  onPoke?: () => void;
  isInArchive?: boolean;
  onArchiveClick?: () => void;
  year?: number;
  timeAgo?: string;
}

/**
 * 명언 피드 컴포넌트
 * @param props
 * @param props.profileImageUrl 프로필 이미지 URL
 * @param props.authorName 사용자 이름
 * @param props.bio 자기소개
 * @param props.createDate 작성 시간
 * @param props.content 입력한 텍스트 (빈 문자열이면 isSilenced 처리)
 * @param props.tag 태그된 이름들 (배열) (빈 배열이거나 null이면 !isNotTagged 처리)
 * @param props.isSilenced 해당 날짜에 글을 안 올렸을 때 (기본값 false)
 * @param props.isBookmarked 북마크를 누른 상태인지
 * @param props.onBookmark 북마크 토글 함수 (빈 함수가 기본값)
 * @param props.onShare 공유 함수 (빈 함수가 기본값) - isInArchive일 때도 활성화
 * @param props.isMyName 태그 목록에 있는 이름이 내 이름인지 확인하는 함수 (빈 함수가 기본값)
 * @param props.onRequest 태그 요청 함수 (빈 함수가 기본값)
 * @param props.onPoke 콕 찌르기 함수 (빈 함수가 기본값)
 * @param props.onAdd 태그 수정 함수 (빈 함수가 기본값)
 * @param props.isInArchive 아카이브 페이지에 있는지(전체 UI 흰색 됨) (기본값 false)
 * @param props.onArchiveClick 아카이브 페이지에서 피드 클릭 시 함수
 * @param props.year 사용자 생년 (아카이브 페이지에서만 사용)
 * @param props.timeAgo 작성 시간 (예: "2시간 전") - API 명세서 호환용
 * @example
 * <QuoteFeed
 *  profileImageUrl="https://example.com/profile.jpg"
 *  authorName="테스트"
 *  bio="안녕하세요"
 *  createDate="2025-11-27T08:19:00"
 *  content="방귀 뀐 놈이 성낸다"
 *  tag={['듀듀', '무니니']}
 *  onShare={() => {}}
 *  isMyName={(name) => name === '듀듀'}
 *  onRequest={() => {}}
 *  onPoke={() => {}}
 *  onAdd={() => {}}
 *  isInArchive={false}
 *  onArchiveClick={() => {}}
 *  year={2000}
 * />
 */
const QuoteFeed = forwardRef<HTMLDivElement, QuoteFeedProps>(
  (
    {
      profileImageUrl,
      authorName,
      bio,
      createDate,
      content,
      tag,
      isSilenced = false,
      isBookmarked = false,
      isBookmarkDisabled = false,
      onBookmark = () => {},
      onShare = () => {},
      onRequest = () => {},
      canRequestTag = true,
      tagRequestStatus = "NONE",
      onPoke = () => {},
      isInArchive = false,
      onArchiveClick,
      year,
      timeAgo,
    },
    ref
  ) => {
    // createDate를 헬퍼 함수로 변환
    const formattedTimeAgo = createDate
      ? formatTimeAgo(createDate)
      : timeAgo
        ? timeAgo
        : "";
    const isNotTagged = !tag || tag.length === 0 || isSilenced;
    const isTagRequestPending = tagRequestStatus === "PENDING";
    const isTagRequestDisabled = !canRequestTag || isTagRequestPending;

    // 아카이브 페이지에 있을 땐 피드 클릭 가능
    const handleArchiveClick = isInArchive ? onArchiveClick : undefined;

    const handleActionClick = (
      event: MouseEvent<HTMLButtonElement>,
      originalHandler: () => void
    ) => {
      event.stopPropagation();
      if (isInArchive) return;
      originalHandler();
    };

    return (
      <S.Container
        $isInArchive={isInArchive}
        onClick={handleArchiveClick}
        ref={ref}
      >
        {!isInArchive && (
          <S.ProfileContainer>
            {profileImageUrl ? (
              <S.ProfileImg src={profileImageUrl} alt="프로필 이미지" />
            ) : (
              <S.DefaultProfileImg />
            )}
            <S.ProfileInfo>
              <S.Username $isInArchive={isInArchive}>{authorName}</S.Username>
              <S.IntroTimeBox $isInArchive={isInArchive}>
                <div>{bio}</div>
                <div>{formattedTimeAgo}</div>
              </S.IntroTimeBox>
            </S.ProfileInfo>
          </S.ProfileContainer>
        )}
        {isInArchive && (
          <S.ArchiveContainer>
            {authorName}({year}~)
          </S.ArchiveContainer>
        )}
        <S.TextContainer $isSilenced={isSilenced} $isInArchive={isInArchive}>
          <S.Quotation>“</S.Quotation>
          <S.Text>
            {isSilenced ? "때로는 침묵이 가장 큰 지혜다" : content}
          </S.Text>
          <S.Quotation>”</S.Quotation>
        </S.TextContainer>
        <S.TagContainer $isInArchive={isInArchive}>
          <S.TagBox>
            {isSilenced ? (
              <S.IconImg
                src={nudgeOutlineIcon}
                alt=""
                $isInArchive={isInArchive}
              />
            ) : (
              <S.IconImg
                src={isNotTagged ? userDisabledIcon : userActiveIcon}
                alt=""
                $isInArchive={isInArchive}
              />
            )}
            {/* 태그하고 올렸을 땐 태그 옆에 태그 추가 버튼  */}
            {/* 아무것도 안 올렸을 땐 콕 찌르기 */}
            {/* 태그 없이 올렸을 땐 태그 요청하기  */}
            {/* 아카이브 페이지면 콕 찌르기나 태그 요청하기 텍스트가 안 뜸 */}
            {!isNotTagged ? (
              <S.Tag>
                {tag.map((name, index) => (
                  <S.Name key={index} $isInArchive={isInArchive}>
                    {name}
                  </S.Name>
                ))}
                {canRequestTag && (
                  <S.PlusBtn
                    type="button"
                    aria-label={
                      isTagRequestPending ? "태그 요청됨" : "태그 요청하기"
                    }
                    disabled={isTagRequestDisabled}
                    onClick={(event) => handleActionClick(event, onRequest)}
                    $isInArchive={isInArchive}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <path
                        d="M1.66675 3.99999H6.33341M4.00008 1.66666V6.33332"
                        stroke={isInArchive ? "#FFF" : "#959595"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </S.PlusBtn>
                )}
              </S.Tag>
            ) : isSilenced ? (
              !isInArchive && (
                <S.PokeBtn
                  type="button"
                  onClick={(event) => handleActionClick(event, onPoke)}
                  $isInArchive={isInArchive}
                >
                  콕 찌르기
                </S.PokeBtn>
              )
            ) : (
              !isInArchive && (
                <S.RequestBtn
                  type="button"
                  disabled={isTagRequestDisabled}
                  onClick={(event) => handleActionClick(event, onRequest)}
                  $isInArchive={isInArchive}
                >
                  {isTagRequestPending ? "태그 요청됨" : "태그 요청하기"}
                </S.RequestBtn>
              )
            )}
          </S.TagBox>
          <S.BtnBox>
            <button
              type="button"
              disabled={isBookmarkDisabled}
              aria-label={isBookmarked ? "북마크 취소" : "북마크"}
              onClick={(event) => handleActionClick(event, onBookmark)}
            >
              <S.IconImg
                src={isBookmarked ? bookmarkFilledIcon : bookmarkOutlineIcon}
                alt=""
                $isInArchive={isInArchive}
              />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 버블링 중단 (Archive 클릭 방지)
                onShare(); // 기존 공유 로직 실행
              }}
            >
              <S.IconImg src={shareIcon} alt="" $isInArchive={isInArchive} />
            </button>
          </S.BtnBox>
        </S.TagContainer>
      </S.Container>
    );
  }
);

export default QuoteFeed;
