import * as S from "./WriteBoxStyled";
import { useState } from "react";

interface QuoteResponse {
  content: string;
  authorName?: string;
  authorBirthYear?: number;
  taggedMemberNames?: string[];
  createDate?: string;
}
interface WriteBoxProps {
  onComplete: (data: QuoteResponse) => void;
  onAI: (text: string) => void;
}

export default function WriteBox({ onComplete, onAI }: WriteBoxProps) {
  const [text, setText] = useState("");

  const today = new Date();

  const month = today.getMonth() + 1; // 0부터 시작
  const date = today.getDate();

  const dayNames = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const day = dayNames[today.getDay()];
  const isLong = text.length > 30;
  const handleSubmit = () => {
    onComplete({
      content: text,
      authorName: "", // 서버 저장 전이므로 비워도 됨
      authorBirthYear: undefined,
    });
  };

  return (
    <S.Container>
      <S.Datebox>
        <S.Month>
          {month}/{date}
        </S.Month>
        <S.Weekend>{day}</S.Weekend>
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
        <S.RecommendBtn onClick={() => onAI(text)}>
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
        <S.RecommendBtn onClick={handleSubmit}>
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
