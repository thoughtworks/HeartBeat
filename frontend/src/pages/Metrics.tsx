import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect';
import { ContextProvider } from '@src/hooks/useMetricsStepValidationCheckContext';
import { Notification } from '@src/components/Common/NotificationButton';
import MetricsStepper from '@src/containers/MetricsStepper';
import Header from '@src/layouts/Header';
import React from 'react';

const Metrics = () => {
  const props = useNotificationLayoutEffect();

  return (
    <>
      <Header />
      <ContextProvider>
        <Notification {...props} />
        <MetricsStepper {...props} />
      </ContextProvider>
    </>
  );
};

export default Metrics;
