package heartbeat.controller.report.vo.request;

import heartbeat.controller.board.vo.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.vo.response.TargetField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraBoardSetting {

	private String type;

	private String token;

	private String site;

	private String projectKey;

	private String teamName;

	private String teamId;

	private String boardId;

	private List<String> doneColumn;

	private List<RequestJiraBoardColumnSetting> boardColumns;

	private Boolean treatFlagCardAsBlock; // todo add default true

	private List<String> users;

	private List<TargetField> targetFields;

}
