package heartbeat.controller.board.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.util.DecimalUtil;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JiraCardDTO {

	private JiraCard baseInfo;

	private List<CycleTimeInfo> cycleTime;

	private List<CycleTimeInfo> originCycleTime;

	private CardCycleTime cardCycleTime;

	private Object cycleTimeFlat;

	@Nullable
	private String totalCycleTimeDivideStoryPoints;

	@JsonIgnore
	public String getTotalCycleTimeDivideStoryPoints() {
		if (this.getBaseInfo() == null || this.getCardCycleTime() == null || this.getBaseInfo().getFields() == null) {
			return "";
		}
		double storyPoints = this.getBaseInfo().getFields().getStoryPoints();
		double cardCycleTime = this.getCardCycleTime().getTotal();

		String formattedResult = DecimalUtil.formatDecimalTwo(cardCycleTime / storyPoints);
		return storyPoints > 0.0 ? formattedResult : "";
	}

	@JsonIgnore
	public Object buildCycleTimeFlatObject() {
		if (this.getOriginCycleTime() == null) {
			return null;
		}
		HashMap<String, Double> cycleTimeFlat = new HashMap<>();
		for (int j = 0; j < this.getOriginCycleTime().size(); j++) {
			CycleTimeInfo cycleTimeInfo = this.getOriginCycleTime().get(j);
			cycleTimeFlat.put(cycleTimeInfo.getColumn().trim(), cycleTimeInfo.getDay());
		}
		return cycleTimeFlat;
	}

}
