import {KanbanVerifyToken} from "../KanbanVerifyToken";
import {KanbanTokenVerifyModel} from "../../../contract/kanban/KanbanTokenVerify";
import {
    ColumnValue,
    JiraColumnResponse,
    KanbanTokenVerifyResponse, TargetField
} from "../../../contract/kanban/KanbanTokenVerifyResponse";
import {LinearClient, User} from "@linear/sdk";
import {LinearFetch, WorkflowState} from "@linear/sdk/dist/_generated_sdk";

export class LinearVerifyToken implements KanbanVerifyToken {
    client: LinearClient;

    constructor(apiKey: string) {
        this.client = new LinearClient({
            apiKey,
        });
    }

    async verifyTokenAndGetColumnsAndUser(
        model: KanbanTokenVerifyModel
    ): Promise<KanbanTokenVerifyResponse> {
        const response = new KanbanTokenVerifyResponse();

        // users
        const issues = await this.client.issues({
            filter: {
                completedAt: {
                    lte: new Date(model.endTime),
                    gte: new Date(model.startTime),
                },
                project: {
                    name: {eq: model.boardId}
                },
            }
        });
        const userNames = Array<string>();
        const issueAssigneePromises: Array<LinearFetch<User> | undefined> = [];
        issues.nodes.forEach(issue => {
            issueAssigneePromises.push(issue.assignee);
        });
        const assignees = await Promise.all(issueAssigneePromises);
        assignees.forEach(assignee => {
            if (assignee && assignee.name && !userNames.includes(assignee.name)) userNames.push(assignee.name);
        });
        response.users = userNames;

        // columns
        const workflows = await this.client.workflowStates();
        workflows.nodes.forEach(workflow => {
            const columnValue = new ColumnValue();
            columnValue.name = workflow.name;
            columnValue.statuses = [workflow.type];
            const jiraColumn = new JiraColumnResponse();
            jiraColumn.key = workflow.type;
            jiraColumn.value = columnValue;
            response.jiraColumns.push(jiraColumn);
        });

        // targetFields: hardCoded
        response.targetFields = [
            {key: "Status", name: "Status", flag: false},
            {key: "Priority", name: "Priority", flag: false},
            {key: "Assignee", name: "Assignee", flag: false},
            {key: "Estimate", name: "Estimate", flag: false},
            {key: "Labels", name: "Labels", flag: false},
        ];

        return new Promise((res, rej) => {
            res(response);
        });
    }
}
