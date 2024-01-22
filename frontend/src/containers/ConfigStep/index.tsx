import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';
import { MetricsTypeCheckbox } from '@src/containers/ConfigStep/MetricsTypeCheckbox';
import BasicInfo from '@src/containers/ConfigStep/BasicInfo';
import { ConfigStepWrapper } from './style';
import { useLayoutEffect } from 'react';

const ConfigStep = ({ closeAllNotifications }: useNotificationLayoutEffectInterface) => {
  useLayoutEffect(() => {
    closeAllNotifications();
  }, []);

  return (
    <ConfigStepWrapper>
      <BasicInfo></BasicInfo>
      <MetricsTypeCheckbox />
    </ConfigStepWrapper>
  );
};

export default ConfigStep;
