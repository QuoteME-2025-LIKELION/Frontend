import { appHandlers } from "./handlers/app";
import { archivesHandlers } from "./handlers/archives";
import { authHandlers } from "./handlers/auth";
import { friendsHandlers } from "./handlers/friends";
import { groupsHandlers } from "./handlers/groups";
import { noticesHandlers } from "./handlers/notices";
import { notificationsHandlers } from "./handlers/notifications";
import { pokesHandlers } from "./handlers/pokes";
import { profileHandlers } from "./handlers/profile";
import { quotesHandlers } from "./handlers/quotes";
import { settingsHandlers } from "./handlers/settings";

export const handlers = [
  ...appHandlers,
  ...authHandlers,
  ...profileHandlers,
  ...friendsHandlers,
  ...groupsHandlers,
  ...quotesHandlers,
  ...archivesHandlers,
  ...notificationsHandlers,
  ...noticesHandlers,
  ...settingsHandlers,
  ...pokesHandlers,
];
