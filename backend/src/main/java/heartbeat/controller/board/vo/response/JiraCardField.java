package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraCardField {

	private String summary;

	private Status status;

	private Assignee assignee;

	private IssueType issuetype;

	private Reporter reporter;

	private String statusCategoryChangeDate;

	private int storyPoints;

	private List<FixVersion> fixVersions;

	private JiraProject project;

	private Priority priority;

	private CardParent parent;

	private String label;

}

class FixVersion {

	public String name;

}

class Reporter {

	public String displayName;

}

class IssueType {

	public String name;

}

class Assignee {

	public String accountId;

	public String displayName;

}

class Status {

	public String name;

}

class Priority {

	public String name;

}

class CardParentFields {

	public String summary;

}

class CardParent {

	public CardParentFields fields;

}

class Sprint {

	public String name;

}

class CardCustomFieldKey {

	public static final String STORY_POINTS = "";

	public static final String SPRINT = "";

	public static final String FLAGGED = "";

}

class JiraProject {

	public String id;

	public String key;

	public String name;

}

class JiraCards {

	public Integer total;

	public List<JiraCard> issues;

}

class JiraCard {

	private String key;

	private JiraCardField fields;

}
