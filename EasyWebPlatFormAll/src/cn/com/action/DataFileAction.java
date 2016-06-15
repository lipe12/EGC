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
public class DataFileAction extends ActionSupport{
	
	private String semantic;
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
		    	 if(semantic.equals(_semantic.getText()) && top.equals(_top.getText())&& down.equals(_down.getText())
		    	    && left.equals(_left.getText()) && right.equals(_right.getText())){
			    	 
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
