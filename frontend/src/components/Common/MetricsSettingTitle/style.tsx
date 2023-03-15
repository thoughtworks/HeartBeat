import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'

export const Divider = styled('div')({
  padding: '0.4rem',
  borderLeft: `0.4rem solid ${theme.main.backgroundColor}`,
  margin: '3rem 0 1rem 0',
})
