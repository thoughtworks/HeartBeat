export class JiraCardtype {
  name: string;
  fields: JiraCardFields;

  constructor(name: string, fields: string[]) {
    this.name = name;
    this.fields = fields;
  }
}

export class JiraCardTypeResponse {
  issuetypes: JiraCardtype[];

  constructor(issuetypes: JiraCardtype[]) {
    this.issuetypes = issuetypes;
  }
}

export class JiraCardFields {}

export const fieldsIgonre: string[] = [
  "summary",
  "description",
  "attachment",
  "duedate",
  "issuelinks",
];
