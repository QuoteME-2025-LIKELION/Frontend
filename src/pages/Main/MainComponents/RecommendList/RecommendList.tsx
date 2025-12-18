import * as S from "./RecommendListStyled";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/Button/Button";
import api from "@/api/api";
import { useEffect } from "react";

interface RecommendListProps {
  onSelectComplete: (text: string) => void;
  content: string;
}

interface SummarizeResponse {
  summary: string;
}

export default function RecommendListList({
  content,
  onSelectComplete,
}: RecommendListProps) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quotes, setQuotes] = useState<
    { id: number; text: string; author: string }[]
  >([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        console.log("📤 summarize 요청 content:", content);

        const res = await api.post<{ summary: string }>(
          "/api/quotes/summarize",
          { content }
        );

        console.log("📥 summarize 응답 전체:", res);
        console.log("📥 summarize 응답 data:", res.data);
        console.log("📥 summarize summary:", res.data?.summary);

        if (!res.data?.summary) {
          console.warn("⚠️ summary가 없음");
          setQuotes([]);
          return;
        }

        setQuotes([
          {
            id: 1,
            text: res.data.summary,
            author: "QuoteMe AI",
          },
        ]);
      } catch (e: any) {
        console.error("❌    에러:", e);
        console.log("status:", e.response?.status);
        console.log("data:", e.response?.data);
      }
    };

    if (content) {
      fetchSummary();
    } else {
      console.warn("⚠️ content가 비어 있음");
    }
  }, [content]);

  return (
    <S.Container>
      <S.Head>
        <S.Text style={{ fontSize: 20 }}>QuoteMe의 추천</S.Text>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          onClick={() => navigate("")}
          style={{ cursor: "pointer" }}
        >
          <path
            d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333M2 5.33333V2M2 5.33333H5.33333"
            stroke="#959595"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </S.Head>
      <S.ComendList>
        {quotes.map((q) => (
          <S.Commend
            key={q.id}
            $isSelected={selectedId === q.id}
            onClick={() => setSelectedId(q.id)}
          >
            <S.FirstLine>
              <svg
                width="11"
                height="10"
                viewBox="0 0 11 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.67998 2.91999C7.23998 1.85332 8.11998 0.959991 9.31998 0.239992C9.69331 0.079991 9.95998 0.159991 10.12 0.479991C10.28 0.799992 10.1866 1.07999 9.83998 1.31999C9.43998 1.55999 9.06665 1.93332 8.71998 2.43999C8.37331 2.91999 8.14665 3.38666 8.03998 3.83999C7.95998 4.15999 7.99998 4.39999 8.15998 4.55999C8.34664 4.71999 8.54665 4.81332 8.75998 4.83999C9.42665 4.99999 9.87998 5.26666 10.12 5.63999C10.3866 5.98666 10.52 6.43999 10.52 6.99999C10.52 7.61332 10.3066 8.13332 9.87998 8.55999C9.47998 8.95999 8.94665 9.15999 8.27998 9.15999C7.63998 9.15999 7.06664 8.91999 6.55998 8.43999C6.07998 7.93332 5.83998 7.17333 5.83998 6.15999C5.83998 5.03999 6.11998 3.95999 6.67998 2.91999ZM0.839978 2.91999C1.42664 1.85332 2.31998 0.959991 3.51998 0.239992C3.89331 0.079991 4.14665 0.159991 4.27998 0.479991C4.43998 0.799992 4.34665 1.07999 3.99998 1.31999C3.59998 1.55999 3.22665 1.93332 2.87998 2.43999C2.53331 2.91999 2.31998 3.38666 2.23998 3.83999C2.15998 4.15999 2.19998 4.39999 2.35998 4.55999C2.51998 4.71999 2.71998 4.81332 2.95998 4.83999C3.59998 4.99999 4.05331 5.26666 4.31998 5.63999C4.58665 5.98666 4.71998 6.43999 4.71998 6.99999C4.71998 7.61332 4.49331 8.13332 4.03998 8.55999C3.61331 8.95999 3.07998 9.15999 2.43998 9.15999C1.79998 9.15999 1.22664 8.91999 0.719978 8.43999C0.239978 7.93332 -2.16961e-05 7.17333 -2.16961e-05 6.15999C-2.16961e-05 5.03999 0.279978 3.95999 0.839978 2.91999Z"
                  fill="black"
                />
              </svg>
              <S.Text
                style={{ fontSize: 16, width: 250 }}
                dangerouslySetInnerHTML={{ __html: q.text || "" }}
              />
              <svg
                width="11"
                height="10"
                viewBox="0 0 11 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.83998 6.23998C3.27998 7.30665 2.39998 8.19998 1.19998 8.91998C0.826646 9.07998 0.55998 8.99998 0.399979 8.67998C0.23998 8.35998 0.333313 8.07998 0.679979 7.83998C1.07998 7.59998 1.45331 7.22665 1.79998 6.71998C2.14665 6.23998 2.37331 5.77332 2.47998 5.31998C2.55998 4.99998 2.51998 4.75998 2.35998 4.59998C2.17331 4.43998 1.97331 4.34665 1.75998 4.31998C1.09331 4.15998 0.639979 3.89331 0.399979 3.51998C0.133313 3.17331 -2.02656e-05 2.71998 -2.02656e-05 2.15998C-2.02656e-05 1.54665 0.213313 1.02665 0.63998 0.599981C1.03998 0.199981 1.57331 -1.85966e-05 2.23998 -1.85966e-05C2.87998 -1.85966e-05 3.45331 0.239981 3.95998 0.719982C4.43998 1.22665 4.67998 1.98665 4.67998 2.99998C4.67998 4.11998 4.39998 5.19998 3.83998 6.23998ZM9.67998 6.23998C9.09331 7.30665 8.19998 8.19998 6.99998 8.91998C6.62665 9.07998 6.37331 8.99998 6.23998 8.67998C6.07998 8.35998 6.17331 8.07998 6.51998 7.83998C6.91998 7.59998 7.29331 7.22665 7.63998 6.71998C7.98665 6.23998 8.19998 5.77332 8.27998 5.31998C8.35998 4.99998 8.31998 4.75998 8.15998 4.59998C7.99998 4.43998 7.79998 4.34665 7.55998 4.31998C6.91998 4.15998 6.46665 3.89331 6.19998 3.51998C5.93331 3.17331 5.79998 2.71998 5.79998 2.15998C5.79998 1.54665 6.02665 1.02665 6.47998 0.599981C6.90665 0.199981 7.43998 -1.85966e-05 8.07998 -1.85966e-05C8.71998 -1.85966e-05 9.29331 0.239981 9.79998 0.719982C10.28 1.22665 10.52 1.98665 10.52 2.99998C10.52 4.11998 10.24 5.19998 9.67998 6.23998Z"
                  fill="black"
                />
              </svg>
            </S.FirstLine>
            <S.Text style={{ fontSize: 12 }}> - {q.author}</S.Text>
          </S.Commend>
        ))}
        <S.BtnBox>
          <Button
            title="선택 완료"
            onClick={() => {
              if (selectedId === null) return;
              const selected = quotes.find((q) => q.id === selectedId);
              if (!selected) return;
              onSelectComplete(selected.text);
            }}
          />
        </S.BtnBox>
      </S.ComendList>
    </S.Container>
  );
}
