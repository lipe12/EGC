package tauDEM;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.InputStreamRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;

import tutorial.Constant;

public class RasterStream2LineNet {
	
	private String DataPath = Constant.DataFilePath + File.separator;
	
	public boolean rastertline(String StreamRaster, String FowdirectionRaster, String shp){
		
		boolean flag = true;
		
		String soap = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +   
        "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
        + " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"" 
        + " xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\">"    
        + " <soap:Body>"
        + " <rasterToLineImpl xmlns=\"http://whu.edu.cn/ws/rasterToLineImpl\">"
        + " <StreamRaster>" + DataPath + StreamRaster + "</StreamRaster>"
        + " <FowdirectionRaster>" + DataPath + FowdirectionRaster + "</FowdirectionRaster>"
        + " <outdata>" + DataPath + shp + "</outdata>"
        + " </rasterToLineImpl>"
        +"</soap:Body>"          
        +"</soap:Envelope>";                  

        //String address = "http://localhost/WS_RasterToLine/WebService.asmx";
        String address = Constant.Service_Raster2Line_Path;  
      try{
			
			PostMethod postMethod = new PostMethod(address); 
			
			String soapRequestData = 	soap;

			byte[] b = soapRequestData.getBytes("UTF-8");
			InputStream is = new ByteArrayInputStream(b,0,b.length);
			RequestEntity re = new InputStreamRequestEntity(is,b.length,"application/soap+xml; charset=UTF-8");
			postMethod.setRequestEntity(re);
			
			HttpClient httpClient = new HttpClient(); 
			int statusCode = httpClient.executeMethod(postMethod); 
			if (statusCode == 200){
				flag = true;             
			}else {
				flag = false;  
			}
		}catch(Exception e){
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}
}
