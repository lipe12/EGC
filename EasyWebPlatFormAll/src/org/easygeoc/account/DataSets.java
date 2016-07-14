package org.easygeoc.account;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.aspectj.lang.reflect.CatchClauseSignature;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import cn.com.bean.DataFile1;
import cn.com.bean.dataSetlist;

import com.opensymphony.xwork2.ActionSupport;

import freemarker.core.ReturnInstruction.Return;
/**
 * this class is to list all the datasets that the user logged in can use
 * include the dataset of the user upload,  the datasets the groups which the user join upload, 
 * and the dataset of public if the user share the some of his dataset
 * @author:lp
 * */
public class DataSets extends ActionSupport{
	
private List<dataSetlist> items = new ArrayList<dataSetlist>();
	
	public List<dataSetlist> getItems() {
	return items;
}
public void setItems(List<dataSetlist> items) {
	this.items = items;
}
public int getTotal() {
	return total;
}
public void setTotal(int total) {
	this.total = total;
}
	private int total = 1;
	private List<String> arrayuser = new ArrayList<String>();
	public String execute(){
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    
	    try{
	    	Document filesdoc = null;
	    	String username = (String)request.getSession().getAttribute("username");
	    	if(username==null){
	    			 
	    	 }else{
	    		 filesdoc = sb.build("file:" + File.separator + path + File.separator + "groups.xml");
	    		 XPath xpath = XPath.newInstance("groups/group/member[username=\""+ username +"\"]");
	    		 List<Element> membersIncludeUser = (List<Element>)xpath.selectNodes(filesdoc);
	    		 for(Element memberIncludeUser:membersIncludeUser)
	    		 {

	    			 
	    			 Element group = memberIncludeUser.getParentElement();
	    			 Element groupname = group.getChild("groupname");
	    			 
	    			 //List<Element> members = (List<Element>)group.getChild("member");
	    			 List<Element> members = (List<Element>)group.getChildren("member");
	    			 for(Element member: members)
	    			 {

	    				 
	    				 Element _usename = member.getChild("username");
	    				 String DataCategory = null;
	    				 String a = _usename.getText();
	    				 if(a.equals(username))
	    				 {
	    					 DataCategory = "";
	    				 }
	    				 else {
	    					 DataCategory = groupname.getText();
						}
	    				 if(arrayuser.contains(_usename.getText()))
	    				 {

	    					 break;
	    				 }
	    				 else {
	    					 arrayuser.add(_usename.getText());
	    					 SAXBuilder sb1 = new SAXBuilder();
	    					 String dataSetPath = path + File.separator + "users_informations" + File.separator + _usename.getText();
	    					 Document dataSetDoc = sb1.build("file:" + File.separator + dataSetPath + File.separator  + "dataSets.xml");
	    					 XPath userDataSet = XPath.newInstance("dataSets/dataSet");
	    					 List<Element> dataSets = (List<Element>)userDataSet.selectNodes(dataSetDoc);
	    					 for(Element dataSet:dataSets)
	    					 {
	    						 dataSetlist ds = new dataSetlist();
	    	    				 ds.setDataCategory(DataCategory);
	    						 Element dataSetName = dataSet.getChild("datasetname");
	    						 ds.setDataSetName(dataSetName.getText());
	    						 ds.setUpLoader(_usename.getText());
	    						 items.add(ds);
	    					 }
						}
	    				 
	    			 }
	    			 
	    		 }
	    		 SAXBuilder sb2 = new SAXBuilder();
	    		 String sharedSetPath = path + File.separator + "shares.xml";
	    		 Document doc2 = sb2.build("file:" + sharedSetPath);
	    		 XPath sharedPath = XPath.newInstance("dataSets/dataSet");
	    		 List<Element> sharedDataSets = (List<Element>)sharedPath.selectNodes(doc2);
	    		 String username2 = (String)request.getSession().getAttribute("username");
	    		 for (Element sharedDataset: sharedDataSets) {
	    			 Element uploader = sharedDataset.getChild("upLoader");
	    			 Element datasetname = sharedDataset.getChild("datasetname");
	    			 if (! uploader.getText().equals(username2)) {
	    				 dataSetlist dsl = new dataSetlist();
	 					 dsl.setDataCategory("shared");
	 					 dsl.setDataSetName(datasetname.getText());
	 					 dsl.setUpLoader(uploader.getText());
	 					 items.add(dsl);
					}
					
					
				}
	    	 }
	    	total = items.size();
	    	
	    }catch(Exception e)
	    {
	    	
	    	e.printStackTrace();
	    }
	    return "success";
	}
	
   
}
