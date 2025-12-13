import Header from "@/components/Header/Header";
import * as S from "./ChangeMessageStyle";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useState } from "react";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function ChangeMessage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  return (
    <>
      <PageTitle title="그룹 메시지 변경" />
      <S.Container>
        <Header
          showBackBtn={false}
          showXBtn={true}
          title=""
          backgroundColor="white"
          onClickXBtn={() => navigate(-1)}
        />
        <S.Content>
          <S.Title>그룹 메시지</S.Title>
          <S.InputBox>
            <Input
              placeholder="메시지를 입력하세요"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <S.Desc>20자 내외</S.Desc>
          </S.InputBox>
          {/* 메시지 변경 로직 추후 구현 예정 */}
          <Button title="저장 완료" onClick={() => navigate(-1)} />
        </S.Content>
      </S.Container>
    </>
  );
}
