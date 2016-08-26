package org.easygeoc.account;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import tutorial.Constant;
import cn.com.bean.DataSet;

import com.googlecode.jsonplugin.annotations.JSON;
import com.opensymphony.xwork2.ActionSupport;

import tutorial.CreateUploadDataMapFile;;

/**
 * @version 1.1
 * @author lp
 * 添加功能：当用户上传栅格数据时，在mapserver中创建mapfile，以便在前台openlayer中显示
 * */
public class UploadDataFile extends ActionSupport{

	private String dataName;
	private String semantic;
	private String dataSetName;
	
	private File datafile_csv;
	private File datafile;
	private File datafile_prj;

	
	private String datafile_csvStr;
	
	public String getDatafile_csvStr() {
		return datafile_csvStr;
	}
	public void setDatafile_csvStr(String datafile_csvStr) {
		this.datafile_csvStr = datafile_csvStr;
	}
	public File getDatafile() {
		return datafile;
	}
	public void setDatafile(File datafile) {
		this.datafile = datafile;
	}
	public File getDatafile_prj() {
		return datafile_prj;
	}
	public void setDatafile_prj(File datafile_prj) {
		this.datafile_prj = datafile_prj;
	}
	public File getDatafile_csv() {
		return datafile_csv;
	}
	public void setDatafile_csv(File datafile_csv) {
		this.datafile_csv = datafile_csv;
	}
	private String filePostfix;
	
	private int tag;
	
	private boolean flag = true;
	@JSON(name="success") 
	public boolean isFlag() {
		return flag;
	}
	public void setFlag(boolean flag) {
		this.flag = flag;
	}
	private  final int BUFFER_SIZE = 1024 ;
   
	public String uploadData(){
		
	    
		this.flag = false;
		
		if(this.datafile == null){
			
			System.out.println("tif is null");
		}
		if(this.datafile_csvStr.equals("")){          
			
			System.out.println("csv is null");
		}
		
                 
        HttpServletRequest request = ServletActionContext.getRequest();
	    
	    String username = (String)request.getSession().getAttribute("username");
		
		//this.fileName = username + File.separator + dataSetName + 
		//		File.separator + dataName + "." + this.filePostfix;
		
	   this.fileName = username + "/" + dataSetName + 
			           "/" + dataName + "." + this.filePostfix;
	    
		this.filePostfix = this.filePostfix.toUpperCase();
		this.format = this.filePostfix;
		this.type = Formant_Type(this.filePostfix);
		//this.readDataSet();// get top down left and right

		
	    String path = Constant.DataFilePath + File.separator + username;
	    File folder =new File(path);    
	     
	    if(!folder.exists()&& !folder.isDirectory()){       
	    	folder.mkdir();    
	    }
	    
	    path = path + File.separator + dataSetName;//username/dataSetName
		
	    folder =new File(path);    
	     
	    if(!folder.exists()&& !folder.isDirectory()){       
	    	folder.mkdir();    
	    }
	               
      if(this.datafile != null){
	    	
	    	String filePath = path + File.separator  + dataName + "." + this.filePostfix;
	  	    File file = new File(filePath);
	    	
	    	this.copy(datafile,file); 
			this.fileSize = FileSize(datafile.length());
			String tmpTxtPath = "";
			try {
				tmpTxtPath = request.getSession().getServletContext().getRealPath("") + File.separator + "WEB-INF"
			    		+ File.separator + "xml" + File.separator + "users_informations" + File.separator + username + File.separator + "tmp.txt";
				String cmdString = Constant.exepath + File.separator + "polygon.exe" + " " + filePath + " " + tmpTxtPath;
				Process process = Runtime.getRuntime().exec("cmd /c" + cmdString); 
				String str;
				BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
				while ( (str=bufferedReader.readLine()) !=null){System.out.println(str);}     
				process.waitFor(); 
			    path = path + File.separator + username;
			} catch (Exception e) {
				e.printStackTrace();
			}
			readTxtExtent(tmpTxtPath);
			WriteDataSet();
			this.writeMetaData();
			//========================new function ==========================
			   //判断在MapFilePath文件夹中是否存在username文件夹，如果不存在创建文件夹
			String mapUserPath = Constant.MapFilePath + File.separator + username;
			File userMapFolder = new File(mapUserPath);
			if (!userMapFolder.exists() && !userMapFolder.isDirectory()) {
				userMapFolder.mkdir();
			}
			   //判断在MapFilePath/username文件夹中是否存在dataSetName文件夹，如果不存在创建该文件夹
			String mapSetPath = mapUserPath + File.separator + dataSetName;
			File mapSetFolder = new File(mapSetPath);
			if (!mapSetFolder.exists() && !mapSetFolder.isDirectory()) {
				mapSetFolder.mkdir();
			}
			   //在dataSetName文件夹中创建raster的mapfi文件
			CreateUploadDataMapFile createFileMap = new CreateUploadDataMapFile();
			String soapFileAddress = username + File.separator + dataSetName + File.separator  + dataName + "." + this.filePostfix;
			createFileMap.create_mapfile(soapFileAddress);
			//=============================end================================
			filePath = path + File.separator  + dataName + ".prj";
	  	    file = new File(filePath);
	    	                                        
	    	this.copy(datafile_prj,file);    
			
	                 
	    	System.out.println("filePath:" + filePath);
	    	
	    }else{
	    	
	    	String filePath = path + File.separator  + dataName + "." + this.filePostfix;
	  	    
	    	
	    	try {
	    		
				this.writeTxt(filePath, datafile_csvStr);
				
			} catch (IOException e) {
				
				e.printStackTrace();
			}
	    	File file = new File(filePath);
			this.fileSize = FileSize(file.length());
			
			this.writeMetaData();
			
			System.out.println("filePath:" + filePath);
			
	    }
		                                 
	    this.flag = true;            
		return SUCCESS;
	}
	
	private void writeTxt(String filePath, String str) throws IOException{
		
		File _file = new File(filePath);
		 _file.createNewFile();
        BufferedWriter out = new BufferedWriter(new FileWriter( _file));  
        out.write(str);
        out.flush();  
        out.close(); 
	}
	
	public String execute(){         
	   
		this.flag = false;
		
		if(this.datafile == null){
			
			System.out.println("asc is null");
		}
		if(this.datafile_csv == null){          
			
			System.out.println("csv is null");
		}
		
                 
        HttpServletRequest request = ServletActionContext.getRequest();
	    
	    String username = (String)request.getSession().getAttribute("username");
		
		//this.fileName = username + File.separator + dataSetName + 
		//		File.separator + dataName + "." + this.filePostfix;
		
	    this.fileName = username + "/" + dataSetName + 
	           "/" + dataName + "." + this.filePostfix;   
	    
		this.filePostfix = this.filePostfix.toUpperCase();
		this.format = this.filePostfix;
		this.type = Formant_Type(this.filePostfix);
		this.readDataSet();// get top down left and right

		
	    String path = Constant.DataFilePath + File.separator + username;
	    File folder =new File(path);    
	     
	    if(!folder.exists()&& !folder.isDirectory()){       
	    	folder.mkdir();    
	    }
	    
	    path = path + File.separator + dataSetName;//username/dataSetName
		
	    folder =new File(path);    
	     
	    if(!folder.exists()&& !folder.isDirectory()){       
	    	folder.mkdir();    
	    }
	               
	                 
	    
	    if(this.datafile_csv !=null){
	    	
	    	String filePath = path + File.separator  + dataName + "." + this.filePostfix;
	  	    File file = new File(filePath);
	    	
	    	this.copy(datafile_csv,file); 
			this.fileSize = FileSize(datafile_csv.length());
			this.writeMetaData();
			
			System.out.println("filePath:" + filePath);
			
	    }else if(this.datafile != null){
	    	
	    	String filePath = path + File.separator  + dataName + "." + this.filePostfix;
	  	    File file = new File(filePath);
	    	
	    	this.copy(datafile,file); 
			this.fileSize = FileSize(datafile.length());
			this.writeMetaData();
			
			System.out.println("filePath:" + filePath);
			
			filePath = path + File.separator  + dataName + ".prj";
	  	    file = new File(filePath);
	    	                         
	    	this.copy(datafile_prj,file); 
			
	    	
	    }
	       
	    this.flag = true;     
		return SUCCESS;      
	}
	
	private void readDataSet(){
		
		SAXBuilder sb = new SAXBuilder();
	    
		HttpServletRequest request = ServletActionContext.getRequest();
		String path = request.getSession().getServletContext().getRealPath("")
				+ File.separator +"WEB-INF" + File.separator +"xml";
		String username = (String)request.getSession().getAttribute("username");    
		path = path + File.separator + "users_informations" + File.separator + username;
	    path = path + File.separator + "dataSets.xml";
		
		try{               
	    	 Document filesdoc = null;
	         filesdoc = sb.build("file:" + File.separator + path);	              
		     XPath xpath = XPath.newInstance("dataSets/dataSet[datasetname='" + dataSetName + "']");
		     Element dataSet = (Element)xpath.selectSingleNode(filesdoc);

			 Element _north = dataSet.getChild("north");
			 this.top = _north.getText();
			 Element _south = dataSet.getChild("south");
			 this.down = _south.getText();
	    	 Element _west = dataSet.getChild("west");
	    	 this.left = _west.getText();
	    	 Element _east = dataSet.getChild("east");
	    	 this.right = _east.getText();        
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
		
	}
	
	private void WriteDataSet(){
			
			SAXBuilder sb = new SAXBuilder();
		    
			HttpServletRequest request = ServletActionContext.getRequest();
			String path = request.getSession().getServletContext().getRealPath("")
					+ File.separator +"WEB-INF" + File.separator +"xml";
			String username = (String)request.getSession().getAttribute("username");    
			path = path + File.separator + "users_informations" + File.separator + username;
		    path = path + File.separator + "dataSets.xml";
			
			try{               
		    	 Document filesdoc = null;
		         filesdoc = sb.build("file:" + File.separator + path);	              
			     XPath xpath = XPath.newInstance("dataSets/dataSet[datasetname='" + dataSetName + "']");
			     Element dataSet = (Element)xpath.selectSingleNode(filesdoc);
	
				 Element _north = dataSet.getChild("north");
				 String dataSettop = _north.getText();
				 if (dataSettop.equals("")) {
					 _north.setText(this.top);
				}else if (Double.parseDouble(this.top) < Double.parseDouble(dataSettop)) {
					_north.setText(this.top);
				}
				 Element _south = dataSet.getChild("south");
				 String dataSetdown = _south.getText();
				 if (dataSetdown.equals("")) {
					 _south.setText(this.down);
				}else if (Double.parseDouble(this.down) < Double.parseDouble(dataSetdown)) {
					_south.setText(this.down);
				}
				 
		    	 Element _west = dataSet.getChild("west");
		    	 String dataSetWest = _west.getText();
		    	 if (dataSetWest.equals("")) {
		    		 _west.setText(this.left);
				}else if (Double.parseDouble(this.left) < Double.parseDouble(dataSetWest)) {
					_west.setText(this.left);
				}
		    	 
		    	 Element _east = dataSet.getChild("east");
		    	 String dataSeteast = _east.getText(); 
		    	 if (dataSeteast.equals("")) {
		    		 _east.setText(this.right);
				}else if (Double.parseDouble(this.right) < Double.parseDouble(dataSeteast)) {
					_east.setText(this.right);
				}
		    	 Format format = Format.getCompactFormat();   
	  	        format.setEncoding("UTF-8");  
	  	        format.setIndent("  ");     
	  	        XMLOutputter xmlout = new XMLOutputter(format); 
	  	        File _file = null;
	  	        _file = new File(path);  
	  	        FileWriter filewriter = new FileWriter(_file);
		        xmlout.output(filesdoc, filewriter);
		        filewriter.close(); 
		    }catch(Exception e){
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
	
	private String Formant_Type(String postfix){
		
		String _type = null;
		if(postfix.equals("CSV")){
			
			_type = "Table";
		}else if (postfix.equals("TIF")){
			
			_type = "Raster";
		}else{
			_type = null;
		}
		
		return _type;
	}
	
	public String FileSize(long filelength) {
        DecimalFormat df = new DecimalFormat("#.00");
        String fileSizeString = "";
        if (filelength < 1024) {
            fileSizeString = df.format((double) filelength) + "B";
        } else if (filelength < 1048576) {
            fileSizeString = df.format((double) filelength / 1024) + "K";
        } else if (filelength < 1073741824) {
            fileSizeString = df.format((double) filelength / 1048576) + "M";
        } else {
            fileSizeString = df.format((double) filelength / 1073741824) + "G";
        }
        return fileSizeString;
    }
	
	private String fileName;
	private String fileSize;
	private String type;
	private String format;
	private String top;
	private String down;
	private String left;
	private String right;
	public void readTxtExtent(String path) {
		String encoding="GBK";
		try {
			File file=new File(path);
			List<String> extents = new ArrayList<String>();
			if(file.isFile() && file.exists()){ 
				InputStreamReader read = new InputStreamReader(new FileInputStream(file),encoding);
				 BufferedReader bufferedReader = new BufferedReader(read);
				 
				 String lineTxt = null;
				 while((lineTxt = bufferedReader.readLine()) != null){
					 extents.add(lineTxt);
				 }
			}
			String extent = extents.get(0);
			String[] splitExtent = extent.split(" ");
			this.down = splitExtent[3];
			this.right = splitExtent[2];
			this.top = splitExtent[1];
			this.left = splitExtent[0];
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private  void writeMetaData(){
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
			 _fileName.setText(this.fileName);
			 Element _fileSize = new Element("fileSize");
			 _fileSize.setText(this.fileSize);
			 Element _type = new Element("type");
			 _type.setText(this.type);
			 Element _format = new Element("format");
			 _format.setText(this.format);
			 Element _semantic = new Element("semantic");
			 _semantic.setText(this.semantic);
			 Element _dataversion = new Element("dataversion");
			 _dataversion.setText("new");
			 Element _top =new Element("top");
			 _top.setText(this.top);
			 Element _down = new Element("down");
			 _down.setText(this.down);
			 Element _left =new Element("left");
			 _left.setText(this.left);
			 Element _right = new Element("right");
			 _right.setText(this.right);
			 Element _dataset = new Element("datasetName");
			 _dataset.setText(this.dataSetName);
			 
			 root.addContent(_file);
			 _file.addContent(_fileName);
			 _file.addContent(_fileSize);
			 _file.addContent(_type);
			 _file.addContent(_format);
			 _file.addContent(_semantic);
			 _file.addContent(_dataversion);
			 _file.addContent(_top);
			 _file.addContent(_down);
			 _file.addContent(_left);
			 _file.addContent(_right);
			 _file.addContent(_dataset);
			 
			 Format format = Format.getCompactFormat();   
  	         format.setEncoding("UTF-8");  
  	         format.setIndent("  ");     
  	         XMLOutputter xmlout = new XMLOutputter(format); 
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
	
	public String getDataName() {
		return dataName;
	}
	public void setDataName(String dataName) {
		this.dataName = dataName;
	}
	public String getSemantic() {
		return semantic;
	}
	public void setSemantic(String semantic) {
		this.semantic = semantic;
	}
	public String getDataSetName() {
		return dataSetName;
	}
	public void setDataSetName(String dataSetName) {
		this.dataSetName = dataSetName;
	}

	public String getFilePostfix() {
		return filePostfix;
	}
	public void setFilePostfix(String filePostfix) {
		this.filePostfix = filePostfix;
	}
	public int getTag() {
		return tag;
	}
	public void setTag(int tag) {
		this.tag = tag;
	}

}
