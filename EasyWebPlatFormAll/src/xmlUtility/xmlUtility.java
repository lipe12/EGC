package xmlUtility;

import java.io.StringReader;
import java.io.File;
import javax.xml.transform.*;    
import javax.xml.transform.dom.DOMSource;    
import javax.xml.transform.stream.StreamResult;        
import javax.xml.parsers.*;    

import org.w3c.dom.*; 
import org.xml.sax.InputSource; 


public class xmlUtility {
	public  Document stringToDocument(String s) { 
       Document document = null; 
       try 
       { 
           DocumentBuilder parser = DocumentBuilderFactory.newInstance().newDocumentBuilder(); 
           document = parser.parse( new InputSource(new StringReader(s)) ); 
       }catch(Exception ex) 
       {             
            ex.printStackTrace(); 
       } 
      return document; 
    }
	public boolean docToXmlFile(Document document,String filename) { 
       boolean flag = true; 
       try 
       { 
             TransformerFactory tFactory = TransformerFactory.newInstance();    
             Transformer transformer = tFactory.newTransformer();  
             DOMSource source = new DOMSource(document);  
             StreamResult result = new StreamResult(new File(filename));    
             transformer.transform(source, result);  
         }catch(Exception ex) 
         { 
             flag = false; 
             ex.printStackTrace(); 
         } 
        return flag;       
     }
	public  boolean stringToXmlFile(String str,String filename) { 
	      boolean flag = true; 
	      try 
	       { 
	          Document doc = stringToDocument(str);        
	          flag = docToXmlFile(doc,filename); 
	       }catch (Exception ex) 
	       { 
	          flag = false; 
	          ex.printStackTrace(); 
	       } 
	      return flag; 
    }

}
