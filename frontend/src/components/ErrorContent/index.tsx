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
import { MESSAGE } from '@src/constants/resources';
import ErrorIcon from '@src/assets/ErrorIcon.svg';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '@src/constants/router';
import React from 'react';

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
