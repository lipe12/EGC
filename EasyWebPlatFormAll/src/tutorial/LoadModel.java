package tutorial;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;

import xmlUtility.xmlUtility_dom;

import com.opensymphony.xwork2.ActionSupport;

public class LoadModel extends ActionSupport{
	
	private String tag;
	private List<Model> models = new ArrayList<Model>();
	private int start;//   
	private int limit;// 
	private int total = 1;
	private String modelname;
	private String modelstr;
	
	public String getModelstr() {
		return modelstr;
	}

	public void setModelstr(String modelstr) {
		this.modelstr = modelstr;
	}

	public String getModelname() {
		return modelname;
	}

	public void setModelname(String modelname) {
		this.modelname = modelname;
	}

	public String query_modelnames(){
		total = 0;
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    
		String  username = null;
		username = (String)request.getSession().getAttribute("username");
	
	    try{
	    	Document filesdoc = null;
	    	if(username == null){
	    		filesdoc = sb.build("file:" + File.separator + path + File.separator + "model.xml");   
	    	}else{
	    		path = path + File.separator + "users_informations" + File.separator + username;
	    		filesdoc = sb.build("file:" + File.separator + path + File.separator + username +"_model.xml");
	    	}
	    	XPath xpath = XPath.newInstance("models/model");
		    List<Element> _models = (List<Element>)xpath.selectNodes(filesdoc);
		    for(Element _model : _models){
		    	Model model = new Model();
		    	String modelName = _model.getAttributeValue("name");
		    	model.setModelName(modelName);
		    	models.add(model);  
		    	total ++;    
		    } 
	    	
	    }catch(Exception e){
	    	e.printStackTrace();
	    	       
	    }
	    System.out.println("model num is "+ models.size());
		return SUCCESS;
	}
	
	public String query_xmlstr(){
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    String  username = null;
		username = (String)request.getSession().getAttribute("username");
	    try{
	    	Document filesdoc = null;
	    	if(username == null){
	    		filesdoc = sb.build("file:" + File.separator + path + File.separator + "model.xml");  
	    	}else{
	    		path = path + File.separator + "users_informations" + File.separator + username;
	    		filesdoc = sb.build("file:" + File.separator + path + File.separator + username +"_model.xml");	
	    	}  
	    	
		    XPath xpath = XPath.newInstance("models/model[@name='"+ modelname +"']");
		    Element _model = (Element)xpath.selectSingleNode(filesdoc);
		    
		    String _modelstr = "<model>";
		    for(Element _item: _model.getChildren()){
		    	String item_name = _item.getName();
		    	_modelstr = _modelstr + "<" + item_name +">";
		    	for(Element _ite : _item.getChildren()){
		    		String ite_name = _ite.getName();
		    		_modelstr = _modelstr + "<" + ite_name +">";
		    		_modelstr = _modelstr + _ite.getText();
		    		_modelstr = _modelstr + "</" + ite_name +">";
		    	}
		    	_modelstr = _modelstr + "</" + item_name +">";
		    }
		    _modelstr = _modelstr + "</model>";
		    modelstr = _modelstr;
	    }catch(Exception e){
	    	e.printStackTrace();
	    	
	    }
		return SUCCESS;
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
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public String getTag() {
		return tag;
	}
	public void setTag(String tag) {
		this.tag = tag;
	}
	public List<Model> getModels() {
		return models;
	}
	public void setModels(List<Model> models) {
		this.models = models;
	}
	
	
}
