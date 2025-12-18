import { formatTimeAgo } from "@/utils/formatTimeAgo";
import * as S from "./FeedStyle";
import { forwardRef } from "react";

interface FeedProps {
  profileImageUrl?: string;
  authorName: string;
  bio?: string;
  createDate?: string;
  content: string;
  tag?: string[];
  isSilenced?: boolean;
  isLiked?: boolean; // 좋아요를 누른 상태인지
  onLike?: () => void;
  onShare?: () => void;
  onRequest?: () => void;
  onPoke?: () => void;
  isInArchive?: boolean;
  onArchiveClick?: () => void;
  year?: number;
  timeAgo?: string;
}

/**
 * 피드 컴포넌트
 * @param props
 * @param props.profileImageUrl 프로필 이미지 URL
 * @param props.authorName 사용자 이름
 * @param props.bio 자기소개
 * @param props.createDate 작성 시간
 * @param props.content 입력한 텍스트 (빈 문자열이면 isSilenced 처리)
 * @param props.tag 태그된 이름들 (배열) (빈 배열이거나 null이면 !isNotTagged 처리)
 * @param props.isSilenced 해당 날짜에 글을 안 올렸을 때 (기본값 false)
 * @param props.isLiked 좋아요를 누른 상태인지 (기본값 false => true일 때만 따로 표시)
 * @param props.onLike 좋아요 토글 함수 (빈 함수가 기본값)
 * @param props.onShare 공유 함수 (빈 함수가 기본값)
 * @param props.isMyName 태그 목록에 있는 이름이 내 이름인지 확인하는 함수 (빈 함수가 기본값)
 * @param props.onRequest 태그 요청 함수 (빈 함수가 기본값)
 * @param props.onPoke 콕 찌르기 함수 (빈 함수가 기본값)
 * @param props.onAdd 태그 수정 함수 (빈 함수가 기본값)
 * @param props.isInArchive 아카이브 페이지에 있는지(전체 UI 흰색 됨) (기본값 false)
 * @param props.onArchiveClick 아카이브 페이지에서 피드 클릭 시 함수
 * @param props.year 사용자 생년 (아카이브 페이지에서만 사용)
 * @param props.timeAgo 작성 시간 (예: "2시간 전")
 * @example
 * <Feed
 *  profileImageUrl="https://example.com/profile.jpg"
 *  authorName="테스트"
 *  bio="안녕하세요"
 *  createDate="2025-11-27T08:19:00"
 *  content="방귀 뀐 놈이 성낸다"
 *  tag={['듀듀', '무니니']}
 *  isLiked={false}
 *  onLike={() => {}}
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
const Feed = forwardRef<HTMLDivElement, FeedProps>(
  (
    {
      profileImageUrl,
      authorName,
      bio,
      createDate,
      content,
      tag,
      isSilenced = false,
      isLiked = false,
      onLike = () => {},
      onShare = () => {},
      onRequest = () => {},
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

    // 아카이브 페이지에 있을 땐 피드 클릭 가능
    const handleArchiveClick = isInArchive ? onArchiveClick : undefined;

    // 아카이브 페이지에 있을 땐 버튼 비활성화
    const handleClick = (originalHandler: () => void) =>
      isInArchive ? undefined : originalHandler();

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
            {/* 아무것도 안 올렸을 땐 콕 찌르기 아이콘  */}
            {isSilenced ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clipPath="url(#clip0_656_866)">
                  <path
                    d="M12 7.33331V3.99998C12 3.64636 11.8595 3.30722 11.6095 3.05717C11.3594 2.80712 11.0203 2.66665 10.6667 2.66665C10.313 2.66665 9.97389 2.80712 9.72384 3.05717C9.4738 3.30722 9.33332 3.64636 9.33332 3.99998M9.33332 6.66665V2.66665C9.33332 2.31302 9.19284 1.97389 8.9428 1.72384C8.69275 1.47379 8.35361 1.33331 7.99999 1.33331C7.64636 1.33331 7.30723 1.47379 7.05718 1.72384C6.80713 1.97389 6.66665 2.31302 6.66665 2.66665V3.99998M6.66665 3.99998V6.99998M6.66665 3.99998C6.66665 3.64636 6.52618 3.30722 6.27613 3.05717C6.02608 2.80712 5.68694 2.66665 5.33332 2.66665C4.9797 2.66665 4.64056 2.80712 4.39051 3.05717C4.14046 3.30722 3.99999 3.64636 3.99999 3.99998V9.33331M12 5.33331C12 4.97969 12.1405 4.64055 12.3905 4.3905C12.6406 4.14046 12.9797 3.99998 13.3333 3.99998C13.6869 3.99998 14.0261 4.14046 14.2761 4.3905C14.5262 4.64055 14.6667 4.97969 14.6667 5.33331V9.33331C14.6667 10.7478 14.1048 12.1044 13.1046 13.1045C12.1044 14.1047 10.7478 14.6666 9.33332 14.6666H7.99999C6.13332 14.6666 4.99999 14.0933 4.00665 13.1066L1.60665 10.7066C1.37728 10.4526 1.25438 10.1201 1.2634 9.77794C1.27243 9.43579 1.41269 9.11021 1.65513 8.86862C1.89758 8.62703 2.22365 8.48792 2.56584 8.48011C2.90802 8.4723 3.2401 8.59637 3.49332 8.82665L4.66665 9.99998"
                    stroke={isInArchive ? "#FFF" : "#959595"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_656_866">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
              >
                <path
                  d="M5.83333 7.16667C7.67428 7.16667 9.16667 5.67428 9.16667 3.83333C9.16667 1.99238 7.67428 0.5 5.83333 0.5C3.99238 0.5 2.5 1.99238 2.5 3.83333C2.5 5.67428 3.99238 7.16667 5.83333 7.16667ZM5.83333 7.16667C7.24782 7.16667 8.60438 7.72857 9.60457 8.72876C10.6048 9.72896 11.1667 11.0855 11.1667 12.5M5.83333 7.16667C4.41885 7.16667 3.06229 7.72857 2.0621 8.72876C1.0619 9.72896 0.5 11.0855 0.5 12.5"
                  stroke={
                    isInArchive ? "#FFF" : isNotTagged ? "#959595" : "#000"
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
                <S.PlusBtn
                  type="button"
                  onClick={() => handleClick(onRequest)}
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
              </S.Tag>
            ) : isSilenced ? (
              <S.PokeBtn
                type="button"
                onClick={() => handleClick(onPoke)}
                $isInArchive={isInArchive}
              >
                {isInArchive ? "" : "콕 찌르기"}
              </S.PokeBtn>
            ) : (
              <S.RequestBtn
                type="button"
                onClick={() => handleClick(onRequest)}
                $isInArchive={isInArchive}
              >
                {isInArchive ? "" : "태그 요청하기"}
              </S.RequestBtn>
            )}
          </S.TagBox>
          <S.BtnBox>
            <button type="button" onClick={() => handleClick(onLike)}>
              {isLiked ? (
                isInArchive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M12.9735 8.63997C13.6068 7.99997 14.0002 7.1333 14.0002 6.16664C14.0002 5.23838 13.6314 4.34814 12.975 3.69176C12.3187 3.03539 11.4284 2.66664 10.5002 2.66664C9.3335 2.66664 8.30016 3.2333 7.66683 4.1133C7.34356 3.6643 6.9179 3.29885 6.42515 3.04726C5.9324 2.79566 5.38676 2.66518 4.8335 2.66664C3.90524 2.66664 3.015 3.03539 2.35862 3.69176C1.70225 4.34814 1.3335 5.23838 1.3335 6.16664C1.3335 7.1333 1.72683 7.99997 2.36016 8.63997L7.66683 13.9466L12.9735 8.63997Z"
                      fill="white"
                    />
                    <path
                      d="M12.9735 8.63997C13.6068 7.99997 14.0002 7.1333 14.0002 6.16664C14.0002 5.23838 13.6314 4.34814 12.975 3.69176C12.3187 3.03539 11.4284 2.66664 10.5002 2.66664C9.3335 2.66664 8.30016 3.2333 7.66683 4.1133C7.34356 3.6643 6.9179 3.29885 6.42515 3.04726C5.9324 2.79566 5.38676 2.66518 4.8335 2.66664C3.90524 2.66664 3.015 3.03539 2.35862 3.69176C1.70225 4.34814 1.3335 5.23838 1.3335 6.16664C1.3335 7.1333 1.72683 7.99997 2.36016 8.63997L7.66683 13.9466L12.9735 8.63997Z"
                      fill="white"
                      fillOpacity="0.2"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="12"
                    viewBox="0 0 13 12"
                    fill="none"
                  >
                    <path
                      d="M11.64 5.97335C12.2733 5.33335 12.6667 4.46668 12.6667 3.50001C12.6667 2.57175 12.2979 1.68152 11.6415 1.02514C10.9852 0.368761 10.0949 1.20347e-05 9.16667 1.20347e-05C8 1.20347e-05 6.96667 0.566679 6.33333 1.44668C6.01007 0.997678 5.5844 0.632224 5.09165 0.380631C4.5989 0.129038 4.05326 -0.00144287 3.5 1.20347e-05C2.57174 1.20347e-05 1.6815 0.368761 1.02513 1.02514C0.368749 1.68152 0 2.57175 0 3.50001C0 4.46668 0.393333 5.33335 1.02667 5.97335L6.33333 11.28L11.64 5.97335Z"
                      fill="black"
                    />
                  </svg>
                )
              ) : isInArchive ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  fill="none"
                >
                  <path
                    d="M1.49333 5.50001C1.22974 5.23817 1.02089 4.92648 0.878967 4.58311C0.737041 4.23974 0.664872 3.87155 0.666667 3.50001C0.666667 2.74857 0.965178 2.0279 1.49653 1.49654C2.02788 0.96519 2.74855 0.666679 3.5 0.666679C4.55333 0.666679 5.47333 1.24001 5.96 2.09335H6.70667C6.95408 1.65938 7.31207 1.29874 7.74419 1.04813C8.17632 0.797522 8.66713 0.665904 9.16667 0.666679C9.91811 0.666679 10.6388 0.96519 11.1701 1.49654C11.7015 2.0279 12 2.74857 12 3.50001C12 4.28001 11.6667 5.00001 11.1733 5.50001L6.33333 10.3333L1.49333 5.50001ZM11.64 5.97335C12.2733 5.33335 12.6667 4.46668 12.6667 3.50001C12.6667 2.57175 12.2979 1.68152 11.6415 1.02514C10.9852 0.368761 10.0949 1.20347e-05 9.16667 1.20347e-05C8 1.20347e-05 6.96667 0.566679 6.33333 1.44668C6.01007 0.997678 5.5844 0.632224 5.09165 0.380631C4.5989 0.129038 4.05326 -0.00144287 3.5 1.20347e-05C2.57174 1.20347e-05 1.6815 0.368761 1.02513 1.02514C0.368749 1.68152 0 2.57175 0 3.50001C0 4.46668 0.393333 5.33335 1.02667 5.97335L6.33333 11.28L11.64 5.97335Z"
                    fill="white"
                  />
                  <path
                    d="M1.49333 5.50001C1.22974 5.23817 1.02089 4.92648 0.878967 4.58311C0.737041 4.23974 0.664872 3.87155 0.666667 3.50001C0.666667 2.74857 0.965178 2.0279 1.49653 1.49654C2.02788 0.96519 2.74855 0.666679 3.5 0.666679C4.55333 0.666679 5.47333 1.24001 5.96 2.09335H6.70667C6.95408 1.65938 7.31207 1.29874 7.74419 1.04813C8.17632 0.797522 8.66713 0.665904 9.16667 0.666679C9.91811 0.666679 10.6388 0.96519 11.1701 1.49654C11.7015 2.0279 12 2.74857 12 3.50001C12 4.28001 11.6667 5.00001 11.1733 5.50001L6.33333 10.3333L1.49333 5.50001ZM11.64 5.97335C12.2733 5.33335 12.6667 4.46668 12.6667 3.50001C12.6667 2.57175 12.2979 1.68152 11.6415 1.02514C10.9852 0.368761 10.0949 1.20347e-05 9.16667 1.20347e-05C8 1.20347e-05 6.96667 0.566679 6.33333 1.44668C6.01007 0.997678 5.5844 0.632224 5.09165 0.380631C4.5989 0.129038 4.05326 -0.00144287 3.5 1.20347e-05C2.57174 1.20347e-05 1.6815 0.368761 1.02513 1.02514C0.368749 1.68152 0 2.57175 0 3.50001C0 4.46668 0.393333 5.33334 1.02667 5.97335L6.33333 11.28L11.64 5.97335Z"
                    fill="white"
                    fillOpacity="0.2"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  fill="none"
                >
                  <path
                    d="M1.49333 5.50001C1.22974 5.23816 1.02089 4.92648 0.878967 4.58311C0.737041 4.23974 0.664872 3.87155 0.666667 3.50001C0.666667 2.74857 0.965178 2.0279 1.49653 1.49654C2.02788 0.96519 2.74855 0.666679 3.5 0.666679C4.55333 0.666679 5.47333 1.24001 5.96 2.09335H6.70667C6.95408 1.65938 7.31207 1.29874 7.74419 1.04813C8.17632 0.797522 8.66713 0.665904 9.16667 0.666679C9.91811 0.666679 10.6388 0.96519 11.1701 1.49654C11.7015 2.0279 12 2.74857 12 3.50001C12 4.28001 11.6667 5.00001 11.1733 5.50001L6.33333 10.3333L1.49333 5.50001ZM11.64 5.97335C12.2733 5.33334 12.6667 4.46668 12.6667 3.50001C12.6667 2.57175 12.2979 1.68152 11.6415 1.02514C10.9852 0.368761 10.0949 1.20347e-05 9.16667 1.20347e-05C8 1.20347e-05 6.96667 0.566679 6.33333 1.44668C6.01007 0.997678 5.5844 0.632224 5.09165 0.380631C4.5989 0.129038 4.05326 -0.00144287 3.5 1.20347e-05C2.57174 1.20347e-05 1.6815 0.368761 1.02513 1.02514C0.368749 1.68152 0 2.57175 0 3.50001C0 4.46668 0.393333 5.33334 1.02667 5.97335L6.33333 11.28L11.64 5.97335Z"
                    fill="black"
                  />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 버블링 중단 (Archive 클릭 방지)
                onShare(); // 기존 공유 로직 실행
              }}
            >
              {isInArchive ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="11"
                  viewBox="0 0 13 11"
                  fill="none"
                >
                  <path
                    d="M7.33331 2.88533V0L10.4713 3.138L12.9873 5.654L10.4266 7.788L7.33331 10.366V7.54267C1.90264 7.13333 -2.72003e-05 10.276 -2.72003e-05 10.276C-2.72003e-05 8.318 0.161305 6.286 1.70064 4.74733C3.48997 2.95733 6.08131 2.83067 7.33331 2.88533Z"
                    fill="white"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="11"
                  viewBox="0 0 13 11"
                  fill="none"
                >
                  <path
                    d="M7.3333 2.88533V0L10.4713 3.138L12.9873 5.654L10.4266 7.788L7.3333 10.366V7.54267C1.90264 7.13333 -2.76566e-05 10.276 -2.76566e-05 10.276C-2.76566e-05 8.318 0.161305 6.286 1.70064 4.74733C3.48997 2.95733 6.08131 2.83067 7.3333 2.88533Z"
                    fill={isInArchive ? "#FFF" : "black"}
                  />
                </svg>
              )}
            </button>
          </S.BtnBox>
        </S.TagContainer>
      </S.Container>
    );
  }
);

export default Feed;
