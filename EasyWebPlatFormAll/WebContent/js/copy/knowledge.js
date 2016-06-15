var GeoTask_XMLDoc = null;
var GeoTask_Ajax = new Ajax(); 
GeoTask_Ajax.open("GET",'tasks.xml',true);
GeoTask_Ajax.onreadystatechange=function(){
	if(GeoTask_Ajax.readyState==4){
		if(GeoTask_Ajax.status==200){
			var GeoTask_XMLStr = GeoTask_Ajax.responseText;
			loadGeoTaskXML(GeoTask_XMLStr);
			  
		}
	}
}; 
GeoTask_Ajax.send(null); 
function loadGeoTaskXML(xmlStr){
	 if(!window.DOMParser && window.ActiveXObject){
		 var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
        for(var i=0;i<xmlDomVersions.length;i++){
            try{
           	 GeoTask_XMLDoc = new ActiveXObject(xmlDomVersions[i]);
           	 GeoTask_XMLDoc.async = false;
           	 GeoTask_XMLDoc.loadXML(xmlStr); 
                break;
            }catch(e){
            }
        }
	 }else if(window.DOMParser && document.implementation && document.implementation.createDocument){
		 var domParser = new  DOMParser();
		 GeoTask_XMLDoc = domParser.parseFromString(xmlStr, 'text/xml');      
	 }
};
function get_firstchild(n)
{
	var x=n.firstChild;
	while (x.nodeType!=1)
	  {
	  x=x.nextSibling;
	  }
	return x;
}
var knowledgeBase = function(){
	this.findAlgorithmNames = function(taskName){
		var algorithmNames = []; 
		  
		if(taskName =="SCACal"){
            //alert(123456);           		          		
		    var algorithmNames = [];  
			//alert(111);
			if(nenjiangStatus == true && currentTask == "TWICal"){
				algorithmNames.push("MFD");
				algorithmNames.push("SFD"); 
                //alert(123);	        			
			}else{    
				algorithmNames.push("SFD");
			    algorithmNames.push("MFD"); 
			}
		}else{
			var taskNode = GeoTask_XMLDoc.getElementById(taskName);    
			var algorithmsNode = get_firstchild(taskNode);   
			var algorithmNodes = algorithmsNode.childNodes;
			for(var i =0; i< algorithmNodes.length; i++){
				if(algorithmNodes[i].nodeName =="Algorithm"){
					var name = get_firstchild(algorithmNodes[i]).childNodes[0].nodeValue;
					algorithmNames.push(name);
				}
			}
		}
		return algorithmNames;
	};
	this.findInputDataNames = function(algorithmName){
		var dataNames = [];
		var inputsNode = GeoTask_XMLDoc.getElementById("In_" + algorithmName);
		var inputNodes = inputsNode.childNodes;
		for(var i =0; i<inputNodes.length; i++){
			if(inputNodes[i].nodeName == "Input"){
				var name = get_firstchild(inputNodes[i]).childNodes[0].nodeValue;
				dataNames.push(name);					
			}
		}
		
		return dataNames;
	};
	this.findParameterNames = function(algorithmName){
		var parameterNames = [];
		var parametersNode = GeoTask_XMLDoc.getElementById("Para_" + algorithmName);
		var parameterNodes = parametersNode.childNodes;
		for(var i =0;i<parameterNodes.length; i++){
			if(parameterNodes[i].nodeName == "Parameter"){
				var name = get_firstchild(parameterNodes[i]).childNodes[0].nodeValue;
				parameterNames.push(name);
			}
		}
		return  parameterNames;
	};
	this.setParametersDefaultValue = function(algorithmName,parameters){
		var parametersNode = GeoTask_XMLDoc.getElementById("Para_" + algorithmName);
		var parameterNodes = parametersNode.childNodes;
		for(var i =0;i<parameterNodes.length; i++){
			if(parameterNodes[i].nodeName == "Parameter"){
				var paraName = null;
				var defaultValue = null;
				var nodes = parameterNodes[i].childNodes;
				for(var j=0;j<nodes.length;j++){
					if(nodes[j].nodeName == "ParaSematic"){
						paraName = nodes[j].childNodes[0].nodeValue;
					}else if(nodes[j].nodeName == "DefaultValue"){
						if(nodes[j].childNodes.length==0){
							defaultValue = "";
						}else{
							defaultValue = nodes[j].childNodes[0].nodeValue;
						}   
					}
				}
				for(var k =0;k<parameters.length; k++){
					if(parameters[k].parameterName == paraName){
						var value = [];
						value.push(defaultValue);  
						parameters[k].setValue(value);
					}
				}
			}
		}
	};
	this.findOutputDataNames = function(algorithmName){
		var dataNames = [];
		var algorithmNode = GeoTask_XMLDoc.getElementById(algorithmName);
		
		var taskNode = algorithmNode.parentNode.parentNode;
		var taskID = taskNode.getAttribute("id");
		var outputsNode = GeoTask_XMLDoc.getElementById("Out_" + taskID);
		var outputNodes = outputsNode.childNodes;
		for(var i =0;i<outputNodes.length; i++){
			if(outputNodes[i].nodeName == "Output"){
				var name = get_firstchild(outputNodes[i]).childNodes[0].nodeValue; 
				dataNames.push(name);
			}
		}
		return dataNames;
	};
	this.findTaskNameHasOutput = function(outputname){
		var outputNode = GeoTask_XMLDoc.getElementById(outputname);
		var taskNode = outputNode.parentNode.parentNode;
		var taskName = taskNode.getAttribute("TaskName");
		return taskName;
	};
	
};