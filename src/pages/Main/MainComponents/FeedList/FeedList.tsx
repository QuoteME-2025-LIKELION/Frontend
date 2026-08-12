import Feed from "@/components/Feed/Feed";
import * as S from "./FeedList.styles";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import type { OtherQuote } from "@/types/feed.type";
import type { Friend } from "@/types/friend.type";
import ToastModal from "@/components/ToastModal/ToastModal";
import { usePokeFriendMutation } from "@/hooks/useFriendQueries";
import {
  useLikeQuoteMutation,
  useRequestQuoteTagMutation,
  useUnlikeQuoteMutation,
} from "@/hooks/useQuoteQueries";

interface QuotesItem extends OtherQuote {
  friendId: number;
  isSilenced: boolean;
  quoteId?: number;
}

export default function FeedList({
  date,
  otherQuotes,
  friendList,
  onTagRequest,
  onPoke,
  onShare,
  isLoading,
}: {
  date?: string;
  otherQuotes: OtherQuote[] | [];
  friendList: Friend[] | [];
  onTagRequest?: () => void;
  onPoke?: () => void;
  onShare: (shareProcess: () => Promise<void>) => void;
  isLoading: boolean;
}) {
  // date prop이 없으면(undefined이면) 오늘 날짜를 사용 -> 추후 글 조회를 날짜 기반으로 하도록 요청 예정
  const displayDate = date ? date : formatDateToYYYYMMDD(new Date());
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [quotes, setQuotes] = useState<QuotesItem[]>([]); // 피드 목록을 상태로 관리
  const { mutateAsync: requestQuoteTag } = useRequestQuoteTagMutation();
  const { mutateAsync: likeQuote } = useLikeQuoteMutation();
  const { mutateAsync: unlikeQuote } = useUnlikeQuoteMutation();
  const { mutateAsync: pokeFriend } = usePokeFriendMutation();

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // otherQuotes나 friendList가 변경될 때 feeds 상태를 업데이트
  useEffect(() => {
    const quotesMap = new Map(
      otherQuotes.map((quote) => [quote.authorNickname, quote])
    );

    const combined = friendList.map((friend) => {
      const friendQuote = quotesMap.get(friend.nickname);
      if (friendQuote) {
        return {
          ...friendQuote,
          quoteId: friendQuote.id,
          friendId: friend.id,
          isSilenced: false,
        };
      } else {
        return {
          id: friend.id,
          friendId: friend.id,
          authorNickname: friend.nickname,
          authorProfileImage: friend.profileImage,
          authorIntroduction: friend.introduction,
          isSilenced: true,
          content: "",
          taggedNicknames: [],
          timeAgo: "",
          isLiked: false,
          createDate: "",
          isFriendQuote: true,
        };
      }
    });
    setQuotes(combined);
  }, [otherQuotes, friendList]);

  const handleRequest = async (quoteId: number) => {
    try {
      await requestQuoteTag(quoteId);
      // API 호출 성공 후, 부모에게 받은 onTagRequest 함수 호출
      onTagRequest?.();
    } catch (err) {
      console.error("태그 요청 실패:", err);
      // 실패 시 사용자에게 알림
      setErrorMessage("태그 요청에 실패했습니다.");
      setShowErrorToast(true);
    }
  };

  const handleLike = async (quoteId: number, isLiked: boolean) => {
    // 먼저 UI를 낙관적으로 업데이트
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote) =>
        quote.id === quoteId ? { ...quote, isLiked: !isLiked } : quote
      )
    );

    try {
      if (isLiked) {
        await unlikeQuote(quoteId);
      } else {
        await likeQuote(quoteId);
      }
    } catch (err) {
      // API 호출 실패 시 UI를 원래 상태로 되돌림
      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === quoteId ? { ...quote, isLiked: isLiked } : quote
        )
      );
      console.error("좋아요 처리 실패:", err);
      setErrorMessage("좋아요 처리에 실패했습니다.");
      setShowErrorToast(true);
    }
  };

  const handleShare = (authorNickname: string, index: number) => {
    const shareProcess = () =>
      new Promise<void>((resolve, reject) => {
        const feedElement = feedRefs.current[index];
        if (feedElement) {
          toPng(feedElement)
            .then((dataUrl) => {
              const link = document.createElement("a");
              link.download = `QuoteMe-${displayDate}-${authorNickname}.png`;
              link.href = dataUrl;
              link.click();
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        }
      });

    onShare(shareProcess);
  };

  const handlePoke = async (friendId: number) => {
    try {
      await pokeFriend(friendId);
      // API 호출 성공 후, 부모에게 받은 onPoke 함수 호출
      onPoke?.();
    } catch (err) {
      console.error("콕 찌르기 실패:", err);
      // 실패 시 사용자에게 알림
      setErrorMessage("콕 찌르기에 실패했습니다.");
      setShowErrorToast(true);
    }
  };

  const [showTagModal, setShowTagModal] = useState(false);

  return (
    <S.FeedList>
      <S.GroupList onClick={() => setShowTagModal(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M2.80572 5.63886H4.75363C4.85767 6.04517 5.09397 6.4053 5.42528 6.66247C5.7566 6.91964 6.16408 7.05923 6.5835 7.05923C7.00291 7.05923 7.4104 6.91964 7.74171 6.66247C8.07303 6.4053 8.30933 6.04517 8.41336 5.63886H13.1946C13.3198 5.63886 13.44 5.58911 13.5285 5.50055C13.6171 5.41199 13.6668 5.29188 13.6668 5.16664C13.6668 5.0414 13.6171 4.92129 13.5285 4.83273C13.44 4.74417 13.3198 4.69442 13.1946 4.69442H8.41336C8.30933 4.28811 8.07303 3.92798 7.74171 3.67081C7.4104 3.41364 7.00291 3.27405 6.5835 3.27405C6.16408 3.27405 5.7566 3.41364 5.42528 3.67081C5.09397 3.92798 4.85767 4.28811 4.75363 4.69442H2.80572C2.68048 4.69442 2.56037 4.74417 2.47181 4.83273C2.38325 4.92129 2.3335 5.0414 2.3335 5.16664C2.3335 5.29188 2.38325 5.41199 2.47181 5.50055C2.56037 5.58911 2.68048 5.63886 2.80572 5.63886ZM6.5835 4.2222C6.77029 4.2222 6.95289 4.27759 7.1082 4.38136C7.26351 4.48514 7.38457 4.63264 7.45605 4.80522C7.52753 4.97779 7.54623 5.16769 7.50979 5.35089C7.47335 5.5341 7.3834 5.70238 7.25132 5.83446C7.11924 5.96655 6.95095 6.0565 6.76775 6.09294C6.58454 6.12938 6.39465 6.11068 6.22207 6.03919C6.0495 5.96771 5.902 5.84666 5.79822 5.69135C5.69444 5.53603 5.63905 5.35343 5.63905 5.16664C5.63905 4.91616 5.73856 4.67594 5.91567 4.49882C6.09279 4.3217 6.33301 4.2222 6.5835 4.2222ZM13.1946 10.3611H12.1911C12.0871 9.95478 11.8508 9.59465 11.5195 9.33748C11.1882 9.0803 10.7807 8.94071 10.3613 8.94071C9.94186 8.94071 9.53437 9.0803 9.20306 9.33748C8.87174 9.59465 8.63544 9.95478 8.53141 10.3611H2.80572C2.68048 10.3611 2.56037 10.4108 2.47181 10.4994C2.38325 10.588 2.3335 10.7081 2.3335 10.8333C2.3335 10.9585 2.38325 11.0787 2.47181 11.1672C2.56037 11.2558 2.68048 11.3055 2.80572 11.3055H8.53141C8.63544 11.7118 8.87174 12.072 9.20306 12.3291C9.53437 12.5863 9.94186 12.7259 10.3613 12.7259C10.7807 12.7259 11.1882 12.5863 11.5195 12.3291C11.8508 12.072 12.0871 11.7118 12.1911 11.3055H13.1946C13.3198 11.3055 13.44 11.2558 13.5285 11.1672C13.6171 11.0787 13.6668 10.9585 13.6668 10.8333C13.6668 10.7081 13.6171 10.588 13.5285 10.4994C13.44 10.4108 13.3198 10.3611 13.1946 10.3611ZM10.3613 11.7778C10.1745 11.7778 9.99188 11.7224 9.83657 11.6186C9.68126 11.5148 9.5602 11.3673 9.48872 11.1947C9.41724 11.0222 9.39853 10.8323 9.43498 10.6491C9.47142 10.4659 9.56137 10.2976 9.69345 10.1655C9.82553 10.0334 9.99382 9.94345 10.177 9.90701C10.3602 9.87057 10.5501 9.88927 10.7227 9.96075C10.8953 10.0322 11.0428 10.1533 11.1466 10.3086C11.2503 10.4639 11.3057 10.6465 11.3057 10.8333C11.3057 11.0838 11.2062 11.324 11.0291 11.5011C10.852 11.6782 10.6118 11.7778 10.3613 11.7778Z"
            fill="#21242B"
          />
        </svg>
        <S.GroupText>전체보기</S.GroupText>
      </S.GroupList>
      {showTagModal && (
        <S.TagModalWrapper
          onClick={() => {
            setShowTagModal(false);
          }}
        >
          <S.TagModal onClick={(e) => e.stopPropagation()}>
            <S.TagModalItem>수정하기</S.TagModalItem>
            <S.TagModalItem>기</S.TagModalItem>
          </S.TagModal>
        </S.TagModalWrapper>
      )}
      {showErrorToast && (
        <ToastModal
          isVisible={showErrorToast}
          onClose={() => {
            setShowErrorToast(false);
          }}
          text={errorMessage}
        />
      )}
      {quotes.length > 0 ? (
        quotes.map((quote, index) => (
          <Feed
            key={quote.id}
            ref={(el: HTMLDivElement | null) => {
              feedRefs.current[index] = el;
            }}
            profileImageUrl={quote.authorProfileImage}
            authorName={quote.authorNickname}
            bio={quote.authorIntroduction}
            createDate={quote.createDate}
            content={quote.content}
            tag={quote.taggedNicknames}
            isLiked={quote.isLiked}
            onLike={() => handleLike(quote.id, quote.isLiked)}
            // Quote가 있을 때만 공유 버튼 활성화
            onShare={
              !quote.isSilenced
                ? () => handleShare(quote.authorNickname, index)
                : undefined
            }
            onRequest={() => {
              if (quote.quoteId) {
                handleRequest(quote.quoteId);
              }
            }}
            onPoke={() => {
              handlePoke(quote.friendId);
            }}
            isInArchive={false}
            isSilenced={quote.isSilenced}
            timeAgo={quote.timeAgo}
          />
        ))
      ) : !isLoading ? (
        <S.NoFeedbox>
          <S.NoFeedText>태그할 수 있는 친구가 없어요</S.NoFeedText>
          <S.NoFeedSubText>
            친구를 추가하고 나중에 태그를 추가할 수 있어요
          </S.NoFeedSubText>
        </S.NoFeedbox>
      ) : null}
    </S.FeedList>
  );
}
