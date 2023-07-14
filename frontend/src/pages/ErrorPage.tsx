import React from 'react'
import styled from '@emotion/styled'
import Header from '@src/layouts/Header'
import { useNavigate } from 'react-router-dom'
import { GuideButton } from '@src/components/Common/Buttons'
import { Stack } from '@mui/material'

const ErrorMessageContainer = styled.div({
  padding: '48px',
})

const ErrorPage = () => {
  const navigate = useNavigate()

  const backToHomePage = () => {
    navigate('/home')
  }

  return (
    <>
      <Header />
      <Stack direction='column' alignItems='center' flex={'auto'}>
        <ErrorMessageContainer>
          <h1>Oh no!</h1>
          <p>
            Something is not quite right. We promise we are working on it - in the meantime, perhaps head back to our
            homepage and try again.
          </p>
        </ErrorMessageContainer>
        <GuideButton onClick={backToHomePage}>Go to homepage</GuideButton>
      </Stack>
    </>
  )
}
export default ErrorPage
