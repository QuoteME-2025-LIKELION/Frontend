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

type TagRequestDecision = "accept" | "reject";

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
  const [selectedIdsDraft, setSelectedIdsDraft] = useState<number[] | null>(
    null
  );
  const [tagRequestDecisions, setTagRequestDecisions] = useState<
    Record<number, TagRequestDecision>
  >({});
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
  const pendingRequestItems = pendingTagRequests.map((request) => {
    const requester = friends.find(
      (friend) => friend.nickname === request.requesterNickname
    );
    const decision =
      tagRequestDecisions[request.requestId] ??
      (requester && selectedIds.includes(requester.id) ? "accept" : "reject");

    return {
      ...request,
      requester,
      decision,
    };
  });
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
    const targetFriend = friends.find((friend) => friend.id === id);
    const targetRequest = targetFriend
      ? pendingTagRequests.find(
          (request) => request.requesterNickname === targetFriend.nickname
        )
      : undefined;

    if (selectedIds.includes(id)) {
      setSelectedIdsDraft(selectedIds.filter((item) => item !== id));
      if (targetRequest) {
        setTagRequestDecisions((prev) => ({
          ...prev,
          [targetRequest.requestId]: "reject",
        }));
      }
    } else {
      setSelectedIdsDraft([...selectedIds, id]);
      if (targetRequest) {
        setTagRequestDecisions((prev) => ({
          ...prev,
          [targetRequest.requestId]: "accept",
        }));
      }
    }
  };

  const decideTagRequest = (
    requestId: number,
    requesterNickname: string,
    decision: TagRequestDecision
  ) => {
    const requester = friends.find(
      (friend) => friend.nickname === requesterNickname
    );

    setTagRequestDecisions((prev) => ({
      ...prev,
      [requestId]: decision,
    }));

    if (!requester) {
      return;
    }

    if (decision === "accept") {
      setSelectedIdsDraft(
        selectedIds.includes(requester.id)
          ? selectedIds
          : [...selectedIds, requester.id]
      );
      return;
    }

    setSelectedIdsDraft(selectedIds.filter((id) => id !== requester.id));
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (mode === "create") {
      try {
        await createQuote({
          content: quote.content,
          originalContent: quote.originalContent,
          summary: quote.summary,
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
            const decision =
              tagRequestDecisions[request.requestId] ??
              (selectedNameSet.has(request.requesterNickname)
                ? "accept"
                : "reject");

            return decision === "accept"
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
        <S.Description>
          나중에 태그를 추가하거나 수정할 수 있어요.
        </S.Description>
        <Search
          placeholder="검색어를 입력해 주세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword("")}
        />
        <S.TagScrollArea>
          {mode === "fix" && pendingRequestItems.length > 0 && (
            <S.TagRequestSection>
              <S.TagRequestHeader>
                <S.TagRequestTitle>태그 요청</S.TagRequestTitle>
                <S.TagRequestCount>
                  {pendingRequestItems.length}
                </S.TagRequestCount>
              </S.TagRequestHeader>
              <S.TagRequestList>
                {pendingRequestItems.map((request) => (
                  <S.TagRequestItem key={request.requestId}>
                    {request.requester?.profileImage ? (
                      <S.RequestProfileImg
                        src={request.requester.profileImage}
                        alt=""
                      />
                    ) : (
                      <S.RequestDefaultProfileImg>Q</S.RequestDefaultProfileImg>
                    )}
                    <S.TagRequestUserBox>
                      <S.TagRequestUsername>
                        {request.requesterNickname}
                      </S.TagRequestUsername>
                      <S.TagRequestState $decision={request.decision}>
                        {request.decision === "accept"
                          ? "수락 예정"
                          : "거절 예정"}
                      </S.TagRequestState>
                    </S.TagRequestUserBox>
                    <S.TagRequestActions>
                      <S.TagRequestButton
                        type="button"
                        $active={request.decision === "accept"}
                        onClick={() =>
                          decideTagRequest(
                            request.requestId,
                            request.requesterNickname,
                            "accept"
                          )
                        }
                      >
                        수락
                      </S.TagRequestButton>
                      <S.TagRequestButton
                        type="button"
                        $active={request.decision === "reject"}
                        onClick={() =>
                          decideTagRequest(
                            request.requestId,
                            request.requesterNickname,
                            "reject"
                          )
                        }
                      >
                        거절
                      </S.TagRequestButton>
                    </S.TagRequestActions>
                  </S.TagRequestItem>
                ))}
              </S.TagRequestList>
            </S.TagRequestSection>
          )}
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
        </S.TagScrollArea>
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
