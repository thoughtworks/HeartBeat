import { MetricsTypeCheckbox } from '@src/containers/ConfigStep/MetricsTypeCheckbox';
import { closeAllNotifications } from '@src/context/notification/NotificationSlice';
import BasicInfo from '@src/containers/ConfigStep/BasicInfo';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { ConfigStepWrapper } from './style';
import { useLayoutEffect } from 'react';

const ConfigStep = () => {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(closeAllNotifications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfigStepWrapper>
      <BasicInfo />
      <MetricsTypeCheckbox />
    </ConfigStepWrapper>
  );
};

export default ConfigStep;
