package MetaData;

public class RasterMetaData {
	private String filename;
	private String epsgcode;
	private String proj4;
	private String exent;//left buttom right up
	private String min;
	private String max;
	private String breakvaules;
	public String GetFilename() {
		return filename;
	}
	public void SetFilename(String filename) {
		this.filename = filename;
	}
	public String GetEpsgcode() {
		return epsgcode;
	}
	public void SetEpsgcode(String epsgcode) {
		this.epsgcode = epsgcode;
	}
	public String GetProj4() {
		return proj4;
	}
	public void SetProj4(String proj4) {
		proj4 = proj4.replaceAll("[+]", "");       
		this.proj4 = proj4; 
	}
	public String GetExent() {
		return exent;
	}
	public void SetExent(String exent) {
		this.exent = exent;
	}
	public String GetMin() {
		return min;
	}
	public void SetMin(String min) {
		this.min = min;
	}
	public String GetMax() {
		return max;
	}
	public void SetMax(String max) {
		this.max = max;
	}
	public String GetBreakvaules() {
		return breakvaules;
	}
	public void SetBreakvaules(String breakvaules) {
		this.breakvaules = breakvaules;
	}

}
