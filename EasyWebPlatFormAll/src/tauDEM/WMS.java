package tauDEM;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

import tutorial.ColorMap;
import tutorial.Constant;

import MetaData.ShpMetaData;
import tauDEM.GetShpMetaData;
import tauDEM.GetRasterMetaData;
import MetaData.RasterMetaData;
public class WMS {
	
	public void createInitialStreamMapFile(String initialstream_file){
		// read the metaData of shp file
		GetShpMetaData getmeta = new GetShpMetaData();
		ShpMetaData metaData = getmeta.getMetaData(initialstream_file);
		String extent = metaData.GetExtent();
		String proj4 = metaData.GetProj4();
		String  [] proj4s = proj4.split("\\s");
		//String epsgcode = metaData.GetEpsgcode();
		// write the mapfile for shp file
		try{
			
			String mapfile_name = Constant.MapFilePath + initialstream_file.replace(".shp", ".map");
			File mapfile = new File(mapfile_name);
			BufferedWriter writer = new BufferedWriter(new FileWriter(mapfile));
			
			//Some important tag of MapFile of MapServer
			String MAP = "Map"; 
			String END_MAP = "END";
			String WEB = "WEB";
			String END_WEB = "END";
			String METADATA_WEB = "METADATA";
			String END_METADATA_WEB = "END";
			String PROJECTION_MAP = "PROJECTION";
			String END_PROJECTION_MAP = "END";
			String LEGEND = "LEGEND";
			String END_LEGEND = "END";
			String LABEL = "LABEL";
			String END_LABEL= "END";
			String LAYER = "LAYER";
			String END_LAYER= "END";
			String PROJECTION_LAYER = "PROJECTION";
			String END_PROJECTION_LAYER = "END";
			String CLASS = "CLASS";
			String END_CLASS = "END";
			String STYLE = "STYLE";
			String END_STYLE = "END";
			String SingleSpace = " ";
			String DoubleSpace = "  ";			
			String FourSpace   = "    ";
			String SixSpace    = "      ";
			String EightSpace  = "        ";
			//MAP BEGIN
			// writer MAP information 
			writer.write(MAP + "\t\n");
			writer.write(DoubleSpace + "NAME" + SingleSpace + "\"WMS-test\"" + "\t\n");
			writer.write(DoubleSpace + "STATUS" + SingleSpace + "ON" + "\t\n");
			writer.write(DoubleSpace + "SIZE" + SingleSpace + "400 300" + "\t\n");
			writer.write(DoubleSpace + "EXTENT" + SingleSpace + extent + "\t\n");
			writer.write(DoubleSpace + "UNITS" + SingleSpace + "METERS" + "\t\n");
			
			writer.write(DoubleSpace + "SHAPEPATH" + SingleSpace + "\""+ Constant.SHAPEPATH +"\"" + "\t\n");
			writer.write(DoubleSpace + "IMAGECOLOR" + SingleSpace + "255 255 255" + "\t\n");
			writer.write(DoubleSpace + "FONTSET" + SingleSpace + "\"../fonts/fonts.list\"" + "\t\n");
			writer.write("\t\n");
			//WEB BEGIN
			// write WEB information
			writer.write(DoubleSpace + WEB + "\t\n");
			writer.write(FourSpace + "IMAGEPATH" + SingleSpace +"\"ms4w/tmp/ms_tmp/\"" + "\t\n");
			writer.write(FourSpace + "IMAGEURL" + SingleSpace +"\"/ms_tmp/\"" + "\t\n");
			writer.write(FourSpace + METADATA_WEB + "\t\n");
			writer.write(SixSpace + "\"wms_title\"" + SingleSpace + "\"WMS Demo Server\"" + "\t\n");
			
			writer.write(SixSpace + "\"wms_onlineresource\"" + SingleSpace + "\""+ Constant.wms_onlineresource +"\"" + "\t\n");
			
			writer.write(SixSpace + "\"wms_srs\"" + SingleSpace + "\"EPSG:4326 EPSG:900913\"" + "\t\n");
			
			writer.write(SixSpace + "\"wms_enable_request\"" + SingleSpace + "\"*\"" + "\t\n");
			writer.write(FourSpace + END_METADATA_WEB + "\t\n");
			// WEB END  
			writer.write(DoubleSpace + END_WEB + "\t\n");
			writer.write("\t\n");
			// write PROJECTION information
			  
			writer.write(DoubleSpace + PROJECTION_MAP + "\t\n");
			writer.write(FourSpace + "\"init=epsg:900913\"" + "\t\n");
			writer.write(DoubleSpace + END_PROJECTION_MAP + "\t\n");
			writer.write("\t\n");
			// write LEGEND information
			
			writer.write(DoubleSpace + LEGEND + "\t\n");
			writer.write(FourSpace + "KEYSIZE" + SingleSpace +"12 12" + "\t\n");
			writer.write(FourSpace + LABEL + "\t\n");
			writer.write(SixSpace + "TYPE" + SingleSpace + "BITMAP"+ "\t\n");
			writer.write(SixSpace + "SIZE" + SingleSpace + "MEDIUM"+ "\t\n");
			writer.write(SixSpace + "COLOR" + SingleSpace + "0 0 89"+ "\t\n");
			writer.write(FourSpace + END_LABEL + "\t\n");
			writer.write(FourSpace + "STATUS" + SingleSpace + "ON" + "\t\n");
			writer.write(DoubleSpace + END_LEGEND + "\t\n");
			writer.write("\t\n");
			// write LAYER information
			//LAYER BEGIN
			writer.write(DoubleSpace + LAYER + "\t\n");
			String [] tempstr = initialstream_file.split("\\.");
			writer.write(FourSpace + "NAME" + SingleSpace + "\""+ tempstr[0] +"\"" +"\t\n");
			
			writer.write(FourSpace + "DATA" + SingleSpace + "\""+ initialstream_file +"\"" + "\t\n");
			writer.write(FourSpace + PROJECTION_LAYER + "\t\n");
			
			//writer.write(SixSpace + "\"init=epsg:"+ epsgcode +"\"" + "\t\n");
			int proj4s_len = proj4s.length -1; 
			for(int i = 0; i< proj4s_len ; i++){
				writer.write(SixSpace + "\"" + proj4s[i] +"\"" + "\t\n");
			}
			writer.write(FourSpace + END_PROJECTION_LAYER + "\t\n");
			writer.write(FourSpace + "STATUS" + SingleSpace + "OFF" + "\t\n");
			writer.write(FourSpace + "TYPE" + SingleSpace + "Line" + "\t\n");
			writer.write("\t\n");
			
			writer.write(FourSpace + CLASS + "\t\n");
			writer.write(SixSpace + "NAME" + SingleSpace  + "\"" +  "stream" + "\"" + "\t\n");
			
			writer.write(SixSpace + STYLE + "\t\n");
			writer.write(EightSpace + "COLOR" + SingleSpace + "0 0 200" + "\t\n");
			writer.write(SixSpace + END_STYLE + "\t\n");
			writer.write(FourSpace + END_CLASS + "\t\n");
			
			//LAYER　END
			writer.write(DoubleSpace + END_LAYER + "\t\n");
		
			//MAP END
			writer.write(END_MAP + "\t\n");
			// MAPFile creating finished
			writer.flush();
			writer.close();
		}catch(Exception e){
		
			e.printStackTrace();
		}
		
	}
	public void createNetWatershedMapFile(String outlet_file, String streamnet_file, String watershed_file){
		// read the metaData of outlet_file, streamnet_file, watershed_file
		GetRasterMetaData getMeta = new GetRasterMetaData();
		RasterMetaData metaData = getMeta.getMetaDataNew(watershed_file, "U");
		String extent = metaData.GetExent();
		String min = metaData.GetMin();
		String max = metaData.GetMax();
		String proj4 = metaData.GetProj4();
		String  [] proj4s = proj4.split("\\s"); 
		//String epsgcode = metaData.GetEpsgcode();
		String uniquevalues = metaData.GetBreakvaules();
		// write the mapfile of outlet ,streamnet and watershed 
		try{
			
			String mapfile_name = Constant.MapFilePath + outlet_file.replace(".shp", ".map");
			File mapfile = new File(mapfile_name);
			BufferedWriter writer = new BufferedWriter(new FileWriter(mapfile));
			
			//Some important tag of MapFile of MapServer
			String MAP = "Map"; 
			String END_MAP = "END";
			String WEB = "WEB";
			String END_WEB = "END";
			String METADATA_WEB = "METADATA";
			String END_METADATA_WEB = "END";
			String PROJECTION_MAP = "PROJECTION";
			String END_PROJECTION_MAP = "END";
			String LEGEND = "LEGEND";
			String END_LEGEND = "END";
			String LABEL = "LABEL";
			String END_LABEL= "END";
			String LAYER = "LAYER";
			String END_LAYER= "END";
			String PROJECTION_LAYER = "PROJECTION";
			String END_PROJECTION_LAYER = "END";
			String CLASS = "CLASS";
			String END_CLASS = "END";
			String STYLE = "STYLE";
			String END_STYLE = "END";
			String SingleSpace = " ";
			String DoubleSpace = "  ";			
			String FourSpace   = "    ";
			String SixSpace    = "      ";
			String EightSpace  = "        ";
			//MAP BEGIN
			// writer MAP information 
			writer.write(MAP + "\t\n");
			writer.write(DoubleSpace + "NAME" + SingleSpace + "\"WMS-test\"" + "\t\n");
			writer.write(DoubleSpace + "STATUS" + SingleSpace + "ON" + "\t\n");
			writer.write(DoubleSpace + "SIZE" + SingleSpace + "400 300" + "\t\n");
			writer.write(DoubleSpace + "EXTENT" + SingleSpace + extent + "\t\n");
			writer.write(DoubleSpace + "UNITS" + SingleSpace + "METERS" + "\t\n");
			
			writer.write(DoubleSpace + "SHAPEPATH" + SingleSpace + "\""+ Constant.SHAPEPATH +"\"" + "\t\n");
			writer.write(DoubleSpace + "IMAGECOLOR" + SingleSpace + "255 255 255" + "\t\n");
			writer.write(DoubleSpace + "FONTSET" + SingleSpace + "\"../fonts/fonts.list\"" + "\t\n");
			writer.write("\t\n");
			//WEB BEGIN
			// write WEB information
			writer.write(DoubleSpace + WEB + "\t\n");
			writer.write(FourSpace + "IMAGEPATH" + SingleSpace +"\"ms4w/tmp/ms_tmp/\"" + "\t\n");
			writer.write(FourSpace + "IMAGEURL" + SingleSpace +"\"/ms_tmp/\"" + "\t\n");
			writer.write(FourSpace + METADATA_WEB + "\t\n");
			writer.write(SixSpace + "\"wms_title\"" + SingleSpace + "\"WMS Demo Server\"" + "\t\n");
			
			writer.write(SixSpace + "\"wms_onlineresource\"" + SingleSpace + "\""+ Constant.wms_onlineresource +"\"" + "\t\n");
			
			writer.write(SixSpace + "\"wms_srs\"" + SingleSpace + "\"EPSG:4326 EPSG:900913\"" + "\t\n");
			
			writer.write(SixSpace + "\"wms_enable_request\"" + SingleSpace + "\"*\"" + "\t\n");
			writer.write(FourSpace + END_METADATA_WEB + "\t\n");
			// WEB END  
			writer.write(DoubleSpace + END_WEB + "\t\n");
			writer.write("\t\n");
			// write PROJECTION information
			  
			writer.write(DoubleSpace + PROJECTION_MAP + "\t\n");
			writer.write(FourSpace + "\"init=epsg:900913\"" + "\t\n");
			writer.write(DoubleSpace + END_PROJECTION_MAP + "\t\n");
			writer.write("\t\n");
			// write LEGEND information
			
			writer.write(DoubleSpace + LEGEND + "\t\n");
			writer.write(FourSpace + "KEYSIZE" + SingleSpace +"12 12" + "\t\n");
			writer.write(FourSpace + LABEL + "\t\n");
			writer.write(SixSpace + "TYPE" + SingleSpace + "BITMAP"+ "\t\n");
			writer.write(SixSpace + "SIZE" + SingleSpace + "MEDIUM"+ "\t\n");
			writer.write(SixSpace + "COLOR" + SingleSpace + "0 0 89"+ "\t\n");
			writer.write(FourSpace + END_LABEL + "\t\n");
			writer.write(FourSpace + "STATUS" + SingleSpace + "ON" + "\t\n");
			writer.write(DoubleSpace + END_LEGEND + "\t\n");
			writer.write("\t\n");
			// write LAYER information
			//LAYER NET BEGIN
			writer.write(DoubleSpace + LAYER + "\t\n");
			String [] tempstr = streamnet_file.split("\\.");
			writer.write(FourSpace + "NAME" + SingleSpace + "\""+ tempstr[0] +"\"" +"\t\n");
			
			writer.write(FourSpace + "DATA" + SingleSpace + "\""+ streamnet_file +"\"" + "\t\n");
			writer.write(FourSpace + PROJECTION_LAYER + "\t\n");
			
			//writer.write(SixSpace + "\"init=epsg:"+ epsgcode +"\"" + "\t\n");
			int proj4s_len = proj4s.length - 1;
			for(int i = 0; i< proj4s_len; i++){   
				writer.write(SixSpace + "\"" + proj4s[i] + "\"" + "\t\n");
			}
			writer.write(FourSpace + END_PROJECTION_LAYER + "\t\n");
			writer.write(FourSpace + "STATUS" + SingleSpace + "OFF" + "\t\n");
			writer.write(FourSpace + "TYPE" + SingleSpace + "Line" + "\t\n");
			writer.write("\t\n");
			
			writer.write(FourSpace + CLASS + "\t\n");
			writer.write(SixSpace + "NAME" + SingleSpace  + "\"" +  "stream" + "\"" + "\t\n");
			
			writer.write(SixSpace + STYLE + "\t\n");
			writer.write(EightSpace + "COLOR" + SingleSpace + "0 0 200" + "\t\n");
			writer.write(SixSpace + END_STYLE + "\t\n");
			writer.write(FourSpace + END_CLASS + "\t\n");
			
			//LAYER NET　END
			writer.write(DoubleSpace + END_LAYER + "\t\n");
			
		    // point SYMBOL Begin
			writer.write(DoubleSpace + "SYMBOL" + "\t\n");
			writer.write(FourSpace + "NAME" + SingleSpace + "\"" + "circle" + "\"" + "\t\n");
			writer.write(FourSpace + "TYPE" + SingleSpace  + "ellipse" + "\t\n");
			writer.write(FourSpace + "FILLED" + SingleSpace  + "true" + "\t\n");
			writer.write(FourSpace + "POINTS" + "\t\n");
			writer.write(SixSpace  + "1 1 " +"\t\n");
			writer.write(FourSpace + "END" + "\t\n");
			writer.write(DoubleSpace + "END"  + "\t\n");
			//point SYMBOL END
			
			//LAYER OutLet BEGIN
			writer.write(DoubleSpace + LAYER + "\t\n");
			tempstr = outlet_file.split("\\.");
			writer.write(FourSpace + "NAME" + SingleSpace + "\""+ tempstr[0] +"\"" +"\t\n");
			
			writer.write(FourSpace + "DATA" + SingleSpace + "\""+ outlet_file +"\"" + "\t\n");
			writer.write(FourSpace + PROJECTION_LAYER + "\t\n");
			
			//writer.write(SixSpace + "\"init=epsg:"+ epsgcode +"\"" + "\t\n");
			for(int i = 0; i< proj4s_len; i++){   
				writer.write(SixSpace + "\"" + proj4s[i] + "\"" + "\t\n");
			}
			writer.write(FourSpace + END_PROJECTION_LAYER + "\t\n");
			writer.write(FourSpace + "STATUS" + SingleSpace + "OFF" + "\t\n");
			writer.write(FourSpace + "TYPE" + SingleSpace + "POINT" + "\t\n");
			writer.write("\t\n");
			
			writer.write(FourSpace + CLASS + "\t\n");
			writer.write(SixSpace + "NAME" + SingleSpace  + "\"" +  "outlet" + "\"" + "\t\n");
			
			writer.write(SixSpace + STYLE + "\t\n");
			writer.write(EightSpace + "SYMBOL" + SingleSpace + "\"circle\"" + "\t\n");
			writer.write(EightSpace + "COLOR" + SingleSpace + "0 0 200" + "\t\n");
			writer.write(EightSpace + "ANGLE" + SingleSpace + "30" + "\t\n");
			writer.write(EightSpace + "SIZE" + SingleSpace + "10" + "\t\n");
			writer.write(EightSpace + "GAP" + SingleSpace + "-30" + "\t\n");
			writer.write(SixSpace + END_STYLE + "\t\n");
			writer.write(FourSpace + END_CLASS + "\t\n");
			
			//LAYER OutLet　END
			writer.write(DoubleSpace + END_LAYER + "\t\n");
			
			//LAYER Watershed BEGIN
			
			writer.write(DoubleSpace + LAYER + "\t\n");
			tempstr = watershed_file.split("\\.");
			writer.write(FourSpace + "NAME" + SingleSpace + "\""+ tempstr[0] +"\"" +"\t\n");
			
			writer.write(FourSpace + "DATA" + SingleSpace + "\""+ watershed_file +"\"" + "\t\n");
			writer.write(FourSpace + PROJECTION_LAYER + "\t\n");
			
			//writer.write(SixSpace + "\"init=epsg:"+ epsgcode +"\"" + "\t\n");
			for(int i = 0; i< proj4s_len; i++){   
				writer.write(SixSpace + "\"" + proj4s[i] + "\"" + "\t\n");
			}
			writer.write(FourSpace + END_PROJECTION_LAYER + "\t\n");
			writer.write(FourSpace + "STATUS" + SingleSpace + "OFF" + "\t\n");
			writer.write(FourSpace + "TYPE" + SingleSpace + "RASTER" + "\t\n");
			writer.write(FourSpace + "OFFSITE" + SingleSpace + "71 74 65" + "\t\n");
			writer.write("\t\n");
			
			//writer.write(FourSpace + "PROCESSING" + SingleSpace + "\"SCALE=0,64.26\"" + "\t\n");
			writer.write(FourSpace + "PROCESSING" + SingleSpace + "\"SCALE="+ min + "," + max +"\"" + "\t\n");
			writer.write(FourSpace + "PROCESSING" + SingleSpace + "\"SCALE_BUCKETS=1000\"" + "\t\n");
			writer.write("\t\n");    
			  
			// write class
			ColorMap colorMap = new ColorMap();
			UniqueClassData classData = new UniqueClassData(min,max,uniquevalues);
			int colormaplen = colorMap.colors.size();
			int len = classData.classData.length;
			for(int i =0; i< len; i++){   
				writer.write(FourSpace + CLASS + "\t\n");   
				writer.write(SixSpace + "NAME" + SingleSpace + "\"" + classData.classData[i] + "\"" + "\t\n");
				String exp = SixSpace + "EXPRESSION" + SingleSpace + "([pixel]>" + (classData.classData[i]-0.1)
				             + SingleSpace + "AND [pixel]<" + SingleSpace + (classData.classData[i] + 0.1)
				             + ")" + "\t\n";
				writer.write(exp);
				writer.write(SixSpace +  STYLE + "\t\n");
				writer.write(EightSpace + "COLOR" + SingleSpace + colorMap.colors.get(i%colormaplen) + "\t\n");
				writer.write(SixSpace + END_STYLE + "\t\n");
				writer.write(FourSpace + END_CLASS + "\t\n");
			}
			//LAYER　END
			writer.write(DoubleSpace + END_LAYER + "\t\n");
		
			
			//LAYER Watershed END
			
			//MAP END
			writer.write(END_MAP + "\t\n");
			// MAPFile creating finished
			writer.flush();
			writer.close();
		}catch(Exception e){
		
			e.printStackTrace();
		}
	}
}
