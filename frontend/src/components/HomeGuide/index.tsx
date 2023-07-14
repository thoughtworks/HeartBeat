import Stack from '@mui/material/Stack'

import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { updateBasicConfigState, updateProjectCreatedState } from '@src/context/config/configSlice'
import React, { useState } from 'react'
import { updateMetricsImportedData } from '@src/context/Metrics/metricsSlice'
import { resetStep } from '@src/context/stepper/StepperSlice'
import { HOME_VERIFY_IMPORT_WARNING_MESSAGE } from '@src/constants'
import { WarningNotification } from '@src/components/Common/WarningNotification'
import { GuideButton } from '@src/components/Common/Buttons'

export const HomeGuide = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [validConfig, setValidConfig] = useState(true)

  const getImportFileElement = () => document.getElementById('importJson') as HTMLInputElement

  const isValidImportedConfig = (configStr: string) => {
    try {
      const importedConfig = JSON.parse(configStr)
      const {
        projectName,
        metrics,
        dateRange: { startDate, endDate },
      } = importedConfig
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
          if (isValidImportedConfig(reader.result)) {
            dispatch(updateProjectCreatedState(false))
            const importedConfig = JSON.parse(reader.result)
            dispatch(updateBasicConfigState(importedConfig))
            dispatch(updateMetricsImportedData(importedConfig))
            navigate('/metrics')
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
    navigate('/metrics')
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
