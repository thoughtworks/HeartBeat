import { ClassificationResp } from '../models/response/reportResp'
import { ReportDataWithThreeColumns } from '@src/models/reportUIDataStructure'

export const classificationMapper = (classification: ClassificationResp[]) => {
  const mappedClassificationValue: ReportDataWithThreeColumns[] = []

  classification.map((item) => {
    const pairsValues: { name: string; value: string }[] = []

    item.pairs.map((pairItem) => {
      pairsValues.push({ name: pairItem.name, value: pairItem.value })
    })

    const classificationValue: ReportDataWithThreeColumns = {
      id: mappedClassificationValue.length + 1,
      name: item.fieldName,
      values: pairsValues,
    }
    mappedClassificationValue.push(classificationValue)
  })

  return mappedClassificationValue
}
