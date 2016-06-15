package tutorial;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;



/**
 * 
 * @author jjc
 *
 */
public class Constant { 
	
	static{  
		Properties props = new Properties();
		InputStream ips = null;  
		try {      
			ips = new BufferedInputStream(new FileInputStream(
					Constant.class.getResource("/").toURI().getPath() + "config.properties"));
			props.load(ips);
			      
			ODE_BasePath = props.getProperty("ODE.BasePath").trim();
			SrcBasePath = props.getProperty("SrcBasePath").trim();  
			DataFilePath = props.getProperty("DataFilePath").trim();  
			HttpFilePath = props.getProperty("HttpFilePath").trim(); 
			MapFilePath = props.getProperty("MapFilePath").trim();
			SHAPEPATH = props.getProperty("SHAPEPATH").trim();
			wms_onlineresource = props.getProperty("wms_onlineresource").trim();
			TauDEMPath = props.getProperty("TauDEMPath").trim(); 
			Service_RasterMetaData_Path = props.getProperty("Service_RasterMetaData_Path").trim();
			Service_ShpMetaData_Path = props.getProperty("Service_ShpMetaData_Path").trim();
			Service_Point2Shp_Path = props.getProperty("Service_Point2Shp_Path").trim();
			Service_ModifyRasterShp_Path = props.getProperty("Service_ModifyRasterShp_Path").trim();
			Service_Raster2Line_Path = props.getProperty("Service_Raster2Line_Path").trim();  
			Service_RasterFormatConvert_Path = props.getProperty("Service_RasterFormatConvert_Path").trim();

		} catch (Exception e) {
			e.printStackTrace();
		
		} 
	}
	public static  String ODE_BasePath; 
	public static  String SrcBasePath;  
	public static  String DataFilePath;  
	public static  String HttpFilePath; 
	public static  String MapFilePath;
	public static  String SHAPEPATH;
	public static  String wms_onlineresource;
	public static  String TauDEMPath;
	public static  String Service_RasterMetaData_Path;
	public static  String Service_ShpMetaData_Path;
	public static  String Service_Point2Shp_Path;
	public static  String Service_ModifyRasterShp_Path;
	public static  String Service_Raster2Line_Path;
	public static  String Service_RasterFormatConvert_Path;
	
	
	
}
