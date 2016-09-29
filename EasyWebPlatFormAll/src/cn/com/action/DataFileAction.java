package cn.com.action;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;  

import org.apache.struts2.ServletActionContext;

import cn.com.bean.DataFile;

import com.opensymphony.xwork2.ActionSupport;




import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;

/**
 * @version 1.1
 * @author lp
 * modify the method how to match the data with the dataset
 * 设计思想：当用户上传数据时，找到数据的空间坐标信息，将数据的上下左右四个值由该坐标系，转化为地理坐标系（经纬度）WGS84
 * 前端数据是由EPSG:900913转化为地理坐标系EPSG：4326（WGS84）
 * 找到包含鼠标点击经纬度值的用户project中的datasets
 * */
public class DataFileAction extends ActionSupport{
	
	private String semantic;
	private String dataSetName;
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

	public String getDataSetName() {
		return dataSetName;
	}

	public void setDataSetName(String dataSetName) {
		this.dataSetName = dataSetName;
	}

	private String top;
	private String down;
	private String left;
	private String right;
	private int start;//   
	private int limit;// 
	private List items = new ArrayList();
	private int total = 1;
	     
	public String execute(){     
		
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();

	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
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
	/**
	 * 读取project里面dataset里面的图层信息
	 * */
	public void readDataSets(String dataSetName, String uploader,String path) {
		String datafilePathString = path + File.separator + "users_informations" + File.separator + uploader + File.separator + uploader +  "_dataFiles.xml";
		SAXBuilder sb = new SAXBuilder();
		
		try {
			Document filedoc = sb.build("file:"+datafilePathString);
			XPath xpath = XPath.newInstance("files/file");
		     List<Element> files = (List<Element>)xpath.selectNodes(filedoc);
		     for(Element file : files){
		    	 Element _semantic = file.getChild("semantic");
		    	 Element _top = file.getChild("top");
		    	 Element _down = file.getChild("down");
		    	 Element _left = file.getChild("left");
		    	 Element _right = file.getChild("right");
		    	 Element _datasetName = file.getChild("datasetName");
			     if(semantic.equals(_semantic.getText()) && dataSetName.equals(_datasetName.getText())){	 
			    	 DataFile datafile = new DataFile();
			    	 Element _fileName = file.getChild("fileName");
			    	 datafile.setFileName(_fileName.getText());
			    	 Element _fileSize = file.getChild("fileSize");
			    	 datafile.setFileSize(_fileSize.getText());
			    	 Element _type = file.getChild("type");
			    	 datafile.setType(_type.getText());
			    	 Element _format = file.getChild("format");
			    	 datafile.setFormat(_format.getText());
			    	 datafile.setSemantic(_semantic.getText());
			    	 datafile.setTop(_top.getText());
			    	 datafile.setDown(_down.getText());
			    	 datafile.setLeft(_left.getText());
			    	 datafile.setRight(_right.getText());
			    	 items.add(datafile);
		    	 }
		    	 
		     }
		     
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	/**
	 * 当project为单独图层时，读取图层的信息
	 * */
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
		    	 Element _top = file.getChild("top");
		    	 Element _down = file.getChild("down");
		    	 Element _left = file.getChild("left");
		    	 Element _right = file.getChild("right");
		    	 Element _datasetName = file.getChild("datasetName");
		    	 
			     if(semantic.equals(_semantic.getText()) && dataSetName.equals(_datasetName.getText()) && dataFileName.equals(nameString)){	 
			    	 DataFile datafile = new DataFile();
			    	 Element _fileName = file.getChild("fileName");
			    	 datafile.setFileName(_fileName.getText());
			    	 Element _fileSize = file.getChild("fileSize");
			    	 datafile.setFileSize(_fileSize.getText());
			    	 Element _type = file.getChild("type");
			    	 datafile.setType(_type.getText());
			    	 Element _format = file.getChild("format");
			    	 datafile.setFormat(_format.getText());
			    	 datafile.setSemantic(_semantic.getText());
			    	 datafile.setTop(_top.getText());
			    	 datafile.setDown(_down.getText());
			    	 datafile.setLeft(_left.getText());
			    	 datafile.setRight(_right.getText());
			    	 items.add(datafile);
		    	 }
		    	 
		     }
		     
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	public boolean judgeDataSets(String dataSetName, String uploader,String path) {
		String datafilePathString = path + File.separator + "users_informations" + File.separator + uploader + File.separator +  "dataSets.xml";
		boolean tag = false;
		SAXBuilder sb = new SAXBuilder();
		
		try {
			Document doc = sb.build("file:" + datafilePathString);
			XPath xpath = XPath.newInstance("dataSets/dataSet[datasetname=\""+ dataSetName +"\"]");
		     Element dataSet = (Element)xpath.selectSingleNode(doc);
		     String northString = dataSet.getChild("north").getValue();
		     if (!dataSet.getChild("north").getValue().equals("")) {
		    	 double north = Double.parseDouble(dataSet.getChild("north").getValue());
			     double south = Double.parseDouble(dataSet.getChild("south").getValue());
			     double west = Double.parseDouble(dataSet.getChild("west").getValue());
			     double east = Double.parseDouble(dataSet.getChild("east").getValue());
			     double lonValue = Double.parseDouble(lon);
				 double latValue = Double.parseDouble(lat);
				 if (lonValue > west & lonValue < east & latValue > south & latValue < north) {
						tag = true;
					}
			}
		     
		     
		} catch (Exception e) {
			e.printStackTrace();
		}
		return tag;
	}
	public String getSemantic() {
		return semantic;
	}

	public void setSemantic(String semantic) {
		this.semantic = semantic;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public List getItems() {
		return items;
	}

	public void setItems(List items) {
		this.items = items;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
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
