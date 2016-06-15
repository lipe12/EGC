package tauDEM;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.InputStreamRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;

import tutorial.Constant;

public class LonLat2Shp {
	
	private String DataPath = Constant.DataFilePath + File.separator;
	/***
	 * 
	 * @param Lon ¾­¶È
	 * @param Lat Î¬¶È
	 * @param outshp 
	 */
	public boolean createShp(String Lon, String Lat, String outshp){
        boolean flag = true;
		
		String soap = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +   
        "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
        + " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"" 
        + " xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\">"    
        + " <soap:Body>"
        + " <pointToShpImpl xmlns=\"http://whu.edu.cn/ws/pointToShpImpl\">"
        + " <xCoordinate>" + Lon + "</xCoordinate>"
        + " <yCoordinate>" + Lat + "</yCoordinate>"
        + " <outShp>" + DataPath + outshp + "</outShp>"
        + " </pointToShpImpl>"
        +"</soap:Body>"            
        +"</soap:Envelope>";                  

        //String address = "http://localhost/WS_PointToShp/WebService.asmx";
        String address = Constant.Service_Point2Shp_Path; 
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
