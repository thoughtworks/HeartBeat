import Stack from '@mui/material/Stack'

import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { updateBasicConfigState, updateProjectCreatedState } from '@src/context/config/configSlice'
import React, { useState } from 'react'
import { updateMetricsImportedData } from '@src/context/Metrics/metricsSlice'
import { resetStep } from '@src/context/stepper/StepperSlice'
import {
  CHINA_CALENDAR,
  HOME_VERIFY_IMPORT_WARNING_MESSAGE,
  METRICS_PAGE_ROUTE,
  REGULAR_CALENDAR,
} from '@src/constants'
import { WarningNotification } from '@src/components/Common/WarningNotification'
import { GuideButton } from '@src/components/Common/Buttons'

export const HomeGuide = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [validConfig, setValidConfig] = useState(true)

  const getImportFileElement = () => document.getElementById('importJson') as HTMLInputElement

  const convertToNewFileConfig = (fileConfig) => {
    try {
      if ('considerHoliday' in fileConfig) {
        const {
          projectName,
          metrics,
          startDate,
          endDate,
          considerHoliday,
          board: { type: boardType, boardId, token: boardToken, site, email, projectKey },
          pipelineTool: { type: pipelineType, token: pipelineToken },
          sourceControl: { type: sourceType, token: sourceToken },
          crews,
          cycleTime,
          doneStatus,
          classifications,
          deployment,
          leadTime,
        } = fileConfig
        return {
          projectName,
          dateRange: {
            startDate,
            endDate,
          },
          calendarType: considerHoliday ? CHINA_CALENDAR : REGULAR_CALENDAR,
          metrics,
          board: {
            type: boardType,
            boardId,
            email,
            projectKey,
            site,
            token: boardToken,
          },
          pipelineTool: {
            type: pipelineType,
            token: pipelineToken,
          },
          sourceControl: {
            type: sourceType,
            token: sourceToken,
          },
          crews,
          cycleTime,
          doneStatus,
          classification: classifications,
          deployment: deployment.map((item, index) => ({
            id: index,
            organization: item?.orgId,
            pipelineName: item?.pipelineId,
            step: item?.step,
          })),
          leadTime: leadTime.map((item, index) => ({
            id: index,
            organization: item?.orgId,
            pipelineName: item?.pipelineId,
            step: item?.step,
          })),
        }
      }
      return fileConfig
    } catch {
      setValidConfig(false)
    }
  }

  const isValidImportedConfig = (config) => {
    try {
      const {
        projectName,
        metrics,
        dateRange: { startDate, endDate },
      } = config
      return projectName || startDate || endDate || metrics.length > 0
    } catch {
      return false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.files?.[0]
    const reader = new FileReader()
    if (input) {
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          const importedConfig = JSON.parse(reader.result)
          const config = convertToNewFileConfig(importedConfig)
          if (isValidImportedConfig(config)) {
            dispatch(updateProjectCreatedState(false))
            dispatch(updateBasicConfigState(config))
            dispatch(updateMetricsImportedData(config))
            navigate(METRICS_PAGE_ROUTE)
          } else {
            setValidConfig(false)
          }
        }
        const fileInput = getImportFileElement()
        fileInput.value = ''
      }
      reader.readAsText(input, 'utf-8')
    }
  }

  const openFileImportBox = () => {
    setValidConfig(true)
    dispatch(resetStep())
    const fileInput = getImportFileElement()
    fileInput.click()
  }

  const createNewProject = () => {
    dispatch(resetStep())
    navigate(METRICS_PAGE_ROUTE)
  }

  return (
    <>
      {!validConfig && <WarningNotification message={HOME_VERIFY_IMPORT_WARNING_MESSAGE} />}
      <Stack direction='column' justifyContent='center' alignItems='center' flex={'auto'}>
        <GuideButton onClick={openFileImportBox}>Import project from file</GuideButton>
        <input hidden type='file' data-testid='testInput' id='importJson' accept='.json' onChange={handleChange} />
        <GuideButton onClick={createNewProject}>Create a new project</GuideButton>
      </Stack>
    </>
  )
}
