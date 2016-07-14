package org.easygeoc.account;
import java.io.File;
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
/**
 * this class is to display the study area,when user click the location button
 * 
 * @author lp
 * */
public class DisplayDataSet extends ActionSupport{
	private String datasetname;    //the selected datasetname
	private String upLoader;       // the uploader of dataset
	private String north;
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
	public boolean isTag() {
		return tag;
	}
	public void setTag(boolean tag) {
		this.tag = tag;
	}
	private String south;
	private String west;
	private String east;
	private boolean tag;
	public String getDatasetname() {
		return datasetname;
	}
	public void setDatasetname(String datasetname) {
		this.datasetname = datasetname;
	}
	public String getUpLoader() {
		return upLoader;
	}
	public void setUpLoader(String upLoader) {
		this.upLoader = upLoader;
	}
/**
 * this method is to find the four direciton boundarys
 * @author lp*/
	public String findkmlextent(){                                           
        
		tag = false;                        
		SAXBuilder sb = new SAXBuilder();
		
		HttpServletRequest request = ServletActionContext.getRequest();
		String path = request.getSession().getServletContext().getRealPath("")
				+ File.separator +"WEB-INF" + File.separator +"xml";
		String username = upLoader;    
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
	    	e.printStackTrace();
	    }
		return SUCCESS;
	}
}
