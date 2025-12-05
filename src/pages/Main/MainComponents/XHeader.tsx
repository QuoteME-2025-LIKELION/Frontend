import * as S from "./DateHeaderStyled";
import { useNavigate } from "react-router-dom";

export default function DateHeader() {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.Header>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          onClick={() => navigate("/main-home")}
          style={{ cursor: "pointer" }}
        >
          <path
            d="M9 21V13C9 12.7348 9.10536 12.4804 9.29289 12.2929C9.48043 12.1054 9.73478 12 10 12H14C14.2652 12 14.5196 12.1054 14.7071 12.2929C14.8946 12.4804 15 12.7348 15 13V21M21 10C21.0001 9.70907 20.9367 9.42162 20.8142 9.15772C20.6918 8.89381 20.5132 8.6598 20.291 8.472L13.291 2.472C12.93 2.16691 12.4726 1.99952 12 1.99952C11.5274 1.99952 11.07 2.16691 10.709 2.472L3.709 8.472C3.4868 8.6598 3.30824 8.89381 3.18579 9.15772C3.06333 9.42162 2.99993 9.70907 3 10V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V10Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <S.IconBox>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </S.IconBox>
      </S.Header>
    </S.Container>
  );
}
