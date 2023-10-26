package heartbeat.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AssigneeFilterMethod {

	LAST_ASSIGNEE("lastAssignee"),

	HISTORICAL_ASSIGNEE("historicalAssignee");

	private final String description;
}
