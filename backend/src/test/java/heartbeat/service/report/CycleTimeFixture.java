package heartbeat.service.report;

import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.JiraCardDTO;

import java.util.List;

public class CycleTimeFixture {

	public static CardCollection MOCK_CARD_COLLECTION() {
		List<CycleTimeInfo> cycleTimeInfoList = List.of(CycleTimeInfo.builder().column("DOING").day(3.1).build(),
				CycleTimeInfo.builder().column("BLOCKED").day(2.0).build(),
				CycleTimeInfo.builder().column("FLAG").day(1.0).build(),
				CycleTimeInfo.builder().column("DONE").day(9.0).build(),
				CycleTimeInfo.builder().column("TESTING").day(1.3).build());
		List<JiraCardDTO> jiraCardList = List.of(JiraCardDTO.builder().cycleTime(cycleTimeInfoList).build(),
				JiraCardDTO.builder().cycleTime(cycleTimeInfoList).build());

		return CardCollection.builder().storyPointSum(3).cardsNumber(2).jiraCardDTOList(jiraCardList).build();
	}

	public static CardCollection MOCK_CARD_COLLECTION_WITH_ZERO_VALUE() {
		List<CycleTimeInfo> cycleTimeInfoList = List.of(CycleTimeInfo.builder().column("DOING").day(0.0).build(),
				CycleTimeInfo.builder().column("BLOCKED").day(2.0).build(),
				CycleTimeInfo.builder().column("FLAG").day(1.0).build(),
				CycleTimeInfo.builder().column("DONE").day(9.0).build(),
				CycleTimeInfo.builder().column("TESTING").day(1.3).build());
		List<JiraCardDTO> jiraCardList = List.of(JiraCardDTO.builder().cycleTime(cycleTimeInfoList).build());

		return CardCollection.builder().storyPointSum(0).cardsNumber(0).jiraCardDTOList(jiraCardList).build();
	}

	public static CardCollection MOCK_CARD_COLLECTION_COLUMN_WITH_MULTIPLE_STATUSES() {
		List<CycleTimeInfo> cycleTimeInfoList = List.of(CycleTimeInfo.builder().column("IN DOING").day(1.4).build(),
				CycleTimeInfo.builder().column("DOING").day(1.2).build(),
				CycleTimeInfo.builder().column("BLOCKED").day(2.0).build(),
				CycleTimeInfo.builder().column("FLAG").day(1.0).build(),
				CycleTimeInfo.builder().column("TESTING").day(1.3).build(),
				CycleTimeInfo.builder().column("DONE").day(9.0).build());
		List<JiraCardDTO> jiraCardList = List.of(JiraCardDTO.builder().cycleTime(cycleTimeInfoList).build());

		return CardCollection.builder().storyPointSum(2.0).cardsNumber(1).jiraCardDTOList(jiraCardList).build();
	}

	public static List<RequestJiraBoardColumnSetting> JIRA_BOARD_COLUMNS_SETTING() {
		return List.of(RequestJiraBoardColumnSetting.builder().name("TODO").value("To do").build(),
				RequestJiraBoardColumnSetting.builder().name("Doing").value("In Dev").build(),
				RequestJiraBoardColumnSetting.builder().name("Blocked").value("Block").build(),
				RequestJiraBoardColumnSetting.builder().name("Testing").value("Testing").build(),
				RequestJiraBoardColumnSetting.builder().name("Done").value("Done").build());
	}

	public static List<RequestJiraBoardColumnSetting> JIRA_BOARD_COLUMNS_SETTING_WITH_MULTIPLE_STATUSES() {
		return List.of(RequestJiraBoardColumnSetting.builder().name("TODO").value("To do").build(),
				RequestJiraBoardColumnSetting.builder().name("Doing").value("In Dev").build(),
				RequestJiraBoardColumnSetting.builder().name("In Doing").value("In Dev").build(),
				RequestJiraBoardColumnSetting.builder().name("Blocked").value("Block").build(),
				RequestJiraBoardColumnSetting.builder().name("Testing").value("Testing").build(),
				RequestJiraBoardColumnSetting.builder().name("Done").value("Done").build());
	}

	public static List<RequestJiraBoardColumnSetting> JIRA_BOARD_COLUMNS_SETTING_WITH_MULTIPLE_SWIM_LANES() {
		return List.of(RequestJiraBoardColumnSetting.builder().name("TODO").value("To do").build(),
				RequestJiraBoardColumnSetting.builder().name("Doing").value("In Dev").build(),
				RequestJiraBoardColumnSetting.builder().name("Blocked").value("In Dev").build(),
				RequestJiraBoardColumnSetting.builder().name("Testing").value("Testing").build(),
				RequestJiraBoardColumnSetting.builder().name("Done").value("Done").build());
	}

}
