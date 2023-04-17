export interface ReportDataWithTwoColumns {
  id: number
  name: string
  valueList: string[]
}

export interface ReportDataWithThreeColumns {
  id: number
  name: string
  valuesList: {
    name: string
    value: string
  }[]
}
