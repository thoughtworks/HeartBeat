import { DURATION } from '@src/constants/commons';
import { AlertColor } from '@mui/material';
import { uniqueId } from 'lodash';
import { useState } from 'react';

export interface Notification {
  id: string;
  title?: string;
  message: string;
  type?: AlertColor;
}

export interface useNotificationLayoutEffectInterface {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  closeNotification: (id: string) => void;
  closeAllNotifications: () => void;
}

export const useNotificationLayoutEffect = (): useNotificationLayoutEffectInterface => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = { id: uniqueId(), ...notification };
    setNotifications((preNotifications) => [...preNotifications, newNotification]);
    window.setTimeout(() => {
      closeNotification(newNotification.id);
    }, DURATION.NOTIFICATION_TIME);
  };

  const closeNotification = (id: string) => {
    setNotifications((preNotifications) => preNotifications.filter((notification) => notification.id !== id));
  };

  const closeAllNotifications = () => {
    setNotifications([]);
  };

  return { notifications, addNotification, closeNotification, closeAllNotifications };
};
