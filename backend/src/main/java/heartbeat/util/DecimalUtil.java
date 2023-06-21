package heartbeat.util;

import java.text.DecimalFormat;
import java.util.Objects;

public interface DecimalUtil {

	String FORMAT_2_DECIMALS = "0.00";

	static String formatDecimalTwo(double value) {
		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_2_DECIMALS);
		if (value == 0) {
			return "0";
		}
		else if (Objects.equals(decimalFormat.format(value), "0.00")) {
			return "0";
		}
		else {
			return decimalFormat.format(value);
		}
	}

}
