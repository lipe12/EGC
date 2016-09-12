package org.easygeoc.account;
import java.io.File;
import java.io.FileWriter;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import com.opensymphony.xwork2.ActionSupport;
/**
 * this class mainly for user to create or join a group
 * tag = 0:username and password are right
 * tag = 1:the input group name do not exist when join the a group, while means the group is already exist when create a group
 * tag = 2:requestcode is wrong
 * tag = 3:group already
 * tag = 4:has joined the group
 * @author lp
 * */
public class GroupOperation extends ActionSupport{


	private String tag;
	
	private String groupName;
	private String groupCode;
	private String userEmail;
	public String getTag() {
		return tag;
	}
	public void setTag(String tag) {
		this.tag = tag;
	}
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public String getGroupCode() {
		return groupCode;
	}
	public void setGroupCode(String groupCode) {
		this.groupCode = groupCode;
	}
/**
 * this method is to write a new group recod into "/xml/groups.xml"
 * when the group of the user input do not exist, create the new group record, and put the creater into group member node
 * give the creater a "founder" role
 * @return tag 
 * */
	public String createGroup() {
		tag = "0";
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	    String username = (String)request.getSession().getAttribute("username");
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    try{
	    	Document filesdoc = sb.build("file:" + File.separator + path + File.separator + "groups.xml");
	    	
	    	XPath xpath = XPath.newInstance("groups/group[groupname=\""+ groupName +"\"]");
		    Element user = (Element)xpath.selectSingleNode(filesdoc);
	    	if(user!=null){
	    		tag = "1";
	    		
	    	}else{
		    	Element root=filesdoc.getRootElement();
		    	Element _group = new Element("group");
		    	Element _groupname = new Element("groupname");
		    	_groupname.setText(groupName);
		    	Element _groupcode = new Element("groupcode");
		    	_groupcode.setText(groupCode);
		    	Element _member = new Element("member");
		    	Element __username = new Element("username");
		    	Element __membershipe = new Element("membershipe");
		    	__membershipe.setText("founder");
		    	__username.setText(username);
		    	_member.addContent(__username);
		    	_member.addContent(__membershipe);
		    	
		    	_group.addContent(_groupname);
		    	_group.addContent(_groupcode);
		    	_group.addContent(_member);
		    	         
		    	root.addContent(_group);
		    	
		    	Format format = Format.getCompactFormat();   
	  	        format.setEncoding("UTF-8");  
	  	        format.setIndent("  ");     
	  	        XMLOutputter xmlout = new XMLOutputter(format); 
	  	        File _file = null;
	  	        _file = new File( path + File.separator + "groups.xml");  
	  	        FileWriter filewriter = new FileWriter(_file);
		        xmlout.output(filesdoc, filewriter);
		        filewriter.close(); 
		        
	    	}		          
	    }catch(Exception e){
	    	e.printStackTrace();
	    	tag = "1";    
	    }
	    return SUCCESS;
}

	
/**
 * joinGroup method is to put the user into the appointed group
 * give the join user a "member" role into member node
 * @return tag*/
	public String joinGroup() {
		tag = "0";
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	    String username = (String)request.getSession().getAttribute("username");
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    try{
	    	Document filesdoc = sb.build("file:" + File.separator + path + File.separator + "groups.xml");
	    	
	    	XPath xpath = XPath.newInstance("groups/group[groupname=\""+ groupName +"\"]");
		    Element group = (Element)xpath.selectSingleNode(filesdoc);
			XPath userPath = XPath.newInstance("groups/group/member[username='" + username + "']");
	    	if(group ==null){
	    		tag = "1";
	    		
	    	} else if(group.getChildText("groupcode").equals(groupCode)){
	    		tag = "0";
	    		boolean flag = false;
	    		List<Element>members = (List<Element>)group.getChildren("member");
	    		for(Element member:members){
	    			Element user = member.getChild("username");
	    			if (user.getValue().equals(username)) {
						flag = true;
					}
	    		}
	    		if (flag) {
					tag = "4";
				}else {
					Element member = new Element("member");
		    		Element __username = new Element("username");
			    	Element __membershipe = new Element("membershipe");
			    	__membershipe.setText("member");
			    	__username.setText(username);
			    	member.addContent(__username);
			    	member.addContent(__membershipe);
			    	group.addContent(member);
			    	Format format = Format.getCompactFormat();   
		  	        format.setEncoding("UTF-8");  
		  	        format.setIndent("  ");     
		  	        XMLOutputter xmlout = new XMLOutputter(format); 
		  	        File _file = null;
		  	        _file = new File( path + File.separator + "groups.xml");  
		  	        FileWriter filewriter = new FileWriter(_file);
			        xmlout.output(filesdoc, filewriter);
			        filewriter.close();
				}
	    		
	    	}
	    	else {
				tag = "2";
			}
	    }catch(Exception e){
	    	e.printStackTrace();
	    	tag = "1";    
	    }
	    return SUCCESS;
	}
}
