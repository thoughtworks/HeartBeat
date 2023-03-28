import Button, { ButtonProps } from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import { theme } from '@src/theme'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { isProjectCreated, updateBasicConfigState } from '@src/context/config/configSlice'

const basicStyle = {
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  margin: '2rem',
  width: '15rem',
  minWidth: '10rem',
  minHeight: '3rem',
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

  const importProject = (e: { target: any }) => {
    const input = e.target
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        dispatch(isProjectCreated(false))
        dispatch(updateBasicConfigState(JSON.parse(reader.result)))
        navigate('/metrics')
      }
    }
    reader.readAsText(input.files[0], 'utf-8')
  }
  const createNewProject = () => {
    dispatch(isProjectCreated(true))
    navigate('/metrics')
  }

  return (
    <Stack direction='column' justifyContent='center' alignItems='center' flex={'auto'}>
      <GuideButton>
        <label htmlFor='importJson'>Import project from file</label>
      </GuideButton>
      <input hidden type='file' id='importJson' accept='.json' onChange={importProject} />
      <GuideButton onClick={createNewProject}>Create a new project</GuideButton>
    </Stack>
  )
}
