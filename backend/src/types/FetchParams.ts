export class FetchParams {
  page: string;
  per_page: string;
  finished_from?: Date;
  created_to?: Date;

  constructor(
    page: string,
    per_page: string,
    finished_from?: Date,
    created_to?: Date
  ) {
    this.page = page;
    this.per_page = per_page;
    this.finished_from = finished_from;
    this.created_to = created_to;
  }
}
