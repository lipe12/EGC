package org.easygeoc.account;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
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
import com.sun.net.httpserver.Authenticator.Success;

/**
 * @author lp
 * this class is used when network front end(前端) recipe right click
 * the back end should return the datasets which their extend contains the mouse location*/
public class FindDataSets extends ActionSupport{
   private String lon;
   private String lat;
   private List<String> dataSets = new ArrayList<String>();
   private List<String> uploaders = new ArrayList<String>();
   public List<String> getUploaders() {
	return uploaders;
}
public void setUploaders(List<String> uploaders) {
	this.uploaders = uploaders;
}
public String getLon() {
	    return lon;
	}
	public void setLon(String lon) {
		this.lon = lon;
	}
	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
	public List<String> getDataSets() {
		return dataSets;
	}
	public void setDataSets(List<String> dataSets) {
		this.dataSets = dataSets;
	}
	
	/**
	 * read the projectSets.xml, find the dataset that include mouse location
	 * */
	public String execute() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String username = (String)request.getSession().getAttribute("username");
		String projectPath = request.getSession().getServletContext().getRealPath("") + File.separator + "WEB-INF"
				+ File.separator + "xml" + File.separator + "projects.xml";
		try{
			SAXBuilder sb_projectPath = new SAXBuilder();
			Document projectdoc = null;
			projectdoc = sb_projectPath.build("file:" + projectPath);
			XPath proPath = XPath.newInstance("projects/project[creater=\""+ username +"\"]");
			List<Element> projects = (List<Element>)proPath.selectNodes(projectdoc);
			for(Element project : projects){
				Element projectDataSets = project.getChild("datasets");
				List<Element> datasets = (List<Element>)projectDataSets.getChildren("dataset");
				for(Element dataset : datasets){
					String uploader = dataset.getChild("uploader").getValue();
					String datasetname = dataset.getChild("datasetname").getValue();
					String path = request.getSession().getServletContext().getRealPath("") + File.separator + "WEB-INF"
							+ File.separator + "xml" + File.separator + "users_informations";
					path = path + File.separator + uploader;
					String projectDataSetPath = path + File.separator + "dataSets.xml";
					SAXBuilder sb = new SAXBuilder();
					Document filesdoc = null;
					try {
						filesdoc = sb.build("file:" + projectDataSetPath);
						XPath xPath = XPath.newInstance("dataSets/dataSet[datasetname=\""+ datasetname +"\"]");
						List<Element> files = (List<Element>)xPath.selectNodes(filesdoc);
						for(Element file: files)
						{
							Element dataSetName = file.getChild("datasetname");
							String setName = dataSetName.getValue();
							Element top = file.getChild("north");
							double topValue = Double.parseDouble(top.getValue());
							Element down = file.getChild("south");
							double downValue = Double.parseDouble(down.getValue());
							Element left = file.getChild("west");
							double leftValue = Double.parseDouble(left.getValue());
							Element right = file.getChild("east");
							double rightValue = Double.parseDouble(right.getValue());
							double lonValue = Double.parseDouble(lon);
							double latValue = Double.parseDouble(lat);
							if (lonValue > leftValue & lonValue < rightValue & latValue > downValue & latValue < topValue) {
								dataSets.add(setName);
								uploaders.add(uploader);
								
							}
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		
		
		return SUCCESS;
	}

   
}
