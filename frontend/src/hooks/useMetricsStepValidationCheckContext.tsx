import { IPipelineConfig } from '@src/context/Metrics/metricsSlice';
import React, { createContext, useContext } from 'react';

interface ProviderContextType {
  getDuplicatedPipeLineIds: (pipelineSettings: IPipelineConfig[]) => number[];
}

interface ContextProviderProps {
  children: React.ReactNode;
}

export const ValidationContext = createContext<ProviderContextType>({
  getDuplicatedPipeLineIds: () => [],
});

const getDuplicatedPipeLineIds = (pipelineSettings: IPipelineConfig[]) => {
  const errors: { [key: string]: number[] } = {};
  pipelineSettings.forEach(({ id, organization, pipelineName, step }) => {
    if (organization && pipelineName && step) {
      const errorString = `${organization}${pipelineName}${step}`;
      if (errors[errorString]) errors[errorString].push(id);
      else errors[errorString] = [id];
    }
  });
  return Object.values(errors)
    .filter((ids) => ids.length > 1)
    .flat();
};

export const ContextProvider = ({ children }: ContextProviderProps) => {
  return (
    <ValidationContext.Provider
      value={{
        getDuplicatedPipeLineIds,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
};

export const useMetricsStepValidationCheckContext = () => useContext(ValidationContext);
