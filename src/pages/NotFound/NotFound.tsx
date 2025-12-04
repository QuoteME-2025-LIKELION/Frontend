import * as S from "./NotFoundStyle";

export default function NotFound() {
  return (
    <S.Container>
      <S.Content>
        <S.SorryBox>
          <S.SorryText>Sorry</S.SorryText>
          <S.Sorry503>503</S.Sorry503>
        </S.SorryBox>
        <S.Main>
          <S.TextBox>급할수록 돌아가라.</S.TextBox>
          <S.Div />
          <S.Footer>
            <div>아직 준비 중인 페이지입니다.</div>
            <div>
              <div>―</div>
              <div>QuoteMe</div>
            </div>
          </S.Footer>
        </S.Main>
      </S.Content>
    </S.Container>
  );
}
