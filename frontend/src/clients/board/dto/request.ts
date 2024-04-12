export interface BoardRequestDTO {
  token: string;
  type: string;
  site: string;
  email: string;
  boardId: string;
}

export interface BoardInfoRequestDTO {
  token: string;
  type: string;
  site: string;
  email: string;
  startTime: string | null;
  endTime: string | null;
  boardId: string;
  projectKey: string;
}
