import { description, request, summary, tagsAll } from "koa-swagger-decorator";
import { body, Context, responses } from "koa-swagger-decorator/dist";
import { GenerateReportRequest } from "../contract/GenerateReporter/GenerateReporterRequestBody";
import { GenerateReporterResponse } from "../contract/GenerateReporter/GenerateReporterResponse";
import { GenerateReportService } from "../services/GenerateReporter/GenerateReportService";
import { DataSourceType } from "../models/kanban/CsvDataSourceType";

@tagsAll(["GenerateReporter"])
export default class GenerateReportController {
  @request("post", "/generateReporter")
  @summary("generateReporter")
  @description("generateReporter")
  @body((GenerateReportRequest as any).swaggerDocument)
  @responses((GenerateReporterResponse as any).swaggerDocument)
  public static async generateReporter(ctx: Context): Promise<void> {
    const request: GenerateReportRequest = ctx.validatedBody;
    ctx.response.body = await new GenerateReportService().generateReporter(
      request
    );
  }

  @request("get", "/exportCsv")
  @summary("exportCsv")
  @description("exportCsv")
  public static async exportCsv(ctx: Context): Promise<void> {
    const request: DataSourceType = ctx.validatedQuery;
    ctx.response.body = await new GenerateReportService().fetchCsvData(
      request.dataType,
      request.csvTimeStamp
    );
  }

  @request("get", "/exportExcel")
  @summary("exportExcel")
  @description("exportExcel")
  public static async exportExcel(ctx: Context): Promise<void> {
    ctx.response.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    ctx.response.set(
      "Content-Disposition",
      `attachment; filename=exportSprintExcel-${ctx.validatedQuery.timeStamp}.xlsx`
    );
    ctx.body = new GenerateReportService().fetchExcelFileStream(
      ctx,
      ctx.validatedQuery.timeStamp
    );
  }
}
