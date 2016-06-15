package data;

import com.googlecode.jsonplugin.annotations.JSON;
import com.opensymphony.xwork2.ActionSupport;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

import tutorial.Constant;
public class SampleDataAction extends ActionSupport{
	
	private String filenamelist;
	
	public String getFilenamelist() {
		return filenamelist;
	}
	public void setFilenamelist(String filenamelist) {
		this.filenamelist = filenamelist;
	}

	private File[] samplefile;
	private String tag;
	
	private boolean flag = true;
    
	private String fileName;
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getFileSize() {
		return fileSize;
	}
	public void setFileSize(String fileSize) {
		this.fileSize = fileSize;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getFormat() {
		return format;
	}
	public void setFormat(String format) {
		this.format = format;
	}
	public String getSemantic() {
		return semantic;
	}
	public void setSemantic(String semantic) {
		this.semantic = semantic;
	}
	public String getTop() {
		return top;
	}
	public void setTop(String top) {
		this.top = top;
	}
	public String getDown() {
		return down;
	}
	public void setDown(String down) {
		this.down = down;
	}
	public String getLeft() {
		return left;
	}
	public void setLeft(String left) {
		this.left = left;
	}
	public String getRight() {
		return right;
	}
	public void setRight(String right) {
		this.right = right;
	}

	private String fileSize;
	private String type;
	private String format;
	private String semantic;
	private String top;
	private String down;
	private String left;
	private String right;
	
	private String samplefields;
    private String samplerows;
	
	public String getSamplefields() {
		return samplefields;
	}
	public void setSamplefields(String samplefields) {
		this.samplefields = samplefields;
	}
	public String getSamplerows() {
		return samplerows;
	}
	public void setSamplerows(String samplerows) {
		this.samplerows = samplerows;
	}
	@JSON(name="success") 
	public boolean isFlag() {
		return flag;
	}
	public void setFlag(boolean flag) {
		this.flag = flag;
	}
	
	private  final int BUFFER_SIZE = 1024 ;

	public String upload(){
		Date d = new Date();
		long longtime = d.getTime(); 
		String [] filenames = filenamelist.replace(".", longtime + ".").split("#");
		           
		try{
			int len = samplefile.length;
			for(int i =0; i< len ; i++){
				File file = new File(Constant.DataFilePath + File.separator  + filenames[i]);
			    copy(samplefile[i], file);     
			    if(filenames[i].contains(".asc")||filenames[i].contains(".tif")||filenames[i].contains(".csv")){
			    	fileName = filenames[i];
			    	fileSize = FormetFileSize(samplefile[i].length());     
			    	writeMetaData();  
			    }
			}
			readSamplefile();     
		    tag = "0";        
		}catch(Exception e){
			e.printStackTrace();
			tag = "1";
		}
		
		return SUCCESS;
	}
	public String find_fields_datas(){
		try{
		    FileReader read = new FileReader(Constant.DataFilePath + File.separator  + fileName);
		    BufferedReader br = new BufferedReader(read);
		    samplefields = br.readLine();
		    String rows = "";
		    String row = null;
		    while((row = br.readLine())!=null){
		      rows = rows + "#" + row ;
		    }
		    samplerows = rows.substring(1);        
		    br.close();
		    read.close();
		 }catch(FileNotFoundException e){
			  e.printStackTrace();
		 }catch(IOException e){
			  e.printStackTrace();
		 }		
		
		return SUCCESS;
	}
	public String FormetFileSize(long filelength) {
        DecimalFormat df = new DecimalFormat("#.00");
        String fileSizeString = "";
        if (filelength < 1024) {
            fileSizeString = df.format((double) filelength) + "B";
        } else if (filelength < 1048576) {
            fileSizeString = df.format((double) filelength / 1024) + "K";
        } else if (filelength < 1073741824) {
            fileSizeString = df.format((double) filelength / 1048576) + "M";
        } else {
            fileSizeString = df.format((double) filelength / 1073741824) + "G";
        }
        return fileSizeString;
    }
	private  void writeMetaData(){
		SAXBuilder sb = new SAXBuilder();
	    HttpServletRequest request = ServletActionContext.getRequest();
	   
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"xml";
		try{
			 Document filesdoc = null;
			 String username = (String)request.getSession().getAttribute("username");
			 
	    	 if(username==null){
	    		 filesdoc = sb.build("file:" + File.separator + path + File.separator + "dataFiles.xml");	 
	    	 }else{        
	    		 filesdoc = sb.build("file:" + File.separator + path + File.separator + username + "_dataFiles.xml"); 
	    	 } 
			 Element root=filesdoc.getRootElement(); 
			 Element _file = new Element("file");
			 Element _fileName = new Element("fileName");
			 _fileName.setText(fileName);
			 Element _fileSize = new Element("fileSize");
			 _fileSize.setText(fileSize);
			 Element _type = new Element("type");
			 _type.setText(type);
			 Element _format = new Element("format");
			 _format.setText(format);
			 Element _semantic = new Element("semantic");
			 _semantic.setText(semantic);
			 Element _top =new Element("top");
			 _top.setText(top);
			 Element _down = new Element("down");
			 _down.setText(down);
			 Element _left =new Element("left");
			 _left.setText(left);
			 Element _right = new Element("right");
			 _right.setText(right);
			 root.addContent(_file);
			 _file.addContent(_fileName);
			 _file.addContent(_fileSize);
			 _file.addContent(_type);
			 _file.addContent(_format);
			 _file.addContent(_semantic);
			 _file.addContent(_top);
			 _file.addContent(_down);
			 _file.addContent(_left);
			 _file.addContent(_right);
			 
			 Format format = Format.getCompactFormat();   
  	         format.setEncoding("UTF-8");  
  	         format.setIndent("  ");     
  	         XMLOutputter xmlout = new XMLOutputter(format); 
  	         File dataFiles = null;
  	         if(username==null){
  	        	 dataFiles = new File(path + File.separator +"dataFiles.xml");
  	         }else{
  	        	 dataFiles = new File(path + File.separator + username +"_dataFiles.xml");
  	         }
  	         FileWriter filewriter = new FileWriter(dataFiles);
  	         
  	         xmlout.output(filesdoc, filewriter);
  	         filewriter.close();     
  	         
		}catch(Exception e){
			e.printStackTrace();
		}          
	}
	private  void copy(File src, File dst){
        try{
           InputStream in = null ;
           OutputStream out = null ;
           try{                
               in = new BufferedInputStream( new FileInputStream(src), BUFFER_SIZE);
               out = new BufferedOutputStream( new FileOutputStream(dst), BUFFER_SIZE);
               byte [] buffer = new byte [BUFFER_SIZE];
               int len = -1;
               while((len = in.read(buffer))>0){
                   out.write(buffer,0,len);
               } 
            }finally{
                if(null != in){
                   in.close();
                } 
                if(null != out){
                   out.close();
                } 
           } 
        }catch(Exception e){
           e.printStackTrace();
        } 
   } 

	@SuppressWarnings("null")
	private void readSamplefile(){

		try{
		    FileReader read = new FileReader(samplefile[0]);
		    BufferedReader br = new BufferedReader(read);
		    samplefields = br.readLine();
		    String rows = "";
		    String row = null;
		    while((row = br.readLine())!=null){
		      rows = rows + "#" + row ;
		    }
		    samplerows = rows.substring(1);
		    //System.out.println(samplefields);         
		    br.close();
		    read.close();
	  }catch(FileNotFoundException e){
		  e.printStackTrace();
	  }catch(IOException e){
		  e.printStackTrace();
	  }		
	}
	public File[] getSamplefile() {
		return samplefile;
	}
	public void setSamplefile(File[] samplefile) {
		this.samplefile = samplefile;
	}
	public String getTag() {
		return tag;
	}
	public void setTag(String tag) {
		this.tag = tag;
	}
}
