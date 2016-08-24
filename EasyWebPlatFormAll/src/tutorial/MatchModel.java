package tutorial;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.io.InputStreamReader;
import java.util.Iterator;
import java.util.List;

import javax.print.Doc;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.sound.sampled.Clip;

//import jdk.nashorn.internal.runtime.FindProperty;

import org.apache.struts2.ServletActionContext;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPath;

import tutorial.Constant;
import xmlUtility.xmlUtility_dom;
import com.opensymphony.xwork2.ActionSupport;
import com.sun.jmx.snmp.tasks.TaskServer;
/**
 * match the precious model to decrease the calculation cost
 * @author lp
 * @version 1.0
 * discription: i think and do this function as follow:
 * create two variables | tmpTask : record the task that can remove from the request model(tasks) |
 *                      | doc_process : a document that record the modified doc |
 * --------->first, i foreach the request tasks, as we know when the back groud get the request, the task had been sorted.
 * --------->when a node is the start node which must been given the data by the user, i check up whether the record of precious model have this task, and 
 * --------->check the user whether have the same input data(check the xml dataValue node), if then add it into tmpTask, and remove it from doc_process
 * --------->for the node that not the start node, we first inspect whether this task in the precious record, if then inspect its father nodes whether in tmpTask
 * ---------> if the father nodes all in, find the children of this node. give its output data to corresponding children input, and remove this node form doc_process
 * */
//import com.sun.xml.internal.ws.api.message.saaj.SAAJFactory;

/**
 * @version 1.1
 * 濡傛灉绗竴娆¤繍琛屾ā鍨嬶紝鍒欎繚瀛樿妯″瀷preciousmodel+鏃堕棿.xml锛屽鏋滀笉鏄涓�杩愯妯″瀷锛屽垯瀵规瘮
 * 濡傛灉杈撳叆鏁版嵁鐨勮寖鍥翠笉涓�嚧锛屽垯瑁佸壀锛屽苟璁板綍瑁佸壀鍚庣殑鏁版嵁鍚嶇Оxml: cliptask+鏃堕棿.xml锛�
 * ------------------xml鏍煎紡涓�------
 * <datas>
 *    <data>
 *       <dataValue>
 *       <clipdatavalue>
 * -------------------end------------
 * 濡傛灉鐢ㄦ埛鍐嶄竴娆¤繍琛屾ā鍨嬶紝鍦ㄥ姣攑reciousmodel+鏃堕棿.xml(璺濈鑷繁鏃堕棿鏈�繎)鏃讹紝濡傛灉鐢ㄦ埛杈撳叆鏁版嵁瀹屽叏涓�嚧锛屽垯鎸塿ersion 1.0 缁х画杩涜
 * 濡傛灉鐢ㄦ埛杈撳叆鏁版嵁涓嶅畬鍏ㄤ竴鑷达紝鍒欏姣旇緭鍏ユ暟鎹寖鍥存槸鍚︿竴鑷达紝涓嶄竴鑷达紝瑁佸壀锛屽悗闈笉鍦ㄨ繘琛屾ā鍨嬪姣�
 * */
public class MatchModel extends ActionSupport{
	int tag = 0;
	/**
	 * @param doc {Docunment} the request xml
	 * @param tasknames {List<String>} the request tasknames
	 * 
	 * */
	public Document matchPreciousModel(Document doc) {
		List<String> tmpTask = new ArrayList<String>(); //use to store the same task
		//Document doc_process = doc;  //use to delete the task that can use the precious task
		Document doc_process = doc.clone();
		Document doc2Strore = doc.clone();
		
		HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml";
	    String user = (String)request.getSession().getAttribute("username");
	    String  ClipPath = path + File.separator + "users_informations" + File.separator + user + File.separator + "clip.xml";
	    String path1 = path + File.separator + "users_informations" + File.separator + user + File.separator + "preciousmodel1.xml";//test
	    //String path2 = path + File.separator + "users_informations" + File.separator + user + File.separator + "preciousmodel1.xml"
	    path = path + File.separator + "users_informations" + File.separator + user + File.separator + "preciousmodel.xml";
	    
	    File file = new File(path);
	    SAXBuilder sb = new SAXBuilder();
	    List<String> inputEnvList = findInputsData(doc); //鎵惧埌鐢ㄦ埛鐨勮緭鍏ユ暟鎹�
    	
	    //========================== 濡傛灉涔嬪墠娌℃湁preciousmodel.xml锛屽垯妫�煡杈撳叆鍙橀噺鏄惁涓�嚧锛岃繑鍥炶鍓悗鐨勬暟鎹紝骞剁敓鎴恈lip.xml====
	    if (!file.exists()) {
	    	writeXML(path, doc);  //鍐欏叆preciousmodel.xml
	    	List<String> outputEnvList = checkInuputEnvExtent(inputEnvList); // 鑾峰彇瑁佸壀鍚庣殑杈撳嚭鏁版嵁
	    	writeClipXML(inputEnvList, outputEnvList, ClipPath);             //鍐欏叆clip.xml鏂囦欢
	    	Document clipdoc = modifiyInputData(doc, outputEnvList);
	    	
			return clipdoc;
		}
	    //===================================end=================
	    else {
	    	  if (checkInuputEnv(inputEnvList, ClipPath)) {
	    		  doc_process = modifyDocInputEnv(ClipPath, doc_process);
	    		  try {
	 	    		 Document filesdoc = sb.build("file:" + path);
	 				XPath xPath = XPath.newInstance("model/task");
	 				List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
	 				List<Element> preciousTaskElements = (List<Element>)xPath.selectNodes(doc);
	 				
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
	 							if (!dataKindElement.getValue().equals("OutputData")) {                          //if the datakind is input data
	 								numInputData = numInputData + 1;
	 								// get the input data value(the data positon and name)
	 								String dataValueString = dataElement.getChild("dataValue").getValue(); 
	 								String dataNameString = dataElement.getChild("dataName").getValue();
	 								//judge the request model start node if have the same input data position and name
	 								boolean tag = hasSameInputValue(dataNameString, dataValueString, taskNameString, filesdoc);             
	 								if (tag) {                                                               //if they have the same input
	 									sameInputData = sameInputData + 1;
	 								}
	 								
	 							}
	 						}
	 						if (numInputData == sameInputData) {
	 							tmpTask.add(taskNameString);
	 							List<String> nextTasks = getNextTasks(taskNameString, doc_process);
	 							List<String> outPutResults = findOldOutputs(taskNameString, filesdoc);
	 							doc_process = setNewTaskDataValue(doc_process,nextTasks,outPutResults);
	 							doc2Strore = setNewTaskDataValue(doc2Strore,nextTasks,outPutResults);
	 							doc_process = removeNode(taskNameString, doc_process);
	 						}
	 					}else if (flag == false) {
	 						int tmp_tag1 = 0;
	 						int tmp_tag2 = 0;
	 						List<Element> dataElements = task.getChild("algorithm").getChildren("data"); 
	 						List<String> inputs = new ArrayList<String>();
	 						List<String> params = new ArrayList<String>();
	 						for(Element dataElement:dataElements){
	 							String datakind = dataElement.getChild("dataKind").getValue();
	 							String datavalue = dataElement.getChild("dataValue").getValue();
	 							if (datakind.equals("InputData")) {
	 								inputs.add(datavalue);
								}
	 							
	 						}
	 						String taskNameString2 = task.getAttributeValue("taskName");
	 						boolean isInOldTask = isInOldModel(taskNameString2, filesdoc);
	 						if (isInOldTask) {
	 							
	 							List<String> PreciousTasks = getPreciousTask(taskNameString2, doc);
	 							for(String taskElement: PreciousTasks){
	 								tmp_tag1 = tmp_tag1 + 1;
	 								
	 								if (inputs.contains(taskElement)) {
	 									boolean tag = hasSameInputValue2(taskElement, taskNameString2, filesdoc);
	 									if (tag) {
	 										tmp_tag2 = tmp_tag2 + 1;
										}
	 									
									}
	 								String taskNameString3 = taskElement;
	 								if (tmpTask.contains(taskNameString3)) {
	 									tmp_tag2 = tmp_tag2 + 1;
	 								}
	 							
	 							}
	 							boolean sameParam = compareParams(task, filesdoc);
	 							if (tmp_tag1 == tmp_tag2 && sameParam) {
	 								tmpTask.add(taskNameString);
	 								List<String> nextTasks = getNextTasks(taskNameString, doc_process);
	 								List<String> outPutResults = findOldOutputs(taskNameString, filesdoc);
	 								doc_process = setNewTaskDataValue(doc_process,nextTasks,outPutResults);
	 								doc2Strore = setNewTaskDataValue(doc2Strore,nextTasks,outPutResults);
	 								doc_process = removeNode(taskNameString2, doc_process);
	 							}
	 						}
	 						
	 					}
	 				}
	 			} catch (Exception e) {
	 				e.printStackTrace();
	 			}
	    		  writeXML(path, doc2Strore);
	    		  writeXML(path1, doc_process);
	    		  return doc_process;
	    		  
			}
	    	 else {
	    		 List<String> outputEnvList = checkInuputEnvExtent(inputEnvList); // 鑾峰彇瑁佸壀鍚庣殑杈撳嚭鏁版嵁
	 	    	writeClipXML(inputEnvList, outputEnvList, ClipPath);             //鍐欏叆clip.xml鏂囦欢
	 	    	Document clipdoc = modifiyInputData(doc, outputEnvList);
	 			return clipdoc;
				
			}
	    	 
		}
	    //TODO: save the new model into the record
	    
	}
/**
 * judge whether this taskNode is the start node
 * @param taskName {String} 
 * @param doc {Document} the request document
 * */
	public boolean hasPreciousTask(String taskName, Document doc) {
		boolean tag = false;
		int index = 0;
		int index2 = 0;
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element>tasks = (List<Element>)xPath.selectNodes(doc);
			for(Element task: tasks)
			{
				String tasknameString = task.getAttributeValue("taskName");
				if (tasknameString.equals(taskName)) {
					Element algorithmElement = task.getChild("algorithm");
					List<Element> dataElements = algorithmElement.getChildren();
					for (Element dataElement : dataElements) {
						String datakindString = dataElement.getChild("dataKind").getValue();
						if (datakindString.equals("InputData")) {
							index2 = index2 + 1;
							String dataName = dataElement.getChild("dataName").getValue();
							try {
								XPath xp = XPath.newInstance("model/task/algorithm/data[dataName='" + dataName + "']");
								List<Element> datas = (List<Element>)xp.selectNodes(doc);
								if (datas.size() == 1) {
									index = index + 1;
								}
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					}
				}
			}
			if (index == index2) {
				tag = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return tag;
	}
/**
 * this function will be deleted 
 * @param xmlPath {String}
 * */
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
/**
 * judge the start nodes whether have same orignal input data value
 * @param inputValue {String}
 * @param doc {Document}
 * */
	public boolean hasSameInputValue(String inputDataName, String inputValue, String taskName, Document doc) {
		boolean tag = false;
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> tasks = (List<Element>)xPath.selectNodes(doc);
			for(Element task:tasks){
				String taskNameInDoc = task.getAttributeValue("taskName");
				if (taskNameInDoc.equals(taskName)) {
					List<Element> datas = task.getChild("algorithm").getChildren("data");
					for(Element data:datas){
						String dataValue = data.getChild("dataValue").getValue();
						String dataName = data.getChild("dataName").getValue();
						if (dataValue.equals(inputValue) && dataName.equals(inputDataName)) {
							tag = true;
						}
					}
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return tag;
	}
	public boolean hasSameInputValue2(String inputValue, String taskName, Document doc) {
		boolean tag = false;
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> tasks = (List<Element>)xPath.selectNodes(doc);
			for(Element task:tasks){
				String taskNameInDoc = task.getAttributeValue("taskName");
				if (taskNameInDoc.equals(taskName)) {
					List<Element> datas = task.getChild("algorithm").getChildren("data");
					for(Element data:datas){
						String dataValue = data.getChild("dataValue").getValue();
						String dataName = data.getChild("dataName").getValue();
						if (dataValue.equals(inputValue)) {
							tag = true;
						}
					}
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return tag;
	}
/**
 * get the next tasks
 * @param taskname {String}
 * @param doc {Document} the request xml
 * */
	public List<String> getNextTasks(String taskname, Document doc) {
		List<String> nextTasks = new ArrayList<String>();
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
			for(Element taskElement: taskElements){
				String taskNameString = taskElement.getAttributeValue("taskName");
				if (taskNameString.equals(taskname)) {
					List<Element> datas = (List<Element>)taskElement.getChild("algorithm").getChildren("data");
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
										nextTasks.add(inputdata.getParentElement().getParentElement().getAttributeValue("taskName"));
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
public List<String> getPreciousTask(String taskname, Document doc) {
		List<String> nextTasks = new ArrayList<String>();
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
			for(Element taskElement: taskElements){
				String taskNameString = taskElement.getAttributeValue("taskName");
				if (taskNameString.equals(taskname)) {
					List<Element> datas = (List<Element>)taskElement.getChild("algorithm").getChildren("data");
					for(Element data: datas){
						String dataKindString = data.getChild("dataKind").getValue();
						String inputDataValue = data.getChild("dataValue").getValue();
						if (dataKindString.equals("InputData")) {
							String dataName = data.getChild("dataName").getValue();
							try {
								XPath xPath2 = XPath.newInstance("model/task/algorithm/data[dataName=\""+ dataName +"\"]");
								List<Element> inputDatas = (List<Element>)xPath2.selectNodes(doc);
								if (inputDatas.size() > 1) {
									for(Element inputdata:inputDatas){
										String dataKind1 = inputdata.getChild("dataKind").getValue();
										if (dataKind1.equals("OutputData")) {
											nextTasks.add(inputdata.getParentElement().getParentElement().getAttributeValue("taskName"));
										}
									}
								}else {
									nextTasks.add(inputDataValue);
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
			for(Element task:tasks){
				String taskNameInOld = task.getAttributeValue("taskName");
				if (taskNameInOld.equals(taskName)) {
					tag = true;
				}
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
			e.printStackTrace();
		}
		return outputResults;
	}
	
/**
 * set the request xml model task new DataValue
 * @param nextTasks {List<Element> nextTasks}
 * @param outPutResults {List<String>}
 * */
	public Document setNewTaskDataValue(Document doc, List<String> nextTasks, List<String> outPutResults) {
		List<String> outputDataNames = new ArrayList<String>();
		List<String> outputDataValues = new ArrayList<String>();
		for(String outputResult : outPutResults){
			String outputDataName = outputResult.split(":")[0];
			String outputDataValue = outputResult.split(":")[1];
			outputDataNames.add(outputDataName);
			outputDataValues.add(outputDataValue);
		}
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> tasks = (List<Element>)xPath.selectNodes(doc);
			for(Element nextTask : tasks){
				String tasknameString = nextTask.getAttributeValue("taskName");
				if (nextTasks.contains(tasknameString)) {
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
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return doc;
	}



/**
 * list the user input data node
 * @param doc {Document}
 * @return dataValues {List<String>} 杩斿洖鐢ㄦ埛杈撳叆鐨勭幆澧冨彉閲忕浉瀵硅矾寰�
 * */
	public List<String> findInputsData(Document doc){
		List<String> dataValues = new ArrayList<String>();
		List<String> inputList = new ArrayList<String>();
		List<String> outputList = new ArrayList<String>();
		List<String> envRaster = new ArrayList<String>();
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
			for(Element task : taskElements){
				List<Element> dataElements = task.getChild("algorithm").getChildren("data");
				for(Element dataElement: dataElements)
				{	
					Element dataKindElement = dataElement.getChild("dataKind");                     
					if (dataKindElement.getValue().equals("InputData")) {
						String dataName = dataElement.getChild("dataName").getValue();
						if (!dataName.equals("Env.Layers ManageMent") && !dataName.equals("Sample Data") && !inputList.contains(dataName)) {
							String dataValue = dataElement.getChild("dataValue").getValue();
							dataValues.add(dataValue);
							inputList.add(dataName);
						}
						
						//String absoluteDataPath = Constant.DataFilePath + File.separator + dataPath;
						
					}else if (dataKindElement.getValue().equals("OutputData")) {
						String dataName = dataElement.getChild("dataName").getValue();
						outputList.add(dataName);
					}
				}
				
			}
			for (int i = 0; i < inputList.size(); i++) {
				if (!outputList.contains(inputList.get(i))) {
					envRaster.add(dataValues.get(i));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return envRaster;
	}
	
	/**
	 * check user input env whether has the same extent
	 * @param dataValues {List<String>}
	 * */
	public List<String> checkInuputEnvExtent(List<String> dataValues) {
		//=============閫氳繃绗竴涓緭鍏ュ彉閲忕浉瀵硅矾寰勶紝鑾峰彇uploader鍜屾暟鎹泦鍚嶇О=======
		String[] splitDataValue = dataValues.get(0).split("/");
		String uploader = splitDataValue[0];
		String dataSet = splitDataValue[1];
		//================================end===========================
		List<String> outdatas = new ArrayList<String>();
		String outPutPaths = ""; //杈撳嚭瀛楃涓叉嫾鎺ヨ矾寰�
		String inPutPaths = ""; //杈撳叆瀛楃涓叉嫾鎺ヨ矾寰�
		String ouputkml = "";
		List<String> top = new ArrayList<String>();
		List<String> down = new ArrayList<String>();
		List<String> left = new ArrayList<String>();
		List<String> right = new ArrayList<String>();
		HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml" + File.separator + "users_informations";
	    //String user = (String)request.getSession().getAttribute("username");
	    String dataFilePath = path + File.separator + uploader + File.separator + uploader + "_dataFiles.xml";
	    SAXBuilder sb = new SAXBuilder();
	    Date nowDate = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String nowTime = dateFormat.format(nowDate); 
	    try {
	    	Document filesdoc = sb.build("file:" + dataFilePath);
	    	for (int i = 0; i < dataValues.size(); i++) {
	    		//鍒╃敤鈥�鈥濆皢鍘熸潵璺緞鍒囧壊锛屽湪鍊掓暟绗簩閮ㄥ垎鍔犱笂鏃堕棿锛屽舰鎴愬垏鍓插悗鐨勬柊鐨勫悕瀛�
	    		String[] splitDataValues = dataValues.get(i).split("\\."); //鍒囧壊
	    		int len = splitDataValues.length;
	    		splitDataValues[len - 2] = splitDataValues[len - 2] + nowTime;  //鍦ㄥ悕瀛楀悗闈㈡坊鍔犳椂闂�
	    		String outPutDataValue = splitDataValues[0];
	    		for (int j = 1; j < splitDataValues.length; j++) {    // 鎷兼帴褰㈡垚璺緞瀛楃涓�
					outPutDataValue = outPutDataValue + "." +splitDataValues[j];
					
				}
	    		outdatas.add(outPutDataValue);
	    		if (i == 0) {
	    			inPutPaths = Constant.DataFilePath + File.separator + dataValues.get(i);
	    			outPutPaths = Constant.DataFilePath + File.separator + outPutDataValue;
				}else {
					inPutPaths = inPutPaths + "#" + Constant.DataFilePath + File.separator + dataValues.get(i);
					outPutPaths = outPutPaths + "#" + Constant.DataFilePath + File.separator + outPutDataValue;
				}
	    		XPath xpath = XPath.newInstance("files/file[fileName=\""+ dataValues.get(i) +"\"]");
	    		List<Element> files = (List<Element>)xpath.selectNodes(filesdoc);
	    		int ElementNum = files.size();
	    		if (ElementNum ==1) {
					Element topNode = files.get(0).getChild("top");
					if (!top.contains(topNode.getValue())) {
						top.add(topNode.getValue());
					}
					
					Element downNode = files.get(0).getChild("down");
					if (!down.contains(downNode.getValue())) {
						down.add(downNode.getValue());
					}
					
					Element leftNode = files.get(0).getChild("left");
					if (!left.contains(leftNode.getValue())) {
						left.add(leftNode.getValue());
					}
					
					Element rightNode = files.get(0).getChild("right");
					if (!right.contains(rightNode.getValue())) {
						right.add(rightNode.getValue());
					}
					
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    // 姣旇緝杈撳叆env鐜鍙橀噺鏍呮牸鑼冨洿鐨勫洓涓�鏄惁涓�嚧锛屽鏋滄湁涓�釜涓嶄竴鑷达紝璇存槑鑼冨洿浣犱笉涓�嚧锛岃皟鐢ㄨ鍓猠xe锛岃繘琛岃鍓�
	    if (top.size() > 1 || down.size() > 1 ||left.size() > 1 || right.size() > 1) {
	    	String outTmp = Constant.DataFilePath + File.separator + uploader + File.separator + "tmp.tif";
	    	ouputkml = request.getSession().getServletContext().getRealPath("") + File.separator +"kml" + File.separator + uploader + File.separator + dataSet + ".kml";
	    	String cmd = Constant.exepath + File.separator + "RasterCut.exe" + " " + inPutPaths + " " + outPutPaths + " " + outTmp + " " + ouputkml;
	    	cmdProcess(cmd);
		}else {
			outdatas = dataValues;
		}
	    return outdatas;
	}
	
	/**
	 * cmd call  
	 * */
	public void cmdProcess(String cmd) {
		try {
			Process process = Runtime.getRuntime().exec(cmd);
			String str;
		    BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
		    while ( (str=bufferedReader.readLine()) !=null){System.out.println(str);}
		    process.waitFor();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	/**
	 * 淇敼鎸囩偣鑺傜偣鍐呭
	 * 涓昏鏄慨鏀筰nput env 璺緞鍊�
	 * */
	public Document modifiyInputData(Document doc,List<String> outPutDatas) {
		List<String> inputDatas = findInputsData(doc);
		//List<String> outPutDatas = checkInuputEnvExtent(inputDatas);
		boolean tag = false;
		// 鍒ゆ柇inputDatas涓巓utPutDatas鏄惁鐩稿悓锛屽鏋滀笉鍚屽悗缁渶瑕佷慨鏀筪oc杈撳叆env鐨勫�
		for (int i = 0; i < inputDatas.size(); i++) {
			if (!inputDatas.get(i).equals(outPutDatas.get(i))) {
				tag = true;
			}
		}
		if (tag) {
			try {
				XPath xPath = XPath.newInstance("model/task");
				List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
				for(Element task : taskElements){
					List<Element> dataElements = task.getChild("algorithm").getChildren("data");
					for(Element dataElement: dataElements)
					{
						//get the datakind of every data element
						
						Element dataValueElement = dataElement.getChild("dataValue");                     
						if (inputDatas.contains(dataValueElement.getValue())) {
							int index = inputDatas.indexOf(dataValueElement.getValue());
							dataValueElement.setText(outPutDatas.get(index));
						}
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		//TODO:妫�煡doc鏄惁淇敼鎴愬姛
		return doc;
		
	}
	/**
	 * 妫�煡鐢ㄦ埛杈撳叆鐨勬暟鎹槸鍚︿竴鑷�
	 * call checkInuputEnvExtent1
	 * */
    public boolean checkInuputEnv(List<String> newInputData, String preciouseClipPath) {
    	boolean tag = false;
		
		SAXBuilder sb = new SAXBuilder();
		try {
			Document filesdoc = sb.build("file:" + preciouseClipPath);
			XPath xPath = XPath.newInstance("datas/data");
			List<Element> datas = (List<Element>)xPath.selectNodes(filesdoc);
			if (checkInuputEnvExtent1(newInputData)) {
				tag = true;
			}else if (datas.size() == newInputData.size()) {
				int countSameInputEnv = 0;
				for (int i = 0; i < datas.size(); i++) {
					Element data = datas.get(i);
					String dataValue = data.getChild("dataValue").getValue();
					if (newInputData.contains(dataValue)) {
						countSameInputEnv = countSameInputEnv + 1;
					}
				}
				if (countSameInputEnv == datas.size()) {
					tag = true;
				}
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	    return tag;
	}
    
    /**
     * 鍐欏叆鏂扮殑doc锛岃鐩栧師鏉ユ枃浠�
     * */
    public void writeXML(String path, Document filesdoc) {
    	try {
    		Format format = Format.getCompactFormat();   
    	    format.setEncoding("UTF-8");  
    	    format.setIndent("  ");     
    	    XMLOutputter xmlout = new XMLOutputter(format); 
    	    File _file = null;
    	    _file = new File(path);  
    	    FileWriter filewriter = new FileWriter(_file);
            xmlout.output(filesdoc, filewriter);
            filewriter.close(); 
		} catch (Exception e) {
			e.printStackTrace();
		}
    	
	}
    /**
     * 鍐欏叆clipxml
     * */
    public void writeClipXML(List<String>inputEnv, List<String>outPutEnv, String path) {
    	Element root = new Element("datas");
    	for (int i = 0; i < inputEnv.size(); i++) {
			Element dataElement = new Element("data");
			Element inputEnvElement = new Element("dataValue");
			inputEnvElement.setText(inputEnv.get(i));
			Element outputElement = new Element("clipdatavalue");
			outputElement.setText(outPutEnv.get(i));
			dataElement.addContent(inputEnvElement);
			dataElement.addContent(outputElement);
			root.addContent(dataElement);
		}
        Document Doc = new Document(root);  
        Format format = Format.getCompactFormat();   
	    format.setEncoding("UTF-8");  
	    format.setIndent("  ");     
        XMLOutputter XMLOut = new XMLOutputter(format);  

        try {
			XMLOut.output(Doc, new FileOutputStream(path));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}  
	}
    
    /**
     * 璇诲彇涓棿缁撴灉鍊�
     * */
    public List<String> readIntermediateResult(String path, Document doc) {
    	List<String> midleResult = new ArrayList<String>();
    	List<String> inputs = findInputsData(doc);
    	SAXBuilder sb = new SAXBuilder();
		try {
			Document filesdoc = sb.build("file:" + path);
			XPath xPath = XPath.newInstance("model/task");
			List<Element> taskElements = (List<Element>)xPath.selectNodes(filesdoc);
			for(int j = 0; j < taskElements.size() - 1; j++){
				Element task = taskElements.get(j);
				String taskNameString = task.getAttributeValue("taskName");
				List<Element> dataElements = task.getChild("algorithm").getChildren("data"); 
				for(int i = 0; i < dataElements.size(); i++)
				{
					Element dataElement = dataElements.get(i);
					String datakind = dataElement.getChild("dataKind").getText();                     
					if (datakind.equals("OutputData")) {
						String dataValue = dataElement.getChild("dataValue").getValue();
						if (!inputs.contains(dataValue)) {
							midleResult.add(dataValue);
						}
						
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return midleResult;
	}
    /**
     * 姝ゅ嚱鏁版槸鍒ゆ柇鑼冨洿鏄惁涓�嚧锛屼笉杩涜瑁佸壀
     * */
    public boolean checkInuputEnvExtent1(List<String> dataValues) {
		//=============閫氳繃绗竴涓緭鍏ュ彉閲忕浉瀵硅矾寰勶紝鑾峰彇uploader鍜屾暟鎹泦鍚嶇О=======
		String[] splitDataValue = dataValues.get(0).split("/");
		String uploader = splitDataValue[0];
		String dataSet = splitDataValue[1];
		//================================end===========================
		boolean tag = true;
		
		List<String> top = new ArrayList<String>();
		List<String> down = new ArrayList<String>();
		List<String> left = new ArrayList<String>();
		List<String> right = new ArrayList<String>();
		HttpServletRequest request = ServletActionContext.getRequest();
	    String path = request.getSession().getServletContext().getRealPath("")+ File.separator +"WEB-INF" + File.separator +"xml" + File.separator + "users_informations";
	    //String user = (String)request.getSession().getAttribute("username");
	    String dataFilePath = path + File.separator + uploader + File.separator + uploader + "_dataFiles.xml";
	    SAXBuilder sb = new SAXBuilder(); 
	    try {
	    	Document filesdoc = sb.build("file:" + dataFilePath);
	    	for (int i = 0; i < dataValues.size(); i++) {
	    		
	    		XPath xpath = XPath.newInstance("files/file[fileName=\""+ dataValues.get(i) +"\"]");
	    		List<Element> files = (List<Element>)xpath.selectNodes(filesdoc);
	    		int ElementNum = files.size();
	    		if (ElementNum ==1) {
					Element topNode = files.get(0).getChild("top");
					if (!top.contains(topNode.getValue())) {
						top.add(topNode.getValue());
					}
					
					Element downNode = files.get(0).getChild("down");
					if (!down.contains(downNode.getValue())) {
						down.add(downNode.getValue());
					}
					
					Element leftNode = files.get(0).getChild("left");
					if (!left.contains(leftNode.getValue())) {
						left.add(leftNode.getValue());
					}
					
					Element rightNode = files.get(0).getChild("right");
					if (!right.contains(rightNode.getValue())) {
						right.add(rightNode.getValue());
					}
					
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    // 姣旇緝杈撳叆env鐜鍙橀噺鏍呮牸鑼冨洿鐨勫洓涓�鏄惁涓�嚧锛屽鏋滄湁涓�釜涓嶄竴鑷达紝璇存槑鑼冨洿浣犱笉涓�嚧锛岃皟鐢ㄨ鍓猠xe锛岃繘琛岃鍓�
	    if (top.size() > 1 || down.size() > 1 ||left.size() > 1 || right.size() > 1) {
	    	tag = false;
		}
	    return tag;
	}
    
    /**
     * 姣旇緝鏂癲oc鍜屼笂娆oc task鍙傛暟鏄惁涓�嚧
     * */
	public boolean compareParams(Element task, Document doc) {
		boolean tag = false;
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
			List<String> newParam = new ArrayList<String>();
			List<String> oldParam = new ArrayList<String>();
			String newInputTaskName = task.getAttributeValue("taskName");
			for(Element taskElement:taskElements){
				String oldInputTaskName = taskElement.getAttributeValue("taskName");
				if (oldInputTaskName.equals(newInputTaskName)) {
					List<Element> oldDatas = taskElement.getChild("algorithm").getChildren("data");
					for(Element oldData: oldDatas){
						String dataKind = oldData.getChild("dataKind").getValue();
						if (dataKind.equals("Parameter")) {
							String dataName = oldData.getChild("dataName").getValue();
							String dataValue = oldData.getChild("dataValue").getValue();
							oldParam.add(dataName + ":" + dataValue);
						}
					}
				}
			}
			List<Element> newDatas = task.getChild("algorithm").getChildren("data");
			for(Element newData: newDatas){
				String dataKind = newData.getChild("dataKind").getValue();
				if (dataKind.equals("Parameter")) {
					String dataName = newData.getChild("dataName").getValue();
					String dataValue = newData.getChild("dataValue").getValue();
					newParam.add(dataName + ":" + dataValue);
				}
			}
			int numSameParam = 0;
			for (int i = 0; i < newParam.size(); i++) {
				if (oldParam.contains(newParam.get(i))) {
					numSameParam = numSameParam + 1;
				}
			}
			if (numSameParam == newParam.size()) {
				tag = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return tag;
	}
	
	/**
	 * 鍒犻櫎鎸囧畾鑺傜偣
	 * */
	
	public Document removeNode(String taskName, Document doc) {
		try {
			XPath xPath = XPath.newInstance("model/task");
			List<Element> taskElements = (List<Element>)xPath.selectNodes(doc);
			for(Element taskElement:taskElements){
				String task = taskElement.getAttributeValue("taskName");
				if (task.equals(taskName)) {
					Element rooElement = doc.getRootElement();
					rooElement.removeContent(taskElement);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return doc;
	}
	/**
	 * 鏇存敼new input doc 杈撳叆鍙橀噺
	 * */
	public Document modifyDocInputEnv(String clipXmlPath, Document doc) {
		
		try {
			List<String> inputEnvs = findInputsData(doc);
			SAXBuilder sb = new SAXBuilder();
			Document filesdoc = sb.build("file:" + clipXmlPath);
			for (int i = 0; i < inputEnvs.size(); i++) {
				XPath xpath = XPath.newInstance("datas/data[dataValue=\""+ inputEnvs.get(i) +"\"]");
				Element clipElement = (Element)xpath.selectSingleNode(filesdoc);
				String clipValue = clipElement.getChild("clipdatavalue").getValue();
				XPath xp = XPath.newInstance("model/task/algorithm/data[dataValue='" + inputEnvs.get(i) + "']");
				Element inputDataNode = (Element)xp.selectSingleNode(doc);
				inputDataNode.getChild("dataValue").setText(clipValue);
			}
			String tmp = "Env.Layers ManageMent";
			XPath xPath2 = XPath.newInstance("model/task/algorithm/data[dataName='" + tmp + "']");
			List<Element> tmpNodeElement = (List<Element>)xPath2.selectNodes(doc);
			String tmpJointString = "";
			List<String> tmpList = new ArrayList<String>();
			if (tmpNodeElement.size() > 0) {
				String tmpString = tmpNodeElement.get(0).getChild("dataValue").getValue();
				String[] tmpStrings = tmpString.split("#");
				for (int j = 0; j < tmpStrings.length; j++) {
					if (inputEnvs.contains(tmpStrings[j])) {
						XPath xpath3 = XPath.newInstance("datas/data[dataValue=\""+ tmpStrings[j] +"\"]");
						Element clipElement3 = (Element)xpath3.selectSingleNode(filesdoc);
						String clipValue3 = clipElement3.getChild("clipdatavalue").getValue();
						tmpList.add(clipValue3);
					}else {
						tmpList.add(tmpStrings[j]);
					}
				}
				tmpJointString = tmpList.get(0);
				for (int i = 1; i < tmpList.size(); i++) {
					tmpJointString = tmpJointString + "#" + tmpList.get(i);
				}
				Element dataValueNodeElement = tmpNodeElement.get(0).getChild("dataValue");
				dataValueNodeElement.setText(tmpJointString);
			}
			
			 
			 
		} catch (Exception e) {
			e.printStackTrace();
		}
		return doc;
	}

}