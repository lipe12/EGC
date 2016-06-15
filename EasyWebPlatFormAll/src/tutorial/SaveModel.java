package tutorial;

import java.io.BufferedInputStream;
import java.io.File;

import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;
import com.opensymphony.xwork2.ActionSupport;
import xmlUtility.xmlUtility;
import xmlUtility.xmlUtility_dom;

public class SaveModel extends ActionSupport {
	private String tag;
	public String getTag() {
		return tag;
	}
    
	public void setTag(String tag) {
		this.tag = tag;
	}
	
    public String execute() {
        try{
            HttpServletRequest request = ServletActionContext.getRequest();
            String username = (String)request.getSession().getAttribute("username");
                      
		    request.setCharacterEncoding("UTF-8"); 
			BufferedInputStream inputStream = new BufferedInputStream(request.getInputStream());
		    byte   by[]=   new   byte[100];
            int   n=0;
		    StringBuffer   bs=new   StringBuffer();
		    while((n=inputStream.read(by))!=-1)
		    {
		    	String temp = new String(by,0,n);               
		        bs.append(temp);    
		    }   
		    inputStream.close(); 
		    String xmlstr = bs.toString();
		    String path = request.getSession().getServletContext().getRealPath("") + File.separator +"WEB-INF" 
		                  + File.separator + "xml" +File.separator + "users_informations" 
		                  + File.separator + username;
		          

		    if(xmlUtility_dom.string2xmlfile(xmlstr, path + File.separator + username + "_model.xml")){
		    	
		    	tag = "1";      
		    }else {
			    tag = "0"; 
		    }
   
        }catch(Exception e)
        {
       	 	tag="0";
        }
        return SUCCESS;
    }
}
