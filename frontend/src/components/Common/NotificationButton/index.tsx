import { AlertTitleWrapper, AlertWrapper } from '@src/components/Common/NotificationButton/style';
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';
import { AlertColor, SvgIcon } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const getStyles = (type: AlertColor | undefined) => {
  switch (type) {
    case 'error':
      return {
        icon: CancelIcon,
        iconColor: '#D74257',
        backgroundColor: '#FFE7EA',
      };
    case 'success':
      return {
        icon: CheckCircleIcon,
        iconColor: '#5E9E66',
        backgroundColor: '#EFFFF1',
      };
    case 'warning':
      return {
        icon: InfoIcon,
        iconColor: '#D78D20',
        backgroundColor: '#FFF4E3',
      };
    case 'info':
    default:
      return {
        icon: InfoIcon,
        iconColor: '#4050B5',
        backgroundColor: '#E9ECFF',
      };
  }
};

export const Notification = ({ notificationProps, updateProps }: useNotificationLayoutEffectInterface) => {
  const handleNotificationClose = () => {
    if (notificationProps === undefined) return;
    updateProps?.({
      title: notificationProps.title,
      message: notificationProps.message,
      open: false,
      closeAutomatically: false,
    });
  };

  const styles = getStyles(notificationProps?.type);

  return (
    <>
      {notificationProps?.open && (
        <AlertWrapper
          onClose={handleNotificationClose}
          icon={<SvgIcon component={styles.icon} inheritViewBox />}
          backgroundcolor={styles.backgroundColor}
          iconcolor={styles.iconColor}
        >
          <AlertTitleWrapper>{notificationProps?.title}</AlertTitleWrapper>
          {notificationProps?.message}
        </AlertWrapper>
      )}
    </>
  );
};
