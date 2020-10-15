import { parse } from "json2csv";
import {
  JiraCardResponse,
  CycleTimeInfo,
} from "../../contract/kanban/KanbanStoryPointResponse";
import CsvForBoardConfig from "../../fixture/csvForBoardConfig.json";
import CsvForPipeLineConfig from "../../fixture/csvForPipelineConfig.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectsToCsv = require("objects-to-csv");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CSV = require("csv-string");
import fs from "fs";
import { CsvFileNameEnum } from "../../models/kanban/CsvFileNameEnum";
import { SourceTypeEnum } from "../../models/kanban/CsvSourceTypeEnum";
import { PipelineCsvInfo } from "../../models/pipeline/PipelineCsvInfo";
import { JiraColumnResponse } from "../../contract/kanban/KanbanTokenVerifyResponse";
import { JiraCard } from "../../models/kanban/JiraCard";

function GenerateObjectArrayToCsvFile(arr: any): any {
  const jsonObj = [];
  const headers = [];
  for (let k = 0; k < arr[0].length; k++) {
    headers.push(arr[0][k]);
  }
  for (let i = 1; i < arr.length; i++) {
    const data = arr[i];
    const obj: any = {};
    for (let j = 0; j < data.length; j++) {
      obj[headers[j].trim()] = data[j].trim();
    }
    jsonObj.push(obj);
  }

  return jsonObj;
}

function getBlank(): JiraCardResponse[] {
  const baseInfo = new JiraCard();
  const cycleTime = Array.of<CycleTimeInfo>();
  const jiraCardWithEmptyValue: JiraCardResponse = new JiraCardResponse(
    baseInfo,
    cycleTime
  );
  jiraCardWithEmptyValue.baseInfo.fields.storyPoints = undefined;

  return Array.of<JiraCardResponse>(jiraCardWithEmptyValue);
}

function getIndexForStatus(
  jiraColumns: JiraColumnResponse[],
  status: string
): number {
  for (let index = 0; index < jiraColumns.length; index++) {
    const statuses = jiraColumns[index].value.statuses;
    if (statuses.indexOf(status.toUpperCase()) > -1) {
      return index;
    } else {
      continue;
    }
  }
  return jiraColumns.length;
}

export async function ConvertBoardDataToCsv(
  jiraCardResponses: JiraCardResponse[],
  jiraNonDoneCardResponses: JiraCardResponse[],
  jiraColumns: JiraColumnResponse[],
  csvTimeStamp: number
): Promise<void> {
  const fields = CsvForBoardConfig;

  jiraNonDoneCardResponses.sort((a, b) => {
    if (
      a.baseInfo.fields.status == undefined ||
      b.baseInfo.fields.status == undefined
    )
      return jiraColumns.length + 1;
    else {
      return (
        getIndexForStatus(jiraColumns, b.baseInfo.fields.status.name) -
        getIndexForStatus(jiraColumns, a.baseInfo.fields.status.name)
      );
    }
  });

  const cards = jiraCardResponses
    .concat(getBlank())
    .concat(jiraNonDoneCardResponses);
  const columns = new Set<string>();
  cards.forEach((jiraCard) => {
    jiraCard.originCycleTime.forEach((cardCycleTime) =>
      columns.add(cardCycleTime.column)
    );
  });
  columns.forEach((column) =>
    fields.push({
      label: "OriginCycleTime: " + column,
      value: "cycleTimeFlat." + column,
    })
  );

  cards.forEach((jiraCard) => {
    jiraCard.buildCycleTimeFlatObject();
    jiraCard.calculateTotalCycleTimeDivideStoryPoints();
  });

  const csvString = parse(cards, { fields });
  const csvArray = GenerateObjectArrayToCsvFile(CSV.parse(csvString));
  new ObjectsToCsv(csvArray).toDisk(
    `${CsvFileNameEnum.BOARD}-${csvTimeStamp}.csv`
  );
}

export async function ConvertPipelineDataToCsv(
  csvData: PipelineCsvInfo[],
  csvTimeStamp: number
): Promise<void> {
  const fields = CsvForPipeLineConfig;
  const csvString = parse(csvData, { fields });
  const csvArray = GenerateObjectArrayToCsvFile(CSV.parse(csvString));
  new ObjectsToCsv(csvArray).toDisk(
    `${CsvFileNameEnum.PIPELINE}-${csvTimeStamp}.csv`
  );
}

function ReadStringFromCSVFile(fileName: string): string {
  try {
    const data = fs.readFileSync(fileName, "utf8");
    return data;
  } catch (e) {
    throw Error("read csv file error");
  }
}

export async function GetDataFromCsv(
  dataType: string,
  csvTimeStamp: number
): Promise<string> {
  switch (dataType) {
    case SourceTypeEnum.BOARD:
      return ReadStringFromCSVFile(
        `${CsvFileNameEnum.BOARD}-${csvTimeStamp}.csv`
      );
    case SourceTypeEnum.PIPELINE:
      return ReadStringFromCSVFile(
        `${CsvFileNameEnum.PIPELINE}-${csvTimeStamp}.csv`
      );
    default:
      return "";
  }
}
