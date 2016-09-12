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

import  cn.com.bean.SampleFile;

import com.opensymphony.xwork2.ActionSupport;
public class SampleFileAction extends ActionSupport{
	private String semantic;
	private String top;
	private String down;
	private String left;
	private String right;
	private String dataSetName;
	private String upLoader;
	public String getUpLoader() {
		return upLoader;
	}

	public void setUpLoader(String upLoader) {
		this.upLoader = upLoader;
	}

	public String getDataSetName() {
		return dataSetName;
	}

	public void setDataSetName(String dataSetName) {
		this.dataSetName = dataSetName;
	}
	private List<SampleFile> samplefiles;
	
	public String execute(){ 
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("") + File.separator +"WEB-INF" + File.separator +"xml";  
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
		     XPath xpath = XPath.newInstance("files/file");
		     List<Element> files = (List<Element>)xpath.selectNodes(filesdoc);
		     samplefiles = new ArrayList<SampleFile>();
		     for(Element file : files){
		    	 
		    	 Element _semantic = file.getChild("semantic");
		    	 Element _top = file.getChild("top");
		    	 Element _down = file.getChild("down");
		    	 Element _left = file.getChild("left");
		    	 Element _right = file.getChild("right");
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
		
		return SUCCESS;
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
