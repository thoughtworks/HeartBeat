import {
  TargetField,
  CSVField,
} from "./../../contract/kanban/KanbanTokenVerifyResponse";
import { parse } from "json2csv";
import {
  JiraCardResponse,
  CycleTimeInfo,
} from "../../contract/kanban/KanbanStoryPointResponse";
import CsvForBoardConfig from "../../fixture/csvForBoardConfig.json";
import CsvForPipeLineConfig from "../../fixture/csvForPipelineConfig.json";
import ObjectsToCsv from "objects-to-csv";
import * as CSV from "csv-string";
import fs from "fs";
import { CsvFileNameEnum } from "../../models/kanban/CsvFileNameEnum";
import { SourceTypeEnum } from "../../models/kanban/CsvSourceTypeEnum";
import { PipelineCsvInfo } from "../../models/pipeline/PipelineCsvInfo";
import { ColumnResponse } from "../../contract/kanban/KanbanTokenVerifyResponse";
import { JiraCard } from "../../models/kanban/JiraBoard/JiraCard";
import _ from "lodash";

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
  jiraColumns: ColumnResponse[],
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

export function getExtraFields(
  targetFields: TargetField[],
  currentFields: CSVField[]
): CSVField[] {
  const extraFields: CSVField[] = [];
  targetFields.forEach((targetField) => {
    let isInCurrentFields = false;
    currentFields.forEach((currentField) => {
      if (
        currentField.label.toLowerCase() === targetField.name.toLowerCase() ||
        currentField.value.indexOf(targetField.key) > -1
      ) {
        isInCurrentFields = true;
      }
    });
    if (!isInCurrentFields) {
      extraFields.push({
        label: targetField.name,
        value: `baseInfo.fields.${targetField.key}`,
        originKey: targetField.key,
      });
    }
  });
  return extraFields;
}

export function insertExtraFields(
  extraFields: CSVField[],
  currentFields: CSVField[]
): void {
  let insertIndex = 0;
  currentFields.forEach((currentField, index) => {
    //insert extra columns in right
    if (currentField.label === "Cycle Time") {
      insertIndex = index + 1;
    }
  });
  currentFields.splice(insertIndex, 0, ...extraFields);
}

export function getFieldDisplayValue(obj: any) {
  let isArray = false;
  let result = "";
  if (_.isArray(obj)) {
    obj = obj[0];
    isArray = true;
  }
  if (_.isObject(obj as any)) {
    if (obj.displayName !== undefined) {
      result = ".displayName";
    } else if (obj.name !== undefined) {
      result = ".name";
    } else if (obj.key !== undefined) {
      result = ".key";
    } else if (obj.value !== undefined) {
      result = ".value";
    }
  } else {
    return false;
  }
  if (isArray) {
    result = "[0]" + result;
  }
  return result;
}

export function updateExtraFields(
  extraFields: CSVField[],
  cards: JiraCardResponse[]
) {
  extraFields.forEach((field) => {
    let hasUpdated = false;
    cards.forEach((card) => {
      if (
        !hasUpdated &&
        field.originKey &&
        _.isObject((card.baseInfo.fields as any)[field.originKey])
      ) {
        const obj = (card.baseInfo.fields as any)[field.originKey];
        const extend = getFieldDisplayValue(obj);
        if (extend) {
          field.value += extend;
          hasUpdated = true;
        }
      }
    });
  });
}

export function getActiveExtraFields(targetFields: TargetField[]) {
  const activeTargetFields = targetFields.filter((field) => field.flag);
  return activeTargetFields;
}

export async function ConvertBoardDataToCsv(
  jiraCardResponses: JiraCardResponse[],
  jiraNonDoneCardResponses: JiraCardResponse[],
  jiraColumns: ColumnResponse[],
  targetFields: TargetField[],
  csvTimeStamp: number
): Promise<void> {
  const activeTargetFields = getActiveExtraFields(targetFields);
  const fields = _.clone(CsvForBoardConfig);
  const extraFields = getExtraFields(activeTargetFields, fields);

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

  updateExtraFields(extraFields, cards);
  insertExtraFields(extraFields, fields);

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
