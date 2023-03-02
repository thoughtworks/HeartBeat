package heartbeat.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@AllArgsConstructor
@Data
public class StatusCategory implements Serializable {

	private String key;

	private String name;

}
