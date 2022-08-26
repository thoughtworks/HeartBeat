export class LinearBoardParam {
  type: string;
  teamName: string;
  teamId: string;
  startTime: string;
  endTime: string;
  token: string;

  constructor({ type, teamName, teamId, startTime, endTime, token }) {
    this.type = type;
    this.teamName = teamName;
    this.teamId = teamId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.token = token;
  }
}
