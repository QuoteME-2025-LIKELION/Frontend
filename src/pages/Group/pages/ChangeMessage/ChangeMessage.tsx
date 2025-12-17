import Header from "@/components/Header/Header";
import * as S from "./ChangeMessageStyle";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle/PageTitle";
import api from "@/api/api";

export default function ChangeMessage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { groupId } = useParams();

  useEffect(() => {
    const currentMotto = location.state?.currentMotto || "";
    setMessage(currentMotto);
  }, [location, location.state]);

  const handleSave = async () => {
    const newMotto = message.trim();

    if (newMotto.length > 20) {
      alert("메시지는 20자 이내로 입력해 주세요.");
      return;
    }
    try {
      await api.patch(`/api/groups/${groupId}/motto`, { motto: newMotto });
      navigate(`/group/${groupId}`);
    } catch (err) {
      console.error("그룹 메시지 변경 오류:", err);
    }
  };

  return (
    <>
      <PageTitle title="그룹 메시지 변경" />
      <S.Container>
        <Header
          showBackBtn={false}
          showXBtn={true}
          title=""
          backgroundColor="white"
          onClickXBtn={() => navigate(`/group/${groupId}`)}
        />
        <S.Content>
          <S.Title>그룹 메시지</S.Title>
          <S.InputBox>
            <Input
              placeholder="메시지를 입력하세요"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={20}
            />
            <S.Desc>20자 이내</S.Desc>
          </S.InputBox>
          {/* 메시지 변경 로직 추후 구현 예정 */}
          <Button title="저장 완료" onClick={handleSave} />
        </S.Content>
      </S.Container>
    </>
  );
}
