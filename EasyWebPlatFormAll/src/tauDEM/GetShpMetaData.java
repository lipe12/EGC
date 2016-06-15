package tauDEM;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.io.StringReader;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.InputStreamRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.Namespace;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;
import org.xml.sax.InputSource;

import tutorial.Constant;
import MetaData.ShpMetaData;
public class GetShpMetaData {
	private String DataPath = Constant.DataFilePath + File.separator;
	public  ShpMetaData getMetaData(String shp_file){
        
		ShpMetaData metaData =  new ShpMetaData();
		
		String soap = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +   
        "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
        + " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"" 
        + " xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\">"    
        + " <soap:Body>"
        + " <ExtractShpMetaData xmlns=\"http://whu.edu.cn/ws/ExtractShpMetaData\">"
        + " <shapefile>" + DataPath + shp_file + "</shapefile>"
        + " </ExtractShpMetaData>"    
        +"</soap:Body>"            
        +"</soap:Envelope>";                  

        String address = Constant.Service_ShpMetaData_Path;
        
      try{
			
			PostMethod postMethod = new PostMethod(address); 
			
			String soapRequestData = 	soap;

			byte[] b = soapRequestData.getBytes("UTF-8");
			InputStream is = new ByteArrayInputStream(b,0,b.length);
			RequestEntity re = new InputStreamRequestEntity(is,b.length,"application/soap+xml; charset=UTF-8");
			postMethod.setRequestEntity(re);
			
			HttpClient httpClient = new HttpClient(); 
			int statusCode = httpClient.executeMethod(postMethod);
			//System.out.println("sheng cheng shp");
			if (statusCode == 200){
				
				String soapResponseData =  postMethod.getResponseBodyAsString();
			    SAXBuilder builder = new SAXBuilder();   
			    StringReader read = new StringReader(soapResponseData);  
			    InputSource source = new InputSource(read); 
				Document jdoc=builder.build(source);
				
				XPath xpath = XPath.newInstance("/soap:Envelope/soap:Body/ns:ExtractShpMetaDataResponse/ns:ExtractShpMetaDataResult/ns:Root");
				xpath.addNamespace("soap","http://www.w3.org/2003/05/soap-envelope");
				xpath.addNamespace("ns","http://whu.edu.cn/ws/ExtractShpMetaData");
				Element Root = (Element)xpath.selectSingleNode(jdoc);
				Namespace ns=Namespace.getNamespace("ns","http://whu.edu.cn/ws/ExtractShpMetaData");
				Element Filename = Root.getChild("Filename", ns);
				Element EPSGCODE = Root.getChild("EPSGCODE",ns);      
				Element ProjString = Root.getChild("ProjString",ns);
				Element Exent = Root.getChild("Exent",ns);
				
				read.close();
				
				metaData.SetFilename(Filename.getValue());
				metaData.SetEpsgcode(EPSGCODE.getValue());
				metaData.SetProj4(ProjString.getValue());
                metaData.SetExtent(Exent.getValue());  
			}else {
				
			}
		}catch(Exception e){
			e.printStackTrace();
			
		}
		return metaData;
	}
}
