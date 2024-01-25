import {
  AlertTitleWrapper,
  AlertWrapper,
  NotificationContainer,
} from '@src/components/Common/NotificationButton/style';
import { closeNotification, selectNotifications } from '@src/context/notification/NotificationSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { NOTIFICATION_TITLE } from '@src/constants/resources';
import CancelIcon from '@mui/icons-material/Cancel';
import { AlertColor, SvgIcon } from '@mui/material';
import { DURATION } from '@src/constants/commons';
import InfoIcon from '@mui/icons-material/Info';
import { theme } from '@src/theme';
import React from 'react';

const getStyles = (type: AlertColor | undefined) => {
  switch (type) {
    case 'error':
      return {
        title: NOTIFICATION_TITLE.SOMETHING_WENT_WRONG,
        icon: CancelIcon,
        iconColor: theme.main.alert.error.iconColor,
        backgroundColor: theme.main.alert.error.backgroundColor,
        borderColor: theme.main.alert.error.borderColor,
      };
    case 'success':
      return {
        title: NOTIFICATION_TITLE.SUCCESSFULLY_COMPLETED,
        icon: CheckCircleIcon,
        iconColor: theme.main.alert.success.iconColor,
        backgroundColor: theme.main.alert.success.backgroundColor,
        borderColor: theme.main.alert.success.borderColor,
      };
    case 'warning':
      return {
        title: NOTIFICATION_TITLE.PLEASE_NOTE_THAT,
        icon: InfoIcon,
        iconColor: theme.main.alert.warning.iconColor,
        backgroundColor: theme.main.alert.warning.backgroundColor,
        borderColor: theme.main.alert.warning.borderColor,
      };
    case 'info':
    default:
      return {
        title: NOTIFICATION_TITLE.HELP_INFORMATION,
        icon: InfoIcon,
        iconColor: theme.main.alert.info.iconColor,
        backgroundColor: theme.main.alert.info.backgroundColor,
        borderColor: theme.main.alert.info.borderColor,
      };
  }
};

export const Notification = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  return (
    <NotificationContainer>
      {notifications.map((notification) => {
        const styles = getStyles(notification.type);
        window.setTimeout(() => {
          dispatch(closeNotification(notification.id));
        }, DURATION.NOTIFICATION_TIME);
        return (
          <AlertWrapper
            key={notification.id}
            onClose={() => {
              dispatch(closeNotification(notification.id));
            }}
            icon={<SvgIcon component={styles.icon} inheritViewBox />}
            backgroundcolor={styles.backgroundColor}
            iconcolor={styles.iconColor}
            bordercolor={styles.borderColor}
          >
            <AlertTitleWrapper>{notification.title || styles.title}</AlertTitleWrapper>
            {notification.message}
          </AlertWrapper>
        );
      })}
    </NotificationContainer>
  );
};
