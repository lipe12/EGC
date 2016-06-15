package cn.com.bean;

public class DataSet {

	private String datasetname;
	private String north;
	private String south;
	private String west;
	public String getDatasetname() {
		return datasetname;
	}
	public void setDatasetname(String datasetname) {
		this.datasetname = datasetname;
	}
	public String getNorth() {
		return north;
	}
	public void setNorth(String north) {
		this.north = north;
	}
	public String getSouth() {
		return south;
	}
	public void setSouth(String south) {
		this.south = south;
	}
	public String getWest() {
		return west;
	}
	public void setWest(String west) {
		this.west = west;
	}
	public String getEast() {
		return east;
	}
	public void setEast(String east) {
		this.east = east;
	}
	public String getKmlpath() {
		return kmlpath;
	}
	public void setKmlpath(String kmlpath) {
		this.kmlpath = kmlpath;
	}
	private String east;
	private String kmlpath;
}
