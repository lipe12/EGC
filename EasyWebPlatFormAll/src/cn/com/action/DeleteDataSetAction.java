package cn.com.action;
import java.io.File;
import java.io.FileWriter;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import com.opensymphony.xwork2.ActionSupport;

import tutorial.Constant;
public class DeleteDataSetAction extends ActionSupport{
	
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


