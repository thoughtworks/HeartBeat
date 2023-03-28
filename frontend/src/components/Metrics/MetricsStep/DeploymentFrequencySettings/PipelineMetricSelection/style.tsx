import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

export const PipelineMetricSelectionWrapper = styled('div')({
  position: 'relative',
  boxShadow:
    '0 0.125rem 0.0625rem -0.0625rem rgb(0 0 0 / 20%), 0 0.125rem 0.25rem 0 rgb(0 0 0 / 14%), 0 0.0625rem 0.1875px 0 rgb(0 0 0 / 12%);',
  borderRadius: '0.25rem',
  width: '85%',
  margin: '1rem 0',
  padding: '1rem',
  fontSize: '1rem',
  lineHeight: '2rem',
})

export const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const RemoveButton = styled(Button)({
  width: '5rem',
  fontSize: '0.8rem',
  fontWeight: '550',
})
