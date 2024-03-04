package heartbeat.service.board.jira;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AssigneeFilterMethod {

	ASSIGNEE_FIELD_ID("assignee"),

	LAST_ASSIGNEE("lastAssignee"),

	HISTORICAL_ASSIGNEE("historicalAssignee");

	private final String description;

}
