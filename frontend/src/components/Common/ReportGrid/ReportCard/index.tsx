import {
  StyledErrorMessage,
  StyledErrorSection,
  StyledImgSection,
  StyledItemSection,
  StyledReportCard,
  StyledReportCardTitle,
} from '@src/components/Common/ReportGrid/ReportCard/style';
import { ReportCardItem, ReportCardItemProps } from '@src/components/Common/ReportGrid/ReportCardItem';
import { GRID_CONFIG } from '@src/constants/commons';
import { Loading } from '@src/components/Loading';
import EmptyBox from '@src/assets/EmptyBox.svg';
import React, { HTMLAttributes } from 'react';

interface ReportCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  items?: ReportCardItemProps[] | null;
  xs: number;
  errorMessage: string | undefined;
}

const ErrorMessagePrompt = (props: { errorMessage: string }) => {
  const { errorMessage } = props;
  return (
    <StyledErrorSection>
      <StyledImgSection src={EmptyBox} alt='empty image' />
      <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
    </StyledErrorSection>
  );
};

export const ReportCard = ({ title, items, xs, errorMessage }: ReportCardProps) => {
  const defaultFlex = 1;
  const getReportItems = () => {
    let style = GRID_CONFIG.FULL;
    switch (xs) {
      case GRID_CONFIG.HALF.XS:
        style = GRID_CONFIG.HALF;
        break;
      case GRID_CONFIG.FULL.XS:
        style = GRID_CONFIG.FULL;
        break;
    }

    const getFlex = (length: number) => {
      if (length <= 1) {
        return defaultFlex;
      } else {
        switch (xs) {
          case GRID_CONFIG.FULL.XS:
            return GRID_CONFIG.FULL.FLEX;
          case GRID_CONFIG.HALF.XS:
            return GRID_CONFIG.HALF.FLEX;
        }
      }
    };

    return (
      <StyledItemSection data-test-id={'report-section'}>
        {items?.map((item, index) =>
          index < style.MAX_INDEX ? (
            <ReportCardItem
              key={index}
              value={item.value}
              isToFixed={item.isToFixed}
              extraValue={item.extraValue}
              subtitle={item.subtitle}
              showDividingLine={items.length > 1 && index > 0}
              style={{ flex: getFlex(items.length) }}
            />
          ) : (
            <></>
          ),
        )}
      </StyledItemSection>
    );
  };

  return (
    <StyledReportCard data-test-id={title}>
      {!errorMessage && !items && <Loading size='1.5rem' backgroundColor='transparent' />}
      <StyledReportCardTitle>{title}</StyledReportCardTitle>
      {errorMessage && <ErrorMessagePrompt errorMessage={errorMessage} />}
      {!errorMessage && items && getReportItems()}
    </StyledReportCard>
  );
};
