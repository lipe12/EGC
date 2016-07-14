package bpelUtility;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;  
import java.io.InputStream;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpClient;   
import org.apache.commons.httpclient.methods.InputStreamRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import tutorial.Constant;

public class bpelUtility2 {
	
	private boolean deployed = false;
	private String bpelWsdl ;
    public String getBpelWsdl() {
		return bpelWsdl;
	}
	/**
     * 
     * @param wsdlBasePath the folder of wsdl
     * @param srcBasePath  the temp folder of .bpel,.deployed
     * @param basePath     the ode folder 
     * @param sortedWsdlName  the cell wsdl name 
     */
	public boolean generateBpel(String wsdlBasePath , String srcBasePath , String basePath ,List<String> sortedWsdlName, List<String> tasknames){
		
		String matchWsdl = matchTask2Wsdl(tasknames);
		if(matchWsdl != null){
			bpelWsdl = basePath + File.separator + matchWsdl;
			
		}else{
			bpelUtility bpel = new bpelUtility(); 
			
			List<String> paths = new ArrayList<String>();
			for(String name : sortedWsdlName){
				paths.add(wsdlBasePath + File.separator + name);
			}
			 
			String mainWsdlName = bpel.CreateWSDL(srcBasePath,paths);
			String mainpath = srcBasePath + File.separator + mainWsdlName;
			paths.add(mainpath);  
			
			String bpelFileName =	bpel.CreateBpelXML(srcBasePath,mainpath, paths); 
		    String bpelpath =  srcBasePath + File.separator + bpelFileName;
		    
		    String deployFileName = bpel.CreateDeployXML(srcBasePath,bpelpath, paths);
		    
		    //boolean flag = bootBpel(basePath, wsdlBasePath, srcBasePath , bpelFileName,deployFileName,mainWsdlName,sortedWsdlName);
		    boolean flag = bootBpel(basePath, wsdlBasePath, srcBasePath , bpelFileName,deployFileName,mainWsdlName,sortedWsdlName,tasknames);
		    return flag;
		    
		}
		return true;
	}
	public  static Object obj=new Object();
	
/**
 * match the task2wsdl precious record, based on tasknames
 * @param tasknames {List<String>} task name strings
 *  */
	private String matchTask2Wsdl(List<String> tasknames){
		
		String wsdl_location = null;
		synchronized(obj){
			try{
				
				HttpServletRequest request = ServletActionContext.getRequest();
				String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator + "xml";
				SAXBuilder sb = new SAXBuilder();
				Document task2wsdl_doc = sb.build("file:" + File.separator + path + File.separator + "task2wsdl.xml");
				XPath xpath = XPath.newInstance("Tasks/Task");
				List<Element> tasks = (List<Element>)xpath.selectNodes(task2wsdl_doc);
				
				String combine_taskname = "";
				for(String taskname: tasknames){
					combine_taskname = combine_taskname + taskname;
				}
				for(Element task : tasks){
					String taskName =  task.getAttributeValue("TaskName");
					taskName = taskName.replace(";", "");
					if(taskName.equals(combine_taskname)){
						wsdl_location = task.getChild("WsdlLocation").getText();
						System.out.println("match wsdl location " +  wsdl_location);
						break;
					}
				}
			}catch(Exception e){
				e.printStackTrace();
			}
			return wsdl_location;
		}
	}
/**
 * updata the task2wsdl.xml
 * when the original xml do not have a same tasks flow, build a new record
 * @param tasknames {List<String>} task names
 * @param wsdllocation {String} the task2wsdl position
 * */	
	private boolean updataTask2Wsdk(List<String> tasknames,String wsdllocation){
		
		String combine_taskname = tasknames.get(0);
		for(int i =1; i< tasknames.size(); i++){
			combine_taskname = combine_taskname + ";" + tasknames.get(i);
		}
		synchronized(obj){
			try{
				SAXBuilder sb = new SAXBuilder();
			    HttpServletRequest request = ServletActionContext.getRequest();
			    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
			    Document task2wsdl_doc = sb.build("file:" + File.separator + path + File.separator + "task2wsdl.xml");
			    
			    Element root = task2wsdl_doc.getRootElement();
			    Element _task = new Element("Task");
			    _task.setAttribute("TaskName", combine_taskname);
			    Element _WsdlLocation = new Element("WsdlLocation");
			    _WsdlLocation.setText(wsdllocation);
			    
			    root.addContent(_task);
			    _task.addContent(_WsdlLocation);
			    
			    Format format = Format.getCompactFormat();   
	 	        format.setEncoding("UTF-8");  
	 	        format.setIndent("  ");     
	 	        XMLOutputter xmlout = new XMLOutputter(format); 
	 	        File dataFiles = new File(path + File.separator + "task2wsdl.xml");
	 	        FileWriter filewriter = new FileWriter(dataFiles);
		         
		        xmlout.output(task2wsdl_doc, filewriter);
		        filewriter.close();     
			}catch(Exception e ){
				e.printStackTrace();
			}
			return true;
		}
	}
/**
 *  create a new fold, copy created wsdl bpel deployedxml into ODE_BasePath, upadate the task2wsdl.xml
 * @param basePath {String} Constant.ODE_BasePath;
 * @param wsdlBasePath {String} "C:/Wsdl"
 * @param srcBasePath {String} Constant.SrcBasePath
 * @param bpelFileName {String}
 * @param deployFileName {String}
 * @param mainWsdlName {String}
 * @param atomWsdlsName {List<String>} every task wsdl such as fillDeps.wsdl
 * @param tasknames {List<String>} task names
 * */
	private boolean bootBpel(String basePath,String wsdlBasePath,String srcBasePath ,String bpelFileName,String deployFileName,String mainWsdlName,List<String> atomWsdlsName,List<String> tasknames){
		Date d = new Date();
		long longtime = d.getTime();   
		
		String   dirFilePath  = basePath + File.separator + "Egc" + longtime; 
		bpelWsdl = dirFilePath + File.separator + mainWsdlName;
		boolean bFile;
		bFile = false; 
		try{  
				 File dirFile = new File(dirFilePath);  
		         bFile   = dirFile.exists();
	
		         if( bFile == true )  
		         {
		            System.out.println("The folder exists.");
		         }else{
		        	 
		            System.out.println("The folder do not exist,now trying to create a one...");
		            bFile = dirFile.mkdir();
		            if( bFile == true )
		            {
		              System.out.println("Create successfully!");
		            }
		            else
		            {
		              System.out.println("Disable to make the folder,please check the disk is full or not.");
		              System.exit(1);
		            }
	                                
		         }
                 for(String filename : atomWsdlsName){        
    		         copyFile(wsdlBasePath + File.separator + filename,dirFilePath,filename);    
                 }
                 copyFile(srcBasePath + File.separator + mainWsdlName,dirFilePath,mainWsdlName); 
                 
                 copyFile(srcBasePath + File.separator + bpelFileName,dirFilePath,bpelFileName);
                 
                 copyFile(srcBasePath + File.separator + deployFileName,dirFilePath,"deploy.xml");       
                 int times = 5; 
                 File deployedfile = new File(dirFilePath +".deployed");
                 deployed = false;
                 while (times  > 0) {            
                     Thread.sleep(5000);               
                     if (deployedfile.exists()) {     
                    	 deployed = true;
                    	 updataTask2Wsdk(tasknames ,"Egc" + longtime + "/" +mainWsdlName);
                    	 break;   
                     } else {     
                         //System.out.println("deployed failed!");  
                    	 times--;
                     }
                 }        	                      
		}catch(Exception e){
			e.printStackTrace();
		}
		return deployed;
		
	}
	public boolean invoke(oneToNMap map , String bpelWsdl){      
		
		bpelUtility bpel = new bpelUtility();         
		String soap = bpel.CreateSoap(bpelWsdl, map);  
		String address = bpel.GetSoapAddress(bpelWsdl);      
		try{          
			
			System.out.println("into invoke");
			
			System.out.println("soap:" + soap);
			
			   
			PostMethod postMethod = new PostMethod(address); 
			
			String soapRequestData = 	soap;

			byte[] b = soapRequestData.getBytes("UTF-8");
			InputStream is = new ByteArrayInputStream(b,0,b.length);
			RequestEntity re = new InputStreamRequestEntity(is,b.length,"application/soap+xml; charset=UTF-8");
			postMethod.setRequestEntity(re);
			
			Long startTime = System.currentTimeMillis();
			
			HttpClient httpClient = new HttpClient(); 
			System.out.println("invoking");      
			int statusCode = httpClient.executeMethod(postMethod);
			
			System.out.println("statusCode:" + statusCode);
			Long endTime = System.currentTimeMillis();
			              
			System.out.println("Totle time is "  + (endTime - startTime) + "milliseconds");
			if(statusCode == 200){
				return true;
			 }
 
			}catch(Exception e){
				e.printStackTrace();
			
				return false;
			}
				
		  return false;
	}
    private  long copyFile(String srcFilePath, String destDirPath, String destFileName) {   
        long copySizes = 0;   
        File srcFile = new File(srcFilePath);
        File destDir = new File(destDirPath);
        if (!srcFile.exists()) {   
            System.out.println("srcFile do not exist");   
            copySizes = -1;   
        } else if (!destDir.exists()) {     
            System.out.println("destDir do not exist");     
            copySizes = -1;   
        } else if (destFileName == null) {   
            System.out.println("new file name is null");   
            copySizes = -1;   
        } else {   
            try {   
                FileChannel fcin = new FileInputStream(srcFile).getChannel();   
                FileChannel fcout = new FileOutputStream(new File(destDir,   
                		destFileName)).getChannel();   
                long size = fcin.size();   
                fcin.transferTo(0, fcin.size(), fcout);   
                fcin.close();   
                fcout.close();   
                copySizes = size;   
            } catch (FileNotFoundException e) {   
                e.printStackTrace();   
            } catch (IOException e) {   
                e.printStackTrace();   
            }   
        }   
        return copySizes;   
    }
}
