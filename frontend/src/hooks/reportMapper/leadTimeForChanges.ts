import { LeadTimeForChangesResponse } from '@src/clients/report/dto/response';

export const leadTimeForChangesMapper = ({
  leadTimeForChangesOfPipelines,
  avgLeadTimeForChanges,
}: LeadTimeForChangesResponse) => {
  const minutesPerHour = 60;
  const formatDuration = (duration: number) => {
    return (duration / minutesPerHour).toFixed(2);
  };
  const formatNameDisplay = (name: string) => {
    if (name == 'pipelineLeadTime') return 'Pipeline Lead Time';
    if (name == 'prLeadTime') return 'PR Lead Time';
    if (name == 'totalDelayTime') return 'Total Lead Time';
  };

  const mappedLeadTimeForChangesValue = leadTimeForChangesOfPipelines.map((item, index) => {
    return {
      id: index,
      name: `${item.name}/${item.step}`,
      valuesList: Object.entries(item)
        .slice(-3)
        .map(([name, value]) => ({
          name: formatNameDisplay(name) as string,
          value: formatDuration(value),
        })),
    };
  });

  mappedLeadTimeForChangesValue.push({
    id: mappedLeadTimeForChangesValue.length,
    name: avgLeadTimeForChanges.name,
    valuesList: Object.entries(avgLeadTimeForChanges)
      .slice(-3)
      .map(([name, value]) => ({
        name: formatNameDisplay(name) as string,
        value: formatDuration(value),
      })),
  });

  return mappedLeadTimeForChangesValue;
};
