import { forwardRef } from "react";

import bookmarkFilledIcon from "@/assets/icons/archive/bookmark-filled.svg";
import bookmarkOutlineIcon from "@/assets/icons/archive/bookmark-outline.svg";
import shareIcon from "@/assets/icons/archive/share.svg";
import userIcon from "@/assets/icons/archive/user.svg";
import type { ArchiveFeed } from "@/types/archiveFeed.type";

import * as S from "./ArchiveQuoteCard.styles";

type ArchiveQuoteCardProps = {
  feed: ArchiveFeed;
  showOriginalContent?: boolean;
  onClick?: () => void;
  onShare?: () => void;
};

const ArchiveQuoteCard = forwardRef<HTMLDivElement, ArchiveQuoteCardProps>(
  ({ feed, showOriginalContent = false, onClick, onShare }, ref) => {
    const authorName = feed.authorName ?? feed.authorNickname ?? "닉네임";
    const birthYear = feed.authorBirthYear ? `${feed.authorBirthYear}~` : "1999~";
    const taggedNames = feed.taggedMemberNames ?? feed.taggedMembers ?? [];

    return (
      <S.Container ref={ref} onClick={onClick}>
        <S.Author>
          {authorName} ({birthYear})
        </S.Author>
        <S.QuoteBox>
          <S.QuoteMark aria-hidden="true">“</S.QuoteMark>
          <S.Content>{feed.content}</S.Content>
          <S.QuoteMark aria-hidden="true">”</S.QuoteMark>
        </S.QuoteBox>
        {showOriginalContent && feed.originalContent && (
          <S.OriginalContent>{feed.originalContent}</S.OriginalContent>
        )}
        <S.ActionRow>
          <S.TagBox>
            <img src={userIcon} alt="" width={16} height={16} />
            <S.TagText>
              {taggedNames.map((name) => (
                <span key={name}>{name}</span>
              ))}
              {taggedNames.length > 0 && <span>+</span>}
            </S.TagText>
          </S.TagBox>
          <S.IconBox>
            <S.IconButton type="button" aria-label="북마크">
              <img
                src={
                  feed.isBookmarked ? bookmarkFilledIcon : bookmarkOutlineIcon
                }
                alt=""
              />
            </S.IconButton>
            <S.IconButton
              type="button"
              aria-label="공유하기"
              onClick={(event) => {
                event.stopPropagation();
                onShare?.();
              }}
            >
              <img src={shareIcon} alt="" />
            </S.IconButton>
          </S.IconBox>
        </S.ActionRow>
      </S.Container>
    );
  }
);

ArchiveQuoteCard.displayName = "ArchiveQuoteCard";

export default ArchiveQuoteCard;
