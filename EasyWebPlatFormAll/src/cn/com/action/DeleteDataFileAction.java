package cn.com.action;

import java.io.File;
import java.io.FileWriter;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

import com.opensymphony.xwork2.ActionSupport;
import tutorial.Constant;

public class DeleteDataFileAction extends ActionSupport{

	private String fileName;
	private int tag;
	private String deleteFileName;
	private String format_tag;
	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public int getTag() {
		return tag;
	}

	public void setTag(int tag) {
		this.tag = tag;
	}

	public String delete(){
		
		tag = 0;
		String username;
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	   
	    String path = request.getSession().getServletContext().getRealPath("")
	    		+ File.separator +"WEB-INF" + File.separator +"xml";
		try{
			 Document filesdoc = null;
			 username = (String)request.getSession().getAttribute("username");

             path = path + File.separator + "users_informations" + File.separator + username;		 
	         filesdoc = sb.build("file:" + File.separator + path + File.separator 
	        		 + username + "_dataFiles.xml"); 
	    	
			 Element root=filesdoc.getRootElement(); 
			 
		     List<Element> files =  root.getChildren();
		     for(Element file : files){
		    	 
		    	 String file_name = file.getChild("fileName").getText();
		    	 file_name = file_name.substring(file_name.lastIndexOf("/") + 1);
		    	 file_name = file_name.substring(0, file_name.lastIndexOf("."));
		    	 if(file_name.equals(fileName)){
		    		 deleteFileName = file_name;
		    		 format_tag = file.getChild("format").getText();
		    		 root.removeContent(file);
		    		 break;
		    	 }
		     }
			 
			 Format format = Format.getCompactFormat();   
  	         format.setEncoding("UTF-8");  
  	         format.setIndent("  ");     
  	         XMLOutputter xmlout = new XMLOutputter(format); 
  	         File dataFiles = null;
  	         
  	         dataFiles = new File(path + File.separator + username +"_dataFiles.xml");
  	         
  	         System.out.println("delete dataFile is :" +  dataFiles);
  	         
  	         FileWriter filewriter = new FileWriter(dataFiles);
  	         
  	         xmlout.output(filesdoc, filewriter);
  	         filewriter.close();
  	         String deleFilePath;
  	         //based on the format, give the file path that  needed to delete
  	         // because the kml file and the raster file are not in the same folder
  	         if (format_tag.equals("KML")) {
  	        	deleFilePath = request.getSession().getServletContext().getRealPath("") + File.separator +"kml" + File.separator  + deleteFileName;
			}else {
				deleFilePath = Constant.DataFilePath + File.separator + deleteFileName;
			}
  	         deleteDiskFile(deleFilePath);
		}catch(Exception e){
			e.printStackTrace();
		}
		
		tag =1;
		return SUCCESS;
	}
    
	public void deleteDiskFile(String path) {
		File deleteFile = new File(path);
		if(deleteFile.isFile() && deleteFile.exists())
		{

			deleteFile.delete();
		}
	}
}
