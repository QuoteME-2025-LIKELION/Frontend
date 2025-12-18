import Header from "@/components/Header/Header";
import * as S from "./ChangeMessageStyle";
import { useNavigate, useParams } from "react-router-dom";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle/PageTitle";
import api from "@/api/api";
import ToastModal from "@/components/ToastModal/ToastModal";
import type { AxiosError } from "axios";

export default function ChangeMessage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { groupId } = useParams();

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // groupId 유효성 검사 및 그룹 데이터 로딩
  useEffect(() => {
    if (!groupId || isNaN(Number(groupId))) {
      navigate("/*", { replace: true });
      return;
    }

    const fetchGroupData = async () => {
      try {
        const res = await api.get(`/api/groups/${groupId}`);
        setMessage(res.data.motto || "");
      } catch (err: AxiosError | any) {
        if (err.response && err.response.status === 500) {
          navigate("/*", { replace: true });
        }
        console.error("그룹 정보 조회 중 오류 발생:", err);
      }
    };

    fetchGroupData();
  }, [groupId, navigate]);

  const handleSave = async () => {
    const newMotto = message.trim();

    if (newMotto.length > 20) {
      setErrorMessage("메시지는 20자 이내로 입력해 주세요.");
      setShowErrorToast(true);
      return;
    }
    try {
      await api.patch(`/api/groups/${groupId}/motto`, { motto: newMotto });
      navigate(`/group/${groupId}`);
    } catch (err) {
      console.error("그룹 메시지 변경 오류:", err);
      setErrorMessage("그룹 메시지 변경에 실패했습니다.");
      setShowErrorToast(true);
    }
  };

  return (
    <>
      <PageTitle title="그룹 메시지 변경" />
      <S.Container>
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => setShowErrorToast(false)}
            text={errorMessage}
          />
        )}
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
