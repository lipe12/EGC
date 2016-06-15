package xmlUtility;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.StringReader;

import org.jdom2.Document;
import org.jdom2.input.SAXBuilder;
import org.jdom2.Element;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

public class xmlUtility_dom {
	/** 
     * transfer String to DOCUMENT 
     *  
     * @param xmlStr  String
     * @return doc JDOM Document 
     * @throws Exception 
     */  
    public static Document string2Doc(String xmlStr) throws Exception {  
        java.io.Reader in = new StringReader(xmlStr);  
        Document doc = (new SAXBuilder()).build(in);         
        return doc;  
    }
    
    /** 
     * Document
     *  
     * @param doc JDOM Document
     * @return xmlStr String
     * @throws Exception 
     */  
    public static String doc2String(Document doc) throws Exception {  
        Format format = Format.getPrettyFormat();  
        format.setEncoding("UTF-8");
        XMLOutputter xmlout = new XMLOutputter(format);  
        ByteArrayOutputStream bo = new ByteArrayOutputStream();  
        xmlout.output(doc, bo);  
        return bo.toString();  
    }
    
    public static void doc2xmlfile(Document filesdoc, String filepath){
    	
    	Format format = Format.getCompactFormat();   
        format.setEncoding("UTF-8");  
        format.setIndent("  ");     
        XMLOutputter xmlout = new XMLOutputter(format); 
        File modelFiles = new File(filepath);
        try{
        	 FileWriter filewriter = new FileWriter(modelFiles);
             xmlout.output(filesdoc, filewriter);
             filewriter.close();
        }catch(Exception e){
        	e.printStackTrace();
        	
        }       
    }
    public static boolean string2xmlfile(String xmlstr, String filepath){
    	
    	try {
			Document model = string2Doc(xmlstr);
			
			SAXBuilder sb = new SAXBuilder();
			//System.out.println("xml path: " + filepath);
			Document filesdoc = sb.build("file:" + File.separator +  filepath);	
			     
			Element models=filesdoc.getRootElement(); 
			models.addContent(model.cloneContent());      
			
			doc2xmlfile(filesdoc,filepath);
			return true;
		} catch (Exception e) {
			
			e.printStackTrace();
			return false;
		}
    }
}
