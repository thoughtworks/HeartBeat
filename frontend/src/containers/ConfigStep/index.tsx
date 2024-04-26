import {
  IBasicInfoData,
  IBoardConfigData,
  IPipelineToolData,
  ISourceControlData,
} from '@src/containers/ConfigStep/Form/schema';
import { closeAllNotifications } from '@src/context/notification/NotificationSlice';
import { useAppSelector, useAppDispatch } from '@src/hooks/useAppDispatch';
import { SourceControl } from '@src/containers/ConfigStep/SourceControl';
import { PipelineTool } from '@src/containers/ConfigStep/PipelineTool';
import { selectConfig } from '@src/context/config/configSlice';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import BasicInfo from '@src/containers/ConfigStep/BasicInfo';
import { Board } from '@src/containers/ConfigStep/Board';
import { useEffect, useLayoutEffect } from 'react';
import { ConfigStepWrapper } from './style';

interface IConfigStepProps {
  basicInfoMethods: UseFormReturn<IBasicInfoData>;
  boardConfigMethods: UseFormReturn<IBoardConfigData>;
  pipelineToolMethods: UseFormReturn<IPipelineToolData>;
  sourceControlMethods: UseFormReturn<ISourceControlData>;
}

const ConfigStep = ({
  basicInfoMethods,
  boardConfigMethods,
  pipelineToolMethods,
  sourceControlMethods,
}: IConfigStepProps) => {
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    dispatch(closeAllNotifications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const configData = useAppSelector(selectConfig);
  const { isShow: isShowBoard } = configData.board;
  const { isShow: isShowPipeline } = configData.pipelineTool;
  const { isShow: isShowSourceControl } = configData.sourceControl;

  useEffect(() => {
    basicInfoMethods.trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfigStepWrapper>
      <FormProvider {...basicInfoMethods}>
        <BasicInfo />
      </FormProvider>
      {isShowBoard && (
        <FormProvider {...boardConfigMethods}>
          <Board />
        </FormProvider>
      )}
      {isShowPipeline && (
        <FormProvider {...pipelineToolMethods}>
          <PipelineTool />
        </FormProvider>
      )}
      {isShowSourceControl && (
        <FormProvider {...sourceControlMethods}>
          <SourceControl />
        </FormProvider>
      )}
    </ConfigStepWrapper>
  );
};

export default ConfigStep;
