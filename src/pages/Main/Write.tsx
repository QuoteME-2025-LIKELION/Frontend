import { useState } from "react";

import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useAiUsageQuery } from "@/hooks/useQuoteQueries";
import type { CreatedQuote } from "@/types/feed.type";

import NewQuote from "./components/NewQuote/NewQuote";
import RecommendList from "./components/RecommendList/RecommendList";
import WriteBox from "./components/WriteBox/WriteBox";
import XHeader from "./components/XHeader/XHeader";
import * as S from "./Main.styles";

type WriteStep = "write" | "recommend" | "tag";

export default function Write() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<WriteStep>("write");
  const [createdQuote, setCreatedQuote] = useState<CreatedQuote | null>(null);
  const [draftText, setDraftText] = useState("");
  const [diaryText, setDiaryText] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);
  const { data: aiUsage, isLoading: isAiUsageLoading } = useAiUsageQuery();
  const hasDraft =
    draftText.trim().length > 0 ||
    diaryText.trim().length > 0 ||
    createdQuote !== null ||
    activeStep !== "write";
  const handleClose = () => {
    if (hasDraft) {
      setShowExitModal(true);
      return;
    }

    navigate("/home");
  };

  return (
    <>
      <PageTitle title="명언 작성하기" />
      <S.Container>
        {showExitModal && (
          <ConfirmModal
            question=""
            lines={["저장하지 않고 나가시겠어요?"]}
            description="작성한 글은 저장되지 않습니다"
            cancelText="돌아가기"
            confirmText="나가기"
            confirmColor="danger"
            variant="card"
            onClose={() => setShowExitModal(false)}
            onConfirm={() => navigate("/home")}
          />
        )}
        <XHeader showHomeButton={false} onClose={handleClose} />

        <WriteBox
          value={
            activeStep === "tag" && createdQuote
              ? createdQuote.content
              : draftText
          }
          onChange={setDraftText}
          isRecommendMode={activeStep === "recommend"}
          isResultMode={activeStep === "tag"}
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
            aiUsage={aiUsage}
            isAiUsageLoading={isAiUsageLoading}
            onBack={() => setActiveStep("write")}
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
          <NewQuote
            quote={createdQuote}
            onBack={() =>
              setActiveStep(
                createdQuote.authorName === "QuoteMe AI"
                  ? "recommend"
                  : "write"
              )
            }
          />
        )}
      </S.Container>
    </>
  );
}
