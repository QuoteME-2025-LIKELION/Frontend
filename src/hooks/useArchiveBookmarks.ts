import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRef, useState } from "react";

import { quoteApi } from "@/api/quoteApi";
import {
  archiveQueryKeys,
  useBookmarkedArchivesQuery,
} from "@/hooks/useArchiveQueries";
import { quoteQueryKeys } from "@/hooks/useQuoteQueries";
import type { ArchiveFeed } from "@/types/archiveFeed.type";

const mutationKey = ["archive-bookmark"];
const getQuoteId = (feed: ArchiveFeed) => feed.quoteId ?? feed.id;

/** 아카이브 응답에 없는 북마크 상태를 북마크 목록의 명언 ID로 확인한다. */
export function useArchiveBookmarks(month?: string) {
  const queryClient = useQueryClient();
  const bookmarks = useBookmarkedArchivesQuery(month);
  const pendingCount = useIsMutating({ mutationKey });
  const inFlight = useRef(false);
  const [toastMessage, setToastMessage] = useState("");
  const mutation = useMutation({
    mutationKey,
    mutationFn: async ({
      feed,
      isBookmarked,
    }: {
      feed: ArchiveFeed;
      isBookmarked: boolean;
      month?: string;
    }) => {
      const quoteId = getQuoteId(feed);
      if (isBookmarked) await quoteApi.unbookmarkQuote(quoteId);
      else await quoteApi.bookmarkQuote(quoteId);
    },
    onSuccess: async (_, { feed, isBookmarked, month: submittedMonth }) => {
      // 진행 중이던 조회가 성공한 변경을 오래된 목록으로 덮어쓰지 않게 한다.
      await queryClient.cancelQueries({ queryKey: archiveQueryKeys.all });
      const quoteId = getQuoteId(feed);
      queryClient.setQueryData<ArchiveFeed[]>(
        archiveQueryKeys.bookmarks(submittedMonth),
        (previous) => {
          if (!previous) return previous;
          const remaining = previous.filter(
            (item) => getQuoteId(item) !== quoteId
          );
          return isBookmarked
            ? remaining
            : [...remaining, { ...feed, isBookmarked: true }];
        }
      );
      setToastMessage(
        isBookmarked ? "북마크가 해제되었습니다." : "북마크에 추가되었습니다."
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: archiveQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: quoteQueryKeys.all }),
      ]);
    },
    onError: () => setToastMessage("북마크 처리에 실패했습니다."),
  });

  const getBookmarkProps = (feed: ArchiveFeed) => {
    const quoteId = getQuoteId(feed);
    const isBookmarked = bookmarks.data?.some(
      (item) => getQuoteId(item) === quoteId
    );
    const isBookmarkDisabled =
      !Number.isSafeInteger(quoteId) ||
      quoteId <= 0 ||
      !bookmarks.isSuccess ||
      bookmarks.isFetching ||
      pendingCount > 0;

    return {
      isBookmarked,
      isBookmarkDisabled,
      onBookmark: async () => {
        if (
          isBookmarkDisabled ||
          inFlight.current ||
          queryClient.isMutating({ mutationKey }) > 0 ||
          isBookmarked === undefined
        )
          return;
        inFlight.current = true;
        try {
          await mutation.mutateAsync({ feed, isBookmarked, month });
        } catch {
          // mutation의 onError에서 안내하며 실패 시 목록은 유지한다.
        } finally {
          inFlight.current = false;
        }
      },
    };
  };

  return {
    getBookmarkProps,
    toastMessage,
    closeBookmarkToast: () => setToastMessage(""),
    isBookmarkError: bookmarks.isError,
    retryBookmarks: () => {
      void bookmarks.refetch();
    },
  };
}
