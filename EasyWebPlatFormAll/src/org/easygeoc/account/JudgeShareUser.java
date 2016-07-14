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

import com.opensymphony.xwork2.ActionSupport;
public class JudgeShareUser extends ActionSupport{
	private Boolean tag;

	
	public Boolean getTag() {
		return tag;
	}


	public void setTag(Boolean tag) {
		this.tag = tag;
	}


	private String judge() {
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    path = path + File.separator + "shares.xml";
	    try {
			Document doc = sb.build("file:" + path);
			String username = (String)request.getSession().getAttribute("username");
			XPath sharedPath = XPath.newInstance("dataSets/dataSet[upLoader=\""+ username +"\"]]");
   		 	List<Element> sharedDataSets = (List<Element>)sharedPath.selectNodes(doc);
   		 	if (sharedDataSets.size() == 0) {
				tag = false;
			}
			else {
				tag = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}
}
