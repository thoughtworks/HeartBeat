package heartbeat.controller.report.dto.request;

import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.request.ReworkTimesSetting;
import heartbeat.controller.board.dto.response.TargetField;
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

	private String boardId;

	private List<String> doneColumn;

	private List<RequestJiraBoardColumnSetting> boardColumns;

	private Boolean treatFlagCardAsBlock; // todo add default true

	private List<String> users;

	private String assigneeFilter;

	private List<TargetField> targetFields;

	private List<TargetField> overrideFields;

	private ReworkTimesSetting reworkTimesSetting;

}
