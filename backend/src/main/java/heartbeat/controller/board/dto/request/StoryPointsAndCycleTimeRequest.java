package heartbeat.controller.board.dto.request;

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
public class StoryPointsAndCycleTimeRequest {

	private String token;

	private String type;

	private String site;

	private String project;

	private String boardId;

	private String startTime;

	private String endTime;

	private List<String> status;

	private List<TargetField> targetFields;

	private List<TargetField> overrideFields;

	private boolean treatFlagCardAsBlock;

}
