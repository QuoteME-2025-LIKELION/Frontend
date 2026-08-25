import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { NotificationSettings as NotificationSettingsType } from "@/api/notificationApi";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import {
  useNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/hooks/useNotificationsQuery";

import * as S from "./NotificationSetting.styles";

type SettingKey =
  | "quoteReminderEnabled"
  | "groupEnabled"
  | "tagEnabled"
  | "friendEnabled"
  | "marketingEnabled";

const DEFAULT_SETTINGS: NotificationSettingsType = {
  groupEnabled: true,
  friendEnabled: true,
  tagEnabled: true,
  pokeEnabled: true,
  likeEnabled: true,
  quoteReminderEnabled: true,
  marketingEnabled: false,
};

const SETTING_ITEMS: Array<{
  key: SettingKey;
  title: string;
  description?: string;
  valueText?: string;
}> = [
  {
    key: "quoteReminderEnabled",
    title: "오늘의 명언 남기기 알림",
    description: "명언을 작성하지 않았을 때 알림을 보내요",
    valueText: "오후 9:00",
  },
  {
    key: "groupEnabled",
    title: "그룹 알림 받기",
    description: "그룹 참여 요청, 그룹 메시지가 변경되었을 때 알림을 보내요",
  },
  {
    key: "tagEnabled",
    title: "태그 알림 받기",
    description: "누군가 나를 태그했을 때, 태그요청을 받았을 때 알림을 보내요",
  },
  {
    key: "friendEnabled",
    title: "친구 알림 받기",
    description: "친구가 명언을 올렸을 때 알림을 보내요",
  },
  {
    key: "marketingEnabled",
    title: "마케팅 정보 수신",
  },
];

export default function NotificationSetting() {
  const navigate = useNavigate();
  const { data: settings = DEFAULT_SETTINGS } = useNotificationSettingsQuery();
  const { mutateAsync: updateSettings, isPending } =
    useUpdateNotificationSettingsMutation();
  const [draftSettings, setDraftSettings] =
    useState<NotificationSettingsType>(DEFAULT_SETTINGS);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  const isAllEnabled = useMemo(
    () => SETTING_ITEMS.some((item) => draftSettings[item.key]),
    [draftSettings]
  );

  const saveSettings = async (
    nextSettings: NotificationSettingsType,
    successMessage = "알림 설정이 저장되었습니다."
  ) => {
    const previousSettings = draftSettings;
    setDraftSettings(nextSettings);

    try {
      await updateSettings(nextSettings);
      setToastMessage(successMessage);
    } catch (err) {
      setDraftSettings(previousSettings);
      console.error("알림 설정 저장 실패:", err);
      setToastMessage("알림 설정 저장에 실패했습니다.");
    }
  };

  const handleToggleAll = () => {
    if (isPending) {
      return;
    }

    const nextValue = !isAllEnabled;
    void saveSettings(
      {
        groupEnabled: nextValue,
        friendEnabled: nextValue,
        tagEnabled: nextValue,
        pokeEnabled: nextValue,
        likeEnabled: nextValue,
        quoteReminderEnabled: nextValue,
        marketingEnabled: nextValue,
      },
      nextValue ? "전체 알림이 켜졌습니다." : "전체 알림이 꺼졌어요."
    );
  };

  const handleToggleItem = (key: SettingKey) => {
    if (isPending) {
      return;
    }

    if (!isAllEnabled) {
      setToastMessage("전체 알림이 꺼져있어요.");
      return;
    }

    void saveSettings({
      ...draftSettings,
      [key]: !draftSettings[key],
    });
  };

  return (
    <>
      <PageTitle title="알림설정" />
      <S.Container>
        {toastMessage && (
          <ToastModal
            isVisible={Boolean(toastMessage)}
            onClose={() => setToastMessage("")}
            text={toastMessage}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="알림설정"
          backgroundColor="secondary"
          onClickBackBtn={() => navigate("/setting-page")}
        />
        <S.List>
          <S.MasterRow type="button" onClick={handleToggleAll}>
            <S.Title>전체 알림 허용</S.Title>
            <S.Value $active={isAllEnabled}>
              {isAllEnabled ? "On" : "Off"}
            </S.Value>
          </S.MasterRow>
          {SETTING_ITEMS.map((item) => {
            const disabled = !isAllEnabled;
            const isActive = draftSettings[item.key];
            const valueText =
              item.valueText && isActive
                ? item.valueText
                : isActive
                  ? "On"
                  : "Off";

            return (
              <S.Row
                key={item.key}
                type="button"
                $disabled={disabled}
                onClick={() => handleToggleItem(item.key)}
              >
                <S.TextBox>
                  <S.Title>{item.title}</S.Title>
                  {item.description && (
                    <S.Description>{item.description}</S.Description>
                  )}
                </S.TextBox>
                <S.Value $active={isActive} $disabled={disabled}>
                  {valueText}
                </S.Value>
              </S.Row>
            );
          })}
        </S.List>
      </S.Container>
    </>
  );
}
