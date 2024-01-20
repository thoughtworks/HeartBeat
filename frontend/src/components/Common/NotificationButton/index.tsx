import { AlertTitleWrapper, AlertWrapper } from '@src/components/Common/NotificationButton/style';
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { AlertColor, SvgIcon } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { theme } from '@src/theme';
import React from 'react';

const getStyles = (type: AlertColor | undefined) => {
  switch (type) {
    case 'error':
      return {
        icon: CancelIcon,
        iconColor: theme.main.alert.error.iconColor,
        backgroundColor: theme.main.alert.error.backgroundColor,
        borderColor: theme.main.alert.error.borderColor,
      };
    case 'success':
      return {
        icon: CheckCircleIcon,
        iconColor: theme.main.alert.success.iconColor,
        backgroundColor: theme.main.alert.success.backgroundColor,
        borderColor: theme.main.alert.success.borderColor,
      };
    case 'warning':
      return {
        icon: InfoIcon,
        iconColor: theme.main.alert.warning.iconColor,
        backgroundColor: theme.main.alert.warning.backgroundColor,
        borderColor: theme.main.alert.warning.borderColor,
      };
    case 'info':
    default:
      return {
        icon: InfoIcon,
        iconColor: theme.main.alert.info.iconColor,
        backgroundColor: theme.main.alert.info.backgroundColor,
        borderColor: theme.main.alert.info.borderColor,
      };
  }
};

export const Notification = ({ notificationProps, updateProps }: useNotificationLayoutEffectInterface) => {
  const handleNotificationClose = () => {
    updateProps({
      title: notificationProps.title,
      message: notificationProps.message,
      open: false,
      closeAutomatically: false,
    });
  };

  const styles = getStyles(notificationProps.type);

  return (
    <>
      {notificationProps.open && (
        <AlertWrapper
          onClose={handleNotificationClose}
          icon={<SvgIcon component={styles.icon} inheritViewBox />}
          backgroundcolor={styles.backgroundColor}
          iconcolor={styles.iconColor}
          bordercolor={styles.borderColor}
        >
          <AlertTitleWrapper>{notificationProps.title}</AlertTitleWrapper>
          {notificationProps.message}
        </AlertWrapper>
      )}
    </>
  );
};
