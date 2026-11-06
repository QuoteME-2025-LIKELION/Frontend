import axios from "axios";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@/components/Button/Button";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import DefaultProfileImage from "@/components/DefaultProfileImage/DefaultProfileImage";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import PageTitle from "@/components/PageTitle/PageTitle";
import Spinner from "@/components/Spinner/Spinner";
import ToastModal from "@/components/ToastModal/ToastModal";
import {
  useSettingsProfileQuery,
  useUpdateSettingsProfileMutation,
} from "@/hooks/useProfileQueries";
import { codePointInputProps, countCodePoints } from "@/utils/codePoint";
import { PROFILE_IMAGE_ACCEPT, validateProfileImage } from "@/utils/profileImage";

import * as S from "./ProfileCenter.styles";

const NICKNAME_MAX_LENGTH = 10;
const INTRO_MAX_LENGTH = 20;

export default function ProfileCenter() {
  const fieldId = useId();
  const nicknameLabelId = `${fieldId}-nickname-label`;
  const nicknameMetaId = `${fieldId}-nickname-meta`;
  const introLabelId = `${fieldId}-intro-label`;
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from || "default";
  const showXBtn = fromPath === "/home";
  const showBackBtn = !showXBtn;

  const { data } = useSettingsProfileQuery();
  const updateSettingsProfile = useUpdateSettingsProfileMutation();
  const savingRef = useRef(false);
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

  const [toastMessage, setToastMessage] = useState("");
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
  const isNicknameTooLong = countCodePoints(currentNickname) > NICKNAME_MAX_LENGTH;
  const isIntroTooLong = countCodePoints(currentIntro) > INTRO_MAX_LENGTH;
  const hasChanges =
    trimmedNickname !== (profile?.nickname ?? "") ||
    currentIntro !== (profile?.intro ?? "") ||
    selectedFile !== null;
  const canSave =
    Boolean(profile) &&
    hasChanges &&
    !isNicknameEmpty &&
    !isNicknameTooLong &&
    !isIntroTooLong &&
    !updateSettingsProfile.isPending;

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleClickUpload = () => {
    if (!isEditing || savingRef.current) return;

    fileRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || savingRef.current) return;

    const error = validateProfileImage(file);
    if (error) {
      setToastMessage(error);
      return;
    }
    setToastMessage("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!canSave || savingRef.current) return;
    savingRef.current = true;
    try {
      await updateSettingsProfile.mutateAsync({
        nickname: trimmedNickname,
        introduction: currentIntro,
        image: selectedFile,
      });
      setToastMessage("변경사항이 저장되었습니다.");
      setIsEditing(false);
      setSelectedFile(null);
      setNickname(undefined);
      setIntro(undefined);
      setPreview(undefined);
    } catch (e) {
      console.error("프로필 저장 실패", e);
      setToastMessage(
        axios.isAxiosError(e) && e.response?.status === 413
          ? "이미지는 5MB 이하로 선택해 주세요."
          : selectedFile
            ? "이미지 업로드에 실패했습니다."
            : "프로필 저장에 실패했습니다."
      );
    } finally {
      savingRef.current = false;
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleRequestExit = (path: string) => {
    if (savingRef.current) return;
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
      <S.Container aria-busy={updateSettingsProfile.isPending}>
        {updateSettingsProfile.isPending && <Spinner />}
        {toastMessage && (
          <ToastModal
            text={toastMessage}
            isVisible={Boolean(toastMessage)}
            onClose={() => setToastMessage("")}
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
            disabled={!isEditing || updateSettingsProfile.isPending}
            onClick={handleClickUpload}
            aria-label={isEditing ? "프로필 이미지 변경" : "프로필 이미지"}
            style={{
              backgroundImage: currentPreview
                ? `url(${currentPreview})`
                : "none",
            }}
          >
            {!currentPreview && <DefaultProfileImage />}
          </S.ImgPreview>
          <input
            disabled={updateSettingsProfile.isPending}
            type="file"
            aria-label="프로필 이미지 파일 선택"
            accept={PROFILE_IMAGE_ACCEPT}
            ref={fileRef}
            onChange={handleChangeFile}
            style={{ display: "none" }}
          />
          <S.ImgInput
            type="button"
            onClick={handleClickUpload}
            disabled={updateSettingsProfile.isPending}
            $hidden={!isEditing}
            aria-hidden={!isEditing}
            tabIndex={isEditing ? 0 : -1}
          >
            이미지 바꾸기
          </S.ImgInput>
        </S.ProfileWrapper>
        <S.InputBox>
          <S.TextName id={nicknameLabelId}>닉네임</S.TextName>
          {isEditing ? (
            <>
              <S.Field $error={isNicknameEmpty}>
                <Input
                  aria-labelledby={nicknameLabelId}
                  aria-describedby={nicknameMetaId}
                  aria-invalid={isNicknameEmpty || isNicknameTooLong}
                  disabled={updateSettingsProfile.isPending}
                  value={currentNickname}
                  {...codePointInputProps(setNickname, NICKNAME_MAX_LENGTH)}
                  placeholder="닉네임"
                  type="text"
                  name="nickname"
                  required
                />
              </S.Field>
            </>
          ) : (
            <S.InfoBox>{currentNickname}</S.InfoBox>
          )}
          <S.FieldMeta
            id={nicknameMetaId}
            $error={isNicknameEmpty}
            $hidden={!isEditing}
          >
            {isNicknameEmpty && <span>닉네임을 비워둘 수 없어요.</span>}
            <span>
              {countCodePoints(currentNickname)}자/{NICKNAME_MAX_LENGTH}자
            </span>
          </S.FieldMeta>
          <S.TextName id={introLabelId}>자기소개</S.TextName>
          {isEditing ? (
            <S.Field>
              <Input
                aria-labelledby={introLabelId}
                aria-invalid={isIntroTooLong}
                disabled={updateSettingsProfile.isPending}
                value={currentIntro}
                {...codePointInputProps(setIntro, INTRO_MAX_LENGTH)}
                placeholder="자기소개"
                type="text"
                name="intro"
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
