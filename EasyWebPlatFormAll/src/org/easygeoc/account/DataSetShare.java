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
public class DataSetShare extends ActionSupport{
	private String dataSetName;
	private int tag; // tag = 0 means the dataset have been shared
	                 // tag = 1 means the dataset hava not been shared
	public int getTag() {
		return tag;
	}
	public void setTag(int tag) {
		this.tag = tag;
	}
	public String getDataSetName() {
		return dataSetName;
	}
	public void setDataSetName(String dataSetName) {
		this.dataSetName = dataSetName;
	}
	public String share() {
		HttpServletRequest request = ServletActionContext.getRequest();
		SAXBuilder sa = new SAXBuilder();
		String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
		String userName = (String)request.getSession().getAttribute("username");
		path = path + File.separator + "shares.xml";
		try {
			tag = 1;
			Document doc = sa.build("file:" + path);
			XPath xpath = XPath.newInstance("datasets/dataset[upLoader=\""+ userName +"\"]");
			List<Element>datasets = (List<Element>)xpath.selectNodes(doc);
			for (Element dataset : datasets) {
				if (dataset.getChild("datasetname").getText().equals(dataSetName)) {
					tag = 0;
				}
			}
			if (tag == 1) {
				Element root = doc.getRootElement();
				Element dataset = new Element("dataset");
				Element _dataSetName = new Element("datasetname");
				_dataSetName.setText(dataSetName);
				Element upLoader = new Element("upLoader");
				upLoader.setText(userName);
				dataset.addContent(upLoader);
				dataset.addContent(_dataSetName);
				root.addContent(dataset);
				Format format = Format.getCompactFormat();   
	  	        format.setEncoding("UTF-8");  
	  	        format.setIndent("  ");     
	  	        XMLOutputter xmlout = new XMLOutputter(format); 
	  	        File _file = null;
	  	        _file = new File( path);  
	  	        FileWriter filewriter = new FileWriter(_file);
		        xmlout.output(doc, filewriter);
		        filewriter.close(); 
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}
	
}
