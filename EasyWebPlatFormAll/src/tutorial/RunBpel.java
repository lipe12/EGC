package tutorial;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import java.util.regex.*;

import javax.servlet.http.HttpServletRequest; 

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.InputStreamRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;
import org.xml.sax.InputSource;

import bpelUtility.bpelUtility2;
import bpelUtility.oneToNMap;


import com.opensymphony.xwork2.ActionSupport;

@SuppressWarnings("deprecation")
public class RunBpel extends ActionSupport{
	private String tag; 
	private List<String> layers = new ArrayList<String>();
	private List<String> mapfiles = new ArrayList<String>();
	private String srs; 
	private List<String> semantics = new ArrayList<String>();
	private List<String> maxs = new ArrayList<String>();
	private List<String> mins = new ArrayList<String>();
	public List<String> getMaxs() {
		return maxs;
	}
	public void setMaxs(List<String> maxs) {
		this.maxs = maxs;
	}
	public List<String> getMins() {
		return mins;
	}
	public void setMins(List<String> mins) {
		this.mins = mins;
	}
	public List<String> getSemantics() {
		return semantics;
	}
	public void setSemantics(List<String> semantics) {
		this.semantics = semantics;
	}
	private List<String> outputData_png = new ArrayList<String>();
	private List<String> outputData_asc = new ArrayList<String>();
	public String getTag() {
		return tag;
	}
	public List<String> getLayers() {
		return layers;
	}
	public void setLayers(List<String> layers) {
		this.layers = layers;
	}
	public List<String> getMapfiles() {
		return mapfiles;
	}
	public void setMapfiles(List<String> mapfiles) {
		this.mapfiles = mapfiles;
	}
	public String getSrs() {
		return srs;
	}
	public void setSrs(String srs) {
		this.srs = srs;
	}
	public void setTag(String tag) {
		this.tag = tag;
	}
	public boolean ascToGeotiff(){
		return true;
	}
/**
 * convert asc data into tif data
 * @param rasterFileName {String}
 * @param geotiffFileName {String}
 * */
	public boolean RasterFormatConver(String rasterFileName, String geotiffFileName){
		boolean flag = false;
		
		String soap = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +   
	        "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
	        + " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"" 
	        + " xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\">"    
	        + " <soap:Body>"
	        + "<rasterToGeoTiff xmlns=\"http://whu.edu.cn/ws/rasterToGeoTiff\">"
	        + "<rasaterFn>" + rasterFileName + "</rasaterFn>"
	        +" <geoTiffFn>" + geotiffFileName + "</geoTiffFn>"
	        + " </rasterToGeoTiff>"
	        +"</soap:Body>" 
	        +"</soap:Envelope>";        

      //String address = "http://localhost/WS_RasterFormatConvert/wsRasterFormatConvert.asmx";
		String address = Constant.Service_RasterFormatConvert_Path;  
      try{
			
			PostMethod postMethod = new PostMethod(address); 
			
			String soapRequestData = 	soap;

			byte[] b = soapRequestData.getBytes("UTF-8");
			InputStream is = new ByteArrayInputStream(b,0,b.length);
			RequestEntity re = new InputStreamRequestEntity(is,b.length,"application/soap+xml; charset=UTF-8");
			postMethod.setRequestEntity(re);
			
			HttpClient httpClient = new HttpClient(); 
			int statusCode = httpClient.executeMethod(postMethod);
			System.out.println("asc to geotiff " + statusCode);
			if(statusCode == 200){
				flag = true;
			}
		}catch(Exception e){
			flag = false;
			e.printStackTrace();
			
		}
		return flag;
	}

	public boolean runcore(List<String> lastTaskOutDataName){
		boolean flag = true;
		for(String dataname : lastTaskOutDataName){
			String ascFileName = Constant.DataFilePath + File.separator + dataname;
			String geotiffFileName = Constant.DataFilePath + File.separator + dataname.replace(".asc", ".tif");
			String layername = dataname.replace(".asc", "");
			String mapfilename = dataname.replace(".asc", "");
			String semantic = "";
			String regEx = "[a-zA-Z]+";  
			Pattern pattern = Pattern.compile(regEx);   
			Matcher matcher = pattern.matcher(dataname); 
            if(matcher.find()){
            	semantic = matcher.group();        	  
            }
            layers.add(layername);                          
            mapfiles.add(mapfilename);
            semantics.add(semantic);
            /*
			if(RasterFormatConver(ascFileName, geotiffFileName)){
				CreateMapFile createMapFile = new CreateMapFile();
				flag = createMapFile.create_mapfile(dataname.replace(".asc", ".tif"));
				if(flag == false){            
					return flag;
				}
			}else{
				flag = false;
				return flag;
			}
			*/
            CreateMapFile createMapFile = new CreateMapFile();
			flag = createMapFile.create_mapfile(dataname);
			maxs.add(createMapFile.max);
			mins.add(createMapFile.min);
			if(flag == false){            
				return flag;
			}
			
		}
		return flag;
	}
	public String run(){   
		           
		 try{  
        	//================================read http input steam, get document doc============================
			 //===========================================start=================================================
        	HttpServletRequest request = ServletActionContext.getRequest();
 		    request.setCharacterEncoding("UTF-8"); 
 			BufferedInputStream inputStream = new BufferedInputStream(request.getInputStream());
 		    byte   by[]=   new   byte[100];
            int   n=0;
 		    StringBuffer   bs=new   StringBuffer();
 		    while((n=inputStream.read(by))!=-1)
 		    {
 		    	String temp = new String(by,0,n);               
 		        bs.append(temp);    
 		    }   
 		    inputStream.close(); 
 		    String xmlstr = bs.toString();
 	        StringReader read = new StringReader(xmlstr);
 	        InputSource source = new InputSource(read);
 	       
 	        SAXBuilder sb = new SAXBuilder();
 	        Document doc = sb.build(source); 
 	        
	        //============================================end=================================================================
	        
	        //==========================read tasks.xml, get document taskdoc=================================================
	        //====================================start======================================================================
 	        String path = request.getSession().getServletContext().getRealPath("")+ File.separator + "WEB-INF" + File.separator + "xml";
 	        Document tasksdoc = sb.build("file:" + File.separator + path + File.separator + "tasks.xml");
	        
	        //======================================end============================================================================
 	        
 	        XPath xpath = XPath.newInstance("model/task");
	        List<Element> tasks = (List<Element>)xpath.selectNodes(doc);
	        List<String> atomWsdlsName = new ArrayList<String>();
	        oneToNMap map = new oneToNMap();
	        String wsdlBasePath = null;
	            
	        int index = 1;
	        int tasksSize = tasks.size();
	        List<String> lastTaskOutDataName = new ArrayList<String>();
	        //
	        List<String> tasknames = new ArrayList<String>();
	        
	        //=======================================get the task information of every task=============================================
	        //=======================================include taskname\input and output data path\wsdlBasePath\atomWsdlsName==============
	        //===============================================start=================================================================
		    for(Element task : tasks){
		    	String taskname = task.getAttribute("taskName").getValue();
	            //
		    	tasknames.add(taskname);
		    	
		    	//based algorithmname to get the algorithmname.xml position, such as D8.xml
		    	Element algorithm =  task.getChild("algorithm");
		    	String  algorithmname = algorithm.getAttributeValue("algorithmName");
		    	xpath = XPath.newInstance("Tasks/Task[@TaskName='"+taskname+"']/Algorithms/Algorithm/AlgorithmName[text()='"+algorithmname+"']");
		    	Element AlgorithmName = (Element)xpath.selectSingleNode(tasksdoc);
		    	Element algorithm_temp = AlgorithmName.getParentElement();
		    	Element algorithmPath_temp = algorithm_temp.getChild("FilePath");
		    	String filePath = path + File.separator + "algorithms" + File.separator + algorithmPath_temp.getText();
		    	
		    	//parse the algorithmname.xml document, get the description of algorithmname
		    	//include WsdlBasePath such as WsdlBasePath = "C:/Wsdl"
		    	//WsdlName WsdlName = "flowDirectionImpl.wsdl"
		    	//datakind and dataname
		    	Document algorithmdoc = sb.build("file:" + File.separator + filePath);
		    	xpath = XPath.newInstance("Algorithm");
		    	Element Algorithm = (Element)xpath.selectSingleNode(algorithmdoc);
		    	wsdlBasePath = Algorithm.getAttributeValue("WsdlBasePath");  
		    	//
		    	atomWsdlsName.add(Algorithm.getAttributeValue("WsdlName"));
		    	
		    	List<Element> datas = Algorithm.getChildren();
		    	
		    	for(Element data : datas){  
		    		Element dataName = data.getChild("DataName");
		    		Element dataKind = data.getChild("DataKind");
		    		xpath = XPath.newInstance("model/task/algorithm/data/dataName[text()='"+dataName.getText()+"']");
		    		Element dataName_temp = (Element)xpath.selectSingleNode(doc);
		    		Element data_temp = dataName_temp.getParentElement();
		    		Element dataValue = data_temp.getChild("dataValue");
		    		String dataValueText = dataValue.getText();   // get the data relative path from the http transfered data 
					
		    		 // get the absolute path of input and out put data 
		    		if(!dataValueText.contains(File.separator) && !dataKind.getText().equals("Parameter")){				
		    			if(dataValueText.contains("#")){
							String [] dataValueTexts = dataValueText.split("#");
		    				dataValueText = Constant.DataFilePath + File.separator + dataValueTexts[0];
		    				for(int k = 1; k< dataValueTexts.length; k++){
		    					dataValueText = dataValueText + "#" + Constant.DataFilePath + File.separator + dataValueTexts[k];
		    				}
		    			}else {
		    				dataValueText = Constant.DataFilePath + File.separator + dataValueText;      
		    			} 
		    		}
		    		if(index == tasksSize ){ 
						if(dataKind.getText().equals("OutputData")){
		    				if(dataValue.getText().split(";").length ==2){
		    					lastTaskOutDataName.add(dataValue.getText().split(";")[0]);
			    				outputData_asc.add(Constant.HttpFilePath + "/" + dataValue.getText().split(";")[0]);	
		    				}else{
		    					lastTaskOutDataName.add(dataValue.getText());
			    				outputData_asc.add(Constant.HttpFilePath + "/" + dataValue.getText());
		    				}
		    				
		    			}        
			    	}  
		    		//
		    	    map.putAdd("input" + index ,dataValueText);  // record the input data
		    	}
		    	index ++;  
		    }// end of for(Element task : tasks)
		    //=============================================================end====================================================
		    bpelUtility2 bu = new bpelUtility2();
		    String basePath = Constant.ODE_BasePath;
		    String srcBasePath = Constant.SrcBasePath;
		    //boolean flag = bu.generateBpel(wsdlBasePath, srcBasePath, basePath, atomWsdlsName);
		    boolean flag = bu.generateBpel(wsdlBasePath, srcBasePath, basePath, atomWsdlsName,tasknames);
		    System.out.println("bpel deployed over:" + flag);                
		    String bpelWsdl = "";
		    if(flag == true){            
		    	bpelWsdl = bu.getBpelWsdl();        
		    	System.out.println(bpelWsdl); 
			    if(!bpelWsdl.equals("")){ 
			    	System.out.println("begin revoke service");
			    	boolean hag =  bu.invoke(map,bpelWsdl);
			    	if(hag){              
			    		tag = "1";
			    		if(!runcore(lastTaskOutDataName)){
			    			tag = "0";
			    		}
			    			
			    	}else{ // end of if(hag)
			    		tag = "0";
			    	}      
			    }else{// end of  if(!bpelWsdl.equals(""))
			    	tag = "0";        
			    }
		    }else{// end of  if(flag == true)
		    	tag = "0";
		    }
		                         
         } catch(Exception e){
        	 e.printStackTrace();
         }
		return SUCCESS;
	}
	public List<String> getOutputData_png() {
		return outputData_png;
	}
	public void setOutputData_png(List<String> outputData_png) {
		this.outputData_png = outputData_png;
	}
	public List<String> getOutputData_asc() {
		return outputData_asc;
	}
	public void setOutputData_asc(List<String> outputData_asc) {
		this.outputData_asc = outputData_asc;
	}

}
