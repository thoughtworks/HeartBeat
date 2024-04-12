import {
  updatePipelineToolVerifyResponse,
  isPipelineToolVerified,
  selectIsProjectCreated,
  selectPipelineTool,
  selectDateRange,
} from '@src/context/config/configSlice';
import { pipelineToolClient, IGetPipelineToolInfoResult } from '@src/clients/pipeline/PipelineToolClient';
import { selectShouldGetPipelineConfig, updatePipelineSettings } from '@src/context/Metrics/metricsSlice';
import { clearMetricsPipelineFormMeta } from '@src/context/meta/metaSlice';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { shouldMetricsLoad } from '@src/context/stepper/StepperSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks';
import { sortDateRanges } from '@src/utils/util';

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
  const sortedDateRanges = useMemo(() => sortDateRanges(dateRange), [dateRange]);
  const shouldLoad = useAppSelector(shouldMetricsLoad);
  const shouldGetPipelineConfig = useAppSelector(selectShouldGetPipelineConfig);

  const getPipelineToolInfo = useCallback(async () => {
    const params = {
      type: restoredPipelineTool.type,
      token: restoredPipelineTool.token,
      startTime: sortedDateRanges[0]?.startDate,
      endTime: sortedDateRanges[0]?.endDate,
    };
    setIsLoading(true);
    try {
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
    restoredPipelineTool.type,
    restoredPipelineTool.token,
    sortedDateRanges,
  ]);

  useEffect(() => {
    if (!apiTouchedRef.current && !isLoading && shouldLoad && shouldGetPipelineConfig) {
      apiTouchedRef.current = true;
      getPipelineToolInfo();
      dispatch(clearMetricsPipelineFormMeta());
    }
  }, [dispatch, getPipelineToolInfo, isLoading, shouldLoad, shouldGetPipelineConfig]);

  return {
    result: info,
    isLoading,
    apiCallFunc: getPipelineToolInfo,
  };
};
