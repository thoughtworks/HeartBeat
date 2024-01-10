import {
  StyledItemSection,
  StyledReportCard,
  StyledReportCardTitle,
} from '@src/components/Common/ReportGrid/ReportCard/style';
import React, { HTMLAttributes } from 'react';
import { ReportCardItem, ReportCardItemProps } from '@src/components/Common/ReportGrid/ReportCardItem';
import { GRID_CONFIG } from '@src/constants/commons';
import { Loading } from '@src/components/Loading';

interface ReportCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  items?: ReportCardItemProps[] | null;
  xs: number;
}

export const ReportCard = ({ title, items, xs }: ReportCardProps) => {
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
          )
        )}
      </StyledItemSection>
    );
  };

  return (
    <StyledReportCard data-test-id={title}>
      {!items && <Loading size='1.5rem' backgroundColor='transparent' />}
      <StyledReportCardTitle>{title}</StyledReportCardTitle>
      {items && getReportItems()}
    </StyledReportCard>
  );
};
