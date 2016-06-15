package tutorial;
import java.io.IOException;   

import org.apache.commons.httpclient.HttpClient;   
import org.apache.commons.httpclient.HttpException;   
import org.apache.commons.httpclient.HttpMethod;   
import org.apache.commons.httpclient.methods.GetMethod;           
import com.opensymphony.xwork2.ActionSupport;

public class RunModel extends ActionSupport {
	private String tag;
	public String getTag() {
		return tag;
	}  

	public void setTag(String tag) {
		this.tag = tag;
	}
	// this function has not been finished, this is only an example to show how invoke a web service 
    private String getWeaherData(String url){                                
    	HttpClient http = new HttpClient();   
        
        if(null == url || url.equals("")){   
            url="http://m.weather.com.cn/data/101110101.html";   
        }   
        HttpMethod method = new GetMethod(url);     
        String data = "";   
           
        try {   
            http.executeMethod(method);   
               
            System.out.println(method.getStatusLine());     
            int i = method.getStatusCode();   
               
            if(vilidateStatus(i)){   
                          
                data = method.getResponseBodyAsString();     
            }                       
            System.out.println(data);         
        } catch (HttpException e) {   
            System.out.println(e.getMessage());   
            return null;   
               
        } catch (IOException e) {   
            System.out.println(e.getMessage());   
            return null;   
        }             
        return data; 
    } 
    private boolean vilidateStatus(int i){     
        
        if(i==200){   
            return true;   
        }   
           
        return false;   
    }    
    public String execute() {     
        this.tag = getWeaherData("");
        return SUCCESS;
    }
}
