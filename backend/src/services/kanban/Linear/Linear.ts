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

        // const workflows = await this.client.workflowStates();
        // const columns = workflows.nodes.map((workflow) => {
        //     const columnValue = new ColumnValue();
        //     columnValue.statuses = [workflow.type];
        //     const columnResponse = new JiraColumnResponse();
        //     columnResponse.key = workflow.type;
        //     columnResponse.value = columnValue;
        //     return columnResponse;
        // });
        // return Promise.resolve(columns);
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
                // team: { id: { eq: model.project } },
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
        console.log("本轮为:");
        for (const card of allCards.nodes) {
            console.log(card.title + "--------------------");
            const cardHistory = await card.history();
            const assigneeSet = await Linear.getAssigneeSet(cardHistory.nodes);
            // console.log(`第${allCards.nodes.indexOf(card)}张卡片的历史为:`, cardHistory.nodes, card.title);
            if (confirmThisCardHasAssignedBySelectedUser(users, assigneeSet)) {
                const statusChangedArray: StatusChangedArrayItem[] = await Linear.putStatusChangeEventsIntoAnArray(
                    cardHistory.nodes
                );
                console.log(`第${allCards.nodes.indexOf(card)}张卡片的历史为`, statusChangedArray);
                const cycleTimeInfo = getCardTimeForEachStep(
                    statusChangedArray,
                    sortStatusChangedArray(statusChangedArray)
                );
                // console.log(`第${allCards.nodes.indexOf(card)}张卡片的info为`, cycleTimeInfo);
                const cardResponse = new JiraCardResponse(
                    await transformLinearCardToJiraCard(card),
                    cycleTimeInfo,
                    cycleTimeInfo
                );
                // console.log(`第${allCards.nodes.indexOf(card)}张卡片的info为`, cardResponse);
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
        cardHistory.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        if (cardHistory.length === 1) {
            statusChangedArray.push({timestamp: cardHistory[0].createdAt.getTime(), status: "Done"});
        } else {
            for (let i = 0; i < cardHistory.length; i++) {
                if (i === 0) {
                    statusChangedArray.push({
                        timestamp: cardHistory[0].createdAt.getTime(),
                        status: (await cardHistory[1].fromState)?.name || ""
                    });
                } else if (i > 0 && cardHistory[i].toState) {
                    statusChangedArray.push({
                        timestamp: cardHistory[i].createdAt.getTime(),
                        status: (await cardHistory[i].toState)?.name || ""
                    });
                }
            }
        }
        return statusChangedArray;
    }
}
