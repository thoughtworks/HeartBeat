import { useCallback, useEffect, useState } from 'react';
import { DURATION } from '@src/constants/commons';
import { AlertColor } from '@mui/material';

export interface NotificationTipProps {
  title: string;
  message: string;
  open: boolean;
  closeAutomatically: boolean;
  durationTimeout?: number;
  type?: AlertColor;
}

export interface useNotificationLayoutEffectInterface {
  notificationProps: NotificationTipProps;
  resetProps: () => void;
  updateProps: (notificationProps: NotificationTipProps) => void;
}

export const useNotificationLayoutEffect = (): useNotificationLayoutEffectInterface => {
  const [notificationProps, setNotificationProps] = useState<NotificationTipProps>({
    open: false,
    title: '',
    message: '',
    closeAutomatically: false,
    durationTimeout: DURATION.NOTIFICATION_TIME,
  });

  const resetProps = useCallback(() => {
    setNotificationProps(() => ({
      open: false,
      title: '',
      message: '',
      closeAutomatically: false,
      durationTimeout: DURATION.NOTIFICATION_TIME,
    }));
  }, []);

  const updateProps = useCallback((notificationProps: NotificationTipProps) => {
    setNotificationProps(notificationProps);
  }, []);

  const closeAutomatically = () => {
    const durationTimeout = notificationProps.durationTimeout
      ? notificationProps.durationTimeout
      : DURATION.NOTIFICATION_TIME;
    window.setTimeout(() => {
      resetProps();
    }, durationTimeout);
  };

  useEffect(() => {
    notificationProps.closeAutomatically && closeAutomatically();
  }, [notificationProps]);

  return { notificationProps, resetProps, updateProps };
};
