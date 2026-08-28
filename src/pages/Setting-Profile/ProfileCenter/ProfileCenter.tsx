import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@/components/Button/Button";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import {
  useSettingsProfileQuery,
  useUpdateSettingsProfileMutation,
} from "@/hooks/useProfileQueries";

import * as S from "./ProfileCenter.styles";

export default function ProfileCenter() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from || "default";
  const showXBtn = fromPath === "/home";
  const showBackBtn = !showXBtn;

  const { data } = useSettingsProfileQuery();
  const updateSettingsProfile = useUpdateSettingsProfileMutation();
  const fileRef = useRef<HTMLInputElement>(null);

  const profile = useMemo(
    () =>
      data
        ? {
            nickname: data.nickname,
            intro: data.introduction ?? "",
            imageUrl: data.profileImageUrl ?? data.profileImage ?? null,
          }
        : null,
    [data]
  );

  const [showToast, setShowToast] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>();
  const [intro, setIntro] = useState<string>();
  const [preview, setPreview] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const currentNickname = nickname ?? profile?.nickname ?? "";
  const currentIntro = intro ?? profile?.intro ?? "";
  const currentPreview = preview ?? profile?.imageUrl ?? null;
  const trimmedNickname = currentNickname.trim();
  const isNicknameEmpty = Boolean(profile) && trimmedNickname.length === 0;
  const hasChanges =
    trimmedNickname !== (profile?.nickname ?? "") ||
    currentIntro !== (profile?.intro ?? "") ||
    selectedFile !== null;
  const canSave =
    Boolean(profile) &&
    hasChanges &&
    !isNicknameEmpty &&
    !updateSettingsProfile.isPending;

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleClickUpload = () => {
    if (!isEditing) return;

    fileRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleSave = async () => {
    try {
      await updateSettingsProfile.mutateAsync({
        nickname: trimmedNickname,
        introduction: currentIntro,
        image: selectedFile,
      });
      setShowToast(true);
      setIsEditing(false);
      setSelectedFile(null);
      setNickname(undefined);
      setIntro(undefined);
      setPreview(undefined);
    } catch (e) {
      console.error("프로필 저장 실패", e);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleRequestExit = (path: string) => {
    if (isEditing && hasChanges) {
      setPendingPath(path);
      setShowExitModal(true);
      return;
    }

    navigate(path);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    setSelectedFile(null);
    setNickname(undefined);
    setIntro(undefined);
    setPreview(undefined);

    if (pendingPath) {
      navigate(pendingPath);
      return;
    }

    setIsEditing(false);
  };

  return (
    <>
      <PageTitle title="프로필 관리" />
      <S.Container>
        {showToast && (
          <ToastModal
            text="변경사항이 저장되었습니다."
            isVisible={showToast}
            onClose={() => setShowToast(false)}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        {showExitModal && (
          <ConfirmModal
            question=""
            lines={["저장하지 않고", "나가시겠어요?"]}
            description="변경된 정보는 저장되지 않아요."
            cancelText="돌아가기"
            confirmText="나가기"
            confirmColor="danger"
            variant="card"
            onClose={() => setShowExitModal(false)}
            onConfirm={handleConfirmExit}
          />
        )}
        <Header
          showBackBtn={showBackBtn}
          showXBtn={showXBtn}
          title="프로필 관리"
          backgroundColor="secondary"
          onClickXBtn={() => handleRequestExit("/home")}
          onClickBackBtn={() => handleRequestExit("/home")}
        />
        <S.ProfileWrapper>
          <S.ImgPreview
            type="button"
            disabled={!isEditing}
            onClick={handleClickUpload}
            aria-label="프로필 이미지"
            style={{
              backgroundImage: currentPreview
                ? `url(${currentPreview})`
                : "none",
            }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleChangeFile}
            style={{ display: "none" }}
          />
          <S.ImgInput
            type="button"
            onClick={handleClickUpload}
            $hidden={!isEditing}
            aria-hidden={!isEditing}
            tabIndex={isEditing ? 0 : -1}
          >
            이미지 바꾸기
          </S.ImgInput>
        </S.ProfileWrapper>
        <S.InputBox>
          <S.TextName>닉네임</S.TextName>
          {isEditing ? (
            <>
              <S.Field $error={isNicknameEmpty}>
                <Input
                  value={currentNickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임"
                  type="text"
                  name="nickname"
                  maxLength={20}
                  required
                />
              </S.Field>
            </>
          ) : (
            <S.InfoBox>{currentNickname}</S.InfoBox>
          )}
          <S.FieldMeta $error={isNicknameEmpty} $hidden={!isEditing}>
            {isNicknameEmpty && <span>닉네임을 비워둘 수 없어요.</span>}
            <span>{currentNickname.length}자/20자</span>
          </S.FieldMeta>
          <S.TextName>자기소개</S.TextName>
          {isEditing ? (
            <S.Field>
              <Input
                value={currentIntro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="자기소개"
                type="text"
                name="intro"
                maxLength={30}
                required
              />
            </S.Field>
          ) : (
            <S.InfoBox>{currentIntro}</S.InfoBox>
          )}
        </S.InputBox>
        <S.BtnBox>
          {isEditing ? (
            <Button title="저장하기" onClick={handleSave} disabled={!canSave} />
          ) : (
            <Button title="편집하기" onClick={handleStartEdit} />
          )}
        </S.BtnBox>
      </S.Container>
    </>
  );
}
