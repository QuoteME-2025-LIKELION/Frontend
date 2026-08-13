import XHeader from "./components/XHeader/XHeader";
import WriteBox from "./components/WriteBox/WriteBox";
import RecommendList from "./components/RecommendList/RecommendList";
import * as S from "./Main.styles";
import NewQuote from "./components/NewQuote/NewQuote";
import { useState } from "react";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { CreatedQuote } from "@/types/feed.type";

type WriteStep = "write" | "recommend" | "tag";

export default function Write() {
  const [activeStep, setActiveStep] = useState<WriteStep>("write");
  const [createdQuote, setCreatedQuote] = useState<CreatedQuote | null>(null);
  const [diaryText, setDiaryText] = useState("");

  return (
    <>
      <PageTitle title="명언 작성하기" />
      <S.Container>
        <XHeader />

        <WriteBox
          onComplete={(data) => {
            setCreatedQuote({
              content: data.content,
              authorName: data.authorName || "",
              authorBirthYear: data.authorBirthYear ?? null,
              taggedNicknames: data.taggedMemberNames,
            });
            setActiveStep("tag");
          }}
          onAI={(text) => {
            setDiaryText(text);
            setActiveStep("recommend");
          }}
        />

        {activeStep === "recommend" && (
          <RecommendList
            content={diaryText}
            onSelectComplete={(aiText) => {
              setCreatedQuote({
                content: aiText,
                authorName: "QuoteMe AI",
                authorBirthYear: null,
              });
              setActiveStep("tag");
            }}
          />
        )}

        {activeStep === "tag" && createdQuote && (
          <NewQuote quote={createdQuote} />
        )}
      </S.Container>
    </>
  );
}
