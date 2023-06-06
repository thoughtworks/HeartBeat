package heartbeat.service.report;

import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class CalculateLeadTimeForChangesTest {

	@InjectMocks
	private LeadTimeForChangesCalculator calculator;

	@Mock
	private PipelineLeadTime pipelineLeadTime;

	@BeforeEach
	void setup() {
		pipelineLeadTime = PipelineLeadTime.builder()
			.pipelineStep("Step")
			.pipelineName("Name")
			.leadTimes(List.of(LeadTime.builder()
				.commitId("111")
				.prCreatedTime(165854910000L)
				.prMergedTime(1658549160000L)
				.firstCommitTimeInPr(165854910000L)
				.jobFinishTime(1658549160000L)
				.pipelineCreateTime(165854910000L)
				.prDelayTime(60000L)
				.pipelineDelayTime(60000)
				.totalTime(120000)
				.build()))
			.build();
	}

	@Test
	void shouldReturnEmptyWhenPipelineLeadTimeIsEmpty() {
		LeadTimeForChanges result = calculator.calculate(List.of());
		LeadTimeForChanges expect = LeadTimeForChanges.builder()
			.leadTimeForChangesOfPipelines(List.of())
			.avgLeadTimeForChanges(AvgLeadTimeForChanges.builder().name("Average").build())
			.build();
		assertEquals(expect, result);
	}

	@Test
	void shouldReturnLeadTimeForChangesPipelineLeadTimeIsNotEmpty() {
		List<PipelineLeadTime> pipelineLeadTimes = List.of(pipelineLeadTime);

		LeadTimeForChanges result = calculator.calculate(pipelineLeadTimes);
		LeadTimeForChanges expect = LeadTimeForChanges.builder()
			.leadTimeForChangesOfPipelines(List.of(LeadTimeForChangesOfPipelines.builder()
				.name("Name")
				.step("Step")
				.mergeDelayTime(1.0)
				.pipelineDelayTime(1.0)
				.totalDelayTime(2.0)
				.build()))
			.avgLeadTimeForChanges(AvgLeadTimeForChanges.builder()
				.name("Average")
				.mergeDelayTime(1.0)
				.pipelineDelayTime(1.0)
				.totalDelayTime(2.0)
				.build())
			.build();

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnEmptyWhenLeadTimeIsEmpty() {
		pipelineLeadTime.setLeadTimes(List.of());
		List<PipelineLeadTime> pipelineLeadTimes = List.of(pipelineLeadTime);

		LeadTimeForChanges result = calculator.calculate(pipelineLeadTimes);
		LeadTimeForChanges expect = LeadTimeForChanges.builder()
			.leadTimeForChangesOfPipelines(List.of())
			.avgLeadTimeForChanges(AvgLeadTimeForChanges.builder()
				.name("Average")
				.mergeDelayTime(0.0)
				.pipelineDelayTime(0.0)
				.totalDelayTime(0.0)
				.build())
			.build();

		assertEquals(expect, result);
	}

}
