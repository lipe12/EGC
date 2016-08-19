package cn.com.action;

import static util.Constants.CHILDREN;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.xpath.XPath;

import util.Constants;
import util.FileUtil;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * @author Houzw
 * @Description Data Management
 * @Createdate 2016年7月29日 上午11:54:29
 */
public class DataManageAction extends BaseAction
{

	private final JSONArray array = new JSONArray();

	/*
	 * public JSONArray getArray() { return array; } public void
	 * setArray(JSONArray array) { System.out.println("array:" +
	 * array.toString()); this.array = array; }
	 */

	private void setLeafValue(JSONObject setJsonObject, List<?> list)
	{
		if (list.size() > 0)
			setJsonObject.put(Constants.LEAF, false);
		else
			setJsonObject.put(Constants.LEAF, true);
	}

	/**
	 * append children node or not
	 * 
	 * @param setJsonObject
	 * @param childNodeString
	 * @Houzw at 2016年8月6日下午8:27:51
	 */
	private void childrenNode(JSONObject setJsonObject, String childNodeString)
	{
		if (!"[]".equals(childNodeString))
			setJsonObject.put(CHILDREN, childNodeString);
	}

	private void childrenNode(JSONObject setJsonObject, List<JSONObject> childNodejson)
	{
		if (childNodejson.size() > 0)
			setJsonObject.put(CHILDREN, childNodejson);
	}

	private void childrenNode(JSONObject setJsonObject, JSONArray childNodejson)
	{
		if (childNodejson != null)
			setJsonObject.put(CHILDREN, childNodejson);
	}

	@SuppressWarnings({ "unchecked", "deprecation" })
	public void returnTreeNodes() throws IOException
	{
		HttpServletRequest request = ServletActionContext.getRequest();
		Document filesdoc = null;
		String path = FileUtil.getXMLDirPath(request);
		String userString = (String) request.getSession().getAttribute(Constants.USERNAME);
		if (userString.equals("null") || StringUtils.isBlank(userString))
		{
			System.out.println("null");
			return;
			// return SUCCESS;
		}
		String setPath = path + File.separator + Constants.USERS_INFORMATIONS + File.separator + userString + File.separator + Constants.DATASETS_DOT_XML;
		String dataPath = path + File.separator + Constants.USERS_INFORMATIONS + File.separator + userString + File.separator + userString + Constants._DATAFILES_DOT_XML;
		String groupPath = path + File.separator + Constants.GROUPS_DOT_XML;
		String sharePath = path + File.separator + Constants.SHARES_DOT_XML;
		String projectPath = path + File.separator + "projects.xml";

		List<String> parantNodes = new ArrayList<String>();
		parantNodes.add(Constants.PERSONAL_DATA);
		parantNodes.add(Constants.GROUP_DATA);
		parantNodes.add(Constants.SHARED_DATA);
		parantNodes.add(Constants.PROJECTS);
		for (int m = 0; m < parantNodes.size(); m++)
		{
			SAXBuilder sb = new SAXBuilder();
			String idString = parantNodes.get(m);
			JSONObject jsonObject = new JSONObject();
			jsonObject.put(Constants.ID, idString);
			jsonObject.put(Constants.TEXT, idString);
			jsonObject.put(Constants.LEAF, false);
			jsonObject.put(Constants.TYPE, "data category");
			// jsonObject.put(Constants.CHECKED, false);
			JSONArray jsonArray = new JSONArray();
			if (m == 0)// PERSONAL_DATA
			{
				try
				{
					XPath xpath = XPath.newInstance("dataSets/dataSet");
					filesdoc = sb.build("File:" + setPath);
					if (filesdoc == null)
					{
						continue;
					}
					Document dataDoc = sb.build("File:" + dataPath);
					List<Element> dataSets = (List<Element>) xpath.selectNodes(filesdoc);
					for (int i = 0; i < dataSets.size(); i++)
					{
						Element dataSet = dataSets.get(i);
						Element dataSetName = dataSet.getChild("datasetname");
						String SetName = dataSetName.getValue();
						JSONObject setJsonObject = new JSONObject();
						setJsonObject.put(Constants.ID, idString + "-" + (i + 1));
						setJsonObject.put(Constants.TEXT, SetName);
						setJsonObject.put(Constants.TYPE, "dataset");
						setJsonObject.put(Constants.UPLOADER, userString);
						setJsonObject.put(Constants.CHECKED, false);
						XPath xPath2 = XPath.newInstance("files/file[datasetName='" + SetName + "']");
						List<Element> datafiles = (List<Element>) xPath2.selectNodes(dataDoc);
						setLeafValue(setJsonObject, datafiles);
						List<JSONObject> datafileList = new ArrayList<JSONObject>();
						for (int j = 0; j < datafiles.size(); j++)
						{
							Element dataFileElement = datafiles.get(j);
							String datasetNameString = dataFileElement.getChild("datasetName").getValue();

							if (datasetNameString.equals(SetName))
							{
								Element dataNameElement = dataFileElement.getChild("fileName");
								Element typeElement = dataFileElement.getChild("type");
								Element formatElement = dataFileElement.getChild("format");
								Element semanticElement = dataFileElement.getChild("semantic");
								String dataNameString = dataNameElement.getValue();
								String[] splitDataPathStrings = dataNameString.split("/");
								int len = splitDataPathStrings.length;
								if (len > 0)
								{
									String dataName = splitDataPathStrings[len - 1];
									String nameString = dataName.split("\\.")[0];
									JSONObject datafile = new JSONObject();
									datafile.put(Constants.ID, idString + "-" + (i + 1) + "-" + (j + 1));
									datafile.put(Constants.TEXT, nameString);
									datafile.put(Constants.LEAF, true);
									datafile.put(Constants.UPLOADER, userString);
									datafile.put(Constants.CHECKED, false);
									String typeString = typeElement.getValue();
									datafile.put(Constants.TYPE, typeString);
									String formatString = formatElement.getValue();
									datafile.put(Constants.FORMAT, formatString);
									String semanticString = semanticElement.getValue();
									datafile.put(Constants.SEMANTIC, semanticString);

									datafileList.add(datafile);
								}
							}
						}
						childrenNode(setJsonObject, datafileList);
						jsonArray.add(setJsonObject);
					}
					childrenNode(jsonObject, jsonArray);
					array.add(jsonObject);
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}
			}
			else if (m == 1)// GROUP_DATA
			{
				try
				{
					filesdoc = sb.build("File:" + groupPath);
					// find <member> by <username>'s value
					XPath userxPath = XPath.newInstance("groups/group/member[username='" + userString + "']");
					List<Element> users = (List<Element>) userxPath.selectNodes(filesdoc);
					int g = 0;
					for (Element user : users)
					{
						g++;
						Element group = user.getParentElement();// <group>
						Element groupname = group.getChild("groupname");
						JSONObject groupObj = new JSONObject();
						groupObj.put(Constants.ID, idString + "-" + g);
						groupObj.put(Constants.TEXT, groupname.getValue());
						groupObj.put(Constants.TYPE, "group");
						// groupObj.put(Constants.CHECKED, false);
						List<Element> members = group.getChildren("member");
						int y = 0;
						JSONArray memberarray = new JSONArray();
						for (Element member : members)
						{
							Element _usernameEl = member.getChild("username");
							String _username = _usernameEl.getText();
							SAXBuilder sb1 = new SAXBuilder();
							// username/dataSets.xml
							String userDataSetPath = path + "\\users_informations\\" + _username;
							Document dataSetDoc = sb1.build("file:\\" + userDataSetPath + "\\dataSets.xml");
							// username_dataFiles.xml
							Document dataDoc = sb1.build("file:\\" + userDataSetPath + File.separator + _username + "_dataFiles.xml");
							// find <dataSet> from dataSets.xml
							XPath userDataSet = XPath.newInstance("dataSets/dataSet");
							List<Element> dataSets = (List<Element>) userDataSet.selectNodes(dataSetDoc);

							for (int i = 0; i < dataSets.size(); i++)
							{
								Element dataSet = dataSets.get(i);
								Element dataSetName = dataSet.getChild("datasetname");
								String userDataSetName = dataSetName.getText();
								JSONObject setJsonObject = new JSONObject();
								y = y + i + 1;
								setJsonObject.put(Constants.ID, idString + "-" + g + "-" + y);
								setJsonObject.put(Constants.TEXT, userDataSetName);
								setJsonObject.put(Constants.TYPE, "dataset");
								setJsonObject.put(Constants.UPLOADER, _username);
								setJsonObject.put(Constants.CHECKED, false);
								XPath xPath2 = XPath.newInstance("files/file[datasetName='" + userDataSetName + "']");
								List<Element> datafiles = (List<Element>) xPath2.selectNodes(dataDoc);
								setLeafValue(setJsonObject, datafiles);
								List<JSONObject> datafileList = new ArrayList<JSONObject>();
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
										datafile.put(Constants.ID, idString + "-" + g + "-" + (y) + "-" + (k + 1));
										datafile.put(Constants.TEXT, nameString);
										datafile.put(Constants.LEAF, true);
										datafile.put(Constants.UPLOADER, _username);
										datafile.put(Constants.CHECKED, false);
										String typeString = dataFileElement.getChild("type").getValue();
										datafile.put(Constants.TYPE, typeString);
										String formatString = dataFileElement.getChild("format").getValue();
										datafile.put(Constants.FORMAT, formatString);
										String semanticString = dataFileElement.getChild("semantic").getValue();
										datafile.put(Constants.SEMANTIC, semanticString);
										datafileList.add(datafile);
									}
								}
								childrenNode(setJsonObject, datafileList);
								memberarray.add(setJsonObject);
							}
						}
						childrenNode(groupObj, memberarray);
						jsonArray.add(groupObj);
						childrenNode(jsonObject, jsonArray);
					}
					array.add(jsonObject);
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}
			}
			else if (m == 2)// SHARED_DATA
			{
				try
				{
					filesdoc = sb.build("File:" + sharePath);
					XPath xPath = XPath.newInstance("datasets/dataset");
					List<Element> dataSets = (List<Element>) xPath.selectNodes(filesdoc);
					JSONArray jsonArray2 = new JSONArray();
					for (int i = 0; i < dataSets.size(); i++)
					{
						Element dataSet = dataSets.get(i);
						String dataSetName = dataSet.getChild("datasetname").getValue();
						String upLoader = dataSet.getChild("upLoader").getValue();
						JSONObject setJsonObject = new JSONObject();
						setJsonObject.put(Constants.ID, idString + "-" + (i + 1));
						setJsonObject.put(Constants.TEXT, dataSetName);
						setJsonObject.put(Constants.TYPE, "dataset");
						setJsonObject.put(Constants.UPLOADER, upLoader);
						setJsonObject.put(Constants.CHECKED, false);
						String userDataPath = path + "\\users_informations\\" + upLoader + File.separator + upLoader + "_dataFiles.xml";
						SAXBuilder sb1 = new SAXBuilder();
						Document userDataFile = sb1.build("File:" + userDataPath);
						XPath userDataXPath = XPath.newInstance("files/file[datasetName ='" + dataSetName + "']");
						List<Element> userDatas = (List<Element>) userDataXPath.selectNodes(userDataFile);
						setLeafValue(setJsonObject, userDatas);
						List<JSONObject> jsonList = new ArrayList<JSONObject>();
						for (int j = 0; j < userDatas.size(); j++)
						{
							Element userData = userDatas.get(j);
							String _userDataPath = userData.getChild("fileName").getValue();
							String[] splitUserDataPath = _userDataPath.split("/");
							int len = splitUserDataPath.length;
							String dataName = splitUserDataPath[len - 1].split("\\.")[0];
							JSONObject dataJsonObject = new JSONObject();
							dataJsonObject.put(Constants.ID, idString + "-" + (i + 1) + "-" + (j + 1));
							dataJsonObject.put(Constants.TEXT, dataName);
							dataJsonObject.put(Constants.LEAF, true);
							dataJsonObject.put(Constants.UPLOADER, upLoader);
							dataJsonObject.put(Constants.CHECKED, false);
							String typeString = userData.getChild("type").getValue();
							dataJsonObject.put(Constants.TYPE, typeString);
							String formatString = userData.getChild("format").getValue();
							dataJsonObject.put(Constants.FORMAT, formatString);
							String semanticString = userData.getChild("semantic").getValue();
							dataJsonObject.put(Constants.SEMANTIC, semanticString);
							jsonList.add(dataJsonObject);
						}
						childrenNode(setJsonObject, jsonList);
						jsonArray2.add(setJsonObject);
					}
					childrenNode(jsonObject, jsonArray2);
					array.add(jsonObject);
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}
			}
			else if (m == 3)// PROJECTS
			{
				try
				{
					SAXBuilder s = new SAXBuilder();
					Document projsdoc = sb.build("File:" + projectPath);
					filesdoc = s.build("file:" + dataPath);// username?
					// get projects through creater
					XPath projPath = XPath.newInstance("projects/project");
					List<Element> allprojs = (List<Element>) projPath.selectNodes(projsdoc);
					List<Element> projs = new ArrayList<Element>();
					for (Element proj : allprojs)
					{
						String creater = proj.getChild("creater").getValue();
						if (userString.equals(creater))
							projs.add(proj);
					}
					JSONArray jArray = new JSONArray();
					// projects-(user:creater)-project-datasets-dataset-datafile
					//
					int y = 0;
					for (Element proj : projs)
					{
						String projName = proj.getChild("name").getValue();
						JSONObject projObj = new JSONObject();
						projObj.put(Constants.ID, idString + "-" + (y + 1));
						projObj.put(Constants.TEXT, projName);
						projObj.put(Constants.TYPE, "project");
						List<JSONObject> jsonObjects = new ArrayList<JSONObject>();
						if (proj.getChild("datasets") == null && proj.getChild("files") == null)
						{
							projObj.put(Constants.LEAF, true);
						}
						if (proj.getChild("datasets") != null)
						{
							projObj.put(Constants.LEAF, false);
							List<Element> datasets = proj.getChild("datasets").getChildren("dataset");
							y++;
							for (int i = 0; i < datasets.size(); i++)
							{
								Element dataset = datasets.get(i);
								JSONObject obj = new JSONObject();
								String datasetName = dataset.getValue();
								obj.put(Constants.ID, idString + "-" + y + "-" + (i + 1));
								obj.put(Constants.TEXT, datasetName);
								obj.put(Constants.TYPE, "dataset");
								obj.put(Constants.UPLOADER, userString);
								XPath xPath2 = XPath.newInstance("files/file[datasetName='" + datasetName + "']");
								List<Element> datafiles = (List<Element>) xPath2.selectNodes(filesdoc);
								setLeafValue(obj, datafiles);
								List<JSONObject> datafileList = new ArrayList<JSONObject>();
								for (int k = 0; k < datafiles.size(); k++)
								{
									Element dataFileElement = datafiles.get(k);
									String datasetNameString = dataFileElement.getChild("datasetName").getValue();
									if (datasetNameString.equals(datasetName))
									{
										Element dataNameElement = dataFileElement.getChild("fileName");
										String dataNameString = dataNameElement.getValue();
										String[] splitDataPathStrings = dataNameString.split("/");
										int len = splitDataPathStrings.length;
										String dataName = splitDataPathStrings[len - 1];
										String nameString = dataName.split("\\.")[0];
										JSONObject datafile = new JSONObject();
										datafile.put(Constants.ID, idString + "-" + y + "-" + (i + 1) + "-" + (k + 1));
										datafile.put(Constants.TEXT, nameString);
										datafile.put(Constants.LEAF, true);
										datafile.put(Constants.UPLOADER, userString);
										String typeString = dataFileElement.getChild("type").getValue();
										datafile.put(Constants.TYPE, typeString);
										String formatString = dataFileElement.getChild("format").getValue();
										datafile.put(Constants.FORMAT, formatString);
										String semanticString = dataFileElement.getChild("semantic").getValue();
										datafile.put(Constants.SEMANTIC, semanticString);
										datafileList.add(datafile);
									}
								}
								childrenNode(obj, datafileList);
								jsonObjects.add(obj);
							}
							childrenNode(projObj, jsonObjects);
						}
						if (proj.getChild("files") != null)
						{
							projObj.put(Constants.LEAF, false);
							List<Element> files = proj.getChild("files").getChildren("file");
							y++;
							for (int i = 0; i < files.size(); i++)
							{
								Element file = files.get(i);
								JSONObject obj = new JSONObject();
								String fileName = file.getValue();
								String user = fileName.substring(0, fileName.indexOf("/"));
								fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
								obj.put(Constants.ID, idString + "-" + y + "-" + (i + 1));
								// 补充？：读取username_datafiles.xml数据文件，获取数据相关内容
								obj.put(Constants.TEXT, fileName);
								obj.put(Constants.TYPE, "datafile");
								obj.put(Constants.LEAF, true);
								obj.put(Constants.UPLOADER, user);
								jsonObjects.add(obj);
							}
							childrenNode(projObj, jsonObjects);
						}
						jArray.add(projObj);
					}
					childrenNode(jsonObject, jArray);
					array.add(jsonObject);
				}
				catch (JDOMException e)
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		writeJson(array.toJSONString());
		// return SUCCESS;
	}
}