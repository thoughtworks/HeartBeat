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
  result: IGetPipelineToolInfoResult
  isLoading: boolean
}

export const useGetPipelineToolInfoEffect = (): IUseVerifyPipeLineToolStateInterface => {
  const defaultInfoStructure = {
    code: 200,
    errorTitle: '',
    errorMessage: '',
  }
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState(false)
  const [info, setInfo] = useState<IGetPipelineToolInfoResult>(defaultInfoStructure)
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
        const err = e as Error
        console.error(`Failed to get pipeline tool info in useGetPipelineToolInfoEffect hook`, err?.message)
      } finally {
        setIsLoading(false)
        setTouched(true)
      }
    }

    if (!touched) {
      getPipelineToolInfo()
    }

    return () => {
      setInfo(defaultInfoStructure)
      setTouched(false)
      // todo dispatch redux actions to purge corresponding data
    }
  }, [pipelineToolVerified, isProjectCreated, restoredPipelineTool, dateRange, dispatch])

  return {
    result: info,
    isLoading,
  }
}
