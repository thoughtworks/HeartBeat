import { deploymentFrequencyMapper } from '@src/hooks/reportMapper/deploymentFrequency';
import { leadTimeForChangesMapper } from '@src/hooks/reportMapper/leadTimeForChanges';
import { meanTimeToRecoveryMapper } from '@src/hooks/reportMapper/meanTimeToRecovery';
import { exportValidityTimeMapper } from '@src/hooks/reportMapper/exportValidityTime';
import { ReportResponse, ReportResponseDTO } from '@src/clients/report/dto/response';
import { changeFailureRateMapper } from '@src/hooks/reportMapper/changeFailureRate';
import { classificationMapper } from '@src/hooks/reportMapper/classification';
import { cycleTimeMapper } from '@src/hooks/reportMapper/cycleTime';
import { velocityMapper } from '@src/hooks/reportMapper/velocity';

export const reportMapper = ({
  velocity,
  cycleTime,
  classificationList,
  deploymentFrequency,
  meanTimeToRecovery,
  leadTimeForChanges,
  changeFailureRate,
  exportValidityTime,
}: ReportResponseDTO): ReportResponse => {
  const velocityList = velocity && velocityMapper(velocity);

  const cycleTimeList = cycleTime && cycleTimeMapper(cycleTime);

  const classification = classificationList && classificationMapper(classificationList);

  const deploymentFrequencyList = deploymentFrequency && deploymentFrequencyMapper(deploymentFrequency);

  const meanTimeToRecoveryList = meanTimeToRecovery && meanTimeToRecoveryMapper(meanTimeToRecovery);

  const leadTimeForChangesList = leadTimeForChanges && leadTimeForChangesMapper(leadTimeForChanges);

  const changeFailureRateList = changeFailureRate && changeFailureRateMapper(changeFailureRate);

  const exportValidityTimeMin = exportValidityTimeMapper(exportValidityTime);

  return {
    velocityList,
    cycleTimeList,
    classification,
    deploymentFrequencyList,
    meanTimeToRecoveryList,
    leadTimeForChangesList,
    changeFailureRateList,
    exportValidityTimeMin,
  };
};
