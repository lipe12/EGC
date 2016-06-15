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

public class DeleteDataFileAction extends ActionSupport{

	private String fileName;
	private int tag;
	
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
			 
		     List<Element> files =  root.getChildren();
		     for(Element file : files){
		    	 
		    	 String file_name = file.getChild("fileName").getText();
		    	 if(file_name.equals(fileName)){
		    		 
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
  	         
		}catch(Exception e){
			e.printStackTrace();
		}
		
		tag =1;
		return SUCCESS;
	}
}