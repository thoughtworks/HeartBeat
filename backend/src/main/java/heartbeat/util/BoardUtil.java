package heartbeat.util;

import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.StatusChangedItem;
import heartbeat.controller.board.dto.response.StatusTimeStamp;
import heartbeat.service.report.WorkDay;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BoardUtil {

	private final WorkDay workDay;

	public List<CycleTimeInfo> reformTimeLineForFlaggedCards(List<StatusChangedItem> statusChangedArray, List<String> realDoneStatus) {
		List<StatusChangedItem> statusChangedBySorted = statusChangedArray.stream()
			.sorted(Comparator.comparingLong(StatusChangedItem::getTimestamp))
			.toList();

		List<StatusChangedItem> flagChangedArray = new ArrayList<>();
		List<StatusChangedItem> columnChangedArray = new ArrayList<>();

		for (StatusChangedItem statusChangedItem : statusChangedBySorted) {
			if (Objects.equals(statusChangedItem.getStatus(), CardStepsEnum.FLAG.getValue()) || Objects.equals(statusChangedItem.getStatus(), CardStepsEnum.REMOVEFLAG.getValue())) {
				flagChangedArray.add(statusChangedItem);
			} else {
				columnChangedArray.add(statusChangedItem);
			}
		}

		List<StatusTimeStamp> flagTimeStamp = getStatusTimeStamp(flagChangedArray);
		List<StatusTimeStamp> columnTimeStamp = getStatusTimeStamp(columnChangedArray);
		List<CycleTimeInfo> cycleTimeInfos = getCycleTimeInfos(realDoneStatus, flagTimeStamp, columnTimeStamp);

		return getCollectRemovedDuplicates(cycleTimeInfos);
	}

	private List<CycleTimeInfo> getCycleTimeInfos(List<String> realDoneStatus, List<StatusTimeStamp> flagTimeStamp, List<StatusTimeStamp> columnTimeStamp) {
		List<CycleTimeInfo> cycleTimeInfos = new ArrayList<>();

		for (StatusTimeStamp columnTimeStampItem : columnTimeStamp) {
			double originColumnTimeInDays = workDay.calculateWorkDaysBy24Hours(columnTimeStampItem.getStartTimestamp(), columnTimeStampItem.getEndTimestamp());
			double realColumnTimeInDays;
			if (realDoneStatus.contains(columnTimeStampItem.getStatus().toUpperCase())){
				realColumnTimeInDays = originColumnTimeInDays;
			} else {
				realColumnTimeInDays = calculateColumnTimeExpectRealDone(flagTimeStamp, columnTimeStampItem, originColumnTimeInDays);
			}
			cycleTimeInfos.add(CycleTimeInfo.builder().day(realColumnTimeInDays).column(columnTimeStampItem.getStatus()).build());
		}
		return cycleTimeInfos;
	}

	private double calculateColumnTimeExpectRealDone(List<StatusTimeStamp> flagTimeStamp, StatusTimeStamp columnTimeStampItem, double originColumnTimeInDays) {
		double totalOverlapTimeInDays = 0.0;
		double totalFlagTimeInDays = 0.0;
		for (StatusTimeStamp flagTimeStampItem : flagTimeStamp) {
			StatusTimeStamp overlapTime = StatusTimeStamp.builder()
				.startTimestamp(Math.max(columnTimeStampItem.getStartTimestamp(), flagTimeStampItem.getStartTimestamp()))
				.endTimestamp(Math.min(columnTimeStampItem.getEndTimestamp(), flagTimeStampItem.getEndTimestamp()))
				.build();
			if (overlapTime.getStartTimestamp() < overlapTime.getEndTimestamp()) {
				double overlapTimeInDays = workDay.calculateWorkDaysBy24Hours(overlapTime.getStartTimestamp(), overlapTime.getEndTimestamp());
				totalOverlapTimeInDays += overlapTimeInDays;
			}

			double flagTimeInDays = workDay.calculateWorkDaysBy24Hours(flagTimeStampItem.getStartTimestamp(), flagTimeStampItem.getEndTimestamp());
			totalFlagTimeInDays += flagTimeInDays;
		}
		double realColumnTimeInDays = 0.0;
		if (Objects.equals(columnTimeStampItem.getStatus(), CardStepsEnum.BLOCK.getValue().toUpperCase())) {
			realColumnTimeInDays = originColumnTimeInDays + totalFlagTimeInDays - totalOverlapTimeInDays;
		} else {
			realColumnTimeInDays = originColumnTimeInDays - totalOverlapTimeInDays;
		}
		return realColumnTimeInDays;
	}

	private static List<CycleTimeInfo> getCollectRemovedDuplicates(List<CycleTimeInfo> cycleTimeInfos) {
		return cycleTimeInfos.stream()
			.collect(Collectors.groupingBy(CycleTimeInfo::getColumn))
			.entrySet()
			.stream()
			.map(entry -> CycleTimeInfo.builder()
				.column(entry.getKey())
				.day(entry.getValue().stream()
					.map(CycleTimeInfo::getDay)
					.mapToDouble(Double::doubleValue)
					.sum())
				.build())
			.collect(Collectors.toList());
	}

	private List<StatusTimeStamp> getStatusTimeStamp(List<StatusChangedItem> statusChangedItems) {
		List<StatusTimeStamp> statusTimeStamps = new ArrayList<>();

		for (int i = 0; i < statusChangedItems.size(); i++) {
			StatusChangedItem flagChangedItem = statusChangedItems.get(i);
			if (!Objects.equals(flagChangedItem.getStatus(), CardStepsEnum.REMOVEFLAG.getValue())) {
			long columnEndTimestamp = getColumnEndTimestamp(i, statusChangedItems);
				statusTimeStamps.add(new StatusTimeStamp(flagChangedItem.getTimestamp(), columnEndTimestamp, flagChangedItem.getStatus()));
			}
		}

		return statusTimeStamps;
	}

	private long getColumnEndTimestamp(int index, List<StatusChangedItem> statusChangedItems) {
		if (index < statusChangedItems.size() - 1) {
			return statusChangedItems.get(index + 1).getTimestamp();
		} else {
			return System.currentTimeMillis();
		}
	}

//	public List<StatusChangedItem> reformTimeLineForFlaggedCards(List<StatusChangedItem> statusChangedArray) {
//		List<Long> needToFilterArray = new ArrayList<>();
//		List<StatusChangedItem> timeLine = statusChangedArray.stream()
//			.sorted(Comparator.comparingLong(StatusChangedItem::getTimestamp))
//			.toList();
//
//		for (int i = 0; i < timeLine.size(); i++) {
//			StatusChangedItem statusChangedItem = timeLine.get(i);
//			if (!Objects.equals(statusChangedItem.getStatus(), CardStepsEnum.FLAG.getValue())) {
//				continue;
//			}
//			String statusNameAfterBlock = CardStepsEnum.UNKNOWN.getValue();
//			if (i > 0) {
//				statusNameAfterBlock = timeLine.get(i - 1).getStatus();
//			}
//			for (int j = i + 1; j < timeLine.size(); j++) {
//				if (Objects.equals(timeLine.get(j).getStatus(), CardStepsEnum.REMOVEFLAG.getValue())) {
//					timeLine.get(j).setStatus(statusNameAfterBlock);
//					break;
//				}
//				statusNameAfterBlock = timeLine.get(j).getStatus();
//				needToFilterArray.add(timeLine.get(j).getTimestamp());
//			}
//		}
//		return timeLine.stream().filter(activity -> !needToFilterArray.contains(activity.getTimestamp())).toList();
//	}

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
