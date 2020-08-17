export class Location {
  projectId: number;
  projectKey: string;
  projectName: string;
  displayName: string;

  constructor(
    projectId: number,
    projectKey: string,
    projectName: string,
    displayName: string
  ) {
    this.projectId = projectId;
    this.projectKey = projectKey;
    this.projectName = projectName;
    this.displayName = displayName;
  }
}

export class Board {
  id: number;
  name: string;
  location: Location;

  constructor(id: number, name: string, location: Location) {
    this.id = id;
    this.name = name;
    this.location = location;
  }
}
