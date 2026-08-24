import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Search from "@/components/Search/Search";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useFriendsQuery } from "@/hooks/useFriendQueries";
import {
  useAcceptQuoteTagRequestMutation,
  useCreateQuoteMutation,
  useQuoteTagRequestsQuery,
  useRejectQuoteTagRequestMutation,
  useUpdateQuoteTagsMutation,
} from "@/hooks/useQuoteQueries";
import type { CreatedQuote } from "@/types/feed.type";

import * as S from "./NewQuote.styles";

interface NewQuoteProps {
  quote: CreatedQuote;
  mode?: "create" | "fix"; // fix일 때만 명시적으로 추가하도록
  onBack?: () => void;
  requestedNickname?: string;
}

export default function NewQuote({
  quote,
  mode = "create",
  onBack,
  requestedNickname,
}: NewQuoteProps) {
  const [selectedIdsDraft, setSelectedIdsDraft] = useState<number[] | null>(null);
  const [keyword, setKeyword] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: friends = [] } = useFriendsQuery();
  const { data: tagRequests = [] } = useQuoteTagRequestsQuery(
    mode === "fix" ? quote.id : undefined
  );
  const { mutateAsync: createQuote } = useCreateQuoteMutation();
  const { mutateAsync: updateQuoteTags } = useUpdateQuoteTagsMutation();
  const { mutateAsync: acceptTagRequest } = useAcceptQuoteTagRequestMutation();
  const { mutateAsync: rejectTagRequest } = useRejectQuoteTagRequestMutation();
  const pendingTagRequests = useMemo(
    () => tagRequests.filter((request) => request.status === "PENDING"),
    [tagRequests]
  );
  const pendingRequesterNames = useMemo(
    () =>
      new Set(
        [
          ...pendingTagRequests.map((request) => request.requesterNickname),
          requestedNickname,
        ].filter(Boolean)
      ),
    [pendingTagRequests, requestedNickname]
  );
  const initialSelectedIds = useMemo(() => {
    if (mode !== "fix") {
      return [];
    }

    return friends
      .filter(
        (friend) =>
          quote.taggedNicknames?.includes(friend.nickname) ||
          pendingRequesterNames.has(friend.nickname)
      )
      .map((friend) => friend.id);
  }, [friends, mode, pendingRequesterNames, quote.taggedNicknames]);
  const selectedIds = selectedIdsDraft ?? initialSelectedIds;
  const selectedFriends = friends.filter((friend) =>
    selectedIds.includes(friend.id)
  );
  const filteredFriends = friends
    .filter((friend) =>
      friend.nickname.toLowerCase().includes(keyword.trim().toLowerCase())
    )
    .sort((a, b) => {
      const aPending = pendingRequesterNames.has(a.nickname);
      const bPending = pendingRequesterNames.has(b.nickname);

      if (aPending === bPending) {
        return 0;
      }

      return aPending ? -1 : 1;
    });

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIdsDraft(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIdsDraft([...selectedIds, id]);
    }
  };
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (mode === "create") {
      try {
        await createQuote({
          content: quote.content,
          authorName: quote.authorName,
          authorBirthYear: quote.authorBirthYear,
          taggedMemberIds: selectedIds,
        });
        navigate("/home");
      } catch {
        setErrorMessage("글 작성에 실패했어요.");
        setShowErrorToast(true);
      }
    } else {
      // fix mode
      if (!quote.id) {
        setErrorMessage("유효하지 않은 명언입니다.");
        setShowErrorToast(true);
        return;
      }

      try {
        await updateQuoteTags({
          quoteId: quote.id,
          payload: {
            taggedMemberIds: selectedIds,
          },
        });

        const selectedNameSet = new Set(
          friends
            .filter((friend) => selectedIds.includes(friend.id))
            .map((friend) => friend.nickname)
        );

        const requestResults = await Promise.allSettled(
          pendingTagRequests.map((request) => {
            const payload = {
              quoteId: quote.id!,
              requestId: request.requestId,
            };

            return selectedNameSet.has(request.requesterNickname)
              ? acceptTagRequest(payload)
              : rejectTagRequest(payload);
          })
        );

        if (requestResults.some((result) => result.status === "rejected")) {
          throw new Error("태그 요청 처리에 실패했습니다.");
        }

        navigate("/home");
      } catch {
        setErrorMessage("태그 수정에 실패했어요.");
        setShowErrorToast(true);
      }
    }
  };

  return (
    <S.Container>
      {showErrorToast && (
        <ToastModal
          text={errorMessage}
          isVisible={showErrorToast}
          onClose={() => setShowErrorToast(false)}
        />
      )}
      <S.TagBox>
        <S.Title>친구 태그</S.Title>
        <S.Description>나중에 태그를 추가하거나 수정할 수 있어요.</S.Description>
        <Search
          placeholder="검색어를 입력해 주세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword("")}
        />
        <S.SelectedList $isEmpty={selectedFriends.length === 0}>
          {selectedFriends.map((friend) => (
            <S.SelectedUser key={friend.id}>
              <S.SelectedAvatar>
                {friend.profileImage ? (
                  <img src={friend.profileImage} alt="" />
                ) : (
                  <span>Q</span>
                )}
              </S.SelectedAvatar>
              <S.RemoveSelectedButton
                type="button"
                aria-label={`${friend.nickname} 태그 제거`}
                onClick={() => toggleSelect(friend.id)}
              >
                ×
              </S.RemoveSelectedButton>
              <span>{friend.nickname}</span>
            </S.SelectedUser>
          ))}
        </S.SelectedList>
        <S.TagList>
          {filteredFriends.map((friend, index) => {
            const isSelected = selectedIds.includes(friend.id);
            const isLast = index === filteredFriends.length - 1;
            const isPendingRequester = pendingRequesterNames.has(
              friend.nickname
            );

            return (
              <S.TagItem
                key={friend.id}
                type="button"
                $showBorder={!isLast}
                onClick={() => toggleSelect(friend.id)}
              >
                {friend.profileImage ? (
                  <S.ProfileImg src={friend.profileImage} alt="" />
                ) : (
                  <S.DefaultProfileImg>Q</S.DefaultProfileImg>
                )}
                <S.UserBox>
                  <S.Username>{friend.nickname}</S.Username>
                  <S.Intro>
                    {isPendingRequester
                      ? "태그 요청을 보낸 친구예요."
                      : friend.introduction}
                  </S.Intro>
                </S.UserBox>
                <S.Checkbox $isSelected={isSelected}>
                  {isSelected && "✓"}
                </S.Checkbox>
              </S.TagItem>
            );
          })}
        </S.TagList>
      </S.TagBox>
      <S.ActionBar $single={mode === "fix"}>
        {mode === "create" && (
          <S.ActionButton type="button" onClick={onBack}>
            뒤로가기
          </S.ActionButton>
        )}
        <S.ActionButton type="button" onClick={handleSubmit}>
          {mode === "create" ? "게시하기" : "수정하기"}
        </S.ActionButton>
      </S.ActionBar>
    </S.Container>
  );
}
