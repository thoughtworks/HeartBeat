export interface JiraColumn {
  key: string;
  value: {
    name: string;
    statuses: string[];
  };
}

export interface TargetField {
  key: string;
  value: string;
  flag: boolean;
}

export interface Board {
  targetFields: TargetField[];
  jiraColumns: JiraColumn[];
  users: string[];
}
