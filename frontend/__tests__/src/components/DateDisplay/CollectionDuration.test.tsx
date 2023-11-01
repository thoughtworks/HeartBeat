import { render } from '@testing-library/react'
import CollectionDuration from '@src/components/Common/CollectionDuration'
import React from 'react'
import { IMPORTED_NEW_CONFIG_FIXTURE, TIME_DISPLAY_TITTLE_END, TIME_DISPLAY_TITTLE_START } from '../../fixtures'

describe('Collection Duration', () => {
  const setup = () =>
    render(
      <CollectionDuration
        startDate={IMPORTED_NEW_CONFIG_FIXTURE.dateRange.startDate}
        endDate={IMPORTED_NEW_CONFIG_FIXTURE.dateRange.endDate}
      />
    )
  it('should render the start and end text correctly', () => {
    const { getByText } = setup()

    expect(getByText(TIME_DISPLAY_TITTLE_START)).toBeInTheDocument()
    expect(getByText(TIME_DISPLAY_TITTLE_END)).toBeInTheDocument()
  })
  it('should render the start and end time with correct format', () => {
    const { getByText, getAllByText } = setup()

    expect(getByText('16')).toBeInTheDocument()
    expect(getAllByText('Mar 23')).toHaveLength(2)
    expect(getByText('30')).toBeInTheDocument()
  })
})
