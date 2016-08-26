package org.easygeoc.account;
import java.io.*;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.InputStreamRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.Namespace;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;
import org.xml.sax.InputSource;

import tutorial.CreateMapFile;
import MetaData.RasterMetaData;
import tutorial.Constant;
import com.opensymphony.xwork2.ActionSupport;
public class readDataSetProj extends ActionSupport{
	private String uploader;
	private String dataSetName;
	private String dataName;
	private String dataPath;
	public String getDataName() {
		return dataName;
	}
	public void setDataName(String dataName) {
		this.dataName = dataName;
	}
	public String getDataPath() {
		return dataPath;
	}
	public void setDataPath(String dataPath) {
		this.dataPath = dataPath;
	}
	public String getProj() {
		return proj;
	}
	public void setProj(String proj) {
		this.proj = proj;
	}
	private String proj = "";
	public String getUploader() {
		return uploader;
	}
	public void setUploader(String uploader) {
		this.uploader = uploader;
	}
	public String getDataSetName() {
		return dataSetName;
	}
	public void setDataSetName(String dataSetName) {
		this.dataSetName = dataSetName;
	}
	public String returnProj() {
		HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    path = path + File.separator + "users_informations" + File.separator + uploader + File.separator + uploader + "_dataFiles.xml";
	    SAXBuilder sb = new SAXBuilder();
	    try {
	    	Document fileDoc = sb.build("file:" + path);
	    	XPath xpath = XPath.newInstance("files/file[datasetName=\""+ dataSetName +"\"]");
	    	List<Element> datas = (List<Element>)xpath.selectNodes(fileDoc);
	    	for(Element data:datas){
	    		Element format = data.getChild("format");
	    		String formatString = format.getText();
	    		if (formatString.equals("TIF") && this.proj.equals("")) {
	    			Element fileName = data.getChild("fileName");
		    		String fileNameString = fileName.getText();
		    		String demPathString = Constant.DataFilePath + File.separator + fileNameString;
	    			CreateMapFile createMapFile = new CreateMapFile();
	    			String projInfoString = createMapFile.getUploadRasterInfo(demPathString);
	    			this.proj = projInfoString;
	    			
				}
	    		if (formatString.equals("CSV")) {
					Element sampleFileElement = data.getChild("fileName");
					String[] splitsStrings = sampleFileElement.getText().split("/");
					int len = splitsStrings.length;
					String[] splitName = splitsStrings[len - 1].split("\\.");
					if (splitName[0].equals(dataName)) {
						this.dataPath = sampleFileElement.getText();
					}
				}
	    	}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    return SUCCESS;
	}
	
}
