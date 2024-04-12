import { IMPORTED_NEW_CONFIG_FIXTURE, TIME_DISPLAY_TITTLE_END, TIME_DISPLAY_TITTLE_START } from '../../fixtures';
import CollectionDuration from '@src/components/Common/CollectionDuration';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Collection Duration', () => {
  const setup = () =>
    render(
      <CollectionDuration
        startDate={IMPORTED_NEW_CONFIG_FIXTURE.dateRange[0].startDate}
        endDate={IMPORTED_NEW_CONFIG_FIXTURE.dateRange[0].endDate}
      />,
    );
  it('should render the start and end text correctly', () => {
    setup();

    expect(screen.getByText(TIME_DISPLAY_TITTLE_START)).toBeInTheDocument();
    expect(screen.getByText(TIME_DISPLAY_TITTLE_END)).toBeInTheDocument();
  });
  it('should render the start and end time with correct format', () => {
    setup();

    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getAllByText('Mar 23')).toHaveLength(2);
    expect(screen.getByText('30')).toBeInTheDocument();
  });
});
