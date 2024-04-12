import { MOCK_REPORT_RESPONSE, PIPELINE_LEAD_TIME, PR_LEAD_TIME, TOTAL_DELAY_TIME } from '../../fixtures';
import { reportMapper } from '@src/hooks/reportMapper/report';
import BoldText from '@src/components/Common/BoldText';
import React from 'react';

export const EXPECTED_REPORT_VALUES = {
  velocityList: [
    { id: 0, name: 'Velocity(Story Point)', valueList: [{ value: 20 }] },
    { id: 1, name: 'Throughput(Cards Count)', valueList: [{ value: 14 }] },
  ],
  cycleTimeList: [
    {
      id: 0,
      name: 'Average cycle time',
      valueList: [
        { value: 21.18, unit: '(Days/SP)' },
        { value: '30.26', unit: '(Days/Card)' },
      ],
    },
    {
      id: 1,
      name: 'Total development time / Total cycle time',
      valueList: [{ value: '57.25%' }],
    },
    {
      id: 2,
      name: 'Average development time',
      valueList: [
        { value: '12.13', unit: '(Days/SP)' },
        { value: '17.32', unit: '(Days/Card)' },
      ],
    },
  ],
  classification: [
    {
      id: 0,
      name: 'FS Work Type',
      valuesList: [{ name: 'Feature Work - Planned', value: '57.14%' }],
    },
  ],
  deploymentFrequencyList: [
    {
      id: 0,
      name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
      valuesList: [
        {
          name: 'Deployment frequency',
          value: '0.30',
        },
      ],
    },
    {
      id: 1,
      name: 'Average',
      valuesList: [
        {
          name: 'Deployment frequency',
          value: '0.40',
        },
      ],
    },
  ],
  devMeanTimeToRecoveryList: [
    {
      id: 0,
      name: 'Heartbeat/:react: Build Frontend',
      valuesList: [
        {
          name: 'Dev mean time to recovery',
          value: '4.32',
        },
      ],
    },
    {
      id: 1,
      name: 'Heartbeat/:cloudformation: Deploy infra',
      valuesList: [
        {
          name: 'Dev mean time to recovery',
          value: '0.00',
        },
      ],
    },
    {
      id: 2,
      name: 'Heartbeat/:rocket: Run e2e',
      valuesList: [
        {
          name: 'Dev mean time to recovery',
          value: '7.67',
        },
      ],
    },
    {
      id: 3,
      name: 'Average',
      valuesList: [
        {
          name: 'Dev mean time to recovery',
          value: '4.00',
        },
      ],
    },
  ],
  leadTimeForChangesList: [
    {
      id: 0,
      name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
      valuesList: [
        { name: PR_LEAD_TIME, value: '45.04' },
        { name: PIPELINE_LEAD_TIME, value: '43.12' },
        { name: TOTAL_DELAY_TIME, value: '88.17' },
      ],
    },
    {
      id: 1,
      name: 'Average',
      valuesList: [
        { name: PR_LEAD_TIME, value: '60.79' },
        { name: PIPELINE_LEAD_TIME, value: '39.03' },
        { name: TOTAL_DELAY_TIME, value: '99.82' },
      ],
    },
  ],
  devChangeFailureRateList: [
    {
      id: 0,
      name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
      valuesList: [
        {
          name: 'Dev change failure rate',
          value: '0.00%(0/2)',
        },
      ],
    },
    {
      id: 1,
      name: 'Average',
      valuesList: [
        {
          name: 'Dev change failure rate',
          value: '0.00%(0/6)',
        },
      ],
    },
  ],
  exportValidityTimeMin: 30,
  reworkList: [
    {
      id: 0,
      name: <React.Fragment>Total rework</React.Fragment>,
      valueList: [
        {
          value: 111,
          unit: ' (times)',
        },
      ],
    },
    {
      id: 3,
      name: (
        <React.Fragment>
          From <BoldText>block</BoldText> to<BoldText> in dev</BoldText>
        </React.Fragment>
      ),
      valueList: [
        {
          value: 111,
          unit: ' (times)',
        },
      ],
    },
    {
      id: 5,
      name: (
        <React.Fragment>
          From <BoldText>review</BoldText> to<BoldText> in dev</BoldText>
        </React.Fragment>
      ),
      valueList: [
        {
          value: 111,
          unit: ' (times)',
        },
      ],
    },
    {
      id: 6,
      name: (
        <React.Fragment>
          From <BoldText>waiting for testing</BoldText> to<BoldText> in dev</BoldText>
        </React.Fragment>
      ),
      valueList: [
        {
          value: 111,
          unit: ' (times)',
        },
      ],
    },
    {
      id: 8,
      name: (
        <React.Fragment>
          From <BoldText>done</BoldText> to<BoldText> in dev</BoldText>
        </React.Fragment>
      ),
      valueList: [
        {
          value: 111,
          unit: ' (times)',
        },
      ],
    },
    {
      id: 9,
      name: <React.Fragment>Total rework cards</React.Fragment>,
      valueList: [
        {
          value: 111,
          unit: ' (cards)',
        },
      ],
    },
    {
      id: 10,
      name: <React.Fragment>Rework cards ratio</React.Fragment>,
      valueList: [
        {
          value: '88.88',
          unit: '% (rework cards/throughput)',
        },
      ],
    },
  ],
};
describe('report response data mapper', () => {
  it('maps response velocity values to ui display value', () => {
    const mappedReportResponseValues = reportMapper(MOCK_REPORT_RESPONSE);

    expect(mappedReportResponseValues).toEqual(EXPECTED_REPORT_VALUES);
  });
});
