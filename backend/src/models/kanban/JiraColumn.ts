export class JiraColumnIssueType {
  id: string;
  name: string;
  statuses: JiraColumn[];

  constructor(id: string, name: string, statuses: JiraColumn[]) {
    this.id = id;
    this.name = name;
    this.statuses = statuses;
  }
}

export class JiraColumn {
  id: string;
  untranslatedName: string;
  statusCategory: StatusCategory;

  constructor(
    id: string,
    untranslatedName: string,
    statusCategory: StatusCategory
  ) {
    this.id = id;
    this.untranslatedName = untranslatedName;
    this.statusCategory = statusCategory;
  }
}

export class JiraProject {
  id: string;
  key: string;
  name: string;

  constructor(id: string, key: string, name: string) {
    this.id = id;
    this.key = key;
    this.name = name;
  }
}

export class StatusCategory {
  id: string;
  key: string;

  constructor(id: string, key: string) {
    this.id = id;
    this.key = key;
  }
}
