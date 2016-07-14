package tutorial;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import jdk.nashorn.internal.runtime.FindProperty;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import xmlUtility.xmlUtility_dom;

import com.opensymphony.xwork2.ActionSupport;
public class MatchModel extends ActionSupport{
	int tag = 0;
	/**
	 * @param doc {Docunment} the request xml
	 * @param tasknames {List<String>} the request tasknames
	 * 
	 * */
	public String matchPreciousModel(Document doc, List<String> tasknames) {
		List<String> tmpTask = new ArrayList<String>(); //use to store the same task
		Document doc_process = doc;  //use to delete the task that can use the precious task
		HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    String user = (String)request.getSession().getAttribute("username");
	    path = path + File.separator + "users_informations" + File.separator + user + File.separator + "preciousmodel.xml";
	    File file = new File(path);
	    SAXBuilder sb = new SAXBuilder();
	    if (!file.exists()) {
			createDataSetXML(path);
		}
	    else {
	    	
	    	 try {
	    		 Document filesdoc = sb.build("file:" + File.separator + path);
				XPath xPath = XPath.newInstance("model/task");
				List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
				List<Element> preciousTaskElements = (List<Element>)xPath.selectNodes(doc);
				Element rootElement = doc_process.getRootElement();
				for(Element task:taskElements)
				{

					String taskNameString = task.getAttributeValue("taskName");
					// judge whether is a start node of this model
					boolean flag = hasPreciousTask(taskNameString, doc);       
					if (flag == true) {                                          // if this is one start node                
						int numInputData = 0;
						int sameInputData = 0;
						// find the node input and output data(also param)
						List<Element> dataElements = task.getChild("algorithm").getChildren("data");       
						for(Element dataElement: dataElements)
						{
							//get the datakind of every data element
							
							Element dataKindElement = dataElement.getChild("dataKind");                     
							if (dataKindElement.getValue().equals("InputData")) {                          //if the datakind is input data
								numInputData = numInputData + 1;
								// get the input data value(the data positon and name)
								String dataValueString = dataElement.getChild("dataValue").getValue();     
								//judge the request model start node if have the same input data position and name
								boolean tag = hasSameInputValue(dataValueString, filesdoc);             
								if (tag) {                                                               //if they have the same input
									sameInputData = sameInputData + 1;
									// get this data Name node value
									//String dataNameString = dataElement.getChild("dataName").getValue();   
									// get this next tasks of this start task
									//List<Element> nextTasks = getNextTask(dataNameString, doc);  
									//judge whether has next tasks
									//if (nextTasks.size() > 0) {
										//for(Element dataElement2 : nextTasks){
											//Element taskElement = dataElement2.getParentElement().getParentElement();
											
										//}
									//}
								}
								
							}
						}
						if (numInputData == sameInputData) {
							tmpTask.add(taskNameString);
							rootElement.removeContent(task);
						}
					}else if (flag == false) {
						int tmp_tag1 = 0;
						int tmp_tag2 = 0;
						
						String taskNameString2 = task.getAttributeValue("taskName");
						boolean isInOldTask = isInOldModel(taskNameString2, filesdoc);
						if (isInOldTask) {
							List<Element> inputDatas = getPreciousTask(taskNameString2, doc);
							for(Element inputData: inputDatas){
								tmp_tag1 = tmp_tag1 + 1;
								Element taskElement = inputData.getParentElement().getParentElement();
								String taskNameString3 = taskElement.getAttributeValue("taskName");
								if (tmpTask.contains(taskNameString3)) {
									tmp_tag2 = tmp_tag2 + 1;
								}
							}
							if (tmp_tag1 == tmp_tag2) {
								tmpTask.add(taskNameString);
								rootElement.removeContent(task);
								List<Element> nextTasks = getNextTasks(taskNameString, doc);
								List<String> outPutResults = findOldOutputs(taskNameString, filesdoc);
								List<String> outputDataNames = new ArrayList<String>();
								List<String> outputDataValues = new ArrayList<String>();
								for(String outputResult : outPutResults){
									String outputDataName = outputResult.split(":")[0];
									String outputDataValue = outputResult.split(":")[1];
									outputDataNames.add(outputDataName);
									outputDataValues.add(outputDataValue);
								}
								for(Element nextTask : nextTasks){
									List<Element>nextTaskDatas = nextTask.getChild("algorithm").getChildren("data");
									for (Element nextTaskData : nextTaskDatas) {
										String nextTaskDataKind = nextTaskData.getChild("dataKind").getValue();
										if (nextTaskDataKind.equals("InputData")) {
											String nextTaskDataName = nextTaskData.getChild("dataName").getValue();
											if (outputDataNames.contains(nextTaskDataName)) {
												Element nextTaskDataValue = nextTaskData.getChild("dataValue");
												int i = outputDataNames.indexOf(nextTaskDataName);
												nextTaskDataValue.setText(outputDataValues.get(i));
											}
										}
									}
								}
								//TODO: add new data value
							}
						}
						
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
	    	
		}
	    return SUCCESS;
	}
/**
 * judge whether this taskNode is the start node
 * @param taskName {String} 
 * @param doc {Document} the request document
 * */
	public boolean hasPreciousTask(String taskName, Document doc) {
		boolean tag = false;
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element>tasks = (List<Element>)xPath.selectNodes(doc);
			for(Element task: tasks)
			{
				String tasknameString = task.getAttributeValue("taskName ");
				if (tasknameString.equals(taskName)) {
					Element algorithmElement = task.getChild("algorithm ");
					List<Element> dataElements = algorithmElement.getChildren();
					for (Element dataElement : dataElements) {
						String datakindString = dataElement.getChild("dataKind").getValue();
						if (datakindString.equals("InputData")) {
							String dataName = dataElement.getChild("dataName").getValue();
							try {
								XPath xp = XPath.newInstance("model/task/algorithm/data[dataName='" + dataName + "']");
								List<Element> datas = (List<Element>)xp.selectNodes(doc);
								if (datas.size() == 1) {
									tag = true;
								}
							} catch (Exception e) {
								// TODO: handle exception
							}
						}
					}
				}
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		return tag;
	}
	private void createDataSetXML(String xmlPath){
		
        Element root = new Element("model");  
        Document Doc = new Document(root);  
        Format format = Format.getCompactFormat();   
	    format.setEncoding("UTF-8");  
	    format.setIndent("  ");     
        XMLOutputter XMLOut = new XMLOutputter(format);  

        try {
			XMLOut.output(Doc, new FileOutputStream(xmlPath));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}  
	}
	public boolean hasSameInputValue(String inputValue, Document doc) {
		boolean tag = false;
		try {
			XPath xPath = XPath.newInstance("model/task/algorithm/data[dataValue=\""+ inputValue +"\"]");
			List<Element> dataElement = (List<Element>)xPath.selectSingleNode(doc);
			if (dataElement.size() > 0) {
				tag = true;
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		return tag;
	}
/**
 * get the next tasks
 * @param taskname {String}
 * @param doc {Document} the request xml
 * */
	public List<Element> getNextTasks(String taskname, Document doc) {
		List<Element> nextTasks = new ArrayList<Element>();
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
			for(Element taskElement: taskElements){
				String taskNameString = taskElement.getAttributeValue("taskName");
				if (taskNameString.equals(taskname)) {
					List<Element> datas = (List<Element>)taskElement.getChild("algorithm").getChild("data");
					for(Element data: datas){
						String dataKindString = data.getChild("dataKind").getValue();
						if (dataKindString.equals("OutputData")) {
							String dataName = data.getChild("dataName").getValue();
							try {
								XPath xPath2 = XPath.newInstance("model/task/algorithm/data[dataName=\""+ dataName +"\"]");
								List<Element> inputDatas = (List<Element>)xPath2.selectNodes(doc);
								for(Element inputdata:inputDatas){
									String dataKind1 = inputdata.getChild("dataKind").getValue();
									if (dataKind1.equals("InputData")) {
										nextTasks.add(inputdata);
									}
								}
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return nextTasks;
	}
	/**
	 * get the precious tasks
	 * @param taskname {String}
	 * @param doc {Document} the request xml
	 * */	
	public List<Element> getPreciousTask(String taskname, Document doc) {
		List<Element> nextTasks = new ArrayList<Element>();
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
			for(Element taskElement: taskElements){
				String taskNameString = taskElement.getAttributeValue("taskName");
				if (taskNameString.equals(taskname)) {
					List<Element> datas = (List<Element>)taskElement.getChild("algorithm").getChild("data");
					for(Element data: datas){
						String dataKindString = data.getChild("dataKind").getValue();
						if (dataKindString.equals("InputData")) {
							String dataName = data.getChild("dataName").getValue();
							try {
								XPath xPath2 = XPath.newInstance("model/task/algorithm/data[dataName=\""+ dataName +"\"]");
								List<Element> inputDatas = (List<Element>)xPath2.selectNodes(doc);
								for(Element inputdata:inputDatas){
									String dataKind1 = inputdata.getChild("dataKind").getValue();
									if (dataKind1.equals("OutputData")) {
										nextTasks.add(inputdata);
									}
								}
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return nextTasks;
	}

/**
 * judge whether the task is in the old task
 * @param taskName {String}
 * @param doc {Document} the old record model
 * */
	public boolean isInOldModel(String taskName, Document doc) {
		boolean tag = false;
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> tasks = (List<Element>)xPath.selectNodes(doc);
			if (tasks.size() > 0) {
				tag = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return tag;
	}
	
/**
 * find the same task output data value
 * @param taskName{String}
 * @param doc {Document} the old record xml Document
 * */
	public List<String> findOldOutputs(String taskName, Document doc) {
		List<String> outputResults = new ArrayList<String>();
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> tasks = (List<Element>)xPath.selectNodes(doc);
			for(Element task:tasks){
				String tasknameString = task.getAttributeValue("taskName");
				if (tasknameString.equals(taskName)) {
					List<Element> datas = task.getChild("algorithm").getChildren("data");
					for(Element data:datas){
						String dataKind = data.getChild("dataKind").getValue();
						if (dataKind.equals("OutputData")) {
							String outputResult = data.getChild("dataName").getValue() + ":" + data.getChild("dataValue").getValue();
							outputResults.add(outputResult);
						}
					}
				}
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		return outputResults;
	}
}
