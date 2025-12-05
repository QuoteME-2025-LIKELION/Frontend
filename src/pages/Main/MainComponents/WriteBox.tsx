import * as S from "./WriteBoxStyled";
import { useState } from "react";

interface WriteBoxProps {
  onComplete: () => void;
  onAI: () => void;
}

export default function WriteBox({ onComplete, onAI }: WriteBoxProps) {
  const [text, setText] = useState("");

  const isLong = text.length > 30;
  return (
    <S.Container>
      <S.Datebox>
        <S.Month>10/31</S.Month>
        <S.Weekend>화요일</S.Weekend>
      </S.Datebox>
      <S.Guide>
        오늘의 명언을 직접 적거나 <br /> 오늘 일기를 적고 명언 만들기를 부탁할
        수 있어요
      </S.Guide>
      <S.WriteBox>
        <S.TextArea value={text} onChange={(e) => setText(e.target.value)} />
        <S.LineWrap>
          <S.Line />
          <S.Line />
          <S.Line />
        </S.LineWrap>
      </S.WriteBox>
      {isLong ? (
        <S.RecommendBtn onClick={onAI}>
          <S.BtnText>AI 추천 받기</S.BtnText>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
          >
            <path
              d="M13.3334 4L6.00002 11.3333L2.66669 8"
              stroke="white"
              strokeOpacity="0.7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </S.RecommendBtn>
      ) : (
        <S.RecommendBtn onClick={onComplete}>
          <S.BtnText>입력완료</S.BtnText>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
          >
            <path
              d="M13.3334 4L6.00002 11.3333L2.66669 8"
              stroke="white"
              strokeOpacity="0.7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </S.RecommendBtn>
      )}
    </S.Container>
  );
}
