import * as S from "./HomeBoxStyled";
import { useNavigate } from "react-router-dom";
export default function HomeBox() {
  const navigate = useNavigate();
  return (
    <S.Container>
      <S.textbox>
        <S.Month>OCT</S.Month>
        <S.weekend>화요일</S.weekend>
      </S.textbox>
      <S.Wrapper onClick={() => navigate("/write")}>
        <S.Left>31</S.Left>
        <S.Right>
          <S.Line />
          <S.Text>오늘 있었던 일을 바탕으로</S.Text>
          <S.Line></S.Line>
          <S.Text>나만의 명언을 남겨보세요</S.Text>
        </S.Right>
      </S.Wrapper>
      <S.bottom>
        <S.Line></S.Line>
        <S.BottomTextBox>
          <S.Text2>그룹이름</S.Text2>
          <S.Text2>- 손지수 (2000~)</S.Text2>
        </S.BottomTextBox>
        <S.BottomBtn>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            onClick={() => ""} //onclick 함수 연결
            style={{ cursor: "pointer" }}
          >
            <path
              d="M4.24 12.25C3.84461 11.8572 3.53134 11.3897 3.31845 10.8746C3.10556 10.3596 2.99731 9.8073 3 9.24999C3 8.12282 3.44777 7.04181 4.2448 6.24478C5.04183 5.44775 6.12283 4.99999 7.25 4.99999C8.83 4.99999 10.21 5.85999 10.94 7.13999H12.06C12.4311 6.48905 12.9681 5.94808 13.6163 5.57216C14.2645 5.19625 15.0007 4.99883 15.75 4.99999C16.8772 4.99999 17.9582 5.44775 18.7552 6.24478C19.5522 7.04181 20 8.12282 20 9.24999C20 10.42 19.5 11.5 18.76 12.25L11.5 19.5L4.24 12.25ZM19.46 12.96C20.41 12 21 10.7 21 9.24999C21 7.8576 20.4469 6.52224 19.4623 5.53768C18.4777 4.55311 17.1424 3.99999 15.75 3.99999C14 3.99999 12.45 4.84999 11.5 6.16999C11.0151 5.49649 10.3766 4.94831 9.63748 4.57092C8.89835 4.19353 8.0799 3.99781 7.25 3.99999C5.85761 3.99999 4.52226 4.55311 3.53769 5.53768C2.55312 6.52224 2 7.8576 2 9.24999C2 10.7 2.59 12 3.54 12.96L11.5 20.92L19.46 12.96Z"
              fill="white"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            onClick={() => ""} //onclick 함수 연결
            style={{ cursor: "pointer" }}
          >
            <path
              d="M13 6.914V2.586L17.707 7.293L21.481 11.067L17.64 14.268L13 18.135V13.9C4.854 13.286 2 18 2 18C2 15.063 2.242 12.015 4.551 9.707C7.235 7.022 11.122 6.832 13 6.914Z"
              fill="white"
            />
          </svg>
        </S.BottomBtn>
      </S.bottom>
    </S.Container>
  );
}
