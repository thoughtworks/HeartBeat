export class StatusSelf {
  self: string;
  name: string;
  untranslatedName: string;
  statusCategory: StatusCategory;

  constructor(
    self: string,
    name: string,
    untranslatedName: string,
    statusCategory: StatusCategory
  ) {
    this.self = self;
    this.name = name;
    this.untranslatedName = untranslatedName;
    this.statusCategory = statusCategory;
  }
}

export class StatusCategory {
  key: string;
  name: string;

  constructor(key: string, name: string) {
    this.key = key;
    this.name = name;
  }
}
