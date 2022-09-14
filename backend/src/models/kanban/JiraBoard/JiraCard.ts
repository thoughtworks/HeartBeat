import { JsonObject, JsonProperty } from "json2typescript";
import { JiraProject } from "./JiraColumn";

@JsonObject("FixVersion")
export class FixVersion {
  @JsonProperty("name", String)
  name: string = "";
}

@JsonObject("Reporter")
export class Reporter {
  @JsonProperty("displayName", String)
  displayName: string = "";
}

@JsonObject("Issuetype")
export class Issuetype {
  @JsonProperty("name", String)
  name: string = "";
}

@JsonObject("Assignee")
export class Assignee {
  @JsonProperty("accountId", String)
  accountId: string = "";
  @JsonProperty("displayName", String)
  displayName: string = "";
}

@JsonObject("Status")
export class Status {
  @JsonProperty("name", String)
  name: string = "";
}

@JsonObject("Priority")
export class Priority {
  @JsonProperty("name", String)
  name: string = "";
}

@JsonObject("CardParentFields")
export class CardParentFields {
  @JsonProperty("summary", String)
  summary: string = "";
}

@JsonObject("CardParent")
export class CardParent {
  @JsonProperty("fields", CardParentFields)
  fields?: CardParentFields = undefined;
}

@JsonObject("Sprint")
export class Sprint {
  @JsonProperty("name", String)
  name: string = "";
}

export class CardCustomFieldKey {
  static STORY_POINTS = "";
  static SPRINT = "";
  static FLAGGED = "";
}

export class JiraCardField {
  summary: string = "";
  status?: Status = undefined;
  assignee?: Assignee = undefined;
  issuetype?: Issuetype = undefined;
  reporter?: Reporter = undefined;
  statuscategorychangedate: string = "";
  storyPoints?: number = 0;
  fixVersions: FixVersion[] = [];
  project?: JiraProject = undefined;
  priority?: Priority = undefined;
  parent?: CardParent = undefined;
  label?: string = "";
  sprint?: string = "";
}

@JsonObject("JiraCard")
export class JiraCard {
  @JsonProperty("key", String)
  key: string = "";
  @JsonProperty("fields", JiraCardField)
  fields: JiraCardField = new JiraCardField();
}

@JsonObject("JiraCards")
export class JiraCards {
  @JsonProperty("total", Number)
  total: number = 0;
  @JsonProperty("issues", [JiraCard])
  issues: JiraCard[] = [];
}
