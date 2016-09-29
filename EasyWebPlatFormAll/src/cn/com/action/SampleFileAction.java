package cn.com.action;


import java.io.File;
import java.util.ArrayList;
import java.util.List;











import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;

import cn.com.bean.DataFile;
import  cn.com.bean.SampleFile;

import com.opensymphony.xwork2.ActionSupport;
public class SampleFileAction extends ActionSupport{
	private String semantic;
	private String top;
	private String down;
	private String left;
	private String right;
	private String lon;
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
	private String lat;
	private List<SampleFile> samplefiles;
	
	public String execute(){ 
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("") + File.separator +"WEB-INF" + File.separator +"xml";  
	    String pathXmlFolder = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    try{
	    	 Document filesdoc = null;
	    	 String username = (String)request.getSession().getAttribute("username");
	    	 if(username==null){
	    		 filesdoc = sb.build("file:" + File.separator + path + File.separator + "dataFiles.xml");	 
	    	 }else{            
	    		 path = path + File.separator + "users_informations" + File.separator + username;
	    		 
	    		 filesdoc = sb.build("file:" + File.separator + path + File.separator + username + "_projects.xml"); 
	    	 }
	    	 XPath projXPath = XPath.newInstance("projects/project");
	    	 List<Element> projects = (List<Element>)projXPath.selectNodes(filesdoc);
	    	 for(Element projectElement : projects){
	    		 Element dataSetElement = projectElement.getChild("datasets");
	    		 if (dataSetElement != null) {
	    			 List<Element> dataSetsElements = dataSetElement.getChildren("dataset");
	    			 if (dataSetsElements.size() > 0) {
	    				 for(Element dataSet : dataSetsElements){
			    			 String dataSetNameString = dataSet.getChild("datasetname").getValue();
			    			 String uploaderNameString = dataSet.getChild("uploader").getValue();
			    			 boolean isInDataSetExtent = judgeDataSets(dataSetNameString,uploaderNameString,pathXmlFolder);
			    			 if (isInDataSetExtent) {
			    				 readDataSets(dataSetNameString,uploaderNameString,pathXmlFolder);
							}
			    		 }
					}
		    		 
				}
	    		 
	    		 Element dataFileElement = projectElement.getChild("files");
	    		 if (dataFileElement != null) {
					List<Element> dataFiles = dataFileElement.getChildren("file");
					if (dataFiles.size() > 0) {
						for(Element dataFile : dataFiles){
							String uploader = dataFile.getChild("uploader").getValue();
							String dataSetName = dataFile.getChild("parentDataset").getValue();
							String filename = dataFile.getChild("filename").getValue();
							boolean isInDataSetExtent = judgeDataSets(dataSetName,uploader,pathXmlFolder);
							if (isInDataSetExtent) {
								readDatafiles(filename,dataSetName,uploader,pathXmlFolder);
							}
						}
					}
				}
	    	 }
		     
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
		
		return SUCCESS;
	}
	public void readDataSets(String dataSetName, String uploader,String path) {
		String datafilePathString = path + File.separator + "users_informations" + File.separator + uploader + File.separator + uploader +  "_dataFiles.xml";
		SAXBuilder sb = new SAXBuilder();
		try{
			Document fileDocument = sb.build("file:" + datafilePathString);
			 XPath xpath = XPath.newInstance("files/file");
		     List<Element> files = (List<Element>)xpath.selectNodes(fileDocument);
		     samplefiles = new ArrayList<SampleFile>();
		     for(Element file : files){
		    	 
		    	 Element _semantic = file.getChild("semantic");
		    	 Element _dataSetName = file.getChild("datasetName");
		    	 if(semantic.equals(_semantic.getText()) && dataSetName.equals(_dataSetName.getText())){
			    	 
		    		 SampleFile samplefile = new SampleFile();
			    	 Element _fileName = file.getChild("fileName");
			    	 samplefile.setName(_fileName.getText());
			    	 samplefile.setId(_fileName.getText());
			    	 samplefiles.add(samplefile);  
		    	 }
		    	 
		     }
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
	}
	public boolean judgeDataSets(String dataSetName, String uploader,String path) {
		String datafilePathString = path + File.separator + "users_informations" + File.separator + uploader + File.separator +  "dataSets.xml";
		boolean tag = false;
		SAXBuilder sb = new SAXBuilder();
		try {
			Document fileDocument = sb.build("file:" + datafilePathString);
			XPath xpath = XPath.newInstance("dataSets/dataSet[datasetname=\""+ dataSetName +"\"]");
		     Element dataSet = (Element)xpath.selectSingleNode(fileDocument);
		     double north = Double.parseDouble(dataSet.getChild("north").getValue());
		     double south = Double.parseDouble(dataSet.getChild("south").getValue());
		     double west = Double.parseDouble(dataSet.getChild("west").getValue());
		     double east = Double.parseDouble(dataSet.getChild("east").getValue());
		     double lonValue = Double.parseDouble(lon);
			 double latValue = Double.parseDouble(lat);
			 if (lonValue > west & lonValue < east & latValue > south & latValue < north) {
					tag = true;
				}
		     
		} catch (Exception e) {
			e.printStackTrace();
		}
		return tag;
	}
	public void readDatafiles(String dataFileName,String dataSetName, String uploader,String path) {
		String datafilePathString = path + File.separator + "users_informations" + File.separator + uploader + File.separator + uploader +  "_dataFiles.xml";
		SAXBuilder sb = new SAXBuilder();
		try {
			Document filedoc = sb.build("file:"+datafilePathString);
			XPath xpath = XPath.newInstance("files/file");
		     List<Element> files = (List<Element>)xpath.selectNodes(filedoc);
		     
		     for(Element file : files){
		    	 Element _filename = file.getChild("fileName");
		    	 String[] tmpString = _filename.getValue().split("/");
		    	 int len = tmpString.length;
		    	 String _fileNameString = tmpString[len - 1];
		    	 String[] nameStrings = _fileNameString.split("\\.");
		    	 String nameString = nameStrings[0];
		    	 Element _semantic = file.getChild("semantic");
		    	 Element _datasetName = file.getChild("datasetName");
			     if(semantic.equals(_semantic.getText()) && dataSetName.equals(_datasetName.getText()) && dataFileName.equals(nameString)){	 
			    	 SampleFile samplefile = new SampleFile();
			    	 Element _fileName = file.getChild("fileName");
			    	 samplefile.setName(_fileName.getText());
			    	 samplefile.setId(_fileName.getText());
			    	 samplefiles.add(samplefile);
		    	 }
		    	 
		     }
		     
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	public List<SampleFile> getSamplefiles() {
		return samplefiles;
	}
	public void setSamplefiles(List<SampleFile> samplefiles) {
		this.samplefiles = samplefiles;
	}
	public String getSemantic() {
		return semantic;
	}
	public void setSemantic(String semantic) {
		this.semantic = semantic;
	}
	public String getTop() {
		return top;
	}
	public void setTop(String top) {
		this.top = top;
	}
	public String getDown() {
		return down;
	}
	public void setDown(String down) {
		this.down = down;
	}
	public String getLeft() {
		return left;
	}
	public void setLeft(String left) {
		this.left = left;
	}
	public String getRight() {
		return right;
	}
	public void setRight(String right) {
		this.right = right;
	}
}
