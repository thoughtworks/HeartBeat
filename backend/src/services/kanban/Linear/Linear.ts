import {Kanban} from "../Kanban";
import sortBy from "lodash/sortBy";
import {StoryPointsAndCycleTimeRequest} from "../../../contract/kanban/KanbanStoryPointParameterVerify";
import {
    ColumnValue,
    JiraColumnResponse,
} from "../../../contract/kanban/KanbanTokenVerifyResponse";
import {Cards} from "../../../models/kanban/RequestKanbanResults";
import {RequestKanbanColumnSetting} from "../../../contract/GenerateReporter/GenerateReporterRequestBody";
import {IssueHistory, LinearClient} from "@linear/sdk";
import {JiraCardResponse} from "../../../contract/kanban/KanbanStoryPointResponse";
import {
    confirmThisCardHasAssignedBySelectedUser,
    getCardTimeForEachStep,
    sortStatusChangedArray,
    StatusChangedArrayItem,
    transformLinearCardToJiraCard,
} from "../util";
import {IssueConnection} from "@linear/sdk/dist/_generated_sdk";

export enum LinearColumnType {
    BACKLOG = "backlog",
    UNSTARTED = "unstarted",
    CANCELED = "canceled",
    COMPLETED = "completed",
    STARTED = "started",
    BLOCK = "block",
}

export class Linear implements Kanban {
    private client: LinearClient;

    constructor(token: string) {
        this.client = new LinearClient({
            apiKey: token,
        });
    }

    async getColumns(): Promise<JiraColumnResponse[]> {
        const workflows = await this.client.workflowStates();
        return workflows.nodes.map(workflow => {
            const columnValue = new ColumnValue();
            columnValue.name = workflow.name;
            columnValue.statuses = [workflow.type];
            const jiraColumn = new JiraColumnResponse();
            jiraColumn.key = workflow.type;
            jiraColumn.value = columnValue;
            return jiraColumn;
        });
    }

    async getStoryPointsAndCycleTime(
        model: StoryPointsAndCycleTimeRequest,
        boardColumns: RequestKanbanColumnSetting[],
        users: string[]
    ): Promise<Cards> {
        const allCards = await this.client.issues({
            filter: {
                updatedAt: {
                    lte: new Date(model.endTime),
                    gte: new Date(model.startTime),
                },
                project: {
                    name: {eq: model.boardId}
                },
                state: {
                    type: {eq: LinearColumnType.COMPLETED},
                },
            },
        });

        return this.generateCardsCycleTime(allCards, users);
    }

    async getStoryPointsAndCycleTimeForNonDoneCards(
        model: StoryPointsAndCycleTimeRequest,
        boardColumns: RequestKanbanColumnSetting[],
        users: string[]
    ): Promise<Cards> {
        const allCards = await this.client.issues({
            filter: {
                updatedAt: {
                    lte: new Date(model.endTime),
                    gte: new Date(model.startTime),
                },
                project: {
                    name: {eq: model.boardId}
                },
                state: {
                    type: {neq: LinearColumnType.COMPLETED},
                },
            },
        });
        // 97321
        // const arr = await Promise.all(allCards.nodes.map(item => item.history()));
        // arr.map(item => {
        //     console.log("!!----------------------------------------");
        //     console.log(item.nodes);
        //
        // });
        return this.generateCardsCycleTime(allCards, users);
    }

    private static async getAssigneeSet(
        activities: IssueHistory[]
    ): Promise<Set<string>> {
        const assigneeSet = new Set<string>();
        for (const activity of activities) {
            const toAssignee = await activity.toAssignee;
            if (toAssignee) {
                assigneeSet.add(toAssignee.name);
            }
        }
        // console.log(assigneeSet);
        return assigneeSet;
    }

    private async generateCardsCycleTime(
        allCards: IssueConnection,
        users: string[]
    ): Promise<Cards> {
        const matchedCards: JiraCardResponse[] = [];
        let storyPointSum = 0;
        for (const card of allCards.nodes) {
            const cardHistory = await card.history();
            const assigneeSet = await Linear.getAssigneeSet(cardHistory.nodes);
            if (confirmThisCardHasAssignedBySelectedUser(users, assigneeSet)) {
                const statusChangedArray: StatusChangedArrayItem[] = await Linear.putStatusChangeEventsIntoAnArray(
                    cardHistory.nodes
                );
                const cycleTimeInfo = getCardTimeForEachStep(
                    statusChangedArray,
                    sortStatusChangedArray(statusChangedArray)
                );
                const cardResponse = new JiraCardResponse(
                    await transformLinearCardToJiraCard(card),
                    cycleTimeInfo,
                    cycleTimeInfo
                );
                matchedCards.push(cardResponse);
                storyPointSum += card.estimate || 0;
            }
        }

        const cardsNumber = matchedCards.length;

        return {storyPointSum, cardsNumber, matchedCards};
    }

    private static async putStatusChangeEventsIntoAnArray(
        cardHistory: IssueHistory[]
    ): Promise<StatusChangedArrayItem[]> {
        const statusChangedArray: StatusChangedArrayItem[] = [];
        const sortedAndStateRelatedHistory = cardHistory.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).filter((item, index) => {
            if (index === 0) return true;
            return !(!item.fromState && !item.toState);
        });
        if (sortedAndStateRelatedHistory.length === 1) {
            const issue = await sortedAndStateRelatedHistory[0].issue;
            const status: string = (await issue?.state)?.name || "";
            statusChangedArray.push({timestamp: sortedAndStateRelatedHistory[0].createdAt.getTime(), status});
        } else {
            for (let i = 0; i < sortedAndStateRelatedHistory.length; i++) {
                if (i === 0) {
                    statusChangedArray.push({
                        timestamp: sortedAndStateRelatedHistory[0].createdAt.getTime(),
                        status: (await sortedAndStateRelatedHistory[1].fromState)?.name || ""
                    });
                } else if (i > 0 && sortedAndStateRelatedHistory[i].toState) {
                    statusChangedArray.push({
                        timestamp: sortedAndStateRelatedHistory[i].createdAt.getTime(),
                        status: (await sortedAndStateRelatedHistory[i].toState)?.name || ""
                    });
                }
            }
        }
        return statusChangedArray;
    }
}
