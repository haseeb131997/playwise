import { useSelector } from "react-redux";
import {
  selectUserToken,
  selectLoggedIN,
  selectUserId,
  selectNewNotification,
  selectPushNotifications,
  selectUserInfo,
  selectDarkMode,
} from "../features/userSlice";

export function UserToken() {
  return useSelector(selectUserToken);
}
export function LoggedIn() {
  return useSelector(selectLoggedIN);
}
export function UserId() {
  return useSelector(selectUserId);
}
export function NewNotification() {
  return useSelector(selectNewNotification);
}
export function PushNotificationsAllowed() {
  return useSelector(selectPushNotifications);
}
export function UserInfo() {
  return useSelector(selectUserInfo);
}
export function DarkModeStatus() {
  return useSelector(selectDarkMode);
}
