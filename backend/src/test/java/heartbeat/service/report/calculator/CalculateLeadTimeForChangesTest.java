package heartbeat.service.report.calculator;

import static org.junit.jupiter.api.Assertions.assertEquals;

import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import java.util.List;

import heartbeat.service.report.calculator.LeadTimeForChangesCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
				.prLeadTime(60000L)
				.pipelineLeadTime(60000)
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
				.prLeadTime(1.0)
				.pipelineLeadTime(1.0)
				.totalDelayTime(2.0)
				.build()))
			.avgLeadTimeForChanges(AvgLeadTimeForChanges.builder()
				.name("Average")
				.prLeadTime(1.0)
				.pipelineLeadTime(1.0)
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
				.prLeadTime(0.0)
				.pipelineLeadTime(0.0)
				.totalDelayTime(0.0)
				.build())
			.build();

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnFilteredResultWhenPrMergedTimeOrPrLeadTimeIsNull() {
		PipelineLeadTime noMergedTime = PipelineLeadTime.builder()
			.pipelineStep("Step")
			.pipelineName("Name")
			.leadTimes(List.of(LeadTime.builder().prMergedTime(0L).build(),
					LeadTime.builder().prMergedTime(1L).prLeadTime(0L).build(),
					LeadTime.builder()
						.commitId("111")
						.prCreatedTime(165854910000L)
						.prMergedTime(1658549160000L)
						.firstCommitTimeInPr(165854910000L)
						.jobFinishTime(1658549160000L)
						.pipelineCreateTime(165854910000L)
						.prLeadTime(60000L)
						.pipelineLeadTime(60000)
						.totalTime(120000)
						.build()))
			.build();

		LeadTimeForChanges result = calculator.calculate(List.of(noMergedTime));
		LeadTimeForChanges expect = LeadTimeForChanges.builder()
			.leadTimeForChangesOfPipelines(List.of(LeadTimeForChangesOfPipelines.builder()
				.name("Name")
				.step("Step")
				.prLeadTime(0.33)
				.pipelineLeadTime(0.33)
				.totalDelayTime(0.66)
				.build()))
			.avgLeadTimeForChanges(AvgLeadTimeForChanges.builder()
				.name("Average")
				.prLeadTime(0.33)
				.pipelineLeadTime(0.33)
				.totalDelayTime(0.66)
				.build())
			.build();

		assertEquals(expect, result);
	}

}
