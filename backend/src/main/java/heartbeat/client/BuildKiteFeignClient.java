package heartbeat.client;

import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@FeignClient(name = "buildKiteFeignClient", url = "${buildKite.url}")
public interface BuildKiteFeignClient {

	@GetMapping(path = "v2/organizations")
	@ResponseStatus(HttpStatus.OK)
	List<BuildKiteOrganizationsInfo> getBuildKiteOrganizationsInfo();
}
