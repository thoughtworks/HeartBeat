package heartbeat.service.report;

import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.report.dto.response.BoardCSVConfig;
import lombok.Builder;
import org.apache.commons.lang3.ArrayUtils;

import java.util.List;

@Builder
public class BoardSheetGenerator {

	private List<JiraCardDTO> jiraCardDTOList;

	private List<BoardCSVConfig> fields;

	private List<BoardCSVConfig> extraFields;

	private List<BoardCSVConfig> reworkFields;

	private CSVFileGenerator csvFileGenerator;

	private String[][] sheet;

	String[][] generate() {
		return sheet;
	}

	BoardSheetGenerator mergeBaseInfoAndCycleTimeSheet() {
		String[][] baseInfoAndCycleTimeSheet = csvFileGenerator.assembleBoardData(jiraCardDTOList, fields, extraFields);
		sheet = mergeSheetHorizontally(sheet, baseInfoAndCycleTimeSheet);
		return this;
	}

	BoardSheetGenerator generateReworkTimes() {
		int columnCount = reworkFields.size();
		String[][] reworkTimesSheet = new String[jiraCardDTOList.size() + 1][columnCount];

		for (int column = 0; column < columnCount; column++) {
			reworkTimesSheet[0][column] = reworkFields.get(column).getLabel();
		}
		for (int row = 0; row < jiraCardDTOList.size(); row++) {
			JiraCardDTO cardDTO = jiraCardDTOList.get(row);
			for (int column = 0; column < columnCount; column++) {
				reworkTimesSheet[row + 1][column] = csvFileGenerator.getExtraDataPerRow(cardDTO.getCycleTimeFlat(),
						reworkFields.get(column));
			}
		}
		sheet = mergeSheetHorizontally(sheet, reworkTimesSheet);
		return this;
	}

	private String[][] mergeSheetHorizontally(String[][] sheet, String[][] sheetToMerge) {
		int rows = jiraCardDTOList.size();
		String[][] combinedArray = new String[rows][];
		if (ArrayUtils.isEmpty(sheet)) {
			return sheetToMerge;
		}
		for (int i = 0; i < rows; i++) {
			combinedArray[i] = ArrayUtils.addAll(sheet[i], sheetToMerge[i]);
		}
		return combinedArray;
	}

}
