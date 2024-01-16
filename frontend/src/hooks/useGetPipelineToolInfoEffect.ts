import { useEffect, useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@src/hooks';
import { pipelineToolClient, IGetPipelineToolInfoResult } from '@src/clients/pipeline/PipelineToolClient';
import {
  updatePipelineToolVerifyResponse,
  isPipelineToolVerified,
  selectIsProjectCreated,
  selectPipelineTool,
  selectDateRange,
} from '@src/context/config/configSlice';
import { updatePipelineSettings } from '@src/context/Metrics/metricsSlice';

export interface IUseVerifyPipeLineToolStateInterface {
  result: IGetPipelineToolInfoResult;
  isLoading: boolean;
  apiCallFunc: () => void;
}

export const useGetPipelineToolInfoEffect = (): IUseVerifyPipeLineToolStateInterface => {
  const defaultInfoStructure = {
    code: 200,
    errorTitle: '',
    errorMessage: '',
  };
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const apiTouchedRef = useRef(false);
  const [info, setInfo] = useState<IGetPipelineToolInfoResult>(defaultInfoStructure);
  const pipelineToolVerified = useAppSelector(isPipelineToolVerified);
  const isProjectCreated = useAppSelector(selectIsProjectCreated);
  const restoredPipelineTool = useAppSelector(selectPipelineTool);
  const dateRange = useAppSelector(selectDateRange);

  const getPipelineToolInfo = useCallback(async () => {
    const params = {
      type: restoredPipelineTool.type,
      token: restoredPipelineTool.token,
      startTime: dateRange.startDate,
      endTime: dateRange.endDate,
    };

    try {
      setIsLoading(true);
      const response = await pipelineToolClient.getInfo(params);
      setInfo(response);
      dispatch(updatePipelineToolVerifyResponse(response.data));
      pipelineToolVerified && dispatch(updatePipelineSettings({ ...response.data, isProjectCreated }));
    } finally {
      setIsLoading(false);
    }
  }, [
    dispatch,
    isProjectCreated,
    pipelineToolVerified,
    dateRange.startDate,
    dateRange.endDate,
    restoredPipelineTool.type,
    restoredPipelineTool.token,
  ]);

  useEffect(() => {
    if (!apiTouchedRef.current && !isLoading) {
      apiTouchedRef.current = true;
      getPipelineToolInfo();
    }
  }, [getPipelineToolInfo, isLoading]);

  return {
    result: info,
    isLoading,
    apiCallFunc: getPipelineToolInfo,
  };
};
