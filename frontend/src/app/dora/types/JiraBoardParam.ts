export class JiraBoardParam {
  type: string;
  site: string;
  email: string;
  token: string;
  projectKey: string;
  startTime: string;
  endTime: string;
  boardId: string;

  constructor({ type, site, email, token, projectKey, startTime, endTime, boardId }) {
    this.type = type;
    this.site = site;
    this.email = email;
    this.token = token;
    this.projectKey = projectKey;
    this.startTime = startTime;
    this.endTime = endTime;
    this.boardId = boardId;
  }
}
