package user;
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
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import com.opensymphony.xwork2.ActionSupport;
public class UserAction extends ActionSupport{
	private String name;
	private String password;
	private String tag;//tag = 0:username and password are right
	                   //tag = 1:username is wrong
	                   //tag = 2:password is wrong
	                   //tag = 3:user login already
	                   //tag = 4:login user num is too large
	private String organization;
	public  static Object obj=new Object();
	@SuppressWarnings("unchecked")
	public String login(){
		_logout();
		System.out.println("current user name is " + name);
		
		if(!CurrentUserInfo.checkCount()){
			tag = "4";
			return SUCCESS;
		}else{
			synchronized(obj){
				tag = "0";
				SAXBuilder sb = new SAXBuilder();
			    HttpServletRequest request = ServletActionContext.getRequest();
			    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
			    try{
			    	 Document filesdoc = sb.build("file:" + File.separator + path + File.separator + "users.xml");
				     XPath xpath = XPath.newInstance("users/user[name=\""+ name +"\"]");
				     Element user = (Element)xpath.selectSingleNode(filesdoc);
				     if(user == null){
				    	 tag = "1";
				     }else if(user.getChildText("password").equals(password)){
				    	
				    	boolean flag  = true;
			 			tag = "0";
				 		HttpSession session=request.getSession();
				 		
				 		ServletContext application = session.getServletContext();
				 		List<String> onlineUserList =(List<String>) application.getAttribute("onlineUserList");
				 		if(onlineUserList != null){
				 			int len = onlineUserList.size();
					 		for(int i =0; i<len ; i++){
					 			if(onlineUserList.get(i).equals(name)){
					 				//tag = "3";
					 				//flag = false;
					 				System.out.println("delete user name is " + name);
					 				session.removeAttribute("onlineUserBindingListener");
					 				break;
					 			}
					 		}	
				 		}
				 		        
				 		if(flag == true){
				 			session.setAttribute("onlineUserBindingListener", new OnlineUserBindingListener(name));
				 		}
				    	 
				     }else{
				    	 tag = "2";
				     }
			    }catch(Exception e){
			    	e.printStackTrace();
			    }
				return SUCCESS;
			}			
		}
		
	}
	
	public String getOrganization() {
		return organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}

	public void _logout(){
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session=request.getSession();
		String username =null;
		username = (String)session.getAttribute("username");
		if(username!=null){   
			session.removeAttribute("onlineUserBindingListener");
		}
		
	}
	
	public String logout(){   
		
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session=request.getSession();
		String username =null;
		username = (String)session.getAttribute("username");
		if(username!=null){   
			session.removeAttribute("onlineUserBindingListener");
		}
		tag ="0";
		return SUCCESS;
	}
	
	public String check_loginuser(){  
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session=request.getSession();
		name = null;
		name = (String)session.getAttribute("username");
		
		return SUCCESS;
	}
	
	public String check_sessiontimeout(){
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session=request.getSession();
		name = null;
		name = (String)session.getAttribute("username");
		if(name ==null){
			tag ="1";
		}else{
			tag ="0";
		}
		return SUCCESS;
	}
	
	public String register(){
		_logout();  
		synchronized(obj){
			tag = "0";
			SAXBuilder sb = new SAXBuilder();
		    HttpServletRequest request = ServletActionContext.getRequest();
		    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
		    try{
		    	Document filesdoc = sb.build("file:" + File.separator + path + File.separator + "users.xml");
		    	
		    	XPath xpath = XPath.newInstance("users/user[name=\""+ name +"\"]");
			    Element user = (Element)xpath.selectSingleNode(filesdoc);
		    	if(user!=null){
		    		tag = "1";
		    		
		    	}else{
			    	Element root=filesdoc.getRootElement();
			    	Element _user = new Element("user");
			    	Element _name = new Element("name");
			    	_name.setText(name);
			    	Element _password = new Element("password");
			    	_password.setText(password);
			    	Element _organization = new Element("organization");
			    	_organization.setText(organization);
			    	
			    	_user.addContent(_name);
			    	_user.addContent(_password);
			    	_user.addContent(_organization);
			    	         
			    	root.addContent(_user);
			    	
			    	Format format = Format.getCompactFormat();   
		  	        format.setEncoding("UTF-8");  
		  	        format.setIndent("  ");     
		  	        XMLOutputter xmlout = new XMLOutputter(format); 
		  	        File _file = null;
		  	        _file = new File( path + File.separator + "users.xml");  
		  	        FileWriter filewriter = new FileWriter(_file);
			        xmlout.output(filesdoc, filewriter);
			        filewriter.close(); 
			        
			        String folderPath = path + File.separator + "users_informations" + File.separator + name + File.separator;
			        creatDir(folderPath);
			        copy(path + File.separator + "dataFiles.xml",folderPath  + name +"_dataFiles.xml");
			        copy(path + File.separator + "model.xml",folderPath  + name +"_model.xml");
			        
			        request.getSession().setAttribute("onlineUserBindingListener", new OnlineUserBindingListener(name));
		    	}		          
		    }catch(Exception e){
		    	e.printStackTrace();
		    	tag = "1";    
		    }
		    return SUCCESS;
		} 	
	}
	
	private void  creatDir(String folderPath){
		String   filePath   =   folderPath; 
	    filePath   =   filePath.toString();    
	    java.io.File   myFilePath   =   new   java.io.File(filePath); 
	    try{ 
		   if(myFilePath.isDirectory()){ 
			   System.out.println("the directory is exists!"); 
		   }else{ 
			   myFilePath.mkdir(); 
		       System.out.println("create directory success"); 
		   } 
	   } 
	   catch(Exception e) { 
		  System.out.println("create directory fail"); 
		  e.printStackTrace(); 
	   } 
	}
	
	private  void copy(String srcPath, String dstPath){
		File src = new File(srcPath); 
		File dst = new File(dstPath);
		int BUFFER_SIZE = 1024 ;
		try{
           InputStream in = null ;
           OutputStream out = null ;
           try{                
               in = new BufferedInputStream( new FileInputStream(src), BUFFER_SIZE);
               out = new BufferedOutputStream( new FileOutputStream(dst), BUFFER_SIZE);
               byte [] buffer = new byte [BUFFER_SIZE];
               int len = -1;
               while((len = in.read(buffer))>0){
                   out.write(buffer,0,len);
               } 
            }finally{
                if(null != in){
                   in.close();
                } 
                if(null != out){
                   out.close();
                } 
           } 
        }catch(Exception e){
           e.printStackTrace();
        } 
   }
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getTag() {
		return tag;
	}
	public void setTag(String tag) {
		this.tag = tag;
	}
}
