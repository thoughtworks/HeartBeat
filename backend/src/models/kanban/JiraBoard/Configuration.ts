export class Configuration {
  id: number;
  name: string;
  columnConfig: ColumnConfig;

  constructor(id: number, name: string, columnConfig: ColumnConfig) {
    this.id = id;
    this.name = name;
    this.columnConfig = columnConfig;
  }
}

export class ColumnConfig {
  constraintType: string;
  columns: Column[];

  constructor(constraintType: string, columns: Column[]) {
    this.constraintType = constraintType;
    this.columns = columns;
  }
}

export class Column {
  name: string;
  statuses: Status[];

  constructor(name: string, statuses: Status[]) {
    this.name = name;
    this.statuses = statuses;
  }
}
export class Status {
  id: string;
  self: string;

  constructor(id: string, self: string) {
    this.id = id;
    this.self = self;
  }
}
