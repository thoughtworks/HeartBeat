import {
  resetMetricData,
  setCycleTimeSettingsType,
  updateMetricsImportedData,
} from '@src/context/Metrics/metricsSlice';
import { resetImportedData, updateBasicConfigState, updateProjectCreatedState } from '@src/context/config/configSlice';
import { GuideButton, HomeGuideContainer, ImportFileWrapper, StyledStack } from '@src/components/HomeGuide/style';
import { convertToNewFileConfig, NewFileConfig, OldFileConfig } from '@src/constants/fileConfig';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import { CYCLE_TIME_SETTINGS_TYPES, MESSAGE } from '@src/constants/resources';
import { resetStep } from '@src/context/stepper/StepperSlice';
import { resetFormMeta } from '@src/context/meta/metaSlice';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '@src/constants/router';
import { useRef, useState } from 'react';

export const HomeGuide = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [validConfig, setValidConfig] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidImportedConfig = (config: NewFileConfig) => {
    try {
      const { projectName, metrics, dateRange } = config;
      return projectName || dateRange.length > 0 || metrics.length > 0;
    } catch {
      return false;
    }
  };

  const getCycleTimeSettingsType = (typeInConfig?: string) =>
    (Object.values(CYCLE_TIME_SETTINGS_TYPES) as string[]).includes(typeInConfig || '')
      ? typeInConfig
      : CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.files?.[0];
    const reader = new FileReader();
    if (input) {
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          const importedConfig: OldFileConfig | NewFileConfig = JSON.parse(reader.result);
          const config: NewFileConfig = convertToNewFileConfig(importedConfig);
          if (isValidImportedConfig(config)) {
            dispatch(updateProjectCreatedState(false));
            dispatch(updateBasicConfigState(config));
            dispatch(updateMetricsImportedData(config));
            dispatch(setCycleTimeSettingsType(getCycleTimeSettingsType(config.cycleTime?.type)));
            navigate(ROUTE.METRICS_PAGE);
          } else {
            setValidConfig(false);
          }
        }
        const fileInput = fileInputRef.current;
        if (fileInput) {
          fileInput.value = '';
        }
      };
      reader.readAsText(input, 'utf-8');
    }
  };

  const resetState = () => {
    dispatch(resetImportedData());
    dispatch(resetStep());
    dispatch(resetFormMeta());
    dispatch(resetMetricData());
  };

  const openFileImportBox = () => {
    setValidConfig(true);
    resetState();
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.click();
    }
  };

  const createNewProject = () => {
    resetState();
    navigate(ROUTE.METRICS_PAGE);
  };

  return (
    <HomeGuideContainer>
      {!validConfig && <WarningNotification message={MESSAGE.HOME_VERIFY_IMPORT_WARNING} />}
      <StyledStack direction='column' justifyContent='center' alignItems='center' flex={'auto'}>
        <GuideButton onClick={openFileImportBox}>Import project from file</GuideButton>
        <ImportFileWrapper
          ref={fileInputRef}
          type='file'
          data-testid='testInput'
          id='importJson'
          accept='.json'
          onChange={handleChange}
        />
        <GuideButton onClick={createNewProject}>Create a new project</GuideButton>
      </StyledStack>
    </HomeGuideContainer>
  );
};
