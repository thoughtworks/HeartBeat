import {
  addADeploymentFrequencySetting,
  deleteADeploymentFrequencySetting,
  selectDeploymentFrequencySettings,
  updateDeploymentFrequencySettings,
} from '@src/context/Metrics/metricsSlice';
import PresentationForErrorCases from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PresentationForErrorCases';
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext';
import { useGetPipelineToolInfoEffect } from '@src/hooks/useGetPipelineToolInfoEffect';
import { MetricsSettingAddButton } from '@src/components/Common/MetricsSettingButton';
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import { deleteMetricsPipelineFormMeta } from '@src/context/meta/metaSlice';
import { selectPipelineCrews } from '@src/context/config/configSlice';
import { PipelineMetricSelection } from './PipelineMetricSelection';
import { PIPELINE_SETTING_TYPES } from '@src/constants/resources';
import { useAppDispatch, useAppSelector } from '@src/hooks';
import { Crews } from '@src/containers/MetricsStep/Crews';
import { Loading } from '@src/components/Loading';
import { HttpStatusCode } from 'axios';
import _ from 'lodash';

export const DeploymentFrequencySettings = () => {
  const dispatch = useAppDispatch();
  const { isLoading, result: pipelineInfoResult, apiCallFunc } = useGetPipelineToolInfoEffect();
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings);
  const { getDuplicatedPipeLineIds } = useMetricsStepValidationCheckContext();
  const pipelineCrews = useAppSelector(selectPipelineCrews);

  const handleAddPipeline = () => {
    dispatch(addADeploymentFrequencySetting());
  };

  const handleRemovePipeline = (id: number) => {
    dispatch(deleteADeploymentFrequencySetting(id));
    dispatch(deleteMetricsPipelineFormMeta(id));
  };

  const handleUpdatePipeline = (id: number, label: string, value: string | StringConstructor[] | unknown) => {
    dispatch(updateDeploymentFrequencySettings({ updateId: id, label, value }));
  };

  return (
    <>
      {isLoading && <Loading />}
      {pipelineInfoResult?.code !== HttpStatusCode.Ok ? (
        <PresentationForErrorCases {...pipelineInfoResult} isLoading={isLoading} retry={apiCallFunc} />
      ) : (
        <>
          <MetricsSettingTitle title={'Pipeline settings'} />
          {deploymentFrequencySettings.map((deploymentFrequencySetting) => (
            <PipelineMetricSelection
              isInfoLoading={isLoading}
              key={deploymentFrequencySetting.id}
              type={PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE}
              pipelineSetting={deploymentFrequencySetting}
              isShowRemoveButton={deploymentFrequencySettings.length > 1}
              onRemovePipeline={(id) => handleRemovePipeline(id)}
              onUpdatePipeline={(id, label, value) => handleUpdatePipeline(id, label, value)}
              isDuplicated={getDuplicatedPipeLineIds(deploymentFrequencySettings).includes(
                deploymentFrequencySetting.id,
              )}
            />
          ))}
          <MetricsSettingAddButton onAddPipeline={handleAddPipeline} />
          {!_.isEmpty(pipelineCrews) && (
            <Crews
              options={pipelineCrews}
              title={'Crew setting (optional)'}
              label={'Included Crews'}
              type={'pipeline'}
            />
          )}
        </>
      )}
    </>
  );
};
