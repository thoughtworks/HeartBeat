package heartbeat.util;

import java.text.DecimalFormat;
import java.util.Objects;

public interface DecimalUtil {

	String FORMAT_2_DECIMALS = "0.00";

	String FORMAT_4_DECIMALS = "0.0000";

	static String formatDecimalTwo(double value) {
		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_2_DECIMALS);

		return Objects.equals(decimalFormat.format(value), "0.00") ? "0" : decimalFormat.format(value);
	}

	static String formatDecimalTwo(float value) {
		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_2_DECIMALS);

		return Objects.equals(decimalFormat.format(value), "0.00") ? "0" : decimalFormat.format(value);
	}

	static String formatDecimalFour(double value) {
		return new DecimalFormat(FORMAT_4_DECIMALS).format(value);
	}

}
