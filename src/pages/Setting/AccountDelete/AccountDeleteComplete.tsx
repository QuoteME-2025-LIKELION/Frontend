import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "@/components/PageTitle/PageTitle";
import useAuthStore from "@/stores/useAuthStore";

import * as S from "./AccountDelete.styles";

export default function AccountDeleteComplete() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <>
      <PageTitle title="계정 삭제 완료" />
      <S.DoneContainer>
        <S.DoneContent>
          <S.DoneTitle>계정이 삭제되었습니다</S.DoneTitle>
          <S.DoneDescription>
            그동안 쿼트미를 이용해 주셔서 감사합니다
            <br />
            더 나은 서비스로 다시 만날 수 있기를 바랍니다
          </S.DoneDescription>
        </S.DoneContent>
        <S.HomeButton type="button" onClick={() => navigate("/")}>
          처음으로
        </S.HomeButton>
      </S.DoneContainer>
    </>
  );
}
