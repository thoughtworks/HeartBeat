import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'
import { theme } from '@src/theme'

export const StyledGrid = styled(Grid)({
  [theme.breakpoints.down('md')]: {
    fontSize: 10,
  },
})
