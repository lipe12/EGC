package util;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

/**
 * @author Houzw
 * @Description http://www.cnblogs.com/xing901022/p/4020527.html
 * @Createdate 2016年8月11日 下午3:34:33
 */
public class XMLUtil
{
	/**
	 * get xml file located in: web-inf/xml/users_informations/current-username/
	 * 
	 * @param request HttpServletRequest
	 * @param filename xml filename such as "dataSets.xml"
	 * @return
	 * @Houzw at 2016年8月11日下午3:59:08
	 */
	public static File getUsersXmlFile(HttpServletRequest request, String filename)
	{
		String username = (String) request.getSession().getAttribute("username");
		String path = FileUtil.getAppPath(request)
				+ "\\WEB-INF\\xml\\users_informations\\"
				+ username + "\\" + filename;
		// web-inf/xml/users_informations/username/dataSets.xml
		File file = new File(path);
		return file;
	}

	/**
	 * get xml file located in: web-inf/xml/users_informations/username/
	 * 
	 * @param request
	 * @param filename
	 * @param username
	 * @return
	 * @Houzw at 2016年8月17日下午10:32:02
	 */
	public static File getUsersXmlFile(HttpServletRequest request, String filename, String username)
	{
		String path = FileUtil.getAppPath(request)
				+ "\\WEB-INF\\xml\\users_informations\\"
				+ username + "\\" + filename;
		// web-inf/xml/users_informations/username/dataSets.xml
		File file = new File(path);
		return file;
	}

	/**
	 * get xml file located in: web-inf/xml/
	 * 
	 * @param request
	 * @param filename xml filename such as "projects.xml"
	 * @return
	 * @Houzw at 2016年8月14日上午11:08:15
	 */
	public static File getWebappXmlFile(HttpServletRequest request, String filename)
	{
		String username = (String)request.getSession().getAttribute("username");
		String path = FileUtil.getAppPath(request) + "\\WEB-INF\\xml\\users_informations\\" + username + "\\" + username + "_" + filename;
		File file = new File(path);
		return file;
	}
	public static Element getXMLRootEl(File xmlFile) 
	{
		SAXBuilder sb = new SAXBuilder();
		Document doc = null;
		try
		{
			doc = sb.build("file:\\" + xmlFile);
		}
		catch (JDOMException e)
		{
			e.printStackTrace();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		Element root = doc.getRootElement();
		return root;
	}

	/**
	 * save your xml file
	 * 
	 * @param doc
	 * @param xmlFile
	 * @Houzw at 2016年8月11日下午4:01:39
	 */
	public static void saveXML(Document doc, File xmlFile)
	{
		try
		{
			// 创建xml文件输出流
			XMLOutputter xmlopt = new XMLOutputter();
			// 创建文件输出流
			FileWriter writer = new FileWriter(xmlFile);
			// 指定文档格式
			Format fm = Format.getPrettyFormat();
			fm.setEncoding("UTF-8");
			fm.setIndent("  ");
			xmlopt.setFormat(fm);
			// 将doc写入到指定的文件中
			xmlopt.output(doc, writer);
			writer.close();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	public static void saveXML(File xmlFile)
	{
		SAXBuilder sb = new SAXBuilder();
		try
		{
			Document doc = sb.build("file:" + xmlFile.getAbsolutePath());
			// 创建xml文件输出流
			XMLOutputter xmlopt = new XMLOutputter();
			// 创建文件输出流
			FileWriter writer = new FileWriter(xmlFile);
			// 指定文档格式
			Format fm = Format.getPrettyFormat();
			fm.setEncoding("UTF-8");
			fm.setIndent("  ");
			xmlopt.setFormat(fm);
			// 将doc写入到指定的文件中
			xmlopt.output(doc, writer);
			writer.close();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	public static void createDataSetXML(String xmlPath)
	{
		Element root = new Element("dataSets");
		Document doc = new Document(root);
		XMLUtil.saveXML(doc, new File(xmlPath));
		/*
		 * Format format = Format.getCompactFormat();
		 * format.setEncoding("UTF-8"); format.setIndent("  "); XMLOutputter
		 * XMLOut = new XMLOutputter(format); try { XMLOut.output(Doc, new
		 * FileOutputStream(xmlPath)); } catch (FileNotFoundException e) {
		 * e.printStackTrace(); } catch (IOException e) { e.printStackTrace(); }
		 */
	}
}
