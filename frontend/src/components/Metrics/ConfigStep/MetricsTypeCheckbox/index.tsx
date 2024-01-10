import { Board } from '@src/components/Metrics/ConfigStep/Board';
import { useAppSelector } from '@src/hooks/useAppDispatch';
import { selectConfig } from '@src/context/config/configSlice';
import { PipelineTool } from '@src/components/Metrics/ConfigStep/PipelineTool';
import { SourceControl } from '@src/components/Metrics/ConfigStep/SourceControl';

export const MetricsTypeCheckbox = () => {
  const configData = useAppSelector(selectConfig);
  const { isShow: isShowBoard } = configData.board;
  const { isShow: isShowPipeline } = configData.pipelineTool;
  const { isShow: isShowSourceControl } = configData.sourceControl;

  return (
    <>
      {isShowBoard && <Board />}
      {isShowPipeline && <PipelineTool />}
      {isShowSourceControl && <SourceControl />}
    </>
  );
};
