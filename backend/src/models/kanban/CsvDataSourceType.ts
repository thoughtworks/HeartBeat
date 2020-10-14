export class DataSourceType {
  dataType: string;
  csvTimeStamp: number;

  constructor(dataType: string, csvTimeStamp: number) {
    this.dataType = dataType;
    this.csvTimeStamp = csvTimeStamp;
  }
}
