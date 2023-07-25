import styled from '@emotion/styled'
import { theme } from '@src/theme'
import { Button } from '@mui/material'
import { basicButtonStyle } from '@src/components/Metrics/MetricsStepper/style'

export const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  marginBottom: '5rem',
})

export const ErrorTitle = styled.div({
  paddingLeft: '7rem',
})

export const ErrorImg = styled.img({
  height: '9rem',
})

export const Some = styled.text({
  fontSize: '3.5rem',
  fontWeight: '700',
  fontFamily: 'system-ui',
  paddingLeft: '1rem',
})

export const Error = styled.text({
  paddingLeft: '1rem',
  fontSize: '6rem',
  fontWeight: '700',
  fontFamily: 'system-ui',
  letterSpacing: '-0.5rem',
  color: 'firebrick',
})

export const ErrorMessage = styled.div({
  display: 'flex',
  flexDirection: 'row',
  paddingRight: '12rem',
})

export const OhNo = styled.text({
  fontSize: '9rem',
  fontWeight: '750',
  fontFamily: 'system-ui',
  letterSpacing: '0.2rem',
})

export const Okay = styled.text({
  margin: 'auto 0',
  paddingLeft: '1rem',
  fontSize: '2.5rem',
  fontWeight: '300',
  fontFamily: 'system-ui',
  color: theme.main.backgroundColor,
})

export const ErrorInfo = styled.div({
  padding: '2rem',
  fontSize: '1.2rem',
  fontWeight: '300',
  fontFamily: 'system-ui',
})

export const RetryButton = styled(Button)({
  ...basicButtonStyle,
  height: '3rem',
  width: '12rem',
  marginTop: '2rem',
  backgroundColor: theme.main.backgroundColor,
  color: 'white',
  '&:hover': {
    background: theme.main.backgroundColor,
  },
})
