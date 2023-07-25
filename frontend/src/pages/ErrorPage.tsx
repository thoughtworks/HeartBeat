import React from 'react'
import styled from '@emotion/styled'
import Header from '@src/layouts/Header'
import { useNavigate } from 'react-router-dom'
import { HOME_PAGE_ROUTE } from '@src/constants'
import { Button } from '@mui/material'
import { theme } from '@src/theme'
import { basicButtonStyle } from '@src/components/Metrics/MetricsStepper/style'
import ErrorIcon from '@src/assets/ErrorIcon.svg'

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  marginBottom: '5rem',
})

const ErrorInfo = styled.div({
  paddingLeft: '7rem',
})

const ErrorImg = styled.img({
  height: '9rem',
})

const Some = styled.text({
  fontSize: '3.5rem',
  fontWeight: '700',
  fontFamily: 'system-ui',
  paddingLeft: '1rem',
})

const Error = styled.text({
  paddingLeft: '1rem',
  fontSize: '6rem',
  fontWeight: '700',
  fontFamily: 'system-ui',
  letterSpacing: '-0.5rem',
  color: 'firebrick',
})

const ErrorMessage = styled.div({
  display: 'flex',
  flexDirection: 'row',
  paddingRight: '12rem',
})

const OhNo = styled.text({
  fontSize: '9rem',
  fontWeight: '750',
  fontFamily: 'system-ui',
  letterSpacing: '0.2rem',
})

const Okay = styled.text({
  margin: 'auto 0',
  paddingLeft: '1rem',
  fontSize: '2.5rem',
  fontWeight: '300',
  fontFamily: 'system-ui',
  color: theme.main.backgroundColor,
})

const ErrorMessageContainer = styled.div({
  padding: '2rem',
  fontSize: '1.2rem',
  fontWeight: '300',
  fontFamily: 'system-ui',
})

const RetryButton = styled(Button)({
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

const ErrorPage = () => {
  const navigate = useNavigate()

  const backToHomePage = () => {
    navigate(HOME_PAGE_ROUTE)
  }

  return (
    <>
      <Header />
      <Content>
        <ErrorInfo>
          <ErrorImg src={ErrorIcon} alt='logo' />
          <Some>SOME</Some>
          <Error>ERROR</Error>
        </ErrorInfo>
        <ErrorMessage>
          <OhNo>OH NO !</OhNo>
          <Okay>But that is okay !</Okay>
        </ErrorMessage>
        <ErrorMessageContainer>
          <p>Something on internet is not quite right. Perhaps head back to our homepage and try again.</p>
        </ErrorMessageContainer>
        <RetryButton onClick={backToHomePage}>Go to homepage</RetryButton>
      </Content>
    </>
  )
}
export default ErrorPage
