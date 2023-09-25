package heartbeat.util;

import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.StatusChangedItem;
import heartbeat.service.report.WorkDay;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class BoardUtil {

	private final WorkDay workDay;

	public List<StatusChangedItem> reformTimeLineForFlaggedCards(List<StatusChangedItem> statusChangedArray) {
		List<Long> needToFilterArray = new ArrayList<>();
		List<StatusChangedItem> timeLine = statusChangedArray.stream()
			.sorted(Comparator.comparingLong(StatusChangedItem::getTimestamp))
			.toList();

		for (int i = 0; i < timeLine.size(); i++) {
			StatusChangedItem statusChangedItem = timeLine.get(i);
			if (!Objects.equals(statusChangedItem.getStatus(), CardStepsEnum.FLAG.getValue())) {
				continue;
			}
			String statusNameAfterBlock = CardStepsEnum.UNKNOWN.getValue();
			if (i > 0) {
				statusNameAfterBlock = timeLine.get(i - 1).getStatus();
			}
			for (int j = i + 1; j < timeLine.size(); j++) {
				if (Objects.equals(timeLine.get(j).getStatus(), CardStepsEnum.REMOVEFLAG.getValue())) {
					timeLine.get(j).setStatus(statusNameAfterBlock);
					break;
				}
				statusNameAfterBlock = timeLine.get(j).getStatus();
				needToFilterArray.add(timeLine.get(j).getTimestamp());
			}
		}
		return timeLine.stream().filter(activity -> !needToFilterArray.contains(activity.getTimestamp())).toList();
	}

	public List<CycleTimeInfo> getCardTimeForEachStep(List<StatusChangedItem> statusChangedItems) {
		if (statusChangedItems.isEmpty()) {
			return null;
		}
		Map<String, Double> result = new HashMap<>();
		List<StatusChangedItem> statusChangedItemArrayList = new ArrayList<>(statusChangedItems);
		for (int i = 0; i < statusChangedItemArrayList.size(); i++) {
			StatusChangedItem statusChangedItem = statusChangedItemArrayList.get(i);
			String status = statusChangedItem.getStatus().toUpperCase();
			double addedTime = result.getOrDefault(status, 0.0);
			double costedTime = getThisStepCostTime(i, statusChangedItemArrayList);
			double value = addedTime + costedTime;
			result.put(status, value);
		}
		List<CycleTimeInfo> cycleTimeInfos = new ArrayList<>();
		for (Map.Entry<String, Double> entry : result.entrySet()) {
			String key = entry.getKey();
			Double value = entry.getValue();
			cycleTimeInfos.add(CycleTimeInfo.builder().column(key).day(value).build());
		}
		return cycleTimeInfos;
	}

	private double getThisStepCostTime(int index, List<StatusChangedItem> statusChangedItems) {
		if (index < statusChangedItems.size() - 1) {
			return workDay.calculateWorkDaysBy24Hours(statusChangedItems.get(index).getTimestamp(),
					statusChangedItems.get(index + 1).getTimestamp());
		}
		return workDay.calculateWorkDaysBy24Hours(statusChangedItems.get(index).getTimestamp(),
				System.currentTimeMillis());
	}

}
