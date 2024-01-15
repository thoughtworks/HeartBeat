import { ConfigStepWrapper } from './style';
import { MetricsTypeCheckbox } from '@src/containers/ConfigStep/MetricsTypeCheckbox';
import BasicInfo from '@src/containers/ConfigStep/BasicInfo';
import { useLayoutEffect } from 'react';
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';

const ConfigStep = ({ resetProps }: useNotificationLayoutEffectInterface) => {
  useLayoutEffect(() => {
    resetProps();
  }, [resetProps]);

  return (
    <ConfigStepWrapper>
      <BasicInfo></BasicInfo>
      <MetricsTypeCheckbox />
    </ConfigStepWrapper>
  );
};

export default ConfigStep;
