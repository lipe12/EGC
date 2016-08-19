package cn.com.action;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import tutorial.Constant;
import util.Constants;
import util.XMLUtil;

import com.alibaba.fastjson.JSON;

public class DeleteDataSetAction extends BaseAction
{
	
	private String dataSetName;
	private int tag;          //tag = 0 the specified dataset xml node delete failed
							// tag = 1 the specified dataset xml node delete successfully
	private int whetherExist; //whetherExist = 0, the dataset does not have a files folder
							  //whetherExist = 1, the dataset and foldr exist and delete sucessfully
	String username;
	public int getWhetherExist() {
		return whetherExist;
	}
	public void setWhetherExist(int whetherExist) {
		this.whetherExist = whetherExist;
	}
	public String getDataSetName() {
		return dataSetName;
	}
	public void setDataSetName(String dataSetName) {
		this.dataSetName = dataSetName;
	}
	public int getTag() {
		return tag;
	}
	public void setTag(int tag) {
		this.tag = tag;
	}

	private String uploader;
	private String projectName;
	private String groupName;
	private String fileName;

	/**
	 * @return the fileName
	 */
	public String getFileName()
	{
		return fileName;
	}

	/**
	 * @param fileName the fileName to set
	 */
	public void setFileName(String fileName)
	{
		this.fileName = fileName;
	}
	/**
	 * @return the uploader
	 */
	public String getUploader()
	{
		return uploader;
	}

	/**
	 * @param uploader the uploader to set
	 */
	public void setUploader(String uploader)
	{
		this.uploader = uploader;
	}

	/**
	 * @return the projectName
	 */
	public String getProjectName()
	{
		return projectName;
	}

	/**
	 * @param projectName the projectName to set
	 */
	public void setProjectName(String projectName)
	{
		this.projectName = projectName;
	}

	/**
	 * @return the groupName
	 */
	public String getGroupName()
	{
		return groupName;
	}

	/**
	 * @param groupName the groupName to set
	 */
	public void setGroupName(String groupName)
	{
		this.groupName = groupName;
	}


	public void deleteGroup() throws IOException
	{
		SAXBuilder sb = new SAXBuilder();
		HttpServletRequest request = ServletActionContext.getRequest();
		File file = XMLUtil.getWebappXmlFile(request, Constants.GROUPS_DOT_XML);
		Document groupsdoc;
		try
		{
			groupsdoc = sb.build(file);

			XPath projPath = XPath.newInstance("groups/group[groupname='" + groupName + "']");
		Element root = groupsdoc.getRootElement();
		Element rmElement = (Element) projPath.selectSingleNode(groupsdoc);
		if (rmElement != null)
			root.removeContent(rmElement);
		XMLUtil.saveXML(groupsdoc, file);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("msg", SUCCESS);
			writeJson(JSON.toJSONString(map));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("msg", e.toString());
			writeJson(JSON.toJSONString(map));
		}
	}

	public void deleteProject() throws IOException
	{
		SAXBuilder sb = new SAXBuilder();
		HttpServletRequest request = ServletActionContext.getRequest();
		File file = XMLUtil.getWebappXmlFile(request, Constants.PROJECTS_DOT_XML);
		Document projsdoc;
		try
		{
			projsdoc = sb.build(file);
			XPath projPath = XPath.newInstance("projects/project[name='" + projectName + "']");
			Element root = projsdoc.getRootElement();
			Element rmElement = (Element) projPath.selectSingleNode(projsdoc);
			System.out.println(projectName);
			System.out.println(rmElement);
		if (rmElement != null)
			root.removeContent(rmElement);
		XMLUtil.saveXML(projsdoc, file);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("msg", SUCCESS);
		writeJson(JSON.toJSONString(map));}
		catch (Exception e)
		{
			e.printStackTrace();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("msg", e.toString());
			writeJson(JSON.toJSONString(map));
		}
	}

	public void rmDataSetFromShared() throws IOException
	{
		SAXBuilder sb = new SAXBuilder();
		HttpServletRequest request = ServletActionContext.getRequest();
		File file = XMLUtil.getWebappXmlFile(request, Constants.SHARES_DOT_XML);
		Document sharesdoc;
		Map<String, Object> map = new HashMap<String, Object>();
		try
		{
			sharesdoc = sb.build(file);
			XPath sharePath = XPath.newInstance("datasets/dataset[datasetname='" + dataSetName + "']");
			Element root = sharesdoc.getRootElement();
			List<Element> datasetEls = (List<Element>) sharePath.selectNodes(sharesdoc);
			int i = 0;
			for (i = 0; i < datasetEls.size(); i++)
			{
				if (datasetEls.get(i).getChild("upLoader").getText().equals(getUsername()))
				{
					root.removeContent(datasetEls.get(i));
					break;
				}
			}
			if (i == datasetEls.size())
			{
				map = new HashMap<String, Object>();
				map.put("msg", "You have no access to delete this sgared dataset!");
				writeJson(JSON.toJSONString(map));
			}
			XMLUtil.saveXML(sharesdoc, file);

			map.put("msg", SUCCESS);
			writeJson(JSON.toJSONString(map));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			map = new HashMap<String, Object>();
			map.put("msg", e.toString());
			writeJson(JSON.toJSONString(map));
		}
	}
	public void rmDataSetFromProj() throws IOException
	{
		SAXBuilder sb = new SAXBuilder();
		HttpServletRequest request = ServletActionContext.getRequest();
		File file = XMLUtil.getWebappXmlFile(request, Constants.PROJECTS_DOT_XML);
		Document projsdoc;
		try
		{
			projsdoc = sb.build(file);

			XPath projPath = XPath.newInstance("projects/project[name='" + projectName + "']");
		Element root = projsdoc.getRootElement();
		Element projEl = (Element) projPath.selectSingleNode(projsdoc);
		Element datasets = projEl.getChild("datasets");
		List<Element> datasetList = datasets.getChildren("dataset");
		for (Element dataset : datasetList)
		{
			if (dataset.getText().equals(dataSetName))
			{
				datasets.removeContent(dataset);
				break;
			}
		}
		XMLUtil.saveXML(projsdoc, file);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("msg", SUCCESS);
		writeJson(JSON.toJSONString(map));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("msg", e.toString());
			writeJson(JSON.toJSONString(map));
		}
	}

	public void rmDataFileFromProj() throws IOException
	{
		SAXBuilder sb = new SAXBuilder();
		HttpServletRequest request = ServletActionContext.getRequest();
		File file = XMLUtil.getWebappXmlFile(request, Constants.PROJECTS_DOT_XML);
		Document projsdoc;
		try
		{
			projsdoc = sb.build(file);
		
		XPath projPath = XPath.newInstance("projects/project[name=" + projectName + "]");
		Element root = projsdoc.getRootElement();
		Element projEl = (Element) projPath.selectSingleNode(projsdoc);
		Element filesElement = projEl.getChild("files");
		List<Element> fileList = filesElement.getChildren("file");
		for (Element fileEl : fileList)
		{
			if (fileEl.getText().equals(fileName))
			{
				filesElement.removeContent(fileEl);
				break;
			}
		}
		XMLUtil.saveXML(projsdoc, new File(file.getAbsolutePath()));
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("msg", SUCCESS);
		writeJson(JSON.toJSONString(map));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("msg", e.toString());
			writeJson(JSON.toJSONString(map));
		}
	}
	public String deleteDataSet() {
		tag = 0;
		String kmlPath = null;
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	   
	    String path = request.getSession().getServletContext().getRealPath("")
	    		+ File.separator +"WEB-INF" + File.separator +"xml";
	    
		try{
			 Document filesdoc = null;
			 username = (String)request.getSession().getAttribute("username");

             path = path + File.separator + "users_informations" + File.separator + username;		 
	         filesdoc = sb.build("file:" + File.separator + path + File.separator 
	        		 + File.separator +"dataSets.xml"); 
	    	
			 Element root=filesdoc.getRootElement(); 
			 
		     List<Element> files =  root.getChildren();
		     for(Element file : files){
		    	 
		    	 String file_name = file.getChild("datasetname").getText();
		    	 
		    	 if(file_name.equals(dataSetName)){
		    		 kmlPath = file.getChild("kmlpath").getText();
		    		 root.removeContent(file);
		    		 break;
		    	 }
		     }
			 
			 Format format = Format.getCompactFormat();   
  	         format.setEncoding("UTF-8");  
  	         format.setIndent("  ");     
  	         XMLOutputter xmlout = new XMLOutputter(format); 
  	         File dataFiles = null;
  	         
  	         dataFiles = new File(path + File.separator +"dataSets.xml");
  	         
  	         System.out.println("delete dataFile is :" +  dataFiles);
  	         
  	         FileWriter filewriter = new FileWriter(dataFiles);
  	         
  	         xmlout.output(filesdoc, filewriter);
  	         filewriter.close(); 
  	         deleteDataInXML(); // delete the data records belong to the dataset which will be deleted in _dataFiles 
  	         String deleteFolderPath = Constant.DataFilePath + File.separator + username + File.separator + dataSetName;
  	         File folder = new File(deleteFolderPath);
  	         File kmlFile = new File(kmlPath);
  	         deleteDiskFolder(folder); //delete the dataset folder in egcDataFiles user` folder
  	         deleteDiskFolder(kmlFile);// delete the dataset kml in kml folder
  	         deleteSharedXmlRecord();
  	         tag =1;
		}catch(Exception e){
			e.printStackTrace();
		}
		
		
		return SUCCESS;
	}
	/**
	 * delete the files in specified dataset folder
	 * */
	public void deleteDiskFolder(File file) {
		
		if (file.exists())
		{
			if (file.isFile()) {
				file.delete();
			}
			else if (file.isDirectory()) {
				File[] files = file.listFiles();
				for (int i = 0; i < files.length; i++) {
					this.deleteDiskFolder(files[i]);
				}
			}
			file.delete();
			whetherExist = 1;
		}
		else {
			whetherExist = 0;
		}
	}
/**
 * delete the data records about the dataset in the _dataFile.xml
 * */
	public void deleteDataInXML() {
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	   
	    String path = request.getSession().getServletContext().getRealPath("")
	    		+ File.separator +"WEB-INF" + File.separator +"xml";
		try{
			 Document filesdoc = null;
	
	         path = path + File.separator + "users_informations" + File.separator + username;		 
	         filesdoc = sb.build("file:" + File.separator + path + File.separator 
	        		 + username + "_dataFiles.xml"); 
	    	
	         Element root=filesdoc.getRootElement();
	         XPath xpath = XPath.newInstance("files/file[datasetName=\""+ dataSetName +"\"]");
			 List<Element> files = (List<Element>)xpath.selectNodes(filesdoc);
		     
		     for(Element file : files){
		    	 
		    		 root.removeContent(file);
		    		 break;
		    	 
		     }
			 
			 Format format = Format.getCompactFormat();   
		         format.setEncoding("UTF-8");  
		         format.setIndent("  ");     
		         XMLOutputter xmlout = new XMLOutputter(format); 
		         File dataFiles = null;
		         
		         dataFiles = new File(path + File.separator + username +"_dataFiles.xml");
		         
		         System.out.println("delete dataFile is :" +  dataFiles);
		         
		         FileWriter filewriter = new FileWriter(dataFiles);
		         
		         xmlout.output(filesdoc, filewriter);
		         filewriter.close();     
		         
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * delete the dataset record in shared xml
	 * */
	public void deleteSharedXmlRecord() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String username = (String)request.getSession().getAttribute("username");
		SAXBuilder sb = new SAXBuilder();
		String path = request.getSession().getServletContext().getRealPath("") + File.separator +"WEB-INF" + File.separator +"xml" + File.separator + "shares.xml";
		try {
			Document filesdoc = sb.build("file:" + path);
			 Element root=filesdoc.getRootElement();
			XPath xPath = XPath.newInstance("datasets/dataset[upLoader=\""+ username +"\"]");
			List<Element> datasets = (List<Element>)xPath.selectNodes(filesdoc);
			for(Element dataset: datasets)
			{
				Element datasetname = dataset.getChild("datasetname");
				if (datasetname.getText().equals(dataSetName)) {
					root.removeContent(dataset);
				}
				
			}
			Format format = Format.getCompactFormat();   
	         format.setEncoding("UTF-8");  
	         format.setIndent("  ");     
	         XMLOutputter xmlout = new XMLOutputter(format); 
	         File dataFiles = null;
	         
	         dataFiles = new File(path);
	         
	         System.out.println("delete dataFile is :" +  dataFiles);
	         
	         FileWriter filewriter = new FileWriter(dataFiles);
	         
	         xmlout.output(filesdoc, filewriter);
	         filewriter.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}


