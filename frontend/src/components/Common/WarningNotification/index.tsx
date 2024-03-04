import { DURATION } from '@src/constants/commons';
import { StyledAlert, WarningBar } from './style';
import { useEffect, useState } from 'react';

export const WarningNotification = (props: { message: string }) => {
  const { message } = props;
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, DURATION.ERROR_MESSAGE_TIME);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <WarningBar open={open}>
      <StyledAlert severity='warning'>{message}</StyledAlert>
    </WarningBar>
  );
};
