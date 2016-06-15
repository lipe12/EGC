package tutorial;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
public class ColorMap {
	public ArrayList<String> colors = new ArrayList<String>();
	public ColorMap(){
		colors.add("118 219 211");
		colors.add("157 235 155");
		colors.add("255 253 199");
		colors.add("255 255 166");
		colors.add("255 255 128");
		colors.add("237 226 126");
		colors.add("217 194 121");
		colors.add("176 143 77");
		colors.add("135 96  38");
		colors.add("148 121 102");
		colors.add("150 150 181");
		colors.add("166 150 181");
		colors.add("181 150 181");
		colors.add("217 180 250");
		colors.add("217 199 216");
	}
	public ColorMap(int type){
    
		HttpServletRequest request = ServletActionContext.getRequest();
		String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator + "xml";
		try{
			FileReader read = null;
			switch( type){
				case 1:
					read = new FileReader(path + File.separator + "strechedColor.txt");
					break;
				default :
					read = new FileReader(path + File.separator + "strechedColor.txt");
					break;
			}
			
			BufferedReader br = new BufferedReader(read);
			String row=br.readLine();
			while((row=br.readLine())!=null){
				colors.add(row);
			}
			br.close();
			read.close();
		}catch(Exception e){
			e.printStackTrace();
		}
		
	}
}
