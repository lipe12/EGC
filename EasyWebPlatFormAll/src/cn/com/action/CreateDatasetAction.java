package cn.com.action;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;

import util.Constants;
import util.XMLUtil;
import util.XMLUtil;
import com.googlecode.jsonplugin.annotations.JSON;

/** 
 * @author Houzw
 * @Description TODO   
 * @Createdate 2016年8月11日 下午12:03:36 
 */
public class CreateDatasetAction extends BaseAction
{
	private String[] datasets;
	private String[] datafiles;
	private String datasetname;
	private String projectName;

	private String north;
	private String south;
	private String west;
	private String east;
	// private String kmlPath;
	private String dataSetPath;
	private String username;
	private boolean flag;

	// start getter setter
	/**
	 * @return the datasets
	 */
	public String[] getDatasets()
	{
		return datasets;
	}

	/**
	 * @param datasets the datasets to set
	 */
	public void setDatasets(String[] datasets)
	{
		this.datasets = datasets;
	}

	/**
	 * @return the datafiles
	 */
	public String[] getDatafiles()
	{
		return datafiles;
	}

	/**
	 * @param datafiles the datafiles to set
	 */
	public void setDatafiles(String[] datafiles)
	{
		this.datafiles = datafiles;
	}
	/**
	 * @return the projectName
	 */
	public String getProjectName()
	{
		return projectName;
	}

	/**
	 * @param projectName the projectName to set
	 */
	public void setProjectName(String projectName)
	{
		this.projectName = projectName;
	}
	public void setFlag(boolean flag)
	{
		this.flag = flag;
	}

	public String getDatasetname()
	{
		return datasetname;
	}

	public void setDatasetname(String datasetname)
	{
		this.datasetname = datasetname;
	}

	// end

	// this param should be there, when submit form,
	// otherwise js will jump into success:handler.

	@JSON(name = "success")
	public boolean isFlag()
	{
		return flag;
	}

	public String createDatasets()
	{
		username = getUsername();
		// / begin
		String integer_random = this.createFixLenthString(6);
		String dot_random = this.createFixLenthString(6);
//		Integer int_north = new Integer(integer_random) + 1000;
//		Integer int_south = new Integer(integer_random) - 1000;
//		Integer int_west = new Integer(integer_random) - 1500;
//		Integer int_east = new Integer(integer_random) + 1500;

		north = "";
		south = "";
		west = "";
		east = "";
		createDataSet();
		// / end
		try
		{
			SAXBuilder sb = new SAXBuilder();
			Document filesdoc = null;
			// filesdoc = sb.build("file:" + File.separator + this.dataSetPath);
			filesdoc = sb.build(this.dataSetPath);
			XPath xPath = XPath.newInstance("dataSets/dataSet[datasetname=\"" + datasetname + "\"]");
			List<Element> files = (List<Element>) xPath.selectNodes(filesdoc);

			if (files.size() == 0)
			{
				updateDataSet();
				this.flag = true;
				System.out.println("flag: " + flag);
			}
			else
			{
				this.flag = false;
				System.out.println("flag: " + flag);
			}
		}
		catch (Exception e)
		{
			// TODO: handle exception
		}
		return SUCCESS;
	}

	/**
	 * @author lp write new dataset information into the dataset.xml
	 */
	private void updateDataSet()
	{
		SAXBuilder sb = new SAXBuilder();
		Document filesdoc = null;
		try
		{
			filesdoc = sb.build("file:\\" + this.dataSetPath);
			//filesdoc = sb.build("file:" + File.separator + this.dataSetPath);
			Element root = filesdoc.getRootElement();
			Element _dataSet = new Element("dataSet");
			// _dataSet.getParentElement();
			root.addContent(_dataSet);

			Element _datasetname = new Element("datasetname");
			_datasetname.setText(this.datasetname);
			Element _north = new Element("north");
			_north.setText(this.north);
			Element _south = new Element("south");
			_south.setText(this.south);
			Element _west = new Element("west");
			_west.setText(this.west);
			Element _east = new Element("east");
			_east.setText(this.east);
			Element _kmlpath = new Element("kmlpath");
			_kmlpath.setText("");
			_dataSet.addContent(_datasetname);
			_dataSet.addContent(_north);
			_dataSet.addContent(_south);
			_dataSet.addContent(_west);
			_dataSet.addContent(_east);
			_dataSet.addContent(_kmlpath);

			XMLUtil.saveXML(filesdoc, new File(this.dataSetPath));
			/*
			 * Format format = Format.getCompactFormat();
			 * format.setEncoding("UTF-8"); format.setIndent("  "); XMLOutputter
			 * xmlout = new XMLOutputter(format); File dataFiles = null;
			 * dataFiles = new File(this.dataSetPath); FileWriter filewriter =
			 * new FileWriter(dataFiles); xmlout.output(filesdoc, filewriter);
			 * filewriter.close();
			 */
		}
		catch (JDOMException e)
		{
			e.printStackTrace();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		 
	}

	/**
	 * @author lp judge the use`s folder have the dataset.xml if not
	 *         createdataset call createDataSetXML
	 */
	private void createDataSet()
	{
		HttpServletRequest request = ServletActionContext.getRequest();
		File file = XMLUtil.getUsersXmlFile(request, Constants.DATASETS_DOT_XML);
		dataSetPath = file.getAbsolutePath();
		// new File(dataSetPath);
		if (!file.exists())
		{
			createDataSetXML(dataSetPath);
		}
	}

	private void createDataSetXML(String xmlPath)
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

	private String createFixLenthString(int strLength)
	{
		Random rm = new Random();
		double pross = (1 + rm.nextDouble()) * Math.pow(10, strLength);
		String fixLenthString = String.valueOf(pross);
		return fixLenthString.substring(1, strLength + 1);
	}

	@SuppressWarnings("deprecation")
	public String removeDatasets()
	{
		HttpServletRequest request = ServletActionContext.getRequest();
		File datasetsXml = XMLUtil.getUsersXmlFile(request, Constants.DATASETS_DOT_XML);
		Element rootElement = XMLUtil.getXMLRootEl(datasetsXml);
		try
		{
			System.out.println("el.getText():");
			Element el = (Element) XPath.selectSingleNode(rootElement, "//dataSet[datasetname='" + datasetname + "']");
			if (el != null)
			{
				System.out.println("el.getText():");
				System.out.println(el.getText());
				rootElement.removeContent(el);
				XMLUtil.saveXML(datasetsXml);
			}
		}
		catch (JDOMException e)
		{
			e.printStackTrace();
		}
		this.flag = true;
		return SUCCESS;
	}

	/**
	 * 上传到project下的数据，同时也算作personal data，<br/>
	 * 但是上传到personal data的数据不能算作project data
	 * 
	 * @throws Exception
	 * 
	 * @Houzw at 2016年8月13日下午6:03:46
	 */
	public void uploadToProject()
	{

	}
	/**
	 * 往project添加数据
	 * 
	 * @throws JDOMException
	 * @Houzw at 2016年8月18日下午3:31:42
	 */
	public void addProjectData() throws Exception
	{
		username = getUsername();
		username = getUsername();
		HttpServletRequest request = ServletActionContext.getRequest();
		File file = XMLUtil.getWebappXmlFile(request, Constants.PROJECTS_DOT_XML);
		XPath userPath = XPath.newInstance("projects/project/creater");

		SAXBuilder sb = new SAXBuilder();
		Document projsdoc = null;
		Element proj = null;
		try
		{
			projsdoc = sb.build(file);
			Element root = projsdoc.getRootElement();
			List<Element> createrEls = (List<Element>) userPath.selectNodes(projsdoc);
			ListIterator<Element> createrElItr = createrEls.listIterator();
			while (createrElItr.hasNext())
			{
				Element createrEl = createrElItr.next();
				Element projEl = createrEl.getParentElement();
				if (createrEl.getValue().equals(username) && projEl.getChild("name").getValue().equals(projectName))
				{
					proj = projEl;
					break;
				}
			}
			if (datasets != null && datasets.length > 0)
			{
				Element datasetsEl = proj.getChild("datasets");
				if (datasetsEl == null)
				{
					proj.addContent(new Element("datasets"));
				}
				datasetsEl = proj.getChild("datasets");
				for (String dataset : datasets)
				{
					System.out.println(dataset);
					Element datasetEl = new Element("dataset");
					datasetEl.setText(dataset);
					if (datasetsEl.getChildren("dataset").size() == 0)
						datasetsEl.addContent(datasetEl);
					else if (!datasetsEl.getChildren("dataset").contains(datasetEl))
						datasetsEl.addContent(datasetEl);
				}
			}

			if (datafiles != null && datafiles.length > 0)
			{
				Element filesEl = proj.getChild("files");
				if (filesEl == null)
				{
					filesEl = new Element("files");
					proj.addContent(filesEl);
				}
				filesEl = proj.getChild("files");
				for (String datafile : datafiles)
				{
					System.out.println(datafile);
					Element dataEl = new Element("file");
					dataEl.setText(datafile);
					if (filesEl.getChildren("file").size() == 0)
						filesEl.addContent(dataEl);
					else if (!filesEl.getChildren("file").contains(dataEl))
						filesEl.addContent(dataEl);
				}
			}
			XMLUtil.saveXML(projsdoc, new File(file.getAbsolutePath()));
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("msg", SUCCESS);
			writeJson(com.alibaba.fastjson.JSON.toJSONString(map));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("msg", e.toString());
			writeJson(com.alibaba.fastjson.JSON.toJSONString(map));
		}

	}

	public void createProject()
	{
		username = getUsername();		
		HttpServletRequest request = ServletActionContext.getRequest();
		File file = XMLUtil.getWebappXmlFile(request, Constants.PROJECTS_DOT_XML);
		SAXBuilder sb = new SAXBuilder();
		Document projsdoc = null;
		try
		{
			projsdoc = sb.build(file);
			Element root = projsdoc.getRootElement();
			Element _proj = new Element("project");
			root.addContent(_proj);
			Element _projname = new Element("name");
			_projname.setText(this.projectName);
			Element _creater = new Element("creater");
			_creater.setText(username);
			_proj.addContent(_projname);
			_proj.addContent(_creater);
			XMLUtil.saveXML(projsdoc, new File(file.getAbsolutePath()));
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("msg", SUCCESS);
			writeJson(com.alibaba.fastjson.JSON.toJSONString(map));
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

	}
}
