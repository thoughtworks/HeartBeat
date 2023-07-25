import { useNavigate } from 'react-router-dom'
import { ERROR_PAGE_MESSAGE, HOME_PAGE_ROUTE } from '@src/constants'
import ErrorIcon from '@src/assets/ErrorIcon.svg'
import React from 'react'
import {
  Container,
  ErrorImg,
  Some,
  Error,
  ErrorTitle,
  ErrorMessage,
  OhNo,
  Okay,
  ErrorInfo,
  RetryButton,
} from '@src/components/ErrorContent/style'

export const ErrorContent = () => {
  const navigate = useNavigate()

  const backToHomePage = () => {
    navigate(HOME_PAGE_ROUTE)
  }

  return (
    <Container>
      <ErrorTitle>
        <ErrorImg src={ErrorIcon} alt='logo' />
        <Some>SOME</Some>
        <Error>ERROR</Error>
      </ErrorTitle>
      <ErrorMessage>
        <OhNo>OH NO !</OhNo>
        <Okay>But that is okay !</Okay>
      </ErrorMessage>
      <ErrorInfo>
        <p>{ERROR_PAGE_MESSAGE}</p>
      </ErrorInfo>
      <RetryButton onClick={backToHomePage}>Go to homepage</RetryButton>
    </Container>
  )
}
