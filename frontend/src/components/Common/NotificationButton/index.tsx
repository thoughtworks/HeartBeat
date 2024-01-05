import { AlertIconImage, AlertTitleWrapper, AlertWrapper } from '@src/components/Common/NotificationButton/style';
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';
import Info from '@src/assets/Info.svg';

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

  return (
    <>
      {notificationProps?.open && (
        <AlertWrapper onClose={handleNotificationClose} icon={<AlertIconImage src={Info} />}>
          <AlertTitleWrapper>{notificationProps?.title}</AlertTitleWrapper>
          {notificationProps?.message}
        </AlertWrapper>
      )}
    </>
  );
};
