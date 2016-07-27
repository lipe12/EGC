package cn.com.action;
import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.util.List;
import java.util.Random;

import tutorial.Constant;

import javax.servlet.http.HttpServletRequest;

import java.util.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import com.opensymphony.xwork2.ActionSupport;

/**
 * this class is to find the smallest area of input env rasters
 * call the RasterCut.exe
 * wirte the output data information into username_dataFiles.xml and dataSet.xml
 * @author lp
 * @version 1.0*/
public class CreateDataSetKml extends ActionSupport{
	private String dataSetName;
	private Boolean flag;
	private int tag;
	public int getTag() {
		return tag;
	}
	public void setTag(int tag) {
		this.tag = tag;
	}
	public Boolean getFlag() {
		return flag;
	}
	public void setFlag(Boolean flag) {
		this.flag = flag;
	}
	public String getDataSetName() {
		return dataSetName;
	}
	public void setDataSetName(String dataSetName) {
		this.dataSetName = dataSetName;
	}
	
	public String execute(){
	tag = 0;
	String tableName = null;
	SAXBuilder sb = new SAXBuilder();
	HttpServletRequest request = ServletActionContext.getRequest();
	String userName = (String)request.getSession().getAttribute("username");
	String path = request.getSession().getServletContext().getRealPath("") + File.separator +"WEB-INF" + File.separator + "xml";
	path = path + File.separator + "users_informations" + File.separator + userName + File.separator + userName + "_dataFiles.xml";
	String inputsOriginal = null;
	String outsOriginal = null;
	String inputsCliped = null;
	String outputsCliped = null;
	String outPutName = null;
	String ouputkml = null;
	String tag_node = "new";
	/// begin
	String integer_random = this.createFixLenthString(6);
	String dot_random = this.createFixLenthString(6);
	Integer int_north = new Integer(integer_random) + 1000;
	Integer int_south = new Integer(integer_random) - 1000;
	Integer int_west = new Integer(integer_random) - 1500;
	Integer int_east = new Integer(integer_random) + 1500;
	
	
	String north = int_north.toString() + "." + dot_random;
	String south = int_south.toString() + "." + dot_random;
	String west = int_west.toString() + "." + dot_random;
	String east = int_east.toString() + "." + dot_random;
			/// end
	try {
		Document doc = null;
		if (userName == null) {
			
		}
		else {
		     doc = sb.build(path);
		     XPath xPath = XPath.newInstance("/files/file[datasetName=\"" +dataSetName + "\"]");
		     List<Element> files = (List<Element>)xPath.selectNodes(doc);
		     String[] semanticValue = new String[files.size()];
		     int k = 0;
		     for(Element file: files)
		     {

		    	 String dataVersion = file.getChild("dataversion").getText();
		    	 String dataType = file.getChild("type").getText();
		    	 
		    	 
		    	 if (dataVersion.equals(tag_node) && dataType.equals("Raster")) {
		    		 String semantic = file.getChild("semantic").getText();
			    	 semanticValue[k] = semantic;
			    	 k = k + 1;
					String inputFilePath =  file.getChild("fileName").getText();
					String[] tmpStrings = file.getChild("fileName").getText().split("/");
					int len = tmpStrings.length;
					String aString = tmpStrings[2];
					String[] tmStrings1 = aString.split("\\.");
					String filenameString = tmStrings1[0]+ "_clip." + tmStrings1[1];
					String outPutFilePath = "";
					for(int i=0; i < len - 1; i++)
					{
						
						outPutFilePath += tmpStrings[i];
						outPutFilePath += "/";
					}
					outPutFilePath = outPutFilePath + filenameString;
					if (outPutName == null) {
						outPutName =  outPutFilePath;
					}
					else {
						outPutName = outPutName + "#" + outPutFilePath;
					}
					outPutFilePath = Constant.DataFilePath + File.separator + outPutFilePath;
					inputFilePath = Constant.DataFilePath + File.separator + inputFilePath;
					if (inputsOriginal == null) {
						inputsOriginal =  inputFilePath;
						outputsCliped = outPutFilePath;
					}
					else {
						inputsOriginal = inputsOriginal + "#" + inputFilePath; // get the input env raster
						outputsCliped = outputsCliped + "#" + outPutFilePath;    // get the output clip env raster
					}
				Date nowDate = new Date();
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
				String nowTime = dateFormat.format(nowDate); 
				file.getChild("dataversion").setText("old" + nowTime);
				 Format format1 = Format.getCompactFormat();   
		  	        format1.setEncoding("UTF-8");  
		  	        format1.setIndent("  ");     
		  	        XMLOutputter xmlout = new XMLOutputter(format1); 
		  	        File dataFiles = null;
		  	         
		  	        dataFiles = new File(path);
		  	         
		  	        System.out.println("dataFiles:" +  dataFiles);
		  	         
		  	        FileWriter filewriter = new FileWriter(dataFiles);
		  	         
		  	        xmlout.output(doc, filewriter);
		  	        filewriter.close();
				}
		     }
		     
		     String outTmp = Constant.DataFilePath + File.separator + userName + File.separator + dataSetName + File.separator + "tmp.tif";
		   //TODO:.shp turn into kml
		     ouputkml = request.getSession().getServletContext().getRealPath("") + File.separator +"kml" + File.separator + userName + File.separator + dataSetName + ".kml";
		   
		     String cmd = Constant.exepath + File.separator + "RasterCut.exe" + " " + inputsOriginal + " " + outputsCliped + " " + outTmp + " " + ouputkml;
		     cmdProcess(cmd);
		     
		     writeXML(path, userName, outPutName, semanticValue, dataSetName, north, south, west, east);
		   //TODO:.shp turn into kml
		     String kml_reletive_path = userName + File.separator + dataSetName + ".kml";
		     writekmlXML(path, userName, kml_reletive_path, ouputkml, dataSetName, north, south, west, east);
		     updateSampleRecord(path, dataSetName, north, south, west, east);
		     writekmllocation(kml_reletive_path, dataSetName, north, south, west, east);
		     this.tag = 1;
		}
	} catch (Exception e) {
		e.printStackTrace();
	}
	return SUCCESS;
	}
	
	/**
	 * call RasterCut.exe to make get the smallest extents of all rasters
	 * @param cmd {String} the input param of exe file, including exe name; input rasters path; output raster path; tempfile(will auto delete); output kml file
	 * */
	public void cmdProcess(String cmd) {
		try {
			Process process = Runtime.getRuntime().exec(cmd);
			String str;
		    BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
		    while ( (str=bufferedReader.readLine()) !=null){System.out.println(str);}
		    process.waitFor();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
/**
 * wtrite the ouput raster information to the username_dataFile.xml
 * @param xmlFilePath: the username_dataFile.xml path
 * @param username: the login user
 * @param outputs: the path of ouput files
 * @param  semanticvalue: the semantic of output rasters
 * @param kmlFile: the output kml file path
 * @param datasetname: the dataset name */	
	public void writeXML(String xmlFilePath, String username,String outPuts,String[] semanticvalue , String datasetname, String north, String south, String west, String east) {
		SAXBuilder sb = new SAXBuilder();
		try {
			Document doc = sb.build("file:" + xmlFilePath);
			String[] outputFiles = outPuts.split("#");
			Element root=doc.getRootElement();
			for (int i = 0; i < outputFiles.length; i++) {
				XPath xPath = XPath.newInstance("/files/file[fileName=\"" +outputFiles[i] + "\"]");
			    Element file = (Element)xPath.selectSingleNode(doc);
			    Element _file = new Element("file");
			    if(file != null)
			    {
			    	
			    }else {
			    	String tmp_f = null;
					Element fileName = new Element("fileName");
					fileName.setText(outputFiles[i]);
					Element fileSize = new Element("fileSize");
					File f= new File(Constant.DataFilePath + File.separator + outputFiles[i]); 
					if (f.exists() && f.isFile()){
						tmp_f = FileSize(f.length());
					}
					fileSize.setText(tmp_f);
					Element top = new Element("top");
					top.setText(north);
					Element down = new Element("down");
					down.setText(south);
					Element left = new Element("left");
					left.setText(west);
					Element right = new Element("right");
					right.setText(east);
					Element format = new Element("format");
					format.setText("TIF");
					Element type = new Element("type");
					Element dataset = new Element("datasetName");
					dataset.setText(datasetname);
					type.setText("Raster");
					Element semantic = new Element("semantic");
					semantic.setText(semanticvalue[i]);
					Element dataversion = new Element("dataversion");
					dataversion.setText("new");
					_file.addContent(fileName);
				    _file.addContent(fileSize);
				    _file.addContent(type);
				    _file.addContent(format);
				    _file.addContent(semantic);
				    _file.addContent(dataversion);
				    _file.addContent(top);
				    _file.addContent(down);
				    _file.addContent(left);
				    _file.addContent(right);
				    _file.addContent(dataset);
				    root.addContent(_file);
				    Format format1 = Format.getCompactFormat();   
		  	        format1.setEncoding("UTF-8");  
		  	        format1.setIndent("  ");     
		  	        XMLOutputter xmlout = new XMLOutputter(format1); 
		  	        File dataFiles = null;
		  	         
		  	        dataFiles = new File(xmlFilePath);
		  	         
		  	        System.out.println("dataFiles:" +  dataFiles);
		  	         
		  	        FileWriter filewriter = new FileWriter(dataFiles);
		  	         
		  	        xmlout.output(doc, filewriter);
		  	        filewriter.close();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
	    
	}
	/**
	 * standardization the file size
	 * @param filelength {long} file size
	 * */
	public String FileSize(long filelength) {
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
    /**
     * write the kml location into dataSet.xml
     * */
	public void writekmllocation(String kmlPath, String datasetname, String north, String south, String west, String east) {
		SAXBuilder sb = new SAXBuilder();
		HttpServletRequest request = ServletActionContext.getRequest();
		String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
		String userName = (String)request.getSession().getAttribute("username");
		path = path + File.separator + "users_informations" + File.separator + userName+ File.separator + "dataSets.xml";
		try {
			Document doc = null;
			doc = sb.build("file:" + path);
			XPath xpath = XPath.newInstance("dataSets/dataSet[datasetname=\""+ datasetname +"\"]");
			Element dataset = (Element)xpath.selectSingleNode(doc);
			dataset.getChild("kmlpath").setText("kml" + File.separator +kmlPath);
			dataset.getChild("south").setText(south);
			dataset.getChild("north").setText(north);
			dataset.getChild("west").setText(west);
			dataset.getChild("east").setText(east);
			Format format1 = Format.getCompactFormat();   
  	        format1.setEncoding("UTF-8");  
  	        format1.setIndent("  ");     
  	        XMLOutputter xmlout = new XMLOutputter(format1); 
  	        File dataFiles = null;
  	         
  	        dataFiles = new File(path);
  	         
  	        System.out.println("dataFiles:" +  dataFiles);
  	         
  	        FileWriter filewriter = new FileWriter(dataFiles);
  	         
  	        xmlout.output(doc, filewriter);
  	        filewriter.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * write the kml information into username_dataFile.xml
	 * */
	public void writekmlXML(String xmlFilePath, String username, String kmlFile, String ouputkml, String datasetname, String north, String south, String west, String east) {
		SAXBuilder sb = new SAXBuilder();
		try {
			Document doc = sb.build("file:" + xmlFilePath);
			Element root=doc.getRootElement();
			XPath xPath = XPath.newInstance("/files/file[fileName=\"" + kmlFile + "\"]");
		    Element file = (Element)xPath.selectSingleNode(doc);
		    Element _file = new Element("file");
		    if(file != null)
		    {
		    	
		    }else {
		    	String tmp_f = null;
				Element fileName = new Element("fileName");
				fileName.setText(kmlFile);
				Element fileSize = new Element("fileSize");
				File f= new File(ouputkml); 
				if (f.exists() && f.isFile()){
					tmp_f = FileSize(f.length());
				}
				fileSize.setText(tmp_f);
				Element top = new Element("top");
				top.setText(north);
				Element down = new Element("down");
				down.setText(south);
				Element left = new Element("left");
				left.setText(west);
				Element right = new Element("right");
				right.setText(east);
				Element format = new Element("format");
				format.setText("KML");
				Element type = new Element("type");
				Element dataset = new Element("datasetName");
				dataset.setText(datasetname);
				type.setText("Boundary");
				Element semantic = new Element("semantic");
				semantic.setText("KML");
				Element dataversion = new Element("dataversion");
				semantic.setText("new");
				_file.addContent(fileName);
			    _file.addContent(fileSize);
			    _file.addContent(type);
			    _file.addContent(format);
			    _file.addContent(semantic);
			    _file.addContent(dataversion);
			    _file.addContent(top);
			    _file.addContent(down);
			    _file.addContent(left);
			    _file.addContent(right);
			    _file.addContent(dataset);
			    root.addContent(_file);
			    Format format1 = Format.getCompactFormat();   
	  	        format1.setEncoding("UTF-8");  
	  	        format1.setIndent("  ");     
	  	        XMLOutputter xmlout = new XMLOutputter(format1); 
	  	        File dataFiles = null;
	  	         
	  	        dataFiles = new File(xmlFilePath);
	  	         
	  	        System.out.println("dataFiles:" +  dataFiles);
	  	         
	  	        FileWriter filewriter = new FileWriter(dataFiles);
	  	         
	  	        xmlout.output(doc, filewriter);
	  	        filewriter.close();
			}
	} catch (Exception e) {
		e.printStackTrace();
	}
	}

	/**
	 * upadate sample data record
	 * */
	public void updateSampleRecord(String xmlFilePath,  String datasetname, String north, String south, String west, String east) {
		SAXBuilder sb = new SAXBuilder();
		try {
			Document doc = sb.build("file:" + xmlFilePath);
			Element root=doc.getRootElement();
			XPath xPath = XPath.newInstance("/files/file[datasetName=\"" + datasetname + "\"]");
			List<Element> files = (List<Element>)xPath.selectNodes(doc);
			for (Element file : files) {
			    if (file.getChild("semantic").getValue().equals("Sample Data")) {
					Element topElement = file.getChild("top");
					topElement.setText(north);
					Element downElement = file.getChild("down");
					downElement.setText(south);
					Element westElement = file.getChild("left");
					westElement.setText(west);
					Element eastElement = file.getChild("right");
					eastElement.setText(east);
				}
		    	
			    Format format1 = Format.getCompactFormat();   
	  	        format1.setEncoding("UTF-8");  
	  	        format1.setIndent("  ");     
	  	        XMLOutputter xmlout = new XMLOutputter(format1); 
	  	        File dataFiles = null;
	  	         
	  	        dataFiles = new File(xmlFilePath);
	  	         
	  	        System.out.println("dataFiles:" +  dataFiles);
	  	         
	  	        FileWriter filewriter = new FileWriter(dataFiles);
	  	         
	  	        xmlout.output(doc, filewriter);
	  	        filewriter.close();
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	private String createFixLenthString(int strLength) {  
	      
	    Random rm = new Random();  
	     
	    double pross = (1 + rm.nextDouble()) * Math.pow(10, strLength);  

	    String fixLenthString = String.valueOf(pross);  

	    return fixLenthString.substring(1, strLength + 1);  
	}
}

