package MetaData;

public class ShpMetaData {
	private String filename;
	private String epsgcode;
	private String proj4;
	private String extent;
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
	public String GetExtent() {
		return extent;
	}
	public void SetExtent(String extent) {
		this.extent = extent;
	}
}
