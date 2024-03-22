import { EXPECTED_REPORT_VALUES, MOCK_REPORT_RESPONSE, REWORK_REPORT_RESPONSE } from '../../fixtures';
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns';
import { StyledSpan } from '@src/containers/ReportStep/ReportDetail/style';
import reworkMapper from '@src/hooks/reportMapper/reworkMapper';
import { reportMapper } from '@src/hooks/reportMapper/report';
import { render } from '@testing-library/react';
import React from 'react';

[
  {
    id: 0,
    name: 'Total rework ',
    valueList: [
      {
        value: 111,
        unit: ' (times)',
      },
    ],
  },
  {
    id: 2,
    name: 'From in dev to in dev ',
    valueList: [
      {
        value: 111,
        unit: ' (times)',
      },
    ],
  },
  {
    id: 3,
    name: 'From block to in dev ',
    valueList: [
      {
        value: 111,
        unit: ' (times)',
      },
    ],
  },
  {
    id: 4,
    name: 'From waiting for testing to in dev ',
    valueList: [
      {
        value: 111,
        unit: ' (times)',
      },
    ],
  },
  {
    id: 6,
    name: 'From review to in dev ',
    valueList: [
      {
        value: 111,
        unit: ' (times)',
      },
    ],
  },
  {
    id: 7,
    name: 'From done to in dev ',
    valueList: [
      {
        value: 111,
        unit: ' (times)',
      },
    ],
  },
  {
    id: 8,
    name: 'Total rework cards ',
    valueList: [
      {
        value: 111,
        unit: ' (cards)',
      },
    ],
  },
  {
    id: 9,
    name: 'Rework cards ratio ',
    valueList: [
      {
        value: '88.88',
        unit: '% (rework cards/throughput)',
      },
    ],
  },
];

describe('report response data mapper', () => {
  it('maps response velocity values to ui display value', () => {
    const mappedReportResponseValues = reportMapper(MOCK_REPORT_RESPONSE);

    expect(mappedReportResponseValues).toEqual(EXPECTED_REPORT_VALUES);
  });

  it('aaa', () => {
    const reworkMappedReportResponseValue = reworkMapper(REWORK_REPORT_RESPONSE);
    const { getByText, container, debug } = render(
      <ReportForTwoColumns title={'Rework'} data={reworkMappedReportResponseValue} />,
    );
    debug();
    // container.expect(getByText('Total rework')).not.toBeEmptyDOMElement();
    // expect(getByText("From 'block' to 'in dev'")).not.toBeEmptyDOMElement();
    // expect(getByText("From 'waiting for testing' to 'in dev'")).not.toBeEmptyDOMElement();
    // expect(getByText("From 'review' to 'in dev'")).not.toBeEmptyDOMElement();
    // expect(getByText("From 'done' to 'in dev'")).not.toBeEmptyDOMElement();
    // expect(getByText('Total rework cards')).not.toBeEmptyDOMElement();
    // expect(getByText('Rework cards ratio')).not.toBeEmptyDOMElement();
  });
});
