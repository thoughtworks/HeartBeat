import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { DeploymentFrequencyResponse } from '@src/clients/report/dto/response';

export const deploymentFrequencyMapper = ({ deploymentFrequencyOfPipelines }: DeploymentFrequencyResponse) => {
  const mappedDeploymentFrequencyValue: ReportDataWithTwoColumns[] = [];

  deploymentFrequencyOfPipelines.map((item, index) => {
    const deploymentFrequencyValue: ReportDataWithTwoColumns = {
      id: index,
      name: `${item.name}/${item.step}`,
      valueList: [{ value: `${item.deploymentFrequency.toFixed(2)}` }],
    };
    mappedDeploymentFrequencyValue.push(deploymentFrequencyValue);
  });

  return mappedDeploymentFrequencyValue;
};
