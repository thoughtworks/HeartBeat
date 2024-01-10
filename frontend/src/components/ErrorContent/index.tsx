import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@src/assets/ErrorIcon.svg';
import React from 'react';
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
} from '@src/components/ErrorContent/style';
import { ROUTE } from '@src/constants/router';
import { MESSAGE } from '@src/constants/resources';

export const ErrorContent = () => {
  const navigate = useNavigate();

  const backToHomePage = () => {
    navigate(ROUTE.BASE_PAGE);
  };

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
        <p>{MESSAGE.ERROR_PAGE}</p>
      </ErrorInfo>
      <RetryButton onClick={backToHomePage}>Go to homepage</RetryButton>
    </Container>
  );
};
