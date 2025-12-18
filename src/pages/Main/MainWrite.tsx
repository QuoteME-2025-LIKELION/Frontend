import XHeader from "@/pages/Main/MainComponents/XHeader/XHeader";
import WriteBox from "@/pages/Main/MainComponents/WriteBox/WriteBox";
import RecommendList from "@/pages/Main/MainComponents/RecommendList/RecommendList";
import * as S from "@/pages/Main/MainStyled";
import NewQuote from "@/pages/Main/MainComponents/NewQuote/NewQuote";
import { useState } from "react";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { MyQuote } from "@/types/feed.type";

export default function MainWrite() {
  const [newQuoteActive, setNewQuoteActive] = useState(false);
  const [recommendActive, setRecommendActive] = useState(false);
  const [createdQuote, setCreatedQuote] = useState<any>(null);
  const [diaryText, setDiaryText] = useState("");
  const [myQuote, setMyQuote] = useState<MyQuote | null>(null);

  return (
    <>
      <PageTitle title="명언 작성하기" />
      <S.Container>
        <XHeader />

        <WriteBox
          onComplete={(data) => {
            setCreatedQuote(data);
            setNewQuoteActive(true);
          }}
          onAI={(text) => {
            setDiaryText(text);
            setRecommendActive(true);
          }}
        />

        {recommendActive && (
          <RecommendList
            content={diaryText}
            onSelectComplete={(aiText) => {
              setCreatedQuote({
                content: aiText,
                authorName: "QuoteMe AI",
                authorBirthYear: null,
              });
              setNewQuoteActive(true);
              setRecommendActive(false);
            }}
          />
        )}

        {newQuoteActive && createdQuote && (
          <NewQuote quote={createdQuote} setMyQuote={setMyQuote} />
        )}
      </S.Container>
    </>
  );
}
