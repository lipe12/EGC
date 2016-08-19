package cn.com.action;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;

import util.Constants;
import util.XMLUtil;

/**
 * @author Houzw
 * @Description kml file path actions
 * @Createdate 2016年8月17日 下午9:50:09
 */
public class KMLAction extends BaseAction implements ServletRequestAware
{
	private String username;
	private String datasetName;
	private String dataCategory;// Projects/Shared Data/Group Data/Personal Data
	private HttpServletRequest request;

	public void getKmlPath()
	{

	}

	@SuppressWarnings("deprecation")
	public String getDatasetCreater() throws Exception, IOException
	{
		username = (String) request.getSession().getAttribute(Constants.USERNAME);
		String creater = username;// default
		SAXBuilder sb = new SAXBuilder();
		if (Constants.PERSONAL_DATA.equals(dataCategory))
		{
			// File groupXml = XMLUtil.getWebappXmlFile(request,
			// Constants.GROUPS_DOT_XML);
			File userXml = XMLUtil.getUsersXmlFile(request, Constants.DATASETS_DOT_XML);
			Document userXmlDoc = sb.build(userXml);
			XPath xpath = XPath.newInstance("dataSets/dataSet/datasetname=" + datasetName + "]");
			Element dataset = (Element) xpath.selectSingleNode(userXmlDoc);
			dataset.getChild("kmlpath");

		}
		return creater;
	}
	// start getter setter
	/**
	 * @return the dataCategory
	 */
	public String getDataCategory()
	{
		return dataCategory;
	}

	/**
	 * @param dataCategory the dataCategory to set
	 */
	public void setDataCategory(String dataCategory)
	{
		this.dataCategory = dataCategory;
	}

	/**
	 * @return the datasetName
	 */
	public String getDatasetName()
	{
		return datasetName;
	}

	/**
	 * @param datasetName the datasetName to set
	 */
	public void setDatasetName(String datasetName)
	{
		this.datasetName = datasetName;
	}

	/**
	 * @return the username
	 */
	@Override
	public String getUsername()
	{
		return username;
	}

	/**
	 * @param username the username to set
	 */
	public void setUsername(String username)
	{
		this.username = username;
	}

	@Override
	public void setServletRequest(HttpServletRequest request)
	{
		this.setRequest(request);
	}


	/**
	 * @return the request
	 */
	public HttpServletRequest getRequest()
	{
		return request;
	}

	/**
	 * @param request the request to set
	 */
	public void setRequest(HttpServletRequest request)
	{
		this.request = request;
	}
	// end
}
