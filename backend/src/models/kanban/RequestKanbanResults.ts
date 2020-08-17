import { JiraCardResponse } from "../../contract/kanban/KanbanStoryPointResponse";

export type Cards = {
  storyPointSum: number;
  cardsNumber: number;
  matchedCards: JiraCardResponse[];
};
