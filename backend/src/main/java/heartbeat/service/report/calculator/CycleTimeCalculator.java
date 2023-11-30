package heartbeat.service.report.calculator;

import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.CycleTimeForSelectedStepItem;
import heartbeat.controller.report.dto.response.CycleTimeResult;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CycleTimeCalculator {

	public CycleTime calculateCycleTime(CardCollection cardCollection,
			List<RequestJiraBoardColumnSetting> boardColumns) {
		Map<String, String> selectedStepsMap = selectedStepsArrayToMap(boardColumns);
		Map<String, Double> totalTimeOfEachStepsMap = addAllCardsTimeUpForEachStep(cardCollection, selectedStepsMap);
		Map<String, Double> aggregatedMap = aggregateResultBySelectedSteps(totalTimeOfEachStepsMap, selectedStepsMap);
		CycleTimeResult cycleTimeResult = calculateAverageTimeAndTotalTime(aggregatedMap, cardCollection,
				selectedStepsMap);
		double cycleTotalTime = cycleTimeResult.getTotalTime();
		double averageCycleTimePerCard = getAverageCycleTimePerCard(cardCollection, cycleTotalTime);
		double averageCycleTimePerSP = getAverageCycleTimePerSP(cardCollection, cycleTotalTime);
		return CycleTime.builder()
			.totalTimeForCards(cycleTotalTime)
			.averageCycleTimePerSP(averageCycleTimePerSP)
			.averageCycleTimePerCard(averageCycleTimePerCard)
			.swimlaneList(cycleTimeResult.getCycleTimeForSelectedStepsList())
			.build();
	}

	private double getAverageCycleTimePerSP(CardCollection cardCollection, double cycleTotalTime) {
		if (cardCollection.getStoryPointSum() == 0) {
			return 0;
		}
		return BigDecimal.valueOf(cycleTotalTime)
			.divide(BigDecimal.valueOf(cardCollection.getStoryPointSum()), 2, RoundingMode.HALF_UP)
			.doubleValue();
	}

	private double getAverageCycleTimePerCard(CardCollection cardCollection, double cycleTotalTime) {
		if (cardCollection.getCardsNumber() == 0) {
			return 0;
		}
		return BigDecimal.valueOf(cycleTotalTime)
			.divide(BigDecimal.valueOf(cardCollection.getCardsNumber()), 2, RoundingMode.HALF_UP)
			.doubleValue();
	}

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
			String column = entry.getKey();
			Double days = entry.getValue();
			String selectedKey = selectedStepsMap.get(column);
			if (selectedKey != null) {
				Double aggregateTime = aggregateMap.get(selectedKey);
				aggregateMap.put(selectedKey, aggregateTime != null ? aggregateTime + days : days);
			}
		}
		return aggregateMap;
	}

	private CycleTimeResult calculateAverageTimeAndTotalTime(Map<String, Double> aggregatedMap,
			CardCollection cardCollection, Map<String, String> selectedStepsMap) {
		List<String> realDoneKeys = selectedStepsMap.entrySet()
			.stream()
			.filter(entry -> entry.getValue().equals(CardStepsEnum.DONE.getValue()))
			.map(Map.Entry::getKey)
			.toList();
		List<CycleTimeForSelectedStepItem> cycleTimeForSelectedStepsList = new ArrayList<>();
		double totalTime = 0.0;
		for (Map.Entry<String, Double> entry : aggregatedMap.entrySet()) {
			String key = entry.getKey();
			double value = BigDecimal.valueOf(entry.getValue()).setScale(2, RoundingMode.HALF_UP).doubleValue();
			if (List.of(CardStepsEnum.ANALYSE, CardStepsEnum.TODO).contains(CardStepsEnum.fromValue(key))
					|| realDoneKeys.contains(key.toUpperCase())) {
				continue;
			}
			CycleTimeForSelectedStepItem cycleTimeOptionalItem = CycleTimeForSelectedStepItem.builder()
				.optionalItemName(key)
				.averageTimeForSP(getAverageCycleTimePerSP(cardCollection, value))
				.averageTimeForCards(getAverageCycleTimePerCard(cardCollection, value))
				.totalTime(value)
				.build();
			cycleTimeForSelectedStepsList.add(cycleTimeOptionalItem);
			totalTime += value;
		}
		return CycleTimeResult.builder()
			.cycleTimeForSelectedStepsList(cycleTimeForSelectedStepsList)
			.totalTime(BigDecimal.valueOf(totalTime).setScale(2, RoundingMode.HALF_UP).doubleValue())
			.build();
	}

}
