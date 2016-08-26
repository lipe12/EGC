package tutorial;
import java.io.*;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.InputStreamRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.Namespace;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;
import org.xml.sax.InputSource;

import MetaData.RasterMetaData;

import com.opensymphony.xwork2.ActionSupport;
public class CreateUploadDataMapFile extends ActionSupport{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String tag;
	public String max;
	public String min;
	public String getTag() {
		return tag;
	}
    
	public void setTag(String tag) {
		this.tag = tag;
	}
	private String DataPath = Constant.DataFilePath + File.separator;
	
	/**
	 * this function call ExtractRasterMetaDataNew webservice to get the specified data proj et al information
	 * @param raster_file {String} fileName: such as egc_result/b.tif
	 * @return metaData {RasterMetaData} raster matadata information
	 * @see http://whu.edu.cn/ws/ExtractRasterMetaDataNew webservice
	 * */
    public RasterMetaData MetaDataExtractNew(String raster_file){
		             	
		RasterMetaData metaData =  new RasterMetaData();
		
		String soap = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +   
        "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
        + " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"" 
        + " xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\">"    
        + " <soap:Body>"
        + " <ExtractRasterMetaData xmlns=\"http://whu.edu.cn/ws/ExtractRasterMetaDataNew\">"
        + " <rasterFn>" + DataPath + raster_file + "</rasterFn>"
        + " <mode>" + "Q" + "</mode>"  
        + " </ExtractRasterMetaData>"        
        +"</soap:Body>"               
        +"</soap:Envelope>";                  

        String address = Constant.Service_RasterMetaData_Path;    
      try{
			
			PostMethod postMethod = new PostMethod(address); 
			
			String soapRequestData = 	soap;

			byte[] b = soapRequestData.getBytes("UTF-8");
			InputStream is = new ByteArrayInputStream(b,0,b.length);
			RequestEntity re = new InputStreamRequestEntity(is,b.length,"application/soap+xml; charset=UTF-8");
			postMethod.setRequestEntity(re);
			
			HttpClient httpClient = new HttpClient(); 
			int statusCode = httpClient.executeMethod(postMethod);
			if (statusCode == 200){
				
				String soapResponseData =  postMethod.getResponseBodyAsString();         
			    SAXBuilder builder = new SAXBuilder();   
			    StringReader read = new StringReader(soapResponseData);  
			    InputSource source = new InputSource(read); 
				Document jdoc=builder.build(source);
				
				XPath xpath = XPath.newInstance("/soap:Envelope/soap:Body/ns:ExtractRasterMetaDataResponse/ns:ExtractRasterMetaDataResult/nsnew:Root");
				xpath.addNamespace("soap","http://www.w3.org/2003/05/soap-envelope");
				xpath.addNamespace("ns","http://whu.edu.cn/ws/ExtractRasterMetaDataNew");
				xpath.addNamespace("nsnew","http://whu.edu.cn/ws/ExtractRasterMetaData");
				Element Root = (Element)xpath.selectSingleNode(jdoc);
				Namespace ns=Namespace.getNamespace("ns","http://whu.edu.cn/ws/ExtractRasterMetaData");
				Element Filename = Root.getChild("Filename", ns);
				Element EPSGCODE = Root.getChild("EPSGCODE",ns);      
				Element ProjString = Root.getChild("ProjString",ns);
				Element Exent = Root.getChild("Exent",ns);
				Element Min = Root.getChild("Min",ns);
				Element Max = Root.getChild("Max",ns);
				Element QuantileBreaks= Root.getChild("QuantileBreaks",ns);
				     
				read.close();    
				
				metaData.SetFilename(Filename.getValue());
				metaData.SetEpsgcode(EPSGCODE.getValue());
				metaData.SetProj4(ProjString.getValue());
				metaData.SetExent(Exent.getValue());
				metaData.SetMin(Min.getValue());
				metaData.SetMax(Max.getValue());
				metaData.SetBreakvaules(QuantileBreaks.getValue());
			}else {
				
			}
		}catch(Exception e){
			e.printStackTrace();
			
		}
		return metaData;
	}
	
    /**
	 * this function is to publish the layer in mapserver
	 * */
    public boolean create_mapfile(String filename){
		
		System.out.println("filename:" + filename);
		
		RasterMetaData metaData  = MetaDataExtractNew(filename);
		String extent = metaData.GetExent();
		String min = metaData.GetMin();
		String max = metaData.GetMax();
		String espgCode = metaData.GetEpsgcode();
		String quantile = metaData.GetBreakvaules();
		String proj4 = metaData.GetProj4();
 
		String  [] proj4s = proj4.split("\\s"); 
		
		this.max = max;
		this.min = min;
		try{
			
			//String mapfile_name = Constant.MapFilePath + filename.replace(".tif", ".map");
			String mapfile_name = "";
			String[] splitFileNames = filename.split("\\.");
			int splitFileLen = splitFileNames.length;
			if (splitFileNames[splitFileLen - 1].equals("TIF")) {
				mapfile_name = Constant.MapFilePath + filename.replace(".TIF", ".map");
			}else if (splitFileNames[splitFileLen - 1].equals("tif")) {
				mapfile_name = Constant.MapFilePath + filename.replace(".tif", ".map");
			}
			
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
			
			//writer.write(DoubleSpace + "SHAPEPATH" + SingleSpace + "\"../data\"" + "\t\n");
			writer.write(DoubleSpace + "SHAPEPATH" + SingleSpace + "\""+ Constant.SHAPEPATH +"\"" + "\t\n");
		                       	
			System.out.println("Constant.SHAPEPATH:" + Constant.SHAPEPATH);
			
			writer.write(DoubleSpace + "IMAGECOLOR" + SingleSpace + "255 255 255" + "\t\n");
			writer.write(DoubleSpace + "FONTSET" + SingleSpace + "\"../../../fonts/fonts.list\"" + "\t\n");
			writer.write("\t\n");
			//WEB BEGIN
			// write WEB information
			writer.write(DoubleSpace + WEB + "\t\n");
			writer.write(FourSpace + "IMAGEPATH" + SingleSpace +"\"ms4w/tmp/ms_tmp/\"" + "\t\n");
			writer.write(FourSpace + "IMAGEURL" + SingleSpace +"\"/ms_tmp/\"" + "\t\n");
			writer.write(FourSpace + METADATA_WEB + "\t\n");
			writer.write(SixSpace + "\"wms_title\"" + SingleSpace + "\"WMS Demo Server\"" + "\t\n");
			writer.write(SixSpace + "\"wms_onlineresource\"" + SingleSpace + "\""+ Constant.wms_onlineresource +"\"" + "\t\n");
			
		    writer.write(SixSpace + "\"wms_srs\"" + SingleSpace + "\"EPSG:900913 EPSG:4326\"" + "\t\n");
			
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
			
			String [] tempstr = filename.split("\\\\")[2].split("\\.");
			writer.write(FourSpace + "NAME" + SingleSpace + "\""+ tempstr[0] +"\"" +"\t\n");
			
			writer.write(FourSpace + "DATA" + SingleSpace + "\""+ filename.replace("result_egc/", "") +"\"" + "\t\n");
			writer.write(FourSpace + PROJECTION_LAYER + "\t\n");
			
			writer.write(SixSpace + "\"init=epsg:"+ espgCode +"\"" + "\t\n");
//			int proj4s_len = proj4s.length -1; 
//			for(int i = 0; i< proj4s_len ; i++){
//				writer.write(SixSpace + "\"" + proj4s[i] +"\"" + "\t\n");
//			}
			
			writer.write(FourSpace + END_PROJECTION_LAYER + "\t\n");
			writer.write(FourSpace + "STATUS" + SingleSpace + "OFF" + "\t\n");
			writer.write(FourSpace + "TYPE" + SingleSpace + "RASTER" + "\t\n");
			writer.write(FourSpace + "OFFSITE" + SingleSpace + "71 74 65" + "\t\n");
			writer.write("\t\n");
			            
			//writer.write(FourSpace + "PROCESSING" + SingleSpace + "\"SCALE=0,64.26\"" + "\t\n");
			max =  String.valueOf(Float.valueOf(max) + 0.1f * Float.valueOf(max));  
			min =  String.valueOf(Float.valueOf(min) - 0.1f * Float.valueOf(min));  
			           
			writer.write(FourSpace + "PROCESSING" + SingleSpace + "\"SCALE="+ min + "," + max +"\"" + "\t\n");
			writer.write(FourSpace + "PROCESSING" + SingleSpace + "\"SCALE_BUCKETS=1000\"" + "\t\n");
			writer.write("\t\n");                            
			       
			// write class
			//ColorMap colorMap = new ColorMap();
			//ClassData classData = new ClassData(min,max,quantile);
			ColorMap colorMap = new ColorMap(1);
			ClassData classData = new ClassData(min,max,filename,1);
			int len = classData.classData.length;
			for(int i =0; i< len; i++){
				writer.write(FourSpace + CLASS + "\t\n");
				writer.write(SixSpace + "NAME" + SingleSpace + "\"" + classData.classData[i][0] + "-" + classData.classData[i][1] + "\"" + "\t\n");
				String exp = SixSpace + "EXPRESSION" + SingleSpace + "([pixel]>=" + classData.classData[i][0]
				             + SingleSpace + "AND [pixel]<" + SingleSpace + classData.classData[i][1]
				             + ")" + "\t\n";
				writer.write(exp);
				writer.write(SixSpace +  STYLE + "\t\n");
				writer.write(EightSpace + "COLOR" + SingleSpace + colorMap.colors.get(i) + "\t\n");
				writer.write(SixSpace + END_STYLE + "\t\n");
				writer.write(FourSpace + END_CLASS + "\t\n");
			}
			//LAYER��END
			writer.write(DoubleSpace + END_LAYER + "\t\n");
		
			//MAP END
			writer.write(END_MAP + "\t\n");
			// MAPFile creating finished
			writer.flush();
			writer.close();
		}catch(Exception e){
			tag = "0";
			e.printStackTrace();
		}
		return true;    
	}
    
    
    public String getUploadRasterInfo(String dataPathString) {
    	String[] tmpStrings = dataPathString.split("\\\\");
    	int len = tmpStrings.length;
    	String envPathString = tmpStrings[len - 1];
		RasterMetaData envRasterMetaData = MetaDataExtractNew(envPathString);
		String EPSGCODE = envRasterMetaData.GetEpsgcode();
		String projString = envRasterMetaData.GetProj4();
		String proj = EPSGCODE + "#" + projString;
		return proj;
	}
    
}
