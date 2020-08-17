export class JiraCardHistory {
  items: HistoryDetail[];

  constructor(items: HistoryDetail[]) {
    this.items = items;
  }
}

export class HistoryDetail {
  fieldId: string;
  timestamp: number;
  from: Status;
  to: Status;

  constructor(fieldId: string, timestamp: number, from: Status, to: Status) {
    this.fieldId = fieldId;
    this.timestamp = timestamp;
    this.from = from;
    this.to = to;
  }
}

export class Status {
  displayValue: string;

  constructor(displayValue: string) {
    this.displayValue = displayValue;
  }
}
