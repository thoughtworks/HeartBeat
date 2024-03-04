package heartbeat.util;

import java.text.DecimalFormat;
import java.util.Objects;

public interface DecimalUtil {

	String FORMAT_2_DECIMALS = "0.00";

	static String formatDecimalTwo(double value) {
		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_2_DECIMALS);

		return Objects.equals(decimalFormat.format(value), "0.00") ? "0" : decimalFormat.format(value);
	}

	static String formatDecimalTwo(float value) {
		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_2_DECIMALS);

		return Objects.equals(decimalFormat.format(value), "0.00") ? "0" : decimalFormat.format(value);
	}

}
