package org.easygeoc.account;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import com.googlecode.jsonplugin.annotations.JSON;
import com.opensymphony.xwork2.ActionSupport;

public class WriteDataSet extends ActionSupport{
	private String datasetname;
	private String north;
	private String south;
	private String west;
	private String east;
	//private String kmlPath;
	private String dataSetPath;
	private String username;
	private boolean flag; //this param should be there, when submit form, otherwise js will jump into success:handler.
	@JSON(name="success")               
	public boolean isFlag() {
		return flag;
	}
	public void setFlag(boolean flag) {
		this.flag = flag;
	}
	public String getDatasetname() {
		return datasetname;
	}

	public void setDatasetname(String datasetname) {
		this.datasetname = datasetname;
	}
	public String execute() {
		HttpServletRequest reuqest = ServletActionContext.getRequest();
		username = (String)reuqest.getSession().getAttribute("username");
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
		createDataSet();
		/// end
		try {
			SAXBuilder sb = new SAXBuilder();
			Document filesdoc = null;
			filesdoc = sb.build("file:" + File.separator + this.dataSetPath);
			XPath xPath = XPath.newInstance("dataSets/dataSet[datasetname=\""+ datasetname +"\"]");
			List<Element> files = (List<Element>)xPath.selectNodes(filesdoc);
			
			if (files.size() == 0) {
				
				updateDataSet();
				this.flag = true;                                                                                                  
				System.out.println("flag: " + flag);
				
			}
			else {
				this.flag = false;                                                                                                  
				System.out.println("flag: " + flag);
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
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
				 Element _north = new Element("north");
				 _north.setText(this.north);
				 Element _south = new Element("south");                         
				 _south.setText(this.south);
				 Element _west = new Element("west");
				 _west.setText(this.west);
				 Element _east = new Element("east");
				 _east.setText(this.east);
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
	
	private String createFixLenthString(int strLength) {  
	      
	    Random rm = new Random();  
	     
	    double pross = (1 + rm.nextDouble()) * Math.pow(10, strLength);  

	    String fixLenthString = String.valueOf(pross);  

	    return fixLenthString.substring(1, strLength + 1);  
	}
}
