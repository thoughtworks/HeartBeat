import { styled } from '@mui/material/styles'
import { Z_INDEX } from '@src/constants/commons'
import { Button } from '@mui/material'
import { theme } from '@src/theme'
import { basicButtonStyle } from '@src/components/Metrics/ReportStep/ReportDetail/style'

export const StyledErrorNotification = styled('div')({
  zIndex: Z_INDEX.MODAL_BACKDROP,
})

export const StyledMetricsSection = styled('div')({
  marginTop: '1.5rem',
})

export const StyledSpacing = styled('div')({
  height: '1.5rem',
})
