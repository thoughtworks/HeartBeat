package heartbeat.service.report.calculator;

import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.CycleTimeForSelectedStepItem;
import heartbeat.controller.report.dto.response.CycleTimeResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class CycleTimeCalculator {

	private Map<String, String> selectedStepsArrayToMap(List<RequestJiraBoardColumnSetting> boardColumns) {

		Map<String, String> map = new HashMap<>();
		for (RequestJiraBoardColumnSetting boardColumn : boardColumns) {
			map.put(boardColumn.getName().toUpperCase(), boardColumn.getValue());
		}
		return map;
	}

	private Map<String, Double> addAllCardsTimeUpForEachStep(CardCollection cardCollection,
			Map<String, String> selectedStepsMap) {
		Map<String, Double> tempSwimlaneMap = new HashMap<>();
		cardCollection.getJiraCardDTOList()
			.stream()
			.flatMap(jiraCardResponse -> jiraCardResponse.getCycleTime().stream())
			.forEach(partTime -> {
				String column = partTime.getColumn();
				if (column.equals(CardStepsEnum.FLAG.getValue())) {
					selectedStepsMap.put(column, CardStepsEnum.BLOCK.getValue());
				}

				selectedStepsMap.entrySet().stream().filter(entry -> entry.getKey().equals(column)).forEach(entry -> {
					Double day = tempSwimlaneMap.get(column);
					if (day == null) {
						day = 0.0;
					}
					tempSwimlaneMap.put(column, day + partTime.getDay());
				});
			});
		return tempSwimlaneMap;
	}

	private Map<String, Double> aggregateResultBySelectedSteps(Map<String, Double> totalTimeOfEachStepsMap,
			Map<String, String> selectedStepsMap) {
		Map<String, Double> aggregateMap = new HashMap<>();

		for (Map.Entry<String, Double> entry : totalTimeOfEachStepsMap.entrySet()) {
			String key = entry.getKey();
			Double value = entry.getValue();
			String selectedKey = selectedStepsMap.get(key);
			if (selectedKey != null) {
				Double aggregateTime = aggregateMap.get(selectedKey);
				aggregateMap.put(selectedKey, aggregateTime != null ? aggregateTime + value : value);
			}
		}
		return aggregateMap;
	}

	private CycleTimeResult calculateAverageTimeAndTotalTime(Map<String, Double> aggregatedMap,
			CardCollection cardCollection) {
		List<CycleTimeForSelectedStepItem> cycleTimeForSelectedStepsList = new ArrayList<>();
		double totalTime = 0;
		for (Map.Entry<String, Double> entry : aggregatedMap.entrySet()) {
			String key = entry.getKey();
			double value = entry.getValue();
			if (List.of(CardStepsEnum.ANALYSE, CardStepsEnum.TODO, CardStepsEnum.DONE)
				.contains(CardStepsEnum.fromValue(key))) {
				continue;
			}
			CycleTimeForSelectedStepItem cycleTimeOptionalItem = CycleTimeForSelectedStepItem.builder()
				.optionalItemName(key)
				.averageTimeForSP(String.format("%.2f",
						Double.parseDouble(String.valueOf(value / cardCollection.getStoryPointSum()))))
				.averageTimeForCards(String.format("%.2f",
						Double.parseDouble(String.valueOf(value / cardCollection.getCardsNumber()))))
				.totalTime(String.format("%.2f", value))
				.build();

			cycleTimeForSelectedStepsList.add(cycleTimeOptionalItem);
			totalTime += value;
		}
		return CycleTimeResult.builder()
			.cycleTimeForSelectedStepsList(cycleTimeForSelectedStepsList)
			.totalTime(String.format("%.2f", totalTime))
			.build();
	}

	public CycleTime calculateCycleTime(CardCollection cardCollection,
			List<RequestJiraBoardColumnSetting> boardColumns) {
		Map<String, String> selectedStepsMap = selectedStepsArrayToMap(boardColumns);
		Map<String, Double> totalTimeOfEachStepsMap = addAllCardsTimeUpForEachStep(cardCollection, selectedStepsMap);
		Map<String, Double> aggregatedMap = aggregateResultBySelectedSteps(totalTimeOfEachStepsMap, selectedStepsMap);
		CycleTimeResult cycleTimeResult = calculateAverageTimeAndTotalTime(aggregatedMap, cardCollection);
		double cycleTotalTime = Double.parseDouble(cycleTimeResult.getTotalTime());
		return CycleTime.builder()
			.totalTime(cycleTotalTime)
			.averageCycleTimePerSP(String.format("%.2f", cycleTotalTime / cardCollection.getStoryPointSum()))
			.averageCircleTimePerCard(String.format("%.2f", cycleTotalTime / cardCollection.getCardsNumber()))
			.cycleTimeForSelectedStepsList(cycleTimeResult.getCycleTimeForSelectedStepsList())
			.build();
	}

}
