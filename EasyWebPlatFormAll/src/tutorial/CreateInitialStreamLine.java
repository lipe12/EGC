package tutorial;
import com.opensymphony.xwork2.ActionSupport;
import tauDEM.TauDEM;
import tauDEM.RasterStream2LineNet;
import tauDEM.WMS;

public class CreateInitialStreamLine extends ActionSupport{
	private static final long serialVersionUID = 1L;
	private String demfilename;
	private String tempfilename;
	private int threshold;

	public int getThreshold() {
		return threshold;
	}

	public void setThreshold(int threshold) {
		this.threshold = threshold;
	}

	public String getTempfilename() {
		return tempfilename;
	}

	public void setTempfilename(String tempfilename) {
		this.tempfilename = tempfilename;
	}

	private String tag;
	private String layers;
	private String mapfile;
	public String getLayers() {
		return layers;
	}

	public void setLayers(String layers) {
		this.layers = layers;
	}

	public String getMapfile() {
		return mapfile;
	}

	public void setMapfile(String mapfile) {
		this.mapfile = mapfile;
	}

	public String getTag() {
		return tag;
	}
    
	public void setTag(String tag) {
		this.tag = tag;
	}
	public String getDemfilename() {
		return demfilename;
	}

	public void setDemfilename(String demfilename) {
		this.demfilename = demfilename;
	}

	public String create_InitialStreamLine (){
		
		TauDEM tauDEM = new TauDEM();
		RasterStream2LineNet stream2net = new RasterStream2LineNet(); 
		WMS wms = new WMS();
		
		String filleddem_file = tempfilename + "fel.tif";
		String flowdirec_file = tempfilename + "p.tif";
		String area_file = tempfilename + "ad8.tif"; 
		String initialstreamline_file = tempfilename + "initialsrc.tif";
		String initialnet_file = tempfilename + "initialnet.shp";
		try{   
			tauDEM.PitRemove(demfilename, filleddem_file);        
			tauDEM.D8Flowdir(filleddem_file, flowdirec_file);
			tauDEM.AreaD8(flowdirec_file, area_file);
			tauDEM.Threshold(area_file, threshold, initialstreamline_file);
			stream2net.rastertline(initialstreamline_file, flowdirec_file, initialnet_file);   
			
			wms.createInitialStreamMapFile(initialnet_file);  
			layers = tempfilename + "initialnet";
			mapfile = tempfilename + "initialnet";   
			tag = "1";
		}catch(Exception e){
			
			tag = "0";     
			e.printStackTrace();
		}          

		return SUCCESS;
	}
}
