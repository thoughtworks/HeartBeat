import Button, { ButtonProps } from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import { theme } from '@src/theme'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { updateProjectCreatedState, updateBasicConfigState } from '@src/context/config/configSlice'
import React from 'react'

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.files?.[0]
    const reader = new FileReader()
    if (input) {
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          dispatch(updateProjectCreatedState(false))
          dispatch(updateBasicConfigState(JSON.parse(reader.result)))
          navigate('/metrics')
        }
      }
      reader.readAsText(input, 'utf-8')
    }
  }

  const openFileImportBox = () => {
    const fileInput = document.getElementById('importJson') as HTMLInputElement
    fileInput.click()
  }

  const createNewProject = () => {
    navigate('/metrics')
  }

  return (
    <Stack direction='column' justifyContent='center' alignItems='center' flex={'auto'}>
      <GuideButton onClick={openFileImportBox}>Import project from file</GuideButton>
      <input hidden type='file' data-testid='testInput' id='importJson' accept='.json' onChange={handleChange} />
      <GuideButton onClick={createNewProject}>Create a new project</GuideButton>
    </Stack>
  )
}
