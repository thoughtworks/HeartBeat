package heartbeat.client.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class StatusCategory implements Serializable {

	private String key;

	private String name;

}
