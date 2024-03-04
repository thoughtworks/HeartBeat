export interface ReportDataWithTwoColumns {
  id: number;
  name: string;
  valueList: ValueWithUnits[];
}

export interface ValueWithUnits {
  value: number | string;
  unit?: string;
}

export interface ReportDataWithThreeColumns {
  id: number;
  name: string;
  valuesList: {
    name: string;
    value: string;
  }[];
}
