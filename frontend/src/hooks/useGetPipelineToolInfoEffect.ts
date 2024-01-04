import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { pipelineToolClient, IGetPipelineToolInfoResult } from '@src/clients/pipeline/PipelineToolClient'
import {
  updatePipelineToolVerifyResponse,
  isPipelineToolVerified,
  selectIsProjectCreated,
  selectPipelineTool,
  selectDateRange,
} from '@src/context/config/configSlice'
import { updatePipelineSettings } from '@src/context/Metrics/metricsSlice'

export interface IUseVerifyPipeLineToolStateInterface {
  deploymentFrequencySettings: IGetPipelineToolInfoResult | undefined
  isLoading: boolean
}

export const useGetPipelineToolInfoEffect = (): IUseVerifyPipeLineToolStateInterface => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [info, setInfo] = useState<IGetPipelineToolInfoResult>()
  const pipelineToolVerified = useAppSelector(isPipelineToolVerified)
  const isProjectCreated = useAppSelector(selectIsProjectCreated)
  const restoredPipelineTool = useAppSelector(selectPipelineTool)
  const dateRange = useAppSelector(selectDateRange)

  const params = {
    type: restoredPipelineTool.type,
    token: restoredPipelineTool.token,
    startTime: dateRange.startDate,
    endTime: dateRange.endDate,
  }

  useEffect(() => {
    const getPipelineToolInfo = async () => {
      setIsLoading(true)
      try {
        const response = await pipelineToolClient.getPipelineToolInfo(params)
        setInfo(response)
        dispatch(updatePipelineToolVerifyResponse(response.data))
        pipelineToolVerified && dispatch(updatePipelineSettings({ ...response.data, isProjectCreated }))
      } catch (e) {
        console.error('[useGetPipelineToolInfoEffect] error', e)
      } finally {
        setIsLoading(false)
      }
    }

    if (!info) {
      getPipelineToolInfo()
    }
  }, [pipelineToolVerified, isProjectCreated, restoredPipelineTool, dateRange, dispatch])

  return {
    deploymentFrequencySettings: info,
    isLoading,
  }
}
