import { ContextProvider } from '@src/hooks/useMetricsStepValidationCheckContext';
import { Notification } from '@src/components/Common/NotificationButton';
import MetricsStepper from '@src/containers/MetricsStepper';
import Header from '@src/layouts/Header';
import React from 'react';

const Metrics = () => {
  return (
    <>
      <Header />
      <ContextProvider>
        <Notification />
        <MetricsStepper />
      </ContextProvider>
    </>
  );
};

export default Metrics;
