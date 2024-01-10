import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { ClassificationResponse } from '@src/clients/report/dto/response';

export const classificationMapper = (classification: ClassificationResponse[]) => {
  const mappedClassificationValue: ReportDataWithThreeColumns[] = [];

  classification.map((item, index) => {
    const pairsValues: { name: string; value: string }[] = [];

    item.pairList.map((pairItem) => {
      pairsValues.push({ name: pairItem.name, value: `${(pairItem.value * 100).toFixed(2)}%` });
    });

    const classificationValue: ReportDataWithThreeColumns = {
      id: index,
      name: item.fieldName,
      valuesList: pairsValues,
    };
    mappedClassificationValue.push(classificationValue);
  });

  return mappedClassificationValue;
};
