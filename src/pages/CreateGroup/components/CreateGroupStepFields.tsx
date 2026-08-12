import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import * as S from "../CreateGroup.styles";

interface CreateGroupStepFieldsProps {
  step: number;
  groupName: string;
  motto: string;
  isSubmitted: boolean;
  onChangeGroupName: (value: string) => void;
  onChangeMotto: (value: string) => void;
  onMoveStep: (step: number) => void;
}

/**
 * 그룹명과 그룹 메시지를 입력하는 1, 2단계 화면을 렌더링
 */
export default function CreateGroupStepFields({
  step,
  groupName,
  motto,
  isSubmitted,
  onChangeGroupName,
  onChangeMotto,
  onMoveStep,
}: CreateGroupStepFieldsProps) {
  if (step === 3) {
    return null;
  }

  return (
    <S.NavyBox>
      <S.InputContainer>
        {step === 1 && (
          <>
            <S.MTitle>
              그룹의 이름을 <br />
              설정해 주세요
            </S.MTitle>
            <S.STitle>그룹 이름은 한 번 정하면 바꿀 수 없어요</S.STitle>
            <S.InputBox>
              <Input
                placeholder="그룹명 설정"
                required={true}
                value={groupName}
                onChange={(e) => onChangeGroupName(e.target.value)}
                maxLength={10}
              />
              {isSubmitted && groupName.trim().length === 0 ? (
                <S.ErrorMsg>그룹명을 입력해주세요.</S.ErrorMsg>
              ) : (
                <div>10자 이내</div>
              )}
            </S.InputBox>
            <Button
              title="다음으로"
              onClick={() => onMoveStep(2)}
              disabled={groupName.trim().length === 0}
            />
          </>
        )}
        {step === 2 && (
          <>
            <S.MTitle>
              그룹의 메시지를 <br />
              설정해 주세요
            </S.MTitle>
            <S.STitle>그룹 메시지는 누구나 언제든 수정할 수 있어요</S.STitle>
            <S.InputBox>
              <Input
                placeholder="메시지 설정"
                value={motto}
                onChange={(e) => onChangeMotto(e.target.value)}
                maxLength={20}
              />
              <div>20자 이내</div>
            </S.InputBox>
            <S.BtnBox>
              <Button title="뒤로가기" onClick={() => onMoveStep(1)} />
              <Button title="건너뛰기" onClick={() => onMoveStep(3)} />
            </S.BtnBox>
          </>
        )}
      </S.InputContainer>
    </S.NavyBox>
  );
}
