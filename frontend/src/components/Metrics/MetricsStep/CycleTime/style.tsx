import { styled } from '@mui/material/styles'
import { Checkbox } from '@mui/material'
import { theme } from '@src/theme'

export const FlagCardItem = styled('div')({
  display: 'flex',
})

export const ItemText = styled('div')({
  padding: '1rem 0',
})

export const ItemCheckbox = styled(Checkbox)({
  paddingLeft: '0',
})

export const ErrorDone = styled('div')({
  color: theme.components?.errorMessage.color,
  paddingBottom: theme.components?.errorMessage.paddingBottom,
})

export const WaringDone = styled('div')({
  color: theme.components?.waringMessage.color,
  paddingBottom: theme.components?.errorMessage.paddingBottom,
})
