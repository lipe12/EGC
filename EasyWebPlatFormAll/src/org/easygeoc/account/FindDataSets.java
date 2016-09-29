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
 * 该java类已经废弃，不再使用
 * this class is used when network front end(前端) recipe right click
 * the back end should return the datasets which their extend contains the mouse location*/
public class FindDataSets extends ActionSupport{
   private String lon;
   private String lat;
   
   private List<String> projectRecords = new ArrayList<String>();


public List<String> getProjectRecords() {
	return projectRecords;
}
public void setProjectRecords(List<String> projectRecords) {
	this.projectRecords = projectRecords;
}


private List<String> uploaders = new ArrayList<String>();

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
	
	
	/**
	 * read the projectSets.xml, find the dataset that include mouse location
	 * */
	public String execute() {
		List<Double> topValues;
		List<Double> downValues;
		List<Double> leftValues;
		List<Double> rightValues;
		HttpServletRequest request = ServletActionContext.getRequest();
		String username = (String)request.getSession().getAttribute("username");
//		String projectPath = request.getSession().getServletContext().getRealPath("") + File.separator + "WEB-INF"
//				+ File.separator + "xml" + File.separator + "projects.xml";
		String projectPath = request.getSession().getServletContext().getRealPath("") + File.separator + "WEB-INF" +
				File.separator + "xml" + File.separator + "users_informations" + File.separator + username + File.separator + username +"_projects.xml";
		try{
			SAXBuilder sb_projectPath = new SAXBuilder();
			Document projectdoc = null;
			projectdoc = sb_projectPath.build("file:" + projectPath);
			XPath proPath = XPath.newInstance("projects/project[creater=\""+ username +"\"]");
			List<Element> projects = (List<Element>)proPath.selectNodes(projectdoc);
			for(Element project : projects){
				List<String> dataSets = new ArrayList<String>();
				String projNameString = project.getChild("name").getValue();
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
//								uploaders.add(uploader);
								
							}
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				Element projectFiles = project.getChild("files");
				List<Element> fileElements = projectFiles.getChildren("file");
				for(Element fileElement : fileElements){
					String fileNameElement = fileElement.getChild("filename").getValue();
					String fileDatasetElement = fileElement.getChild("datasetname").getValue();
					String fileUploaderElement = fileElement.getChild("uploader").getValue();
					String path = request.getSession().getServletContext().getRealPath("") + File.separator + "WEB-INF"
							+ File.separator + "xml" + File.separator + "users_informations";
					path = path + File.separator + fileUploaderElement;
					String projectDataSetPath = path + File.separator + "dataSets.xml";
					SAXBuilder sb = new SAXBuilder();
					Document filesdoc = null;
					try {
						filesdoc = sb.build("file:" + projectDataSetPath);
						XPath xPath = XPath.newInstance("dataSets/dataSet[datasetname=\""+ fileDatasetElement +"\"]");
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
								dataSets.add(fileDatasetElement);
//								uploaders.add(fileUploaderElement);
								
							}
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				if (dataSets.size() > 0) {
					projectRecords.add(projNameString);
				}
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		
		
		return SUCCESS;
	}

   
}
