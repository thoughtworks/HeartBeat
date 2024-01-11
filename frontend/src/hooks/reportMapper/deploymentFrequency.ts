import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { DeploymentFrequencyResponse } from '@src/clients/report/dto/response';
import { DEPLOYMENT_FREQUENCY_NAME } from '@src/constants/resources';

export const deploymentFrequencyMapper = ({
  avgDeploymentFrequency,
  deploymentFrequencyOfPipelines,
}: DeploymentFrequencyResponse) => {
  const mappedDeploymentFrequencyValue: ReportDataWithThreeColumns[] = [];

  deploymentFrequencyOfPipelines.map((item, index) => {
    const deploymentFrequencyValue: ReportDataWithThreeColumns = {
      id: index,
      name: `${item.name}/${item.step}`,
      valuesList: [{ name: DEPLOYMENT_FREQUENCY_NAME, value: `${item.deploymentFrequency.toFixed(2)}` }],
    };
    mappedDeploymentFrequencyValue.push(deploymentFrequencyValue);
  });
  mappedDeploymentFrequencyValue.push({
    id: mappedDeploymentFrequencyValue.length,
    name: avgDeploymentFrequency.name,
    valuesList: [
      {
        name: DEPLOYMENT_FREQUENCY_NAME,
        value: `${avgDeploymentFrequency.deploymentFrequency.toFixed(2)}`,
      },
    ],
  });
  return mappedDeploymentFrequencyValue;
};
