package org.easygeoc.account;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;

import cn.com.bean.DataFile1;

import com.opensymphony.xwork2.ActionSupport;
public class ListDataFile extends ActionSupport{
	private String upLoader;
	private String datasetname;
	public String getUpLoader() {
		return upLoader;
	}

	public void setUpLoader(String upLoader) {
		this.upLoader = upLoader;
	}

	public String getDatasetname() {
		return datasetname;
	}

	public void setDatasetname(String datasetname) {
		this.datasetname = datasetname;
	}

	

	private List<DataFile1> items = new ArrayList<DataFile1>();
	public List<DataFile1> getItems() {
		return items;
	}

	public void setItems(List<DataFile1> items) {
		this.items = items;
	}



	private int total = 1;
	
	public String listData(){     
		
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();

	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    try{
	    	 Document filesdoc = null;
	    	 //String username = (String)request.getSession().getAttribute("username");
	    	 String username = upLoader;
	    	 if(username==null){
	    		 filesdoc = sb.build("file:" + File.separator + path + File.separator + "dataFiles.xml");	 
	    	 }else{            
	    		 path = path + File.separator + "users_informations" + File.separator + username;
	    		 filesdoc = sb.build("file:" + File.separator + path + File.separator + username + "_dataFiles.xml"); 
	    	 }
		     XPath xpath = XPath.newInstance("files/file[datasetName='" + this.datasetname + "']");
		     List<Element> files = (List<Element>)xpath.selectNodes(filesdoc);
		     
		     for(Element file : files){

			    	 DataFile1 datafile = new DataFile1();
			    	 
			    	 Element _datasetName = file.getChild("datasetName");
			    	 if(_datasetName!=null){
				    	 
			    		 datafile.setDatasetName(_datasetName.getText());
				    	 Element _fileName = file.getChild("fileName");
				    	 datafile.setFileName(_fileName.getText());
				    	 Element _fileSize = file.getChild("fileSize");
				    	 datafile.setFileSize(_fileSize.getText());
				    	 Element _type = file.getChild("type");
				    	 datafile.setType(_type.getText());
				    	 Element _format = file.getChild("format");
				    	 datafile.setFormat(_format.getText());
				    	 Element _semantic = file.getChild("semantic");
				    	 datafile.setSemantic(_semantic.getText());    
				    	 items.add(datafile); 			    		 
			    	 }

		     }
		     
		     total = items.size();
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
		return SUCCESS;
}
}
