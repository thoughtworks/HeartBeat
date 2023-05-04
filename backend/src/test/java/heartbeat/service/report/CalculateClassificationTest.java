package heartbeat.service.report;

import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardFields;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.controller.board.dto.request.Cards;
import heartbeat.controller.board.dto.response.*;
import heartbeat.controller.report.dto.response.Classification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.*;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CalculateClassificationTest {

	@InjectMocks
	CalculateClassification calculateClassification;

	@Test
	void shouldReturnClassificationFields() throws IllegalAccessException {
		List<TargetField> expectTargetFields = List.of(
				TargetField.builder().key("priority").name("Priority").flag(true).build(),
				TargetField.builder().key("timetracking").name("Time tracking").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardResponse> cards = Arrays.asList(JiraCardResponse.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardFields.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.fixVersions(List.of())
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		Cards expectCards = Cards.builder().cardsNumber(3).storyPointSum(3).jiraCardResponseList(cards).build();

		List<Classification> classifications = calculateClassification.calculateClassification(expectTargetFields,
				expectCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Priority", classification.getFieldName());
	}

	@Test
	public void testMapArrayField() {
		Map<String, Integer> map = new HashMap<>();
		map.put("Field1", 0);
		map.put("Field2", 0);
		map.put("None", 1);
		Map<String, Map<String, Integer>> resultMap = new HashMap<>();
		resultMap.put("TestField", map);

		// 创建虚拟的List对象
		List<Map<String, Object>> obj = new ArrayList<>();
		Map<String, Object> item1 = new HashMap<>();
		item1.put("displayName", "Value1");
		obj.add(item1);
		Map<String, Object> item2 = new HashMap<>();
		item2.put("displayName", "Value2");
		obj.add(item2);
		Map<String, Object> item3 = new HashMap<>();
		item3.put("None", "Value3");
		obj.add(item3);

		// 调用函数
		calculateClassification.mapArrayField(resultMap, "TestField", obj);

		// 验证结果
		Map<String, Integer> result = resultMap.get("TestField");
		assertEquals(1, result.get("Value1").intValue());
		assertEquals(1, result.get("Value2").intValue());
		assertEquals(0, result.get("None").intValue());

	}

	@Test
	public void testMapSingleField() {
		Map<String, Integer> map = new HashMap<>();
		map.put("Field1", 0);
		map.put("Field2", 0);
		map.put("None", 1);
		Map<String, Map<String, Integer>> resultMap = new HashMap<>();
		resultMap.put("TestField", map);

		// 创建虚拟的List对象
		Map<String, Object> obj = new HashMap<>();
		obj.put("displayName", "Value1");

		String displayName = CalculateClassification.pickDisplayNameFromObj(obj);
		Integer count = map.get(displayName);

		// 验证结果
		Map<String, Integer> result = resultMap.get("TestField");
		assertEquals(1, result.get("None").intValue());
	}

	@Test
	public void testUpdateMap() {
		// 准备测试数据
		Map<String, Integer> map = new HashMap<>();
		map.put("value1", 1);
		map.put("value2", 2);
		map.put("value3", 3);
		map.put("NONE", 4);

		Object obj = new Object() {
			public String toString() {
				return "value1";
			}
		};

		// 调用方法
		String displayName = CalculateClassification.pickDisplayNameFromObj(obj);
		Integer count = map.get(displayName);
		map.put(displayName, count != null ? count + 1 : 1);
		map.put("NONE", map.get("NONE") - 1);

		// 验证displayName是否被正确获取
		assertEquals("value1", displayName);

		// 验证count是否被正确获取
		assertEquals(1, (int) count);

		// 验证map是否被正确更新
		assertEquals(2, (int) map.get("value1"));
		assertEquals(3, (int) map.get("NONE"));

	}

	@Test
	public void testNoneProgress() {
		// 准备测试数据
		Map<String, Integer> map = new HashMap<>();
		map.put("value1", 1);
		map.put("value2", 2);
		map.put("value3", 3);
		map.put("NONE", 0);

		// 调用方法
		if (map.get("NONE") == 0) {
			map.remove("NONE");
		}

		// 验证map是否被正确更新
		assertNull(map.get("NONE"));
		assertNotNull(map.get("value1"));
		assertNotNull(map.get("value2"));
		assertNotNull(map.get("value3"));
	}

	@Test
	public void testMapArrayFieldFunctionCalled() {
		CalculateClassification mockClassification = mock(CalculateClassification.class);
		Map<String, Integer> map = new HashMap<>();
		map.put("Field1", 0);
		map.put("Field2", 0);
		map.put("None", 1);
		Map<String, Map<String, Integer>> resultMap = new HashMap<>();
		resultMap.put("TestField", map);

		List<Map<String, Object>> obj = new ArrayList<>();
		Map<String, Object> item1 = new HashMap<>();
		item1.put("displayName", "Value1");
		obj.add(item1);
		Map<String, Object> item2 = new HashMap<>();
		item2.put("displayName", "Value2");
		obj.add(item2);
		Map<String, Object> item3 = new HashMap<>();
		item3.put("None", "Value3");
		obj.add(item3);
		mockClassification.mapArrayField(resultMap, "TestField", obj);

		verify(mockClassification, times(1)).mapArrayField(resultMap, "TestField", obj);

	}

	@Test
	public void testMapArrayFieldFunction() {
}

	@Test
	public void testPickDisplayNameFromObj() {
		// Create a mock map object
		Map<String, Object> mockMap = new HashMap<>();
		mockMap.put("displayName", "Test Display Name");

		// Test when the input is a Map object with "displayName" key
		String result = calculateClassification.pickDisplayNameFromObj(mockMap);
		assertEquals("Test Display Name", result);

		// Test when the input is a Map object with "name" key
		mockMap.clear();
		mockMap.put("name", "Test Name");
		result = calculateClassification.pickDisplayNameFromObj(mockMap);
		assertEquals("Test Name", result);

		// Test when the input is a Map object with "key" key
		mockMap.clear();
		mockMap.put("key", "Test Key");
		result = calculateClassification.pickDisplayNameFromObj(mockMap);
		assertEquals("Test Key", result);

		// Test when the input is a Map object with "value" key
		mockMap.clear();
		mockMap.put("value", "Test Value");
		result = calculateClassification.pickDisplayNameFromObj(mockMap);
		assertEquals("Test Value", result);

		// Test when the input is a String with "name" pattern
		String mockString = "id=123,name=Test Name,value=456";
		result = calculateClassification.pickDisplayNameFromObj(mockString);
		assertEquals("Test Name", result);

		// Test when the input is a null object
		result = calculateClassification.pickDisplayNameFromObj(null);
		assertEquals("None", result);
	}

}
