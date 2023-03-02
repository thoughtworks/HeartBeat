package heartbeat.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@AllArgsConstructor
@Data
@Builder
public class StatusSelfDTO implements Serializable {

	private String untranslatedName;

	private StatusCategory statusCategory;

}

