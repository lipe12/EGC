import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;
public class test {
	public static void main(String[] args) throws JDOMException, IOException {
		String a = "123";
		String b = "234";
		double c = Double.parseDouble(a) + Double.parseDouble(b);
		
		String path = "D:\\1.txt";
		String encoding="GBK";
		try {
			File file=new File(path);
			List<String> extents = new ArrayList<String>();
			if(file.isFile() && file.exists()){ 
				InputStreamReader read = new InputStreamReader(new FileInputStream(file),encoding);
				 BufferedReader bufferedReader = new BufferedReader(read);
				
				 String lineTxt = null;
				 while((lineTxt = bufferedReader.readLine()) != null){
					 extents.add(lineTxt);
				 }
			}
			String extent = extents.get(0);
			String[] splitExtent = extent.split(" ");
			String top = splitExtent[2];
	} catch (Exception e) {
		// TODO: handle exception
	}
	}
}
