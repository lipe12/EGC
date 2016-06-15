package cn.com.action;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import tutorial.Constant;
import cn.com.bean.DataSet;    

import com.googlecode.jsonplugin.annotations.JSON;
import com.opensymphony.xwork2.ActionSupport;

public class DataSetAction  extends ActionSupport{

	private String datasetname;
	private String north;
	private String south;
	private String west;
	private String east;
	private File kml;
	private String kmlPath;
	private String dataSetPath;
	
	private boolean tag;
	public boolean isTag() {
		return tag;
	}
	public void setTag(boolean tag) {
		this.tag = tag;
	}

	private boolean flag = true;        
	@JSON(name="success")               
	public boolean isFlag() {
		return flag;
	}
	public void setFlag(boolean flag) {
		this.flag = flag;
	}
	
	private  final int BUFFER_SIZE = 1024 ;
	
	private ArrayList <DataSet> items = new ArrayList<DataSet>();

	public String findkmlextent(){                                           
        
		tag = false;                        
		SAXBuilder sb = new SAXBuilder();
		
		HttpServletRequest request = ServletActionContext.getRequest();
		String path = request.getSession().getServletContext().getRealPath("")
				+ File.separator +"WEB-INF" + File.separator +"xml";
		String username = (String)request.getSession().getAttribute("username");    
		path = path + File.separator + "users_informations" + File.separator + username;
	    path = path + File.separator + "dataSets.xml";
	    
	    File tmpFile = new File(path);
	    if(!tmpFile.exists()){
	    	tag = true;
	    	return SUCCESS;
	    }
		
	    try{
	    	 Document filesdoc = null;
	         filesdoc = sb.build("file:" + File.separator + path);	 
		     XPath xpath = XPath.newInstance("dataSets/dataSet[datasetname='" + this.datasetname + "']");
		     
		     Element dataSet = (Element)xpath.selectSingleNode(filesdoc);
             if(dataSet==null){
            	 tag = true;
            	 return SUCCESS;
             }
			 Element _north = dataSet.getChild("north");
			 this.north = _north.getText();
			 Element _south = dataSet.getChild("south");
			 this.south = _south.getText();
	    	 Element _west = dataSet.getChild("west");
	    	 this.west = _west.getText();
	    	 Element _east = dataSet.getChild("east");
	    	 this.east = _east.getText();   
	    	 tag = true;
	    }catch(Exception e){
	    	//System.out.println("xxxxxx-----xxxxxxxx");
	    	e.printStackTrace();
	    }
		
		
		//System.out.println("invoke getExtent");           
		
		return SUCCESS;
	}
	
	public String list(){ //list dataSets       
		
		
		SAXBuilder sb = new SAXBuilder();
		
		HttpServletRequest request = ServletActionContext.getRequest();
		String path = request.getSession().getServletContext().getRealPath("")
				+ File.separator +"WEB-INF" + File.separator +"xml";
		String username = (String)request.getSession().getAttribute("username");    
		path = path + File.separator + "users_informations" + File.separator + username;
	    path = path + File.separator + "dataSets.xml";
	    
	    //System.out.println("path: " + path);           
	    
	    File tmpFile = new File(path);
	    if(!tmpFile.exists()){
	    	
	    	return SUCCESS;
	    }
	    
	    try{
	    	 Document filesdoc = null;
	         filesdoc = sb.build("file:" + File.separator + path);	 
		     XPath xpath = XPath.newInstance("dataSets/dataSet");
		     ArrayList<Element> dataSets = (ArrayList<Element>)xpath.selectNodes(filesdoc);
		                                                               
		   
		     for(Element file : dataSets){                             
		    	 
		    	 DataSet dataset = new DataSet();
		    	 Element _datasetname = file.getChild("datasetname");
		    	
		    	 dataset.setDatasetname(_datasetname.getText());
		    	 Element _north = file.getChild("north");
		    	 dataset.setNorth(_north.getText());
		    	 Element _south = file.getChild("south");
		    	 dataset.setSouth(_south.getText());
		    	 Element _west = file.getChild("west");
		    	 dataset.setWest(_west.getText());
		    	 Element _east = file.getChild("east");
		    	 dataset.setEast(_east.getText());  
		    	 Element _kmlpath = file.getChild("kmlpath");
		    	 dataset.setKmlpath(_kmlpath.getText()); 
		    	 
		    	 //System.out.println("DataSetName is " + _datasetname.getText());
		    	                                                 
		    	 items.add(dataset);  
		    	  
		     }                                                                   
		   
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
	    
	                
		return SUCCESS;
	}
	
	public ArrayList<DataSet> getItems() {
		return items;
	}                           
	public void setItems(ArrayList<DataSet> items) {
		this.items = items;
	}

	private String username;
	
	public String upload(){// upload kml
		
		                        
		            
		this.flag = false;                
		
		HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("") + File.separator + "kml";
	    username = (String)request.getSession().getAttribute("username");
	    path = path + File.separator + username;
	    File folder =new File(path);    
	     
	    if(!folder.exists()&& !folder.isDirectory()){       
	    	folder.mkdir();    
	    } 
	    
	    String kmlPath = path + File.separator  + datasetname + ".kml";
		File file = new File(kmlPath);
		copy(kml,file);           
		System.out.println(datasetname);
		
		
		//Float float_north = new Float(north);
		//Float float_south = new Float(south);
		//Float float_west = new Float(west);
		//Float float_east = new Float(east);
		//DecimalFormat   fnum   =   new   DecimalFormat("##0.000000");  
		//north=fnum.format(float_north);      
		//south=fnum.format(float_south);   
		//west=fnum.format(float_west);   
		//east=fnum.format(float_east);   
		                                  
		/// begin
		String integer_random = this.createFixLenthString(6);
		String dot_random = this.createFixLenthString(6);
		Integer int_north = new Integer(integer_random) + 1000;
		Integer int_south = new Integer(integer_random) - 1000;
		Integer int_west = new Integer(integer_random) - 1500;
		Integer int_east = new Integer(integer_random) + 1500;
		
		
		north = int_north.toString() + "." + dot_random;
		south = int_south.toString() + "." + dot_random;
		west = int_west.toString() + "." + dot_random;
		east = int_east.toString() + "." + dot_random;
		/// end
		
		
		createDataSet();
	
		updateDataSet(); 
	                           
	
		writeMetaData(username + File.separator + this.datasetname + ".kml","null","Boundary","KML",
				"KML",this.north,this.south,this.west,
				this.east,this.datasetname);    
		
		                      
		this.flag = true;                                                                                                  
		
		System.out.println("flag: " + flag);               
		
	                         
		return SUCCESS;    
	}
	
	/* 
	* return random with strLength
	*/  
	private String createFixLenthString(int strLength) {  
	      
	    Random rm = new Random();  
	     
	    double pross = (1 + rm.nextDouble()) * Math.pow(10, strLength);  

	    String fixLenthString = String.valueOf(pross);  

	    return fixLenthString.substring(1, strLength + 1);  
	}  
	 
	 
	
	private  void writeMetaData(String fileName, String fileSize, String type, String format,
			                    String semantic, String top, String down, String left,
			                    String right, String datasetName
			){
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	   
	    String path = request.getSession().getServletContext().getRealPath("")
	    		+ File.separator +"WEB-INF" + File.separator +"xml";
		try{
			 Document filesdoc = null;
			 String username = (String)request.getSession().getAttribute("username");

             path = path + File.separator + "users_informations" + File.separator + username;		 
	         filesdoc = sb.build("file:" + File.separator + path + File.separator 
	        		 + username + "_dataFiles.xml"); 
	    	
			 Element root=filesdoc.getRootElement(); 
			 
			 Element _file = new Element("file");
			 Element _fileName = new Element("fileName");
			 _fileName.setText(fileName);
			 
			 Element _fileSize = new Element("fileSize");
			 _fileSize.setText(fileSize);
			 Element _type = new Element("type");
			 _type.setText(type);
			 
			 Element _format = new Element("format");
			 _format.setText(format);
			 
			 Element _semantic = new Element("semantic");
			 _semantic.setText(semantic);
			 
			 Element _top =new Element("top");
			 _top.setText(top);
			 Element _down = new Element("down");
			 _down.setText(down);
			 
			 Element _left =new Element("left");
			 _left.setText(left);
			 
			 Element _right = new Element("right");
			 _right.setText(right);
			 
			 Element _dataset = new Element("datasetName");
			 _dataset.setText(datasetName);
			 
			 root.addContent(_file);
			 _file.addContent(_fileName);
			 _file.addContent(_fileSize);
			 _file.addContent(_type);
			 _file.addContent(_format);
			 _file.addContent(_semantic);
			 _file.addContent(_top);
			 _file.addContent(_down);
			 _file.addContent(_left);
			 _file.addContent(_right);
			 _file.addContent(_dataset);
			 
			 Format _format1 = Format.getCompactFormat();   
  	         _format1.setEncoding("UTF-8");  
  	         _format1.setIndent("  ");     
  	         XMLOutputter xmlout = new XMLOutputter(_format1); 
  	         File dataFiles = null;
  	         
  	         dataFiles = new File(path + File.separator + username +"_dataFiles.xml");
  	         
  	         System.out.println("dataFiles:" +  dataFiles);
  	         
  	         FileWriter filewriter = new FileWriter(dataFiles);
  	         
  	         xmlout.output(filesdoc, filewriter);
  	         filewriter.close();     
  	         
		}catch(Exception e){
			e.printStackTrace();
		}          
	}
	
	private void updateDataSet(){
		
		SAXBuilder sb = new SAXBuilder();
		Document filesdoc = null;
		try {
			filesdoc = sb.build("file:" + File.separator + this.dataSetPath);
			 Element root=filesdoc.getRootElement(); 
			 Element _dataSet = new Element("dataSet");
			 Element _datasetname = new Element("datasetname");
			 _datasetname.setText(this.datasetname);
			 Element _north = new Element("north");
			 _north.setText(this.north);
			 Element _south = new Element("south");                         
			 _south.setText(this.south);
			 Element _west = new Element("west");
			 _west.setText(this.west);
			 Element _east = new Element("east");
			 _east.setText(this.east);
			 Element _kmlpath = new Element("kmlpath");
			 _kmlpath.setText("kml" + File.separator + this.username + File.separator + this.datasetname + ".kml");
			 
			 _dataSet.addContent(_datasetname);
			 _dataSet.addContent(_north);
			 _dataSet.addContent(_south);
			 _dataSet.addContent(_west);
			 _dataSet.addContent(_east);
			 _dataSet.addContent(_kmlpath);
			 root.addContent(_dataSet);
			 
			 Format format = Format.getCompactFormat();   
  	         format.setEncoding("UTF-8");  
  	         format.setIndent("  ");     
  	         XMLOutputter xmlout = new XMLOutputter(format); 
  	         File dataFiles = null;
  	         
  	         dataFiles = new File(this.dataSetPath);
  	        
  	         FileWriter filewriter = new FileWriter(dataFiles);
  	         
  	         xmlout.output(filesdoc, filewriter);
  	         filewriter.close();     
		} catch (JDOMException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 	
	}
	
	private void createDataSet(){
		
		
		HttpServletRequest request = ServletActionContext.getRequest();
		String username = (String)request.getSession().getAttribute("username");
		String path = request.getSession().getServletContext().getRealPath("") + File.separator + "WEB-INF"
	    		+ File.separator + "xml" + File.separator + "users_informations";
	   
	    path = path + File.separator + username;
	    
		
		dataSetPath = path + File.separator + "dataSets.xml";
	    File file=new File(dataSetPath);    
	    if(!file.exists())    
	    {    
	        createDataSetXML(dataSetPath);    
	    }    
	}
	
	private void createDataSetXML(String xmlPath){
		
        Element root = new Element("dataSets");  
        Document Doc = new Document(root);  
        Format format = Format.getCompactFormat();   
	    format.setEncoding("UTF-8");  
	    format.setIndent("  ");     
        XMLOutputter XMLOut = new XMLOutputter(format);  

        try {
			XMLOut.output(Doc, new FileOutputStream(xmlPath));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}  
	}
	
	private  void copy(File src, File dst){
        try{
           InputStream in = null ;
           OutputStream out = null ;
           try{                
               in = new BufferedInputStream( new FileInputStream(src), BUFFER_SIZE);
               out = new BufferedOutputStream( new FileOutputStream(dst), BUFFER_SIZE);
               byte [] buffer = new byte [BUFFER_SIZE];
               int len = -1;
               while((len = in.read(buffer))>0){
                   out.write(buffer,0,len);
               } 
            }finally{
                if(null != in){
                   in.close();
                } 
                if(null != out){
                   out.close();
                } 
           } 
        }catch(Exception e){
           e.printStackTrace();
        } 
   } 

	
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

	public File getKml() {
		return kml;
	}

	public void setKml(File kml) {
		this.kml = kml;
	}

	
}
