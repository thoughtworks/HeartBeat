package heartbeat.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoneCard implements Serializable {

	private String key;

	private DoneCardFields fields;

}
