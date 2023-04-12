export interface ReportDataWithTwoColumns {
  id: number
  name: string
  value: string[]
}

export interface ReportDataWithThreeColumns {
  id: number
  name: string
  values: {
    name: string
    value: string
  }[]
}
