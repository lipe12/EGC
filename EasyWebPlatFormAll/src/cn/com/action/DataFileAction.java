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
	    try{
	    	 Document filesdoc = null;
	    	 String username = (String)request.getSession().getAttribute("username");
	    	 if(username==null){
	    		 filesdoc = sb.build("file:" + File.separator + path + File.separator + "dataFiles.xml");	 
	    	 }else{            
	    		 path = path + File.separator + "users_informations" + File.separator + username;
	    		 //TODO:等侯志伟把前台弄好，确定他建立了一个什么表来存储project数据，然后把_dataFiles.xml修改为该表。
	    		 filesdoc = sb.build("file:" + File.separator + path + File.separator + username + "_dataFiles.xml"); 
	    	 }
		     XPath xpath = XPath.newInstance("files/file");
		     List<Element> files = (List<Element>)xpath.selectNodes(filesdoc);
		     
		     for(Element file : files){
		    	 
		    	 Element _semantic = file.getChild("semantic");
		    	 Element _top = file.getChild("top");
		    	 Element _down = file.getChild("down");
		    	 Element _left = file.getChild("left");
		    	 Element _right = file.getChild("right");
		    	 Element _datasetName = file.getChild("datasetName");
//		    	 if(semantic.equals(_semantic.getText()) && top.equals(_top.getText())&& down.equals(_down.getText())
//		    	    && left.equals(_left.getText()) && right.equals(_right.getText())){
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
		     
		     total = items.size();
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
		return SUCCESS;
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
