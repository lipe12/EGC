package cn.com.action;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

import com.googlecode.jsonplugin.annotations.JSON;
import com.opensymphony.xwork2.ActionSupport;

public class ShareAlgorithmAction extends ActionSupport{

	
	private  final int BUFFER_SIZE = 1024 ;
	private File metaFile;
	public File getMetaFile() {
		return metaFile;
	}
	public void setMetaFile(File metaFile) {
		this.metaFile = metaFile;
	}
	public File getWsdlFile() {
		return wsdlFile;
	}
	public void setWsdlFile(File wsdlFile) {
		this.wsdlFile = wsdlFile;
	}
	public String getAlgorithmName() {
		return algorithmName;
	}
	public void setAlgorithmName(String algorithmName) {
		this.algorithmName = algorithmName;
	}
	public String getAlgorithmDescription() {
		return algorithmDescription;
	}
	public void setAlgorithmDescription(String algorithmDescription) {
		this.algorithmDescription = algorithmDescription;
	}
	public List<String> getInputName() {
		return inputName;
	}
	public void setInputName(List<String> inputName) {
		this.inputName = inputName;
	}
	public List<String> getInputDescription() {
		return inputDescription;
	}
	public void setInputDescription(List<String> inputDescription) {
		this.inputDescription = inputDescription;
	}
	public List<String> getParameterName() {
		return parameterName;
	}
	public void setParameterName(List<String> parameterName) {
		this.parameterName = parameterName;
	}
	public List<String> getParameterDescription() {
		return parameterDescription;
	}
	public void setParameterDescription(List<String> parameterDescription) {
		this.parameterDescription = parameterDescription;
	}
	public List<String> getOutputName() {
		return outputName;
	}
	public void setOutputName(List<String> outputName) {
		this.outputName = outputName;
	}
	public List<String> getOutputDescription() {
		return outputDescription;
	}
	public void setOutputDescription(List<String> outputDescription) {
		this.outputDescription = outputDescription;
	}

	private File wsdlFile;
	private String algorithmName;
	private String algorithmDescription;
	private List<String> inputName;
	private List<String> inputDescription;
	private List<String> parameterName;
	private List<String> parameterDescription;
	private List<String> outputName;
	private List<String> outputDescription;
	
	private boolean flag = true;
	@JSON(name="success") 
	public boolean isFlag() {
		return flag;
	}
	public void setFlag(boolean flag) {
		this.flag = flag;
	}
	
	public String uploadAlgorithm(){
		
		this.flag = false;
	   
		
		this.createShareInfo();
		
		this.createXML();
	
		this.flag = true;
		             
		return SUCCESS;
	}
	
	private void createShareInfo(){// create algorithm shared foleder, including wsdl and mata.txt
		
		HttpServletRequest request = ServletActionContext.getRequest();
		String path = request.getSession().getServletContext().getRealPath("")
				+ File.separator +"WEB-INF" + File.separator +"xml";
		String username = (String)request.getSession().getAttribute("username");    
		path = path + File.separator + "users_informations" + File.separator + username;
		
	    path = path + File.separator + "sharedAlgorithmInfo";
	    
	    File tmpFile = new File(path);
	    if(!tmpFile.exists() &&  !tmpFile.isFile()){
	    	
	    	tmpFile.mkdir();
	    }
	}
	
	private  void copy(File src, File dst){
       
		 try {
			
			 BufferedInputStream in = new BufferedInputStream( new FileInputStream(src), BUFFER_SIZE);    
			 
			 BufferedOutputStream out = new BufferedOutputStream( new FileOutputStream(dst), BUFFER_SIZE);
                
			 byte [] buffer = new byte [BUFFER_SIZE];
             int len = -1;
             try {  
				while((len = in.read(buffer))>0){
				     out.write(buffer,0,len);           
				 }
				in.close();
				out.close();
			} catch (IOException e) {
			
				e.printStackTrace();
			} 

			
		} catch (FileNotFoundException e) {
			
			e.printStackTrace();
		}
        
   }        
    
    private void createXML(){//create algorithm shared xml file
    	
    	HttpServletRequest request = ServletActionContext.getRequest();
		String path = request.getSession().getServletContext().getRealPath("")
				+ File.separator +"WEB-INF" + File.separator +"xml";
		String username = (String)request.getSession().getAttribute("username");    
		path = path + File.separator + "users_informations" + File.separator + username;
		
	    path = path + File.separator + "sharedAlgorithmInfo.xml";
	    
	    
	    File file=new File(path);    
	    if(!file.exists()){
	    	 Element root = new Element("algorithms");  
	         Document Doc = new Document(root);  
	         Format format = Format.getCompactFormat();   
	 	     format.setEncoding("UTF-8");  
	 	     format.setIndent("  ");     
	         XMLOutputter XMLOut = new XMLOutputter(format);  

	         try {
	 			 XMLOut.output(Doc, new FileOutputStream(path));
	 		 }catch (FileNotFoundException e) {
	 			 e.printStackTrace();
	 		 }catch (IOException e) {
	 			e.printStackTrace();
	 		}  
	    }//end of if
	    updateXML(path);
	    
    }
    
    private void updateXML(String xmlPath){
		
    	String wsdlPath = xmlPath.replace("sharedAlgorithmInfo.xml",
    			"sharedAlgorithmInfo" + File.separator 
    			+ this.algorithmName + ".wsdl");
    	String metaPath = xmlPath.replace("sharedAlgorithmInfo.xml",
    			"sharedAlgorithmInfo" + File.separator 
    			+ this.algorithmName + ".txt");
     
    	SAXBuilder sb = new SAXBuilder();
		Document filesdoc = null;
		try {
			 filesdoc = sb.build("file:" + File.separator + xmlPath);
			 
			 Element root=filesdoc.getRootElement(); 
			 
			 Element _algorithm = new Element("algorithm");
			 
			 Element _algorithmName = new Element("algorithmName");
			 _algorithmName.setText(this.algorithmName);
			 
			 Element _algorithmDescription = new Element("algorithmDescription");
			 _algorithmDescription.setText(this.algorithmDescription);
			 
			 Element _metaFilePath = new Element("metaFilePath");
			 _metaFilePath.setText(this.algorithmName + ".txt");
			 
			 Element _wsdlFilePath = new Element("wsdlFilePath");
			 _wsdlFilePath.setText(this.algorithmName + ".wsdl");
			 
			 Element _inputs = new Element("inputs");
			 int inputLen = this.inputName.size();
			 for(int i =0 ; i< inputLen; i++ ){
				 
				 Element _input = new Element("input");
				 
				 Element _inputName = new Element("Name");
				 _inputName.setText(this.inputName.get(i));
				 
				 Element _inputDescription = new Element("Description");
				 _inputDescription.setText(this.inputDescription.get(i));
				 
				 _input.addContent(_inputName);
				 _input.addContent(_inputDescription);
				 
				 _inputs.addContent(_input);
			 }
			 
			 Element _parameters = new Element("parameters");
			 int parameterLen = this.parameterName.size();
			 for(int i =0 ; i< parameterLen; i++ ){
				 
				 Element _parameter = new Element("parameter");
				 
				 Element _parameterName = new Element("Name");
				 _parameterName.setText(this.parameterName.get(i));
				 
				 Element _parameterDescription = new Element("Description");
				 _parameterDescription.setText(this.parameterDescription.get(i));
				 
				 _parameter.addContent(_parameterName);
				 _parameter.addContent(_parameterDescription);
				 
				 _parameters.addContent(_parameter);
			 }
			 
			 
			 Element _outputs = new Element("outputs");
			 int outputLen = this.outputName.size();
			 for(int i =0 ; i< outputLen; i++ ){
				 
				 Element _output = new Element("output");
				 
				 Element _outputName = new Element("Name");
				 _outputName.setText(this.outputName.get(i));
				 
				 Element _outputDescription = new Element("Description");
				 _outputDescription.setText(this.outputDescription.get(i));
				 
				 _output.addContent(_outputName);
				 _output.addContent(_outputDescription);
				 
				 _outputs.addContent(_output);
			 }
			 
			 _algorithm.addContent(_algorithmName);
			 _algorithm.addContent(_algorithmDescription);
			 _algorithm.addContent(_metaFilePath);
			 _algorithm.addContent(_wsdlFilePath);
			 _algorithm.addContent(_inputs);
			 _algorithm.addContent(_parameters);
			 _algorithm.addContent(_outputs);
			 
			 root.addContent(_algorithm);
			 
			 Format format = Format.getCompactFormat();   
  	         format.setEncoding("UTF-8");  
  	         format.setIndent("  ");     
  	         XMLOutputter xmlout = new XMLOutputter(format); 
  	         File dataFiles = null;
  	         
  	         dataFiles = new File(xmlPath);
  	        
  	         FileWriter filewriter = new FileWriter(dataFiles);
  	         
  	         xmlout.output(filesdoc, filewriter);
  	         filewriter.close();  
  	         
  	         
  	         if(this.wsdlFile.length()>0){
  	        	File wsdl_file = new File(wsdlPath);
  	  	         this.copy(this.wsdlFile, wsdl_file);	 
  	         }
  	         if(this.metaFile.length()> 0){
  	  	         File meta_file = new File(metaPath);
  		         this.copy(this.metaFile, meta_file);
  	         }

  	         
		} catch (JDOMException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	
    }
}
