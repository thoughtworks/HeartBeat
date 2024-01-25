import { PipelineSetting } from '@src/context/interface';
import React, { createContext, useContext } from 'react';

interface ProviderContextType {
  getDuplicatedPipeLineIds: (pipelineSettings: PipelineSetting[]) => number[];
}

interface ContextProviderProps {
  children: React.ReactNode;
}

export const ValidationContext = createContext<ProviderContextType>({
  getDuplicatedPipeLineIds: () => [],
});

const getDuplicatedPipeLineIds = (pipelineSettings: PipelineSetting[]) => {
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
