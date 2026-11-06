import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import tagCheckboxCheckedIcon from "@/assets/icons/quote-feed/tag-checkbox-checked.svg";
import tagCheckboxUncheckedIcon from "@/assets/icons/quote-feed/tag-checkbox-unchecked.svg";
import Search from "@/components/Search/Search";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useFriendsQuery } from "@/hooks/useFriendQueries";
import { useMyProfileQuery } from "@/hooks/useProfileQueries";
import {
  useCreateQuoteMutation,
  useQuoteTagRequestsQuery,
  useSaveQuoteTagsMutation,
} from "@/hooks/useQuoteQueries";
import type { CreatedQuote } from "@/types/feed.type";
import { getTagCandidates, hasInvalidTagSelection } from "@/utils/quoteTags";

import * as S from "./NewQuote.styles";

interface NewQuoteProps {
  quote: CreatedQuote;
  mode?: "create" | "fix"; // fix일 때만 명시적으로 추가하도록
  onBack?: () => void;
}

export default function NewQuote({
  quote,
  mode = "create",
  onBack,
}: NewQuoteProps) {
  const [selectedIdsDraft, setSelectedIdsDraft] = useState<number[] | null>(
    null
  );
  const [keyword, setKeyword] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: friends = [], isSuccess: areFriendsReady } = useFriendsQuery();
  const { data: myProfile, isSuccess: isProfileReady } = useMyProfileQuery();
  const { data: tagRequests = [], isError: isRequestsError, isSuccess: areRequestsReady, refetch: refetchRequests } = useQuoteTagRequestsQuery(
    mode === "fix" ? quote.id : undefined
  );
  const { mutateAsync: createQuote, isPending: isCreatingQuote } =
    useCreateQuoteMutation();
  const { mutateAsync: saveTags, isPending: isUpdatingQuoteTags } =
    useSaveQuoteTagsMutation();
  const tagCandidates = useMemo(
    () => getTagCandidates(friends, mode === "fix" ? quote.tags ?? [] : [], myProfile?.id, mode === "fix" ? tagRequests : []),
    [friends, mode, quote.tags, myProfile?.id, tagRequests]
  );
  const initialSelectedIds = useMemo(() => {
    if (mode !== "fix") {
      return [];
    }

    return (quote.tags ?? []).map((tag) => tag.memberId).filter((id) => id !== myProfile?.id);
  }, [mode, quote.tags, myProfile?.id]);
  const selectedIds = selectedIdsDraft ?? initialSelectedIds;
  const selectedFriends = tagCandidates.filter((friend) =>
    selectedIds.includes(friend.id)
  );
  const filteredFriends = tagCandidates.filter((friend) =>
    friend.nickname.toLowerCase().includes(keyword.trim().toLowerCase())
  );
  const isSubmitting = isCreatingQuote || isUpdatingQuoteTags;
  const requesterIds = new Set(tagRequests.map((request) => request.requesterId));

  const toggleSelect = (id: number) => {
    if (isSubmitting) return;
    if (selectedIds.includes(id)) {
      setSelectedIdsDraft(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIdsDraft([...selectedIds, id]);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!areFriendsReady || !isProfileReady || !myProfile) {
      setErrorMessage("친구와 내 정보를 불러온 뒤 다시 시도해 주세요.");
      setShowErrorToast(true);
      return;
    }
    if (mode === "fix" && !areRequestsReady) {
      setErrorMessage("태그 요청을 불러온 뒤 다시 시도해 주세요.");
      setShowErrorToast(true);
      return;
    }
    // 요청자는 수락 API를 통해 처리하므로 일반 태그 추가 검증에서 분리한다.
    const directIds = mode === "fix" ? selectedIds.filter((id) => !requesterIds.has(id)) : selectedIds;
    if (selectedIds.includes(myProfile.id) || hasInvalidTagSelection(directIds, friends, mode === "fix" ? quote.tags ?? [] : [], myProfile.id)) {
      setErrorMessage("새 태그는 친구만 선택할 수 있어요. 선택한 회원을 다시 확인해 주세요.");
      setShowErrorToast(true);
      return;
    }
    if (mode === "fix" && !Array.isArray(quote.tags)) {
      setErrorMessage("태그 정보를 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.");
      setShowErrorToast(true);
      return;
    }
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
      if (quote.id === undefined) {
        setErrorMessage("유효하지 않은 명언입니다.");
        setShowErrorToast(true);
        return;
      }

      try {
        await saveTags({ quoteId: quote.id, selectedIds, requests: tagRequests });

        navigate("/home");
      } catch {
        setErrorMessage("저장을 완료하지 못했어요. 일부 요청은 수락됐을 수 있으니 목록을 확인하고 다시 시도해 주세요.");
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
        {mode === "fix" && isRequestsError && (
          <>
            <S.Description role="alert">태그 요청을 불러오지 못했어요.</S.Description>
            <S.ActionButton type="button" onClick={() => void refetchRequests()}>다시 시도</S.ActionButton>
          </>
        )}
        {tagCandidates.length === 0 ? (
          <S.EmptyBox>
            <S.EmptyTitle>태그할 수 있는 친구가 없어요.</S.EmptyTitle>
            <S.EmptyDescription>
              친구를 추가하고 나중에 태그를 추가할 수 있어요.
            </S.EmptyDescription>
          </S.EmptyBox>
        ) : (
          <>
            <Search
              label="태그할 친구 검색"
              placeholder="태그할 친구를 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onClear={() => setKeyword("")}
            />
            <S.TagScrollArea>
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

                  return (
                    <S.TagItem
                      key={friend.id}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={isSubmitting}
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
                          {requesterIds.has(friend.id) ? "태그 요청을 보낸 분이에요." : friend.introduction}
                        </S.Intro>
                      </S.UserBox>
                      <S.Checkbox>
                        <img
                          src={
                            isSelected
                              ? tagCheckboxCheckedIcon
                              : tagCheckboxUncheckedIcon
                          }
                          alt=""
                        />
                      </S.Checkbox>
                    </S.TagItem>
                  );
                })}
              </S.TagList>
            </S.TagScrollArea>
          </>
        )}
      </S.TagBox>
      <S.ActionBar $single={mode === "fix"}>
        {mode === "create" && (
          <S.ActionButton type="button" onClick={onBack}>
            뒤로가기
          </S.ActionButton>
        )}
        <S.ActionButton
          type="button"
          disabled={isSubmitting || !areFriendsReady || !isProfileReady || (mode === "fix" && !areRequestsReady)}
          onClick={handleSubmit}
        >
          {mode === "create" ? "게시하기" : "수정하기"}
        </S.ActionButton>
      </S.ActionBar>
    </S.Container>
  );
}
