package org.easygeoc.account;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

import com.opensymphony.xwork2.ActionSupport;

public class WriteDataSet extends ActionSupport{
	private String datasetname;
	//private String kmlPath;
	private String dataSetPath;
	private String username;
	public String getDatasetname() {
		return datasetname;
	}

	public void setDatasetname(String datasetname) {
		this.datasetname = datasetname;
	}
	public String execute() {
		HttpServletRequest reuqest = ServletActionContext.getRequest();
		username = (String)reuqest.getSession().getAttribute("username");
		createDataSet();
		updateDataSet();
		return SUCCESS;
		
	}
	/**
	 * @author lp
	 *  write new dataset information into the dataset.xml*/
	private void updateDataSet(){
			
			SAXBuilder sb = new SAXBuilder();
			Document filesdoc = null;
			try {
				filesdoc = sb.build("file:" + File.separator + this.dataSetPath);
				 Element root=filesdoc.getRootElement(); 
				 Element _dataSet = new Element("dataSet");
				 Element _datasetname = new Element("datasetname");
				 _datasetname.setText(this.datasetname);
				 Element _kmlpath = new Element("kmlpath");
				 _kmlpath.setText("");
				 
				 _dataSet.addContent(_datasetname);
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
/**
 * @author lp
 * judge the use`s folder have the dataset.xml
 * if not createdataset
 * call createDataSetXML*/
	private void createDataSet(){
		
		
		HttpServletRequest request = ServletActionContext.getRequest();
		//username = (String)request.getSession().getAttribute("username");
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
}
