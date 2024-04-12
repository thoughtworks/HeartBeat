import { devMeanTimeToRecoveryMapper } from '@src/hooks/reportMapper/devMeanTimeToRecovery';
import { devChangeFailureRateMapper } from '@src/hooks/reportMapper/devChangeFailureRate';
import { deploymentFrequencyMapper } from '@src/hooks/reportMapper/deploymentFrequency';
import { leadTimeForChangesMapper } from '@src/hooks/reportMapper/leadTimeForChanges';
import { exportValidityTimeMapper } from '@src/hooks/reportMapper/exportValidityTime';
import { ReportResponse, ReportResponseDTO } from '@src/clients/report/dto/response';
import { classificationMapper } from '@src/hooks/reportMapper/classification';
import { cycleTimeMapper } from '@src/hooks/reportMapper/cycleTime';
import { velocityMapper } from '@src/hooks/reportMapper/velocity';
import reworkMapper from '@src/hooks/reportMapper/reworkMapper';

export const reportMapper = ({
  velocity,
  cycleTime,
  classificationList,
  deploymentFrequency,
  devMeanTimeToRecovery,
  leadTimeForChanges,
  devChangeFailureRate,
  exportValidityTime,
  rework,
}: ReportResponseDTO): ReportResponse => {
  const velocityList = velocity && velocityMapper(velocity);

  const cycleTimeList = cycleTime && cycleTimeMapper(cycleTime);

  const reworkList = rework && reworkMapper(rework);

  const classification = classificationList && classificationMapper(classificationList);

  const deploymentFrequencyList = deploymentFrequency && deploymentFrequencyMapper(deploymentFrequency);

  const devMeanTimeToRecoveryList = devMeanTimeToRecovery && devMeanTimeToRecoveryMapper(devMeanTimeToRecovery);

  const leadTimeForChangesList = leadTimeForChanges && leadTimeForChangesMapper(leadTimeForChanges);

  const devChangeFailureRateList = devChangeFailureRate && devChangeFailureRateMapper(devChangeFailureRate);

  const exportValidityTimeMin = exportValidityTimeMapper(exportValidityTime);

  return {
    velocityList,
    cycleTimeList,
    reworkList,
    classification,
    deploymentFrequencyList,
    devMeanTimeToRecoveryList,
    leadTimeForChangesList,
    devChangeFailureRateList,
    exportValidityTimeMin,
  };
};
