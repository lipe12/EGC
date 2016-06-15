package tutorial;
import java.util.List;

import com.opensymphony.xwork2.ActionSupport;
import tauDEM.TauDEM;
import tauDEM.LonLat2Shp;
import tauDEM.ModifyWatershed_Net;
import tauDEM.GetRasterMetaData;
import tauDEM.WMS;
public class CreateStreamNetWatershed extends ActionSupport{
	private static final long serialVersionUID = 1L;
	private String tempfilename;
	private int threshold;
	private int tag;
	private String lon;
	private String lat;
	private String maplayers;
	private String mapfile;
	public String getMaplayers() {
		return maplayers;
	}
	public void setMaplayers(String maplayers) {
		this.maplayers = maplayers;
	}
	public String getMapfile() {
		return mapfile;
	}
	public void setMapfile(String mapfile) {
		this.mapfile = mapfile;
	}
	public String getTempfilename() {
		return tempfilename;
	}
	public void setTempfilename(String tempfilename) {
		this.tempfilename = tempfilename;
	}
	public int getThreshold() {
		return threshold;
	}
	public void setThreshold(int threshold) {
		this.threshold = threshold;
	}
	public int getTag() {
		return tag;
	}
	public void setTag(int tag) {
		this.tag = tag;
	}
	public String create_StreamNetWatershed(){
		String flowdirec_file =   tempfilename + "p.tif";
		String initialstreamline_file = tempfilename + "initialsrc.tif";
		String initialoutlet_file = tempfilename + "initialoutlet.shp";
		String outlet_file = tempfilename + "outlet.shp";
		String filleddem_file = tempfilename + "fel.tif";
		String candidatestreamline_file = tempfilename + "ss.tif";
		String area2_file = tempfilename + "ssa.tif";
		String streamline_file = tempfilename + "src.tif";
		String streamnet_file = tempfilename + "net.shp";
		String watershed_file = tempfilename + "w.tif";
		String streamnet_file_new = tempfilename + "new_net.shp";
		String watershed_file_new = tempfilename + "new_w.tif";
		try{
			TauDEM tauDEM = new TauDEM();
			LonLat2Shp lonlat2Shp = new LonLat2Shp();
			ModifyWatershed_Net modify = new ModifyWatershed_Net();
			GetRasterMetaData metaData = new GetRasterMetaData();
			WMS wms = new WMS();
			
			lonlat2Shp.createShp(lon, lat, initialoutlet_file);
			
			tauDEM.MoveOutletsToStreams(flowdirec_file,initialstreamline_file,initialoutlet_file,outlet_file);
			tauDEM.PeukerDouglas(filleddem_file,candidatestreamline_file);
			tauDEM.AreaD8_2(flowdirec_file, outlet_file, candidatestreamline_file, area2_file);
			tauDEM.Threshold(area2_file, threshold, streamline_file);
			tauDEM.Streamnet(filleddem_file, flowdirec_file, area2_file, streamline_file, outlet_file, streamnet_file, watershed_file);
			
			modify.modify(watershed_file, streamnet_file, watershed_file_new, streamnet_file_new);
		    
			
			wms.createNetWatershedMapFile(outlet_file, streamnet_file_new, watershed_file_new);   
			maplayers =  tempfilename + "new_w," + tempfilename + "new_net," + tempfilename + "outlet";
			mapfile = tempfilename + "outlet";     
			tag = 1;
		}catch(Exception e){
			tag = 0;
			e.printStackTrace();
		}
		
		return SUCCESS;
	}
	public String getLon() {
		return lon;
	}
	public void setLon(String lon) {
		this.lon = lon;
	}
	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
}
