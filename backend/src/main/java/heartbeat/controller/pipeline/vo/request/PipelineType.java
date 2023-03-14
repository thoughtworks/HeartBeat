package heartbeat.controller.pipeline.vo.request;

public enum PipelineType {

	BUILD_KITE("buildKite");

	public final String pipelineType;

	PipelineType(String pipelineType) {
		this.pipelineType = pipelineType;
	}

}
