package heartbeat.util;

import com.google.gson.Gson;
import com.google.gson.JsonElement;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;

public class JsonFileReader {

	public static HashMap<String, JsonElement> readJsonFile(String filePath) {
		HashMap<String, JsonElement> jsonMap = new HashMap<>();

		try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
			Gson gson = new Gson();
			JsonElement jsonElement = gson.fromJson(reader, JsonElement.class);

			if (jsonElement.isJsonObject()) {
				jsonMap = gson.fromJson(jsonElement, HashMap.class);
			}
		}
		catch (IOException e) {
			e.printStackTrace();
		}

		return jsonMap;
	}

}
