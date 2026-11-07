import { http, HttpResponse } from "msw";

import { mockState } from "../state";

export const notificationsHandlers = [
  // ==========================================
  // 9. 알림 (Notifications)
  // ==========================================
  http.get("/api/notifications", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    return HttpResponse.json(
      category
        ? mockState.mockNotifications.filter(
            (notification) =>
              notification.type === category ||
              notification.category === category
          )
        : mockState.mockNotifications
    );
  }),
  http.get("/api/notifications/unread-count", () => {
    return HttpResponse.json({
      count: mockState.mockNotifications.filter(
        (notification) => !notification.isRead
      ).length,
    });
  }),
  http.patch("/api/notifications/:id/read", ({ params }) => {
    const notificationId = Number(params.id);
    const targetNotification = mockState.mockNotifications.find(
      (notification) => notification.id === notificationId
    );
    if (!targetNotification) {
      return new HttpResponse(null, { status: 404 });
    }
    mockState.mockNotifications = mockState.mockNotifications.map(
      (notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
    );
    return new HttpResponse(null, { status: 200 });
  }),
  http.get("/api/notifications/settings", () => {
    return HttpResponse.json(mockState.mockNotificationSettings);
  }),
  http.put("/api/notifications/settings", async ({ request }) => {
    const body = (await request.json()) as Partial<
      typeof mockState.mockNotificationSettings
    >;
    mockState.mockNotificationSettings = {
      ...mockState.mockNotificationSettings,
      ...body,
    };
    return HttpResponse.json(mockState.mockNotificationSettings);
  }),
];
