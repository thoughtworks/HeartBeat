import Button, { ButtonProps } from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import { theme } from '@src/theme'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { updateBasicConfigState, updateProjectCreatedState } from '@src/context/config/configSlice'
import React, { useState } from 'react'
import { updateMetricsImportedData } from '@src/context/Metrics/metricsSlice'
import { ErrorNotificationAutoDismiss } from '../Common/ErrorNotificationAutoDismiss'
import { HOME_VERIFY_IMPORT_WARNING_MESSAGE } from '@src/constants'

const basicStyle = {
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  margin: '2rem',
  width: '15rem',
  minWidth: '10rem',
  minHeight: '3rem',
  [theme.breakpoints.down('md')]: {
    width: '80%',
    maxWidth: '15rem',
  },
}
const GuideButton = styled(Button)<ButtonProps>({
  ...basicStyle,
  '&:hover': {
    ...basicStyle,
  },
  '&:active': {
    ...basicStyle,
  },
  '&:focus': {
    ...basicStyle,
  },
})

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
    const fileInput = getImportFileElement()
    fileInput.click()
  }

  const createNewProject = () => {
    navigate('/metrics')
  }

  return (
    <>
      {!validConfig && <ErrorNotificationAutoDismiss message={HOME_VERIFY_IMPORT_WARNING_MESSAGE} />}
      <Stack direction='column' justifyContent='center' alignItems='center' flex={'auto'}>
        <GuideButton onClick={openFileImportBox}>Import project from file</GuideButton>
        <input hidden type='file' data-testid='testInput' id='importJson' accept='.json' onChange={handleChange} />
        <GuideButton onClick={createNewProject}>Create a new project</GuideButton>
      </Stack>
    </>
  )
}
