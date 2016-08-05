package cn.com.action;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;

import util.FileUtil;

import com.opensymphony.xwork2.ActionSupport;

/**
 * @author Houzw
 * @Description Data Management
 * @Createdate 2016年7月29日 上午11:54:29
 */
public class DataManageAction extends ActionSupport
{
	private JSONArray array = new JSONArray();

	public JSONArray getArray()
	{
		return array;
	}

	public void setArray(JSONArray array)
	{
		this.array = array;
	}

	public String returnTreeNodes()
	{
		HttpServletRequest request = ServletActionContext.getRequest();

		SAXBuilder sb = new SAXBuilder();
		Document filesdoc = null;
		String path = FileUtil.getXMLDirPath(request);
		String userString = (String) request.getSession().getAttribute("username");
		String setPath = path + File.separator + "users_informations" + File.separator + userString + File.separator + "dataSets.xml";
		String dataPath = path + File.separator + "users_informations" + File.separator + userString + File.separator + userString + "_dataFiles.xml";
		String groupPath = path + File.separator + "groups.xml";
		String sharePath = path + File.separator + "shares.xml";

		List<String> parantNodes = new ArrayList<String>();
		parantNodes.add("personnal data");
		parantNodes.add("group data");
		parantNodes.add("shared data");
		for (int m = 0; m < parantNodes.size(); m++)
		{
			String idString = parantNodes.get(m);
			JSONObject jsonObject = new JSONObject();
			jsonObject.element("id", idString);
			jsonObject.element("text", idString);
			jsonObject.element("leaf", false);
			JSONArray jsonArray = new JSONArray();
			if ("personnal data".equals(idString))
			{
				try
				{
					XPath xpath = XPath.newInstance("dataSets/dataSet");
					filesdoc = sb.build("File:" + setPath);
					Document dataDoc = sb.build("File:" + dataPath);
					List<Element> dataSets = (List<Element>) xpath.selectNodes(filesdoc);
					for (int i = 0; i < dataSets.size(); i++)
					{
						Element dataSet = dataSets.get(i);
						Element dataSetName = dataSet.getChild("datasetname");
						String SetName = dataSetName.getValue();
						JSONObject setJsonObject = new JSONObject();
						setJsonObject.element("id", idString + "-" + (i + 1));
						setJsonObject.element("text", SetName);

						XPath xPath2 = XPath.newInstance("files/file[datasetName='" + SetName + "']");
						List<Element> datafiles = (List<Element>) xPath2.selectNodes(dataDoc);
						if (datafiles.size() > 0)
							setJsonObject.element("leaf", false);
						else
						{
							setJsonObject.element("leaf", true);
						}
						String childNodeString = "[";
						for (int j = 0; j < datafiles.size(); j++)
						{

							Element dataFileElement = datafiles.get(j);
							String datasetNameString = dataFileElement.getChild("datasetName").getValue();

							if (datasetNameString.equals(SetName))
							{
								Element dataNameElement = dataFileElement.getChild("fileName");
								String dataNameString = dataNameElement.getValue();
								String[] splitDataPathStrings = dataNameString.split("/");
								int len = splitDataPathStrings.length;
								if (len > 0)
								{
									String dataName = splitDataPathStrings[len - 1];
									String nameString = dataName.split("\\.")[0];
									JSONObject datafile = new JSONObject();
									datafile.element("id", idString + "-" + (i + 1) + "-" + (j + 1));
									datafile.element("text", nameString);
									datafile.element("leaf", true);
									String datafileString = datafile.toString();
									if (childNodeString.equals("["))
									{
										childNodeString = childNodeString + datafileString;
									}
									else
									{
										childNodeString = childNodeString + "," + datafileString;
									}
								}
							}
						}
						childNodeString = childNodeString + "]";
						System.out.println(childNodeString);
						if (!"[]".equals(childNodeString))
							setJsonObject.element("children", childNodeString);
						jsonArray.add(setJsonObject);
					}
					String childrenString = jsonArray.toString();
					jsonObject.element("children", childrenString);
					array.add(jsonObject);
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}

			}
			else if (idString.equals("group data"))
			{

				try
				{
					filesdoc = sb.build("File:" + groupPath);
					XPath xPath = XPath.newInstance("groups/group/member[username='" + userString + "']");
					List<Element> uses = (List<Element>) xPath.selectNodes(filesdoc);
					for (Element memberIncludeUser : uses)
					{
						Element group = memberIncludeUser.getParentElement();
						Element groupname = group.getChild("groupname");
						List<Element> members = group.getChildren("member");
						int y = 0;
						for (Element member : members)
						{
							Element _username = member.getChild("username");
							String a = _username.getText();
							SAXBuilder sb1 = new SAXBuilder();
							String userDataSetPath = path + File.separator + "users_informations" + File.separator + _username.getText();
							Document dataSetDoc = sb1.build("file:" + File.separator + userDataSetPath + File.separator + "dataSets.xml");
							Document dataDoc = sb1.build("File:" + File.separator + userDataSetPath + File.separator + a + "_dataFiles.xml");
							XPath userDataSet = XPath.newInstance("dataSets/dataSet");
							List<Element> dataSets = (List<Element>) userDataSet.selectNodes(dataSetDoc);
							String childNodeString = "[";
							for (int i = 0; i < dataSets.size(); i++)
							{
								Element dataSet = dataSets.get(i);
								Element dataSetName = dataSet.getChild("datasetname");
								String userDataSetName = dataSetName.getText();
								JSONObject setJsonObject = new JSONObject();
								y = y + i + 1;
								setJsonObject.element("id", idString + "-" + (y));
								setJsonObject.element("text", userDataSetName);
								XPath xPath2 = XPath.newInstance("files/file[datasetName='" + userDataSetName + "']");
								List<Element> datafiles = (List<Element>) xPath2.selectNodes(dataDoc);
								if (datafiles.size() > 0)
									setJsonObject.element("leaf", false);
								else
									setJsonObject.element("leaf", true);
								for (int k = 0; k < datafiles.size(); k++)
								{
									Element dataFileElement = datafiles.get(k);
									String datasetNameString = dataFileElement.getChild("datasetName").getValue();
									if (datasetNameString.equals(userDataSetName))
									{
										Element dataNameElement = dataFileElement.getChild("fileName");
										String dataNameString = dataNameElement.getValue();
										String[] splitDataPathStrings = dataNameString.split("/");
										int len = splitDataPathStrings.length;
										String dataName = splitDataPathStrings[len - 1];
										String nameString = dataName.split("\\.")[0];
										JSONObject datafile = new JSONObject();
										datafile.element("id", idString + "-" + (y) + "-" + (k + 1));
										datafile.element("text", nameString);
										datafile.element("leaf", true);
										String datafileString = datafile.toString();
										if (childNodeString.equals("["))
										{
											childNodeString = childNodeString + datafileString;
										}
										else
										{
											childNodeString = childNodeString + "," + datafileString;
										}
									}
								}
								childNodeString = childNodeString + "]";
								if (!"[]".equals(childNodeString))
									setJsonObject.element("children", childNodeString);
								setJsonObject.element("children", childNodeString);
								jsonArray.add(setJsonObject);
							}
							String childrenString = jsonArray.toString();
							jsonObject.element("children", childrenString);
						}
						array.add(jsonObject);
					}
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}

			}
			else if (idString.equals("shared data"))
			{
				try
				{
					filesdoc = sb.build("File:" + sharePath);
					XPath xPath = XPath.newInstance("datasets/dataset");
					List<Element> dataSets = (List<Element>) xPath.selectNodes(filesdoc);
					for (int i = 0; i < dataSets.size(); i++)
					{
						Element dataSet = dataSets.get(i);
						String dataSetName = dataSet.getChild("datasetname").getValue();
						String upLoader = dataSet.getChild("upLoader").getValue();
						JSONObject setJsonObject = new JSONObject();
						setJsonObject.element("id", idString + "-" + (i + 1));
						setJsonObject.element("text", dataSetName);
						String userDataPath = path + File.separator + "users_informations" + File.separator + upLoader + File.separator + upLoader + "_dataFiles.xml";
						SAXBuilder sb1 = new SAXBuilder();
						Document userDataFile = sb.build("File:" + userDataPath);
						XPath userDataXPath = XPath.newInstance("files/file[datasetName ='" + dataSetName + "']");
						List<Element> userDatas = (List<Element>) userDataXPath.selectNodes(userDataFile);
						if (userDatas.size() > 0)
							setJsonObject.element("leaf", false);
						else
							setJsonObject.element("leaf", true);
						String childNodeString = "[";
						for (int j = 0; j < userDatas.size(); j++)
						{
							Element userData = userDatas.get(j);
							String _userDataPath = userData.getChild("fileName").getValue();
							String[] splitUserDataPath = _userDataPath.split("/");
							int len = splitUserDataPath.length;
							String dataName = splitUserDataPath[len - 1].split("\\.")[0];
							JSONObject dataJsonObject = new JSONObject();
							dataJsonObject.element("id", idString + "-" + (i + 1) + "-" + (j + 1));
							dataJsonObject.element("text", dataName);
							dataJsonObject.element("leaf", true);
							String datafileString = dataJsonObject.toString();
							if (childNodeString.equals("["))
							{
								childNodeString = childNodeString + datafileString;
							}
							else
							{
								childNodeString = childNodeString + "," + datafileString;
							}
						}
						childNodeString = childNodeString + "]";
						if (!"[]".equals(childNodeString))
							setJsonObject.element("children", childNodeString);
						setJsonObject.element("children", childNodeString);
						jsonArray.add(setJsonObject);
					}
					String childrenString = jsonArray.toString();
					jsonObject.element("children", childrenString);
					array.add(jsonObject);
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}
			}
		}
		return SUCCESS;
	}

}
