import XHeader from "@/pages/Main/MainComponents/XHeader/XHeader";
import WriteBox from "@/pages/Main/MainComponents/WriteBox/WriteBox";
import RecommendList from "@/pages/Main/MainComponents/RecommendList/RecommendList";
import * as S from "@/pages/Main/MainStyled";
import NewQuote from "@/pages/Main/MainComponents/NewQuote/NewQuote";
import { useState } from "react";

export default function MainWrite() {
  const [newQuoteActive, setNewQuoteActive] = useState(false);
  const [recommendActive, setRecommendActive] = useState(false);

  return (
    <S.Container>
      <XHeader />

      <WriteBox
        onComplete={() => setNewQuoteActive(true)}
        onAI={() => setRecommendActive(true)}
      />

      {recommendActive && (
        <RecommendList
          onSelectComplete={() => {
            setNewQuoteActive(true);
            setRecommendActive(false);
          }}
        />
      )}

      {newQuoteActive && <NewQuote />}
    </S.Container>
  );
}
