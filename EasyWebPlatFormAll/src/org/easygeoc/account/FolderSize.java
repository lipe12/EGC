package org.easygeoc.account;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;

import com.opensymphony.xwork2.ActionSupport;

import tutorial.Constant;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * this class is to find whether the user folder is lager than 2G(manager define the disk size)
 * @author lp
 * @since 2016-06-14
 * */
public class FolderSize extends ActionSupport{
	String tag_capacity;                    //the tag whether folder lager than 2G
	public String getTag_capacity() {
		return tag_capacity;
	}
	public void setTag_capacity(String tag_capacity) {
		this.tag_capacity = tag_capacity;
	}
	/**
	 * this method is to find the folder size by iteration
	 * @param directory  specified user folder
	 * @return length the folder size, including files and folders in a user folder
	 * */
	public static long folderSize(File directory)
    {
        long length = 0;
        for (File file : directory.listFiles()) {
            if (file.isFile())
                length += file.length();
            else
                length += folderSize(file);
        }
        return length;
    }
	/**
	 * this method is to receive the Http request and get the user name, call function folderSize
	 * */
	@Override
	public String execute()
	{
		HttpServletRequest request = ServletActionContext.getRequest();
		
		String username = (String)request.getSession().getAttribute("username");
	    
		String folderpath = Constant.DataFilePath + File.separator + username;
		
		File folder = new File(folderpath);
		
		long foldsize = 0;
		foldsize = folderSize(folder);
		if(foldsize < 1024 *1024 *1024)
			tag_capacity = "0";
		else 
			tag_capacity = "1";
		
		if (foldsize != 0)
			return SUCCESS;
		else
			return ERROR;
	}
	/**
	 * count up the use`s upload data sum size, but do not consider the shared data
	 * @author lp
	 * @return user`s all data using disk size exclusive of the data that had shared
	 * */
	public double  diskUsage() {
		HttpServletRequest request = ServletActionContext.getRequest();
		
		String username = (String)request.getSession().getAttribute("username");
		Double size = 0.0;
		String path = (String)request.getSession().getServletContext().getRealPath("") + File.separator +"WEB-INF" + File.separator + "xml";
		path = path + File.separator + username + File.separator + username + "_dataFiles.xml";
		List<String> shareddatasets = findSharedDataSet(request, username);
		try {
			Document doc = null;
			SAXBuilder sa = new SAXBuilder();
			doc = sa.build(path);
			XPath xpath = XPath.newInstance("files/file");
			List<Element> files = (List<Element>)xpath.selectNodes(doc);
			
			for (Element file: files) {
				String dataSetName = file.getChild("datasetName").getText();
				String dataSize = file.getChild("fileSize").getText();
				if (!shareddatasets.contains(dataSetName)) {
					String postfix = dataSize.substring(dataSize.length()-1,dataSize.length());
					if (postfix.equals("B")) {
						size = size + Double.parseDouble(dataSize.substring(0,dataSize.length()-1)) / 1073741824;
					}else if (postfix.equals("K")) {
						size = size + Double.parseDouble(dataSize.substring(0,dataSize.length()-1)) / 1048576;
					}else if (postfix.equals("M")) {
						size = size + Double.parseDouble(dataSize.substring(0,dataSize.length()-1)) / 1024;
					}else if (postfix.equals("G")) {
						size = size + Double.parseDouble(dataSize.substring(0,dataSize.length()-1));
					}
				}
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		return size;
	}
	/**
	 * get the data set name that the user had shared
	 * @author lp
	 * @param request: the request that get
	 * @param username: the user who login*/
	public List<String> findSharedDataSet(HttpServletRequest request, String username) {
		String path = (String)request.getSession().getServletContext().getRealPath("") + File.separator + "xml" + File.separator + "shares.xml";
		List<String> datasets = new ArrayList<String>();
		try {
			Document doc = null;
			SAXBuilder sa = new SAXBuilder();
			
			doc = sa.build(path);
			XPath xpath = XPath.newInstance("datasets/dataset[upLoader=\""+ username +"\"]");
			List<Element> files = (List<Element>)xpath.selectNodes(doc);
			int i = 0;
			for(Element file: files)
			{

				Element dataset = file.getChild("datasetname");
				datasets.add(dataset.getText());
				i = i + 1;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return datasets;
	}
}
