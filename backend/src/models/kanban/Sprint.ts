export class Sprint {
  id: number = 0;
  state: string = "";
  name: string = "";
  startDate: string = "";
  endDate: string = "";
  completeDate: string = "";

  constructor(
    id: number,
    state: string,
    name: string,
    startDate?: string,
    endDate?: string,
    completeDate?: string
  ) {
    this.id = id;
    this.state = state;
    this.name = name;
    this.startDate = startDate || "";
    this.endDate = endDate || "";
    this.completeDate = completeDate || "";
  }
}
