package heartbeat.service.pipeline.buildkite.builder;

import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class DeploymentEnvironmentBuilder {

	private DeploymentEnvironment deploymentEnvironment;

	public static DeploymentEnvironmentBuilder withDefault() {

		DeploymentEnvironment deploymentEnvironment = new DeploymentEnvironment();
		deploymentEnvironment.setOrgId("xx");
		deploymentEnvironment.setOrgName("xx");
		deploymentEnvironment.setId("xx");
		deploymentEnvironment.setName("xx");
		deploymentEnvironment.setStep("xx");
		return new DeploymentEnvironmentBuilder(deploymentEnvironment);
	}

	public DeploymentEnvironment build() {
		return deploymentEnvironment;
	}

	public DeploymentEnvironmentBuilder withStep(String step) {
		deploymentEnvironment.setStep(step);
		return this;
	}

}
