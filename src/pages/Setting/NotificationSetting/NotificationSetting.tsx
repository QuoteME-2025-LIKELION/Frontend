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

type Meridiem = "오전" | "오후";

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

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, index) => index * 5);

export default function NotificationSetting() {
  const navigate = useNavigate();
  const { data: settings = DEFAULT_SETTINGS } = useNotificationSettingsQuery();
  const { mutateAsync: updateSettings, isPending } =
    useUpdateNotificationSettingsMutation();
  const [draftSettings, setDraftSettings] =
    useState<NotificationSettingsType>(DEFAULT_SETTINGS);
  const [toastMessage, setToastMessage] = useState("");
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState({
    meridiem: "오후" as Meridiem,
    hour: 9,
    minute: 0,
  });

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

  const handleReminderRowClick = () => {
    if (!isAllEnabled) {
      setToastMessage("전체 알림이 꺼져있어요.");
      return;
    }

    if (!draftSettings.quoteReminderEnabled) {
      void saveSettings({
        ...draftSettings,
        quoteReminderEnabled: true,
      });
    }

    setIsTimePickerOpen(true);
  };

  const reminderTimeText = `${reminderTime.meridiem} ${reminderTime.hour}:${
    reminderTime.minute === 0 ? "00" : reminderTime.minute
  }`;
  const centerSelectedOption = (element: HTMLButtonElement) => {
    element.scrollIntoView({
      block: "center",
      behavior: "smooth",
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
        {isTimePickerOpen && (
          <S.PickerOverlay onClick={() => setIsTimePickerOpen(false)}>
            <S.PickerSheet onClick={(event) => event.stopPropagation()}>
              <S.PickerGrid>
                <S.PickerColumn>
                  {(["오전", "오후"] as Meridiem[]).map((meridiem) => (
                    <S.PickerOption
                      key={meridiem}
                      type="button"
                      $selected={reminderTime.meridiem === meridiem}
                      onClick={(event) => {
                        setReminderTime((prev) => ({ ...prev, meridiem }));
                        centerSelectedOption(event.currentTarget);
                      }}
                    >
                      {meridiem}
                    </S.PickerOption>
                  ))}
                </S.PickerColumn>
                <S.PickerColumn>
                  {HOUR_OPTIONS.map((hour) => (
                    <S.PickerOption
                      key={hour}
                      type="button"
                      $selected={reminderTime.hour === hour}
                      onClick={(event) => {
                        setReminderTime((prev) => ({ ...prev, hour }));
                        centerSelectedOption(event.currentTarget);
                      }}
                    >
                      {hour}시
                    </S.PickerOption>
                  ))}
                </S.PickerColumn>
                <S.PickerColumn>
                  {MINUTE_OPTIONS.map((minute) => (
                    <S.PickerOption
                      key={minute}
                      type="button"
                      $selected={reminderTime.minute === minute}
                      onClick={(event) => {
                        setReminderTime((prev) => ({ ...prev, minute }));
                        centerSelectedOption(event.currentTarget);
                      }}
                    >
                      {minute.toString().padStart(2, "0")}분
                    </S.PickerOption>
                  ))}
                </S.PickerColumn>
              </S.PickerGrid>
              <S.PickerDoneButton
                type="button"
                onClick={() => {
                  setIsTimePickerOpen(false);
                  setToastMessage("알림 시간이 설정되었습니다.");
                }}
              >
                완료
              </S.PickerDoneButton>
            </S.PickerSheet>
          </S.PickerOverlay>
        )}
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="알림설정"
          backgroundColor="secondary"
          onClickBackBtn={() => navigate("/home")}
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
              item.key === "quoteReminderEnabled" && isActive
                ? reminderTimeText
                : isActive
                  ? "On"
                  : "Off";

            return (
              <S.Row
                key={item.key}
                type="button"
                $disabled={disabled}
                onClick={() =>
                  item.key === "quoteReminderEnabled"
                    ? handleReminderRowClick()
                    : handleToggleItem(item.key)
                }
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
