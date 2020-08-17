import {
  ClassificationField,
  ClassificationNameValuePair,
} from "../../contract/GenerateReporter/GenerateReporterResponse";
import { Cards } from "../../models/kanban/RequestKanbanResults";
import { TargetField } from "../../contract/kanban/KanbanTokenVerifyResponse";
import { JiraCardResponse } from "../../contract/kanban/KanbanStoryPointResponse";

function pickDisplayNameFromObj(obj: any): string {
  if (obj == null) return "None";
  if (obj.displayName !== undefined) return obj.displayName;
  if (obj.name !== undefined) return obj.name;
  if (obj.key !== undefined) return obj.key;
  if (obj.value !== undefined) return obj.value;

  const regexSprintName = RegExp("name=.*", "g");
  let nameString;
  if (
    typeof obj === "string" &&
    (nameString = regexSprintName.exec(obj)) != null
  )
    return nameString[0].replace("name=", "").split(",")[0];

  return obj.toString();
}

function mapArrayField(
  resultMap: Map<string, Map<string, number>>,
  fieldsKey: string,
  obj: Array<Record<string, any>>
) {
  const map = resultMap.get(fieldsKey);
  if (map && obj.length > 0) {
    obj.forEach(function (p1: Record<string, any>) {
      if (p1 !== undefined) {
        const displayName = pickDisplayNameFromObj(p1);
        const count = map.get(displayName);
        map.set(displayName, count ? count + 1 : 1);
      }
    });
    if (obj.length > 0) map.set("None", map.get("None")! - 1);
  }
}

export function getClassificationOfSelectedFields(
  cards: Cards,
  targetFields: TargetField[]
): ClassificationField[] {
  const classificationFields: ClassificationField[] = [];
  const resultMap: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();
  const nameMap = new Map<string, string>();

  targetFields
    .filter((it) => it.flag == true)
    .forEach(function (targetField: TargetField) {
      resultMap.set(
        targetField.key,
        new Map<string, number>().set("None", cards.cardsNumber)
      );
      nameMap.set(targetField.key, targetField.name);
    });
  cards.matchedCards.forEach(function (jiraCardResponse: JiraCardResponse) {
    const tempFields: Record<string, any> = jiraCardResponse.baseInfo.fields;
    for (const tempFieldsKey in tempFields) {
      const obj = tempFields[tempFieldsKey];
      if (Array.isArray(obj)) {
        mapArrayField(resultMap, tempFieldsKey, tempFields[tempFieldsKey]);
      } else if (obj !== undefined) {
        const map = resultMap.get(tempFieldsKey);
        if (map) {
          const displayName = pickDisplayNameFromObj(obj);
          const count = map.get(displayName);
          map.set(displayName, count ? count + 1 : 1);
          map.set("None", map.get("None")! - 1);
        }
      }
    }
  });
  resultMap.forEach(function (map: Map<string, number>, fieldName: string) {
    const classificationNameValuePair: ClassificationNameValuePair[] = [];
    if (map.get("None") == 0) {
      map.delete("None");
    }
    map.forEach((count: number, displayName: string) => {
      classificationNameValuePair.push({
        name: displayName,
        value: ((count / cards.cardsNumber) * 100).toFixed(2) + "%",
      });
    });
    classificationFields.push({
      fieldName: nameMap.get(fieldName)!,
      pairs: classificationNameValuePair,
    });
  });
  return classificationFields;
}
