export interface BoardRequestDTO {
  token: string;
  type: string;
  site: string;
  projectKey: string;
  startTime: number | null;
  endTime: number | null;
  boardId: string;
}
