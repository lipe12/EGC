
var Ajax = function () {
	try {
		req = new XMLHttpRequest(); /* e.g. Firefox */
	} catch (e) {
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
			/* some versions IE */
		} catch (e) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
				/* some versions IE */
			} catch (E) {
				req = false;
			}
		}
	}
	return req;
};
var ModelManager = function(){
	this.openModel = function(graphManager,xmlUrl){
		
		ajax = new Ajax();      
		ajax.open("GET",xmlUrl,true);        
		ajax.onreadystatechange=function(){
			                   
			if(ajax.readyState==4)
		    {
		        if(ajax.status==200)  
		       {          
		        	var xml = ajax.responseText;
		        	graphManager.openModel(xml);
		        }
		     }    
		};
		ajax.send(null);
	};
	this.saveModel = function(graphManager){
		graphManager.saveModel();
	};
	this.RunModel = function(){          
		var xmlUrl = "RunModel.action";
		ajax = new Ajax();
		ajax.open("GET",xmlUrl,true);
		ajax.onreadystatechange=function(){  
			if(ajax.readyState==4)
		    {
		        if(ajax.status==200)  
		       {     
		        	var text = ajax.responseText;
		        	alert(text);
		        }
		     }    
		};
		ajax.send(null);
	};
};

var graphManager = function(canvas){
    
	this.canvas = canvas;
	this.list = [];
	this.current = null;
	this.currentLR = null;
	this.currentPre = null;  
	this._dataMenu = null;
	this._taskMenu= null;
/**
 * @description get all data needed
 * */	
	this.findInitInputDatas = function(){
		var taskList =[];
		var dataList =[];
        var initdataList=[];
        for(var i= 0; i< this.list.length; i++){
		   if(this.list[i].label == 'Env.Layers ManageMent'||this.list[i].label == 'HM Env.Layers ManageMent'){
		      continue;
		   }
		   if("rectangle" == this.list[i].type){
		      taskList.push(this.list[i]);
		   }else if("ellipse" == this.list[i].type){
		      dataList.push(this.list[i]);
		   }
		}
        for(var i =0; i<dataList.length;i++){
		    
			var flagin = false;
			var flagout = false;
			for(var j=0; j<taskList.length; j++){
			    if(taskList[j].hasInputData(dataList[i])){
					flagin = true;
				}else if(taskList[j].hasOutputData(dataList[i])){
				    flagout = true;
				}	
			}
			if(flagin== true && flagout == false){
			   initdataList.push(dataList[i]);
			}
		}
        return 	initdataList;	
	};
	
	this.openModel = function(xmlstr){
		       
		var modeXML = xmlstr;
		this.list = [];
		domParser = new  DOMParser();
        xmlDoc = domParser.parseFromString(modeXML, 'text/xml');
        var datas = xmlDoc.getElementsByTagName("data");
		var tasks = xmlDoc.getElementsByTagName("task");
		
		var datalist = [];
		var tasklist = [];
		 
	    var lasttask = null; 
		 
		for(var i =0;i<datas.length;i++){// draw data node
			      
			var x = datas[i].getElementsByTagName("x")[0].firstChild.nodeValue;
			var y = datas[i].getElementsByTagName("y")[0].firstChild.nodeValue;
			var a = datas[i].getElementsByTagName("a")[0].firstChild.nodeValue;
			var b = datas[i].getElementsByTagName("b")[0].firstChild.nodeValue;
			var label = datas[i].getElementsByTagName("label")[0].firstChild.nodeValue;
            var _data = new data(Number(x),Number(y),Number(a),Number(b),label,this.canvas);
            if(datas[i].getElementsByTagName("value")[0].firstChild == null){
			   _data.hasValue = false;
				var value = [];
				_data.setValue(value);   
			}else{
				var	data_value = datas[i].getElementsByTagName("value")[0].firstChild.nodeValue;			
				_data.hasValue = true;
				var value = [];
				value.push(data_value);
				_data.setValue(value);
			}			
            
			//this.list.push(_data);
			datalist.push(_data);     
		}
		  
		for(var i =0;i<tasks.length;i++){ // draw task node
			var x = tasks[i].getElementsByTagName("x")[0].firstChild.nodeValue;
			var y =  tasks[i].getElementsByTagName("y")[0].firstChild.nodeValue;
			var width = tasks[i].getElementsByTagName("width")[0].firstChild.nodeValue;
			var height = tasks[i].getElementsByTagName("height")[0].firstChild.nodeValue;
			var label = tasks[i].getElementsByTagName("label")[0].firstChild.nodeValue;
			
			var _task = new task(Number(x),Number(y),Number(width),Number(height),label,this.canvas,this);
			_task.isReadyToRun = false;
			//this.list.push(_task);
			tasklist.push(_task);
		}
		
		
		for(var i =0;i<tasklist.length;i++){
			var algorithmName = tasks[i].getElementsByTagName("algorithm")[0].firstChild.nodeValue; 
			var inputnames = tasks[i].getElementsByTagName("inputdata")[0].firstChild.nodeValue.split('$');
			var outputnames = tasks[i].getElementsByTagName("outputdata")[0].firstChild.nodeValue.split('$');
			var parameter_name_values ;
			if(tasks[i].getElementsByTagName("parameter")[0].firstChild == null){
				parameter_name_values = [];
			}else{
				parameter_name_values = tasks[i].getElementsByTagName("parameter")[0].firstChild.nodeValue.split('$') ;
			}        
			        
			var inputdatas = [];
			var outputdatas = [];   
			var parameters = [];
			
			var _task = tasklist[i];
			_task.initAlgorithms();
			_task.setAlgorithm(algorithmName);
			
			for(var t = 0;t<inputnames.length;t++){
				for(var k = 0;k<datalist.length;k++){
					if(datalist[k].dataName ==inputnames[t]){
						inputdatas.push(datalist[k]);
					}
				}
                				
			}
            var taskname = tasks[i].getElementsByTagName("label")[0].firstChild.nodeValue;
			if( taskname == 'Sample Based Mapping'){     
			   selectedLayersItems = [];
			   for(var t=0; t<inputnames.length; t++){
			      inputname = inputnames[t];
				  if(inputname=='Precipitation'||inputname=='Temperature'||inputname=='Evaporation'){
                      selectedLayersItems.push("Climate#" + inputname);   				  
				  }else if(inputname=='Parent Material'){
				      selectedLayersItems.push("Geology#" + inputname);   		
				  }else if(inputname=='TWI'||inputname=='Slope Gradient'||inputname=='Profile Curvature'||inputname=='Plan Curvature'){
					  selectedLayersItems.push("Terrain#" + inputname);   	
				  }else if(inputname =='NDVI'){
					  selectedLayersItems.push("Vegetation#" + inputname);    
				  }else if(inputname =='Albedo'||inputname =='Watershed'){  
					  selectedLayersItems.push("Others#" + inputname);    
				  }
			   }
			}
			
			for(var t = 0;t<outputnames.length;t++){
				for(var k = 0;k<datalist.length;k++){
					if(datalist[k].dataName ==outputnames[t]){
						outputdatas.push(datalist[k]);
					}
				}
			}
           
			for(var t = 0; t<parameter_name_values.length; t++){
			    var name_value = parameter_name_values[t].split(':');
                name = name_value[0];
                value = name_value[1];              
                var para =  new parameter(name);
                var _value = [];
                _value.push(value);
   				para.setValue(_value);
				parameters.push(para);
				
			} 
			     
			_task.setInputDatas(inputdatas);
			_task.setOutputDatas(outputdatas);
			_task.setParameters(parameters);
			for(var k=0; k< inputdatas.length;k++){// draw connection
				var con = new connection(inputdatas[k], _task, this.canvas);
			    con.isReady = true;
			    this.list.push(con);
			
			}
			
			for(var k=0; k< outputdatas.length;k++){//draw connection
				var con = new connection(_task,outputdatas[k], this.canvas);
			    con.isReady = true;			   
			    this.list.push(con);
			
			}
			     
		}// end of for
		
		//
		var myflag = 0;
		for(var i=0;i<tasklist.length;i++){
		    var _task = tasklist[i];
			var outputdatas = _task.selectedAlgorithm.outputDatas;
			myflag =0;
			for(var t = 0;t<outputdatas.length;t++){
				for(var k = 0;k<tasklist.length;k++){
					if(tasklist[k].hasInputData(outputdatas[t])){
					    myflag =1;
						_task.addNextTask(tasklist[k]);
					}
				}
			}
           	if(myflag ==0){  
				currentTask = _task.taskName;
                				
			}		
        }//end of for
		 
		for(var i =0;i<datalist.length;i++){
			this.list.push(datalist[i]);
		}
		for(var i =0;i<tasklist.length;i++){
			this.list.push(tasklist[i]);
		}
		      
		this.reDraw();  
		    
	};
		
	this.saveModel = function(modelname){
		var initdataList = this.findInitInputDatas();
		
		var modeXML = '<?xml version="1.0" encoding="utf-8" ?>';
		modeXML = modeXML + '<model name= "' + modelname+ '">';
		for(var i =0;i< this.list.length;i++){         
			if(this.list[i].type=="ellipse"){
				modeXML = modeXML + '<data>'
				          +'<x>'+this.list[i].x+'</x>'
						  +'<y>'+this.list[i].y+'</y>'
						  +'<a>'+this.list[i].a+'</a>'
						  +'<b>'+this.list[i].b+'</b>'
						  +'<label>'+this.list[i].label+'</label>';
				var flag = false;		  
				for(var k =0; k< initdataList.length; k++){
				   if(initdataList[k].label == this.list[i].label){
				       flag = true; 
				   }
				}
				if(flag == true){
				    modeXML = modeXML + '<value></value>'+'</data>';
				}else{
				    modeXML = modeXML + '<value>'+this.list[i].getValue()[0]+'</value>'+'</data>';
				}
				      
			}else if(this.list[i].type=="rectangle"){
				var paras = this.list[i].getSelectedAlgorithm().parameters;        
				var parastr = "" ;
				    
				if(paras.length>0){    
				   parastr = paras[0].parameterName + ':' + paras[0].value[0];
				   for(var k =1; k< paras.length; k++){
					  parastr = parastr + '$' + paras[k].parameterName + ':' + paras[k].value[0];
				   }
				}
				
				var inputdatas = this.list[i].getSelectedAlgorithm().inputDatas;
				var inputstr = "";
				if(inputdatas.length>0){
				    inputstr = inputdatas[0].dataName;
					for(var k = 1; k< inputdatas.length; k ++){
					   inputstr =  inputstr + '$' + inputdatas[k].dataName ;
					}
				}              
				var outputdatas = this.list[i].getSelectedAlgorithm().outputDatas;
				       
                var outputstr = "";
				if(outputdatas.length>0){
				    outputstr = outputdatas[0].dataName;
					
					for(var k = 1; k< outputdatas.length; k ++){
					   outputstr =  outputstr + '$' + outputdatas[k].dataName ;
					}     
				}  
				   
				modeXML = modeXML + '<task>'
				          +'<x>'+this.list[i].x+'</x>'
						  +'<y>'+this.list[i].y+'</y>'
						  +'<width>'+this.list[i].width+'</width>'
						  +'<height>'+this.list[i].height+'</height>'
						  +'<label>'+this.list[i].label+'</label>'
						  +'<algorithm>'+this.list[i].getSelectedAlgorithm().algorithmName+'</algorithm>'
						  +'<parameter>' + parastr + '</parameter>' 
						  +'<inputdata>' + inputstr + '</inputdata>'
						  +'<outputdata>' + outputstr + '</outputdata>'  
				          +'</task>';
			}
		
		}
		modeXML = modeXML +"</model>";
		
        modelstrjjc = modeXML;	
                 		
		
		var ajax = new Ajax();
	    url = "SaveModel.action";     
	    ajax.open("post",url,true);    
	    ajax.setRequestHeader("Content-Type","text/xml");
	    ajax.onreadystatechange = function(){
		    if(ajax.readyState == 4 && ajax.status == 200){  
		    }
	    };  
	    ajax.send(modeXML);
		
	};
	this.topologySort = function(){
		var taskList = [];
		var sortedTaskList = [];
		for(var i =0;i<this.list.length;i++){
			if("rectangle"==this.list[i].type){
				taskList.push(this.list[i]);
			}
		}
		var first = null;
		for(var i=0;i<taskList.length;i++){
		    var flag =0;
			for (var j =0;j<taskList.length; j++){
				if(taskList[j].taskIsNextTask(taskList[i])){
					flag = 1;
				}
			}
			if(flag==0){
				first = taskList[i];
				break;
			}
		}
		
		while(first){
		    
			sortedTaskList.push(first);
            var temp0 = [];
			for(var k =0;k<taskList.length;k++){
				if(taskList[k]!=first)
					temp0.push(taskList[k]);
			}
			taskList = temp0;
			first = null;
			for(var i=0;i<taskList.length;i++){
				var flag =0;
				for (var j =0;j<taskList.length; j++){
					if(taskList[j].taskIsNextTask(taskList[i])){
						flag = 1;
					}
				}
				if(flag==0){
					first = taskList[i];
					break;
				}
			}
			
		}
       
		return sortedTaskList;
		
	};       
	this.generateBPEL = function(){
		var taskList = this.topologySort();
		var modeXML = null;
	    modeXML = '<?xml version="1.0" encoding="utf-8" ?>';
	    modeXML = modeXML + '<model>';
	    for(var k =0;k< taskList.length; k++){
	    	var task = taskList[k];       
	    	var algorithm = task.getSelectedAlgorithm();
	    	var inputDatas = [];
	    	var outputDatas = [];
	    	var paras = [];
	    	inputDatas = algorithm.inputDatas;
	    	outputDatas = algorithm.outputDatas;    
	    	paras = algorithm.parameters;
	    	    
	    		modeXML = modeXML + '<task taskName = \''+ task.taskName + '\'>';
	    			modeXML = modeXML + '<algorithm algorithmName = \''+ algorithm.algorithmName + '\'>';
	    			for(var i =0;i< inputDatas.length; i++){
	    				var inputData = inputDatas[i];
	    				modeXML = modeXML + '<data>';
	    					modeXML = modeXML + '<dataKind>';
	    						modeXML = modeXML + 'InputData';
	    					modeXML = modeXML + '</dataKind>';
	    					modeXML = modeXML + '<dataName>';
    							modeXML = modeXML + inputData.dataName;
    						modeXML = modeXML + '</dataName>';
	    					modeXML = modeXML + '<dataValue>';
								modeXML = modeXML + inputData.value[0];
						    modeXML = modeXML + '</dataValue>';    						
    					modeXML = modeXML + '</data>';
	    			}
	    			for(var i =0;i< outputDatas.length; i++){
		    			var outputData = outputDatas[i];
		    			modeXML = modeXML + '<data>';
	    					modeXML = modeXML + '<dataKind>';
	    						modeXML = modeXML + 'OutputData';
	    					modeXML = modeXML + '</dataKind>';
	    					modeXML = modeXML + '<dataName>';
								modeXML = modeXML + outputData.dataName;
							modeXML = modeXML + '</dataName>';
	    					modeXML = modeXML + '<dataValue>';
							if(KenyaStatus == true && outputData.dataName=="TWI"){
								modeXML = modeXML + outputData.value[0]+';'+KenyaExtent;
							}else{  
							    modeXML = modeXML + outputData.value[0];
							}

						    modeXML = modeXML + '</dataValue>';    						
						modeXML = modeXML + '</data>';
	    			}
	    			      
	    			for(var i =0;i< paras.length; i++){
		    			       
	    				var para = paras[i];
		    			modeXML = modeXML + '<data>';
	    					modeXML = modeXML + '<dataKind>';
	    						modeXML = modeXML + 'Parameter';
	    					modeXML = modeXML + '</dataKind>';
	    					modeXML = modeXML + '<dataName>';
								modeXML = modeXML + para.parameterName;
							modeXML = modeXML + '</dataName>';
	    					modeXML = modeXML + '<dataValue>';
								modeXML = modeXML + para.value[0];
						    modeXML = modeXML + '</dataValue>';    						
						modeXML = modeXML + '</data>';
			              
	    			}
	    			modeXML = modeXML + '</algorithm>';
	    		modeXML = modeXML + '</task>';
 
	    } 
    	modeXML = modeXML + '</model>';  
                      		  	          
    	var ajax = new Ajax();
	    url = "RunBpel.action";     
	    ajax.open("post",url,true);    
	    ajax.setRequestHeader("Content-Type","text/xml");
	    ajax.onreadystatechange = function(){  
		    if(ajax.readyState == 4 && ajax.status == 200){
		    	var tag=ajax.responseText.pJSON().tag;     
		    	if(tag ==1){    
		    		Ext.getCmp('modelprogressbar').setVisible(false); 
		    		var earth = tabs.child('#EarthTab');
	    			earth.tab.show();  
	    		    tabs.setActiveTab(earth);          
	    		    var projInfo = ajax.responseText.pJSON().envProj;
	    		    var filePath = ajax.responseText.pJSON().csvFile;
	    		    var mapfiles = ajax.responseText.pJSON().mapfiles;
		    		var layers = ajax.responseText.pJSON().layers;
		    		var srs = ajax.responseText.pJSON().srs;
		    		var semantics = ajax.responseText.pJSON().semantics;
					////
		    		
					var maxs = ajax.responseText.pJSON().maxs;
					var mins = ajax.responseText.pJSON().mins;
		    		wms_results = [];
	    		    if (projInfo != null && filePath !=null)
	    		    {
	    		    	checkSamples(filePath, projInfo);
	    		    	if(addSamples!=null){    
							addSamples.setVisibility(true);
					        map.setLayerIndex(addSamples,index+5);  
						}
						var result = Ext.getCmp('easttabs').child('#result_display');
						result.tab.show();              
						Ext.getCmp('easttabs').setActiveTab(result);
						files_for_download = document.getElementById('files_for_download');
			    		var files_for_download_html = '';
			    		//TODO:judge the result format, if it is a csv file or a tif file
			    		for(var i =0; i< layers.length; i++){ 
			    			var tmpLayer = layers[i].split("/");
			    			var temp = //'<a href= "'+ resultfile_path + layers[i] + '.tif' +'" target= "_self ">'
							            '<a href= "'+ resultfile_path + layers[i] + '.csv' +'" target= "_self ">'
			    				        + tmpLayer[1] +'</a><br/>';
			    		    temp = temp.replace("result_egc/","");
			    			files_for_download_html = files_for_download_html + temp;
			    			
			    		}
						//files_for_download_html	= files_for_download_html.replace("result_egc/","");				
			    		files_for_download.innerHTML = files_for_download_html;
//			    		var validate_rmse = document.getElementById('validate_rmse');
//			    		validate_rmse.style.visibility = 'hidden';
//			    		var map_for_show = document.getElementById('map_for_show');
//			    		map_for_show.style.visibility = 'hidden';
//			    		var select_show_map = document.getElementById('select_show_map');
//			    		select_show_map.style.visibility = 'hidden';
//	    		    	var title_map_legend = document.getElementById('title_map_legend');
//	    		    	title_map_legend.style.visibility = 'hidden';
//	    		    	var legend_container = document.getElementById('legend_container');
//	    		    	legend_container.style.visibility = 'hidden';
	    		    	
	    		    }else{
		    		    	for(var i=0;i< mapfiles.length ; i++){
		    		        var tmpLayer = layers[i].split("/");
			    			var wms_result = new WMS_Result(mapfiles[i],layers[i],srs,tmpLayer[1],maxs[i],mins[i]);
		    			    wms_results.push(wms_result);
	    			    
		    			}//end of for
		    			displayresult(wms_results[0].wms,wms_results[0].legendUrl,maxs[0],mins[0]);
		    			var select_show_map = document.getElementById('select_show_map');   
		    		var select_show_map_html = '<select  STYLE="width: 110px"  onclick="clickSelectValue(this);" onchange="getSelectValue(this);">';
		    		
					for(var i =0 ;i< semantics.length; i++){
						var tmpLayer = layers[i].split("/");
		    			select_show_map_html = select_show_map_html + '<option value = "' + i + '">' + tmpLayer[1] + '</option>'; 
		    			
		    		}
					currentLayerName = semantics[0];       
					select_show_map_html = select_show_map_html + '<option value ="0">Clear result</option>'; 
		    		select_show_map_html = select_show_map_html + '</select>';           
					select_show_map_html = select_show_map_html + '&nbsp;opacity&nbsp;';
					select_show_map_html = select_show_map_html + '<select  onclick="clickLayerOpacity(this);" onchange="getLayerOpacity(this);">';                     
					select_show_map_html = select_show_map_html + '<option selected="selected" value ="1.0">1.0</option><option value ="0.9">0.9</option><option value ="0.8">0.8</option><option value ="0.7">0.7</option>';
					select_show_map_html = select_show_map_html + '<option value ="0.6">0.6</option><option value ="0.5">0.5</option><option value ="0.4">0.4</option><option value ="0.3">0.3</option>';
					select_show_map_html = select_show_map_html + '<option value ="0.2">0.2</option><option value ="0.1">0.1</select>'; 
		    		select_show_map.innerHTML = select_show_map_html;     
		    		
		    		files_for_download = document.getElementById('files_for_download');
		    		var files_for_download_html = '';
		    		//TODO:judge the result format, if it is a csv file or a tif file
		    		for(var i =0; i< layers.length; i++){ 
		    			var tmpLayer = layers[i].split("/");
		    			var temp = //'<a href= "'+ resultfile_path + layers[i] + '.tif' +'" target= "_self ">'
						            '<a href= "'+ resultfile_path + layers[i] + '.tif' +'" target= "_self ">'
		    				        + tmpLayer[1] +'</a><br/>';
		    			//select_show_map_html = select_show_map_html + '<option value = "' + i + '">' + tmpLayer[1] + '</option>'; 
		    			//temp = temp.replace("result_egc/","");
		    			files_for_download_html = files_for_download_html + temp;
		    		}
					//files_for_download_html	= files_for_download_html.replace("result_egc/","");				
		    		files_for_download.innerHTML = files_for_download_html;
	    		    }
		
		    		
		    		//
		    	}else{   
					Ext.getCmp('modelprogressbar').setVisible(false); 
					alert("The application fails");
				}//end of if(tag ==1)            
		    }         
	    };  
	    ajax.send(modeXML); 
	};
	this.init = function(taskname){
	    this.list=[];  // 
	    this.reDraw(); // clear the previous element  
	    if(taskname == ""){
		   return 1;
		}          
	    if (this.canvas.getContext){
			         
			var kb = new knowledgeBase();

			var _task = new task(300,400,100,50,taskname,this.canvas,this);
			//var _task = new task(300,1400,100,50,taskname,this.canvas,this);
			_task.initAlgorithms();
			_task.setDefaultAlgorithm();
			var algorithmName =  _task.getSelectedAlgorithm().algorithmName;
			var inputnames = kb.findInputDataNames(algorithmName);
			var outputnames = kb.findOutputDataNames(algorithmName);
			var parameternames = kb.findParameterNames(algorithmName);
			
			var inputdatas = [];    
			var outputdatas = [];
			var parameters = [];
			for(var i = 0;i<inputnames.length;i++){
				var _data=new data(100 + i*50,200,40,25,inputnames[i],this.canvas);
				//var _data=new data(100 + i*50,1200,40,25,inputnames[i],this.canvas);
			    _data.hasValue = false;
				//_data.draw();
				this.list.push(_data);         
				inputdatas.push(_data);
			}
			for(var i =0;i< outputnames.length;i++){
				var _data;
				if(outputnames[i]=="Uncertainty Map"){  
					_data=new data(500 + i*50,200,0,0,outputnames[i],this.canvas);
				}else {   
					_data=new data(500 + i*50,200,40,25,outputnames[i],this.canvas);
				}
				//var _data=new data(500 + i*50,200,40,25,outputnames[i],this.canvas);
				//var _data=new data(500 + i*50,1200,40,25,outputnames[i],this.canvas);
			    //_data.hasValue = false;
				var format;
				var nowtime = (new Date()).valueOf();
				var dataName;
				var filename;
				if(outputnames[i] == "result samples"){
					format = ".csv";     
				    dataName = _data.dataName.replace(/\s/g,"");   
				    filename = "result_egc/" +  dataName + nowtime + format;  
				}else{
					format = ".tif";       
				    dataName = _data.dataName.replace(/\s/g,"");   
				    filename = "result_egc/" +  dataName + nowtime + format; 
				}
				 
			       
			    var value = [];                       
				value.push(filename);     
				_data.setValue(value);      
				_data.hasValue = true;
				
			    _data.lastValue = true;  
			    //_data.draw();       
				this.list.push(_data);
				outputdatas.push(_data);
			}
			for(var i = 0; i< parameternames.length; i++){
				   
				var para = new parameter(parameternames[i]);
				parameters.push(para);         
				
			}            
			
			_task.isReadyToRun = false;
			_task.setInputDatas(inputdatas);
			_task.setOutputDatas(outputdatas);       
			kb.setParametersDefaultValue(algorithmName,parameters);
			_task.setParameters(parameters);         
			//_task.draw();
			this.list.push(_task);
			
			for(var i=0; i< inputdatas.length;i++){
				var con = new connection(inputdatas[i], _task, this.canvas);
			    con.isReady = false;
			    //con.draw();       
			    this.list.push(con);
			
			}
			for(var i=0; i< outputdatas.length;i++){
				if(outputdatas[i].value[0]!="Uncertainty Map"){   
					var con = new connection(_task,outputdatas[i], this.canvas);
				    con.isReady = false;
				    //con.draw();  
				    this.list.push(con);
				}  
			}			      
		}
	    this.reDraw(); 
	};
	this.reDraw = function(){ 
		             
		this.canvas.width = this.canvas.width;
		if (this.canvas.getContext){
			for(var i=0;i<this.list.length;i++){
				var c=this.list[i];
				c.check();  
				c.draw();
			}
		}
		
		if(this._dataMenu!=null)
			this._dataMenu.draw();
		if(this._taskMenu!=null){
			this._taskMenu.draw();
		}

	};
	this.onmousedown = function(e){
		var x = e.clientX - this.canvas.offsetLeft;
		      
		this.current = null;
		this.currentLR = null;
		var flag = 0;
		
		var menuItemflag = false;
		if(this._dataMenu!=null){
			var x = e.clientX - this.canvas.offsetLeft + Ext.get("modelCanvas-body").dom.scrollLeft + adjustX;
		    var y = e.clientY - this.canvas.offsetTop  + Ext.get("modelCanvas-body").dom.scrollTop + adjustY ; 
			if(this._dataMenu.isPointIn(x,y)){
				this._dataMenu.click();
				menuItemflag = true;
			}
				 
		}
		if(this._taskMenu!=null){
			var x = e.clientX - this.canvas.offsetLeft+ Ext.get("modelCanvas-body").dom.scrollLeft + adjustX;
		    var y = e.clientY - this.canvas.offsetTop+ Ext.get("modelCanvas-body").dom.scrollTop + adjustY   ; 
			if(this._taskMenu.isPointIn(x,y)){
				this._taskMenu.click();
				menuItemflag = true;
			}	
		}
        if(menuItemflag == false){
			for(var i=0;i<this.list.length;i++){      
			
				var c=this.list[i];
				if(flag ==1){    
					c.fakemousedown(e);    
				}else{
					c.onmousedown(e);	
				}
				if(c.isCurrent == true){
					flag = 1; 
					this.currentLR = c;
					if(e.button == 2){
						this.current = c;
					}
				}    
			}
		}
	    
        this._dataMenu = null;
        this._taskMenu = null;			
		if(this.current!=null){
			if(this.current.type=='ellipse'){
				var startflag = 0;
				var endflag = 0;
				for(var i =0 ;i<this.list.length; i++ ){
					if(this.list[i].type== 'arrow'){
						if(this.list[i].start ==this.current)
						{
							 startflag = 1;
						}else if(this.list[i].end ==this.current){
							 endflag = 1;
						}  
						   
					}
				}
				if(startflag ==1&&endflag==0){
					this._dataMenu = new  DataMenu(this,this.canvas,e,this.current,"Automate");
					this._dataMenu.init();
				}else if(startflag ==0&&endflag==1){ 
					this._dataMenu = new  DataMenu(this,this.canvas,e,this.current,"Automate");
					this._dataMenu.init();       
				}else if(startflag ==1&&endflag==1){
					this.current.interMediateResult = true;  //TODO: zhongjian jieguo menu
					this._dataMenu = new DataMenu(this, this.canvas,e,this.current,"Automate");
					this._dataMenu.init();
				}
			
			}else if(this.current.type=='rectangle'){
				this._taskMenu= new TaskMenu(this,this.canvas,e,this.current,"SetParameter");
				this._taskMenu.init();
			}
			
		}
		if(this.currentPre != null || this.currentLR != null ||menuItemflag == false){
			this.reDraw();	     
		}
		this.currentPre = this.currentLR;
	};
	this.onmousemove = function(e){
        if(this.currentLR == null){
        	return;
        }
		for(var i=0;i<this.list.length;i++){
			var c=this.list[i];
			c.onmousemove(e);
			
		}                
		this.reDraw();
		
		if(this._dataMenu!=null){  
			this._dataMenu.onmousemove(e);
			this._dataMenu.draw();
		}
		
		if(this._taskMenu!=null){  
			this._taskMenu.onmousemove(e);
			this._taskMenu.draw();
		}
		
	};
	this.onmouseup = function(e){
		if(this.currentLR == null){
        	return;
        }   
		for(var i=0;i<this.list.length;i++){
			var c=this.list[i];
			c.onmouseup(e);	
		}
		
		this.reDraw();
	};
	this.addGraph = function(graph){
			
	};
	this.deleteGraph = function(graph){     
		var tmp = [];
		var flag = 1;
		var last_task = null;
		for(var i =0; i< this.list.length; i++){
			if(this.list[i].type =="rectangle"){
				if(this.list[i].nextTasks.length ==0){
					last_task = this.list[i];  
				}
			}
		}
		
		if(graph.type =="rectangle"){    
			if(graph == last_task){
				for(var i = 0; i< this.list.length; i++){
					
					if(this.list[i].type =='ellipse'){  
						if(!graph.hasOutputData(this.list[i])){           
							tmp.push(this.list[i]);
						}
					}else if(this.list[i].type =='rectangle' && this.list[i] != graph){          
						if(this.list[i].taskIsNextTask(graph))
						{
							this.list[i].deleteNextTask(graph);  
						}
						tmp.push(this.list[i]);
					}else if(this.list[i].type =='arrow'){
						if(this.list[i].start != graph && this.list[i].end != graph){
							
							tmp.push(this.list[i]);
						}
					}    
				} 
			}else {
				for(var i = 0; i< this.list.length; i++){
					
					if(this.list[i].type =='ellipse'){  
						if(graph.hasOutputData(this.list[i])){   
							var value = [];
							this.list[i].setValue(value);
						}
						tmp.push(this.list[i]);
					}else if(this.list[i].type =='rectangle' && this.list[i] != graph){          
						if(this.list[i].taskIsNextTask(graph))
						{
							this.list[i].deleteNextTask(graph);  
						}
						tmp.push(this.list[i]);
					}else if(this.list[i].type =='arrow'){
						if(this.list[i].start != graph && this.list[i].end != graph){
							
							tmp.push(this.list[i]);
						}
					}    
				} 
			}
			this.list = tmp;
		}
		      
		while(flag ==1){    
			flag = 0;
			var invalid_data = null;
			var invalid_task = null;
			for(var i =0; i< this.list.length; i++){
				if(this.list[i].type =='ellipse' && !last_task.hasOutputData(this.list[i])){
					
					var tag = 0;
					for(var j =0; j< this.list.length; j++){
						if(this.list[j].type =='arrow' && this.list[j].start ==this.list[i]){
							tag = 1;
							break;               
						}
					}
					if(tag ==0){
						invalid_data = this.list[i];
						flag = 1;             
						break;
					}
				}else if(this.list[i].type =='rectangle' && this.list[i] != last_task){
					var tag = 0;
					for(var j =0; j< this.list.length; j++){
						if(this.list[j].type =='arrow' && this.list[j].start ==this.list[i]){
							tag = 1;
							break; 
						}
					}
					if(tag ==0){
						invalid_task = this.list[i];
						flag = 1;
						break;
					}
				}
			}// end of for
			if(invalid_data != null){
				 
				var temp =[];
				for(var i = 0; i< this.list.length; i ++){
					if(this.list[i].type == 'rectangle'){
						temp.push(this.list[i]);
					}else if(this.list[i].type == 'ellipse' ){
						if(this.list[i]!= invalid_data){
							temp.push(this.list[i]);
						}
					}else if(this.list[i].type == 'arrow'){
						if(this.list[i].end != invalid_data){
							temp.push(this.list[i]);
						}
					}  
				}
				this.list = temp;
			}else if(invalid_task != null){       
				
				var temp =[];   
				for(var i = 0; i< this.list.length; i ++){
					if(this.list[i].type == 'ellipse'){
						temp.push(this.list[i]);
					}else if(this.list[i].type == 'rectangle' ){
						if(this.list[i]!= invalid_task){
							if(this.list[i].taskIsNextTask(invalid_task))
							{
								this.list[i].deleteNextTask(invalid_task);  
							}
							temp.push(this.list[i]);
						}
					}else if(this.list[i].type == 'arrow'){    
						if(this.list[i].end != invalid_task){
							temp.push(this.list[i]);
						}
					}
				}
				this.list = temp;
			}          
		}//end of while
	};
	this.deleteGraph1 = function(graph){       
	    
		var preTasks = [];
		for(var i=0;i<this.list.length;i++){
			if(this.list[i].type =='rectangle'){
				var nextTasks = this.list[i].nextTasks;
				if(nextTasks.length ==1){
					for(var j=0;j<nextTasks.length;j++){
						if(nextTasks[j] == graph){
							preTasks.push(this.list[i]);
						}
						
					}  
				}
                         
			}
		}// end of for
		
		for(var i=0;i<preTasks.length;i++){
			this.deleteGraph(preTasks[i]);
		}
		
		var tmp = [];
		for(var i = 0;i <this.list.length;i++){
			if(this.list[i].type=="rectangle"){
				if(this.list[i]!=graph)
				{  
					// by jjc
					if(this.list[i].taskIsNextTask(graph)){
						this.list[i].deleteNextTask(graph);  
					}
					// by jjc
					tmp.push(this.list[i]);
				}
			}else if(this.list[i].type =='arrow'){
				if(this.list[i].start!=graph&&this.list[i].end!=graph){
					tmp.push(this.list[i]);
				}
			
			}else if(this.list[i].type =='ellipse'){
					var counter = 0;
					if(graph.hasInputData(this.list[i])){
						for(var k=0;k<this.list.length;k++){
							if(this.list[k].type =='rectangle'){
								if(this.list[k].hasInputData(this.list[i])||this.list[k].hasOutputData(this.list[i]))
									counter++;
							}
						}
						
						if(counter>1){
							tmp.push(this.list[i]);
							counter =0;
						}
					}else if(graph.hasOutputData(this.list[i])){
						
						for(var k=0;k<this.list.length;k++){
							if(this.list[k].type =='rectangle'){
								if(this.list[k].hasOutputData(this.list[i])||this.list[k].hasInputData(this.list[i]))
									counter++;
							}
						}
					
						if(counter>1){
							tmp.push(this.list[i]);
							var value = [];
							this.list[i].setValue(value);
							counter =0;
						}
					
					}else{
						tmp.push(this.list[i]);
					}
			}
		    
		}// end of for
		this.list = tmp;
	};
};
var point = function (x,y){
	this.x = x;
	this.y = y;
	this.type = 'point';
};

var SampleMappingParametersWin = null;  
var AdditonalSamplingWin = null;
var PurposiveSampingWin =null;
var TaskMenuItem = function(graphManager,canvas,x,y,graph,text){
	this.graphManager = graphManager;
	this.canvas = canvas;
	this.graph = graph;
	this.x = x ;
	this.y = y;
	this.width =150;        
	this.height = 30;
	this.text = text;
	this.isCurrent=false;
	this.fillStyle = '#dddddd';  
	this.type = 'menuItem';
	this.isPointIn=function(x1,y1){
		if(x1 > this.x && x1 < this.x + this.width  && y1 > this.y&& y1 < this.y + this.height ){
			return true;
		}
		return false;
	};
	this.onmousemove = function(e){
		var x = e.clientX - this.canvas.offsetLeft + Ext.get("modelCanvas-body").dom.scrollLeft + adjustX;
		var y = e.clientY - this.canvas.offsetTop + Ext.get("modelCanvas-body").dom.scrollTop+ adjustY ; 
		if(this.isPointIn(x, y)){
			this.fillStyle = 'yellow';
		}else{
			this.fillStyle = '#dddddd';  
		} 
	};
	this.click = function(){   
		if(this.text == 'Delete'){
			
			this.graphManager.deleteGraph(this.graph);
		    this.graphManager.reDraw();
		}else if(this.text =="SetParameter"){
			//this.graphManager.topologySort();    
			//this.graphManager.saveModel(); 
			var paras = this.graph.getParameters();
			if(paras.length == 0){
				return 0;
			}else {  
			 	var win = GeoExt.createParameterSetWindow(paras);
			 	win.show();  
			}
		}else if(this.text == "Run"){
			//=========test checkSamples whether can use=================
//			var filePath = "result_egc/resultsamples1470412940405.csv";
//			var projInfo = "32650#proj=utm zone=50 datum=WGS84 units=m no_defs";
//			checkSamples(filePath, projInfo); 
			//===========================================================
			Ext.getCmp('modelprogressbar').setVisible(true); 
			this.graphManager.generateBPEL();           
			this.graphManager.topologySort();     
		}else if(this.text == 'Operation Parameters'){
			if(this.graph.taskName == "Sampling Based On Uncertainty")
			{
					if(AdditonalSamplingWin == null){
					var paras = this.graph.getParameters();
					//var paras = null;
					AdditonalSamplingWin = GeoExt.createAdditonalSamplingWin(paras);       
					AdditonalSamplingWin.show();   
			   }else
			   {
				   	var paras = this.graph.getParameters();
					//var paras = null;
					AdditonalSamplingWin = GeoExt.createAdditonalSamplingWin(paras);       
					AdditonalSamplingWin.show(); 
			   }
			}else if(this.graph.taskName == "sampling based on purposive"){
				   if(PurposiveSampingWin == null){
					var paras = this.graph.getParameters();
					//var paras = null;
					PurposiveSampingWin = GeoExt.createPurposiveSamplingWin(paras);       
					PurposiveSampingWin.show();   
			   }else
			   {
				   	var paras = this.graph.getParameters();
					//var paras = null;
					PurposiveSampingWin = GeoExt.createPurposiveSamplingWin(paras);       
					PurposiveSampingWin.show(); 
			   }
			}else if(this.graph.taskName == "Sample Based Mapping"){
					if(SampleMappingParametersWin == null){
					var paras = this.graph.getParameters();
					//var paras = null;
					SampleMappingParametersWin = GeoExt.createSampleMappingParametersWin(paras);        
					SampleMappingParametersWin.show();   
			}else{        
					var paras = this.graph.getParameters(); 
					//var paras = null;          
					SampleMappingParametersWin = GeoExt.createSampleMappingParametersWin(paras);         
					SampleMappingParametersWin.show();
			     }  
			}
			 
		}else if(this.text =='SelectAlgorithm'){
		    var  AlgorithmSelectWin = GeoExt.createAlgorithmSelectWindow(this.graph,this.graphManager,this.canvas);
			             
			AlgorithmSelectWin.show();
		
		}
		canvas.onmouseup(); 
	};        
	this.draw = function(){
		this.isCurrent=true;
		var ctx = this.canvas.getContext('2d');
		ctx.save();
		ctx.shadowColor="#999999";
		ctx.strokeStyle ='hsl(120,50%,50%)';                    
		ctx.shadowBlur=2;
		ctx.shadowOffsetX=2;
		ctx.shadowOffsetY=2;

		ctx.beginPath();
		ctx.moveTo(this.x,this.y); 		
		ctx.lineTo(this.x + 150,this.y);
		ctx.lineTo(this.x + 150,this.y + 30);  
		ctx.lineTo(this.x,this.y + 30);
		ctx.fillStyle = this.fillStyle;
		//ctx.fillStyle = '#dddddd';
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();
		
		
		ctx.save();
		ctx.fillStyle = '#000000';
		ctx.font="15px Arial";
		ctx.textAlign = "center";
		ctx.fillText(this.text,this.x + 70,this.y + 20,150);
		ctx.restore();
	         
	};

};
var TaskMenu = function(graphManager,canvas,e,graph,text){
	this.graphManager = graphManager;
	this.canvas = canvas;
	this.graph = graph;
	this.e = e;
	this.text = text;
    this.list = [];
	this.current = null;
	this.isPointIn = function(x,y){
		for(var i =0 ;i< this.list.length; i++){
			if(this.list[i].isPointIn(x,y)){
			   this.current = this.list[i];
			   return true;
			}	
		}
		return false;
	};
	this.click = function(){
		this.current.click();
		
	};
	this.onmousemove = function(e){  
		for(var i = 0; i<this.list.length; i++){
			this.list[i].onmousemove(e);
		}
	};      
	this.init = function(){
		var x = this.e.clientX - this.canvas.offsetLeft + Ext.get("modelCanvas-body").dom.scrollLeft + adjustX;
		var y = this.e.clientY - this.canvas.offsetTop + Ext.get("modelCanvas-body").dom.scrollTop +  adjustY ; 
		     
		if(this.graph.isReadyToRun&& this.graph.canRun){
		       
			if(this.graph.taskName =='Sample Based Mapping' || this.graph.taskName =='Sampling Based On Uncertainty' || this.graph.taskName =='sampling based on purposive'){
				
				var item0 = new  TaskMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Run");
			    this.list.push(item0);
				
				var item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 31,this.graph,"Operation Parameters");
			    this.list.push(item1);
				      
				var item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y+61,this.graph,"Delete");
			    this.list.push(item2);
			    
			}else{
				
				var item0 = new  TaskMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Run");
			    this.list.push(item0);
			    if(this.graph.taskName =="StreamLE"){
					var item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 31,this.graph,"SetParameter");
				    this.list.push(item1);

				      
					var item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y+61,this.graph,"Delete");
				    this.list.push(item2);   
			    }else {
					var item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 31,this.graph,"Delete");
				    this.list.push(item2);
				}

			}

		}else{
		               
			if(this.graph.taskName =='Sample Based Mapping' || this.graph.taskName =='Sampling Based On Uncertainty' || this.graph.taskName =='sampling based on purposive'){
				var item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Operation Parameters");
			    this.list.push(item1); 
			    var item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y+31,this.graph,"Delete");
			    this.list.push(item2);        
			}else {
				if(this.graph.taskName =="StreamLE"){
					var item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y,this.graph,"SetParameter");
				    this.list.push(item1);   
	                 
					var item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y+31,this.graph,"Delete");
				    this.list.push(item2);
				//}else if(this.graph.taskName =="FlowAC") {    
				}else if(this.graph.taskName =="SCACal" && nenjiangStatus == true) {      
                               				
					var item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y,this.graph,"SelectAlgorithm");
				    this.list.push(item1);
					        
					var item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y+31,this.graph,"Delete");
				    this.list.push(item2);
				}else{
					var item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Delete");
				    this.list.push(item2);
				}
 
			}  
			
		}

	};
	this.draw = function(){
		for(var i = 0;i<this.list.length;i++){
			this.list[i].draw();
		}
	
	};
};

var EnvLayersManageWin = null;
var DataMenuItem = function(graphManager,canvas,x,y,graph,text){
	this.graphManager = graphManager;
	this.canvas = canvas;
	this.graph = graph;
	this.x = x ;       
	this.y = y;    
	this.width =150;   
	this.height = 30;
	this.text = text;
	this.isCurrent=false;
	this.type = 'menuItem';
	this.fillStyle = '#dddddd'; 
	this.isPointIn=function(x1,y1){
		if(x1 > this.x && x1 < this.x + this.width  && y1 > this.y&& y1 < this.y + this.height ){
			return true;
		}
		return false;
	};
	this.onmousemove = function(e){
		var x = e.clientX - this.canvas.offsetLeft + Ext.get("modelCanvas-body").dom.scrollLeft + adjustX;
		var y = e.clientY - this.canvas.offsetTop + Ext.get("modelCanvas-body").dom.scrollTop+ adjustY ; 
		if(this.isPointIn(x, y)){
			this.fillStyle = 'yellow';
		}else{
			this.fillStyle = '#dddddd';  
		} 
	};
	
	this.click = function(){
		//this.fillStyle = 'yellow'; 
		
		if(this.text =='Automate'){
			var kb = new knowledgeBase();
			var taskname = kb.findTaskNameHasOutput(this.graph.dataName);
			if(taskname==null)
			   return;		
			var x_task = this.graph.x + 150;
			var y_task = this.graph.y - 70;      
			
			var _task = new task(x_task,y_task,100,50,taskname,this.canvas,this.graphManager);     
			this.graphManager.list.push(_task);
			_task.initAlgorithms();
			_task.setDefaultAlgorithm();
			var  algorithmName =  _task.getSelectedAlgorithm().algorithmName;
			var inputnames = kb.findInputDataNames(algorithmName);
			var parameternames = kb.findParameterNames(algorithmName);
			var inputdatas = [];
			var outputdatas = [];
			var paras = [];
			var counter = 0;
			for(var i =0;i<inputnames.length; i++){
				var flag = 0;
				for(var j=0;j<this.graphManager.list.length;j++){
				   if(this.graphManager.list[j].type =="ellipse"){
					  if(this.graphManager.list[j].dataName == inputnames[i]){
						inputdatas.push(this.graphManager.list[j]);
						flag = 1;
						for(var k = 0; k< this.graphManager.list.length; k++){
							if(this.graphManager.list[k].type == 'rectangle'){
								if(this.graphManager.list[k].hasOutputData(this.graphManager.list[j]))
								{
									this.graphManager.list[k].addNextTask(_task);
								}
							}
						}// end of for
					  }// end of if
				   }
				}  
				if(flag == 0){
					var x_data = this.graph.x + 350;
					var y_data = this.graph.y - 100; 
					var _data=new data(x_data + counter*50,y_data,40,25,inputnames[i],this.canvas);
	
					this.graphManager.list.push(_data);
					inputdatas.push(_data);
					counter ++;
				}
			}
					
			for(var i = 0;i<this.graphManager.list.length;i++){
				if(this.graphManager.list[i].type == 'rectangle'){
					if(this.graphManager.list[i].hasInputData(this.graph))
					{
						_task.addNextTask(this.graphManager.list[i]);
					}
				}
			}
			
			for(var i =0; i<parameternames.length; i++){
				var para = new parameter(parameternames[i]);
				paras.push(para);
			}
			
			var outputdatas = [];
			var value = [];
			
			var nowtime = (new Date()).valueOf();
			var filename =null ;
			// by jjc 2012-8-23
			if(this.graph.dataName == 'Presence Sites'){
				filename = "result_egc/" +  this.graph.dataName + nowtime + ".shp";
			}else{ 
				filename = "result_egc/" +  this.graph.dataName + nowtime + ".tif";
			}
			// by jjc 2012-8-23
			//var filename = this.graph.dataName + nowtime + ".asc"; 
			filename = filename.replace(/\s/g,"");  
			value.push(filename); 
			this.graph.setValue(value);       
			outputdatas.push(this.graph);
			//// begin of Sample Based Mapping
			var currentTask = null;
			for(var i =0; i<this.graphManager.list.length; i++){
				if(this.graphManager.list[i].type=='rectangle'&&this.graphManager.list[i].hasInputData(this.graph)){
					currentTask = this.graphManager.list[i];
					break;
				}
			}
			if(currentTask.taskName == 'Sample Based Mapping'||currentTask.taskName == 'Sampling based on Uncertainty'|| currentTask.taskName =='sampling based on purposive'){
				       
			  var algorithm = currentTask.selectedAlgorithm;
			  var inputDatas = algorithm.inputDatas;
			  var temps = [];
			  var Env_Layers_ManageMent = null;
			  var layerDataNames = "";
			  for(var i=0;i<inputDatas.length;i++){  
				  if(inputDatas[i].dataName == 'Env.Layers ManageMent'){
					  Env_Layers_ManageMent = inputDatas[i];      
				  }
				  if(inputDatas[i].dataName != 'Sample Data' && inputDatas[i].dataName != 'Env.Layers ManageMent'){
					  temps.push(inputDatas[i]);   
				  }
			  }
			  if(temps.length == 1){
				  layerDataNames = temps[0].value[0];
			  }else if(temps.length > 1){    
				  for(var i =0;i<temps.length ; i++){
					  if(i == 0){   
						  layerDataNames = layerDataNames  +temps[i].value[0];
					  }else{
						  layerDataNames = layerDataNames + "#" +temps[i].value[0];
					  }
					  
				  }   
			  }
			         
			  var value = [];
			  value.push(layerDataNames);          
			  //value.push("slope.asc");                               
			  Env_Layers_ManageMent.setValue(value);     
			  
			}else if(currentTask.taskName == 'Habitat Mapping'){
				  var algorithm = currentTask.selectedAlgorithm;
				  var inputDatas = algorithm.inputDatas;
				  var temps = [];
				  var Env_Layers_ManageMent = null;
				  var layerDataNames = "";
				  for(var i=0;i<inputDatas.length;i++){  
					  if(inputDatas[i].dataName == 'HM Env.Layers ManageMent'){
						  Env_Layers_ManageMent = inputDatas[i];      
					  }
					  if(inputDatas[i].dataName != 'Presence Sites' && 
					     inputDatas[i].dataName != 'HM Env.Layers ManageMent' &&
					     inputDatas[i].dataName != "Cumulative Visibility"){
						  temps.push(inputDatas[i]);   
					  }
				  }
				  if(temps.length == 1){
					  layerDataNames = temps[0].value[0];
				  }else if(temps.length > 1){    
					  for(var i =0;i<temps.length ; i++){
						  if(i == 0){   
							  layerDataNames = layerDataNames  +temps[i].value[0];
						  }else{
							  layerDataNames = layerDataNames + "#" +temps[i].value[0];
						  }
						  
					  }   
				  }
				  if(temps.length>=1){
					  var value = [];
					  value.push(layerDataNames);          
					  //value.push("slope.asc");                               
					  Env_Layers_ManageMent.setValue(value); 
				  }       
				     
			}else if(currentTask.taskName == 'Frequency Sampler'){
				  var algorithm = currentTask.selectedAlgorithm;
				  var inputDatas = algorithm.inputDatas;
				  var temps = [];
				  var Env_Layers_ManageMent = null;
				  var layerDataNames = "";
				  for(var i=0;i<inputDatas.length;i++){  
					  if(inputDatas[i].dataName == 'FS Env.Layers ManageMent'){
						  Env_Layers_ManageMent = inputDatas[i];      
					  }
					  if(inputDatas[i].dataName != 'Presence Polygons' && 
					     inputDatas[i].dataName != 'FS Env.Layers ManageMent' ){
						  temps.push(inputDatas[i]);   
					  }
				  }
				  if(temps.length == 1){
					  layerDataNames = temps[0].value[0];
				  }else if(temps.length > 1){    
					  for(var i =0;i<temps.length ; i++){
						  if(i == 0){   
							  layerDataNames = layerDataNames  +temps[i].value[0];
						  }else{
							  layerDataNames = layerDataNames + "#" +temps[i].value[0];
						  }
						  
					  }   
				  }
				  if(temps.length>=1){       
					  var value = [];
					  value.push(layerDataNames);          
					  //value.push("slope.asc");                               
					  Env_Layers_ManageMent.setValue(value);   
				  }       
                 
			}
			//// end of  Sample Based Mapping  
			_task.setInputDatas(inputdatas);
			_task.setOutputDatas(outputdatas);
			kb.setParametersDefaultValue(algorithmName,paras);
			_task.setParameters(paras);
             
			var con = new connection(_task,this.graph, this.canvas);
			this.graphManager.list.push(con);	
			
			for(var i=0;i<inputdatas.length;i++){
				var con = new connection(inputdatas[i],_task, this.canvas);
				this.graphManager.list.push(con);
			}
			this.graphManager._dataMenu = null;                    
			this.graphManager.reDraw();        
			              
		}else if(this.text =='SetData'){   
			    
			var win = GeoExt.createInputDataWindow(this.graph,this.graphManager);
			win.show();     
			      
		}else if(this.text =='SetOutput'){    
	             
			var win = GeoExt.createOutputDataWindow(this.graph,this.graphManager);  
			win.show();             
		}else if(this.text =='Add/Remove Env.Layers'){        
			if(EnvLayersManageWin == null){  
				EnvLayersManageWin = GeoExt.createEnvLayersManageWin(this.graph,this.graphManager);
				    
				EnvLayersManageWin.show();  
			}else{  
				EnvLayersManageWin = GeoExt.createEnvLayersManageWin(this.graph,this.graphManager);                      
				EnvLayersManageWin.show();
			}
			
		}else if(this.text =="Add/Remove HMEnv.Layers"){
			var HMEnvLayersManageWin = GeoExt.createHMEnvLayersManageWin(this.graph,this.graphManager);
		        
			HMEnvLayersManageWin.show();  
		}else if(this.text =="Add/Remove FSEnv.Layers"){
			var FSEnvLayersManageWin = GeoExt.createFSEnvLayersManageWin(this.graph,this.graphManager);
	        
			FSEnvLayersManageWin.show();  
		}else if(this.text == 'SetSampleData'){
			var win = GeoExt.createSampleDataWin(this.graph,this.graphManager);
			win.show();   
		}else if(this.text == "download"){
			var downLoadFilePath = this.graph.getValue();
			window.location.href = "http://159.226.110.183/egcDataFiles/" +  downLoadFilePath;
			//TODO:change the egc_result folder into useser`s own folder
		}
		canvas.onmouseup();          
              		
	};
	this.draw = function(){
		this.isCurrent=true;
		var ctx = this.canvas.getContext('2d');
		ctx.save();
		ctx.shadowColor="#999999";
		ctx.strokeStyle ='hsl(120,50%,50%)';      

		ctx.shadowBlur=2;
		ctx.shadowOffsetX=2;
		ctx.shadowOffsetY=2;

		ctx.beginPath();
		ctx.moveTo(this.x,this.y); 		
		ctx.lineTo(this.x + 150,this.y);
		ctx.lineTo(this.x + 150,this.y + 30);  
		ctx.lineTo(this.x,this.y + 30);
		//ctx.fillStyle = '#dddddd';          
		ctx.fillStyle = this.fillStyle;  
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();
		
		
		ctx.save();            
		ctx.fillStyle = '#000000';   
		ctx.font="15px Arial";     
		ctx.textAlign = "center";
		ctx.fillText(this.text,this.x + 70,this.y + 20,150);            
		ctx.restore();
	
	};


};
var DataMenu = function(graphManager,canvas,e,graph,text){
	this.graphManager = graphManager;
	this.canvas = canvas;
	this.graph = graph;
	this.e = e;
	this.text = text;
    this.list = [];
	this.current = null;
	this.isPointIn = function(x,y){
		for(var i =0 ;i< this.list.length; i++){
			if(this.list[i].isPointIn(x,y)){
			   this.current = this.list[i];
			   return true;
			}	
		}
		return false;
	};
	this.click = function(){
		this.current.click();
	};
	this.onmousemove = function(e){
		for(var i =0;i<this.list.length;i++){
			this.list[i].onmousemove(e);
		}
	};
	this.init = function(){
		var x = this.e.clientX - this.canvas.offsetLeft + Ext.get("modelCanvas-body").dom.scrollLeft+  adjustX;
		var y = this.e.clientY - this.canvas.offsetTop+ Ext.get("modelCanvas-body").dom.scrollTop+  adjustY ; 
		          
		if(this.graph.lastValue == false){
			if(this.graph.dataName == 'Env.Layers ManageMent'){
				var item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Add/Remove Env.Layers");
			    this.list.push(item1);
			}else if(this.graph.dataName == 'Sample Data'){
				var item1 = new DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"SetSampleData");
				this.list.push(item1);     
			}else if(this.graph.dataName =="HM Env.Layers ManageMent"){    
				var item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Add/Remove HMEnv.Layers");
			    this.list.push(item1);
			}else if(this.graph.dataName =="FS Env.Layers ManageMent"){
				var item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Add/Remove FSEnv.Layers");
			    this.list.push(item1);
			}else if(this.graph.interMediateResult == true)
			{
				//var item1 = new DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"download");
				//this.list.push(item1);
			}else{
				var item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Automate");
			    this.list.push(item1);
				
				var item2 = new  DataMenuItem(this.graphManager,this.canvas,x,y+31,this.graph,"SetData");
			    this.list.push(item2);
			    //TODO:add  download button
			    //var item3 = new  DataMenuItem(this.graphManager,this.canvas,x,y+62,this.graph,"download");
			    //this.list.push(item3);
			}
			
		}else {  
			//var item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"SetOutput");
		    //this.list.push(item1);
			
		}
		    
	};
	this.draw = function(){
		for(var i = 0;i<this.list.length;i++){
			this.list[i].draw();
		}
	
	};
};	

/**
 * ellipse 
 * @param canvas the vessel for drawing
 * @param y the y axis in canvas
 * @param x the x axis in canvas
 * @param a the width of ellipse
 * @param b the height of ellipse
 * @inner type ellipse
 * @inner isCurrent 
 * @inner isLeftKeyDown
 * @inner isRightKeyDown
 * @inner isMounseMove
 * @inner isKeyUp
 * @inner fillStyle 
 * @inner hasValue
 * @inner lastValue
 * @inner hasShadow
 * @event isPointIn
 * @event fakemousedown
 * @event onmousedown
 * @event onmousemove
 * @event onmouseup
 * @event draw*/
var ellipse = function(x,y,a,b,label,canvas){
	this.x=x;
	this.y=y;
	this.a=a;
	this.b = b;
	this.label = label;
	this.canvas=canvas;  
	this.type = 'ellipse';
	this.interMediateResult = false; //TODO: lp add for download button

	this.isCurrent=false;
	this.isLeftKeyDown=false;
	this.isRightKeyDown=false;
	this.isMounseMove=false;  
	this.isKeyUp=true;
	
	//this.fillStyle = '#999999';
	this.fillStyle = '#B0E2FF'; 
	this.hasValue = false;
	this.lastValue = false;  
	this.hasShadow = false;
	
	this.isPointIn=function(x1,y1){
		var s = (this.x-x1)*(this.x-x1) / (this.a * this.a) + (this.y-y1)*(this.y-y1) / (this.b * this.b); 
		if(s < 1.0){
			return true;
		}
		return false;
	};
	this.fakemousedown = function(e){
		this.isCurrent=false;
		//this.fillStyle = '#999999';
		this.fillStyle = '#B0E2FF'; 
	};
	this.onmousedown=function(e){
		
		var x = e.clientX - canvas.offsetLeft + Ext.get("modelCanvas-body").dom.scrollLeft +  adjustX;                             
		var y = e.clientY - canvas.offsetTop + Ext.get("modelCanvas-body").dom.scrollTop + adjustY ;                     
		if(this.isPointIn(x,y)){
			if(e.button == 0){       
				    
				this.isLeftKeyDown = true;
				this.isCurrent=true;
				this.fillStyle = '#ff8c00';
				      
			}else if(e.button == 2){
				this.isRightKeyDown = true;
				this.isCurrent=true;
				this.fillStyle = '##ff8c00';
			}
		}else{
			this.isCurrent=false;
			//this.fillStyle = '#999999';   
			this.fillStyle = '#B0E2FF'; 
		}
	};
	
	this.onmousemove = function(e){
		if(this.isLeftKeyDown == true){
		
			var x = e.clientX - this.canvas.offsetLeft + Ext.get("modelCanvas-body").dom.scrollLeft + adjustX;
			var y = e.clientY - this.canvas.offsetTop + Ext.get("modelCanvas-body").dom.scrollTop+ adjustY ; 
			this.x = x;
			this.y = y;
		}
	
	};
	
	this.onmouseup = function(e){
		
		this.isLeftKeyDown=false;
		this.isRightKeyDown=false;
		this.isMounseMove=false;
		this.isKeyUp=true;
	};
	
	this.draw=function(){
		if(this.label == "Uncertainty Map")
		return;    
		var ctx = this.canvas.getContext('2d');
		ctx.save();
		
		
		if(this.hasValue )
		{   
			this.hasShadow = true;  
			ctx.shadowColor='#999999';
			ctx.shadowBlur=5;    
			ctx.shadowOffsetX=5;
			ctx.shadowOffsetY=5;
			this.fillStyle = '#9acd32';				
		}else{     
			 if(this.isCurrent==true){   
				 this.fillStyle = '#ff8c00';               
			 }else{  
				 //this.fillStyle = '#999999';
				 this.fillStyle = '#B0E2FF';      
			 }    
		}
		
		ctx.scale(1, b / a);
		ctx.beginPath();
		if(this.y <40){
			this.y = 40;   
		}
		ctx.arc(this.x,this.y / (b / a),this.a,2*Math.PI,0,true);
		ctx.fillStyle = this.fillStyle;
		ctx.fill();
		ctx.closePath();
		ctx.restore();

		ctx.save();
		ctx.fillStyle = '#000000';
		ctx.font="15px Arial";
		ctx.textAlign = "center";
		//ctx.fillText(this.label,this.x,this.y,this.a*2);
		//if(this.label != "Uncertainty Map"){
			var _array = this.label.split(" ");
			var len = _array.length;
			if(len ==1){
				ctx.fillText(this.label,this.x,this.y,this.a*2);
			}else if(len > 1){
				for(var i =0 ;i< len ;i++){
					ctx.fillText(_array[i],this.x,this.y - 10 + i*12,this.a*2);  
				}     
			}
			ctx.restore();
		//}

	};

};
/**
 * rectangle 
 * @param canvas the vessel for drawing
 * @param y the y axis in canvas
 * @param x the x axis in canvas
 * @param a the width of ellipse
 * @param b the height of ellipse
 * @param label the name of a rectangle
 * @inner type rectangle
 * @inner isCurrent 
 * @inner isLeftKeyDown
 * @inner isRightKeyDown
 * @inner isMounseMove
 * @inner isKeyUp
 * @inner fillStyle 
 * @inner isReadyToRun
 * @inner canRun
 * @inner hasShadow
 * @event isPointIn
 * @event fakemousedown
 * @event onmousedown
 * @event onmousemove
 * @event onmouseup
 * @event draw*/	
var rectangle = function (x,y,width,height,label,canvas){
	    this.x = x;
        this.y = y;
		this.width = width;
		this.height = height;
		this.label = label;
		this.canvas = canvas;
		this.isSet = false;   
		this.type = 'rectangle';

    	this.isCurrent=false;
		this.isLeftKeyDown=false;
		this.isRightKeyDown=false;
		this.isMounseMove=false;
		this.isKeyUp=true;
		
		//this.fillStyle = '#999999';
		this.fillStyle = '#B0E2FF';
		this.isReadyToRun = false;
		this.hasShadow = false;
		this.canRun = false; 
		
		this.isPointIn=function(x1,y1){
			if(x1 > this.x - this.width / 2.0 && x1 < this.x + this.width / 2.0 && y1 > this.y - this.height / 2.0 && y1 < this.y + this.height / 2.0){
				return true;
			}
			return false;
		};
		this.fakemousedown = function(e){
			this.isCurrent=false;
			//this.fillStyle = '#999999';
			this.fillStyle = '#B0E2FF';
		}; 
		this.onmousedown=function(e){
			var x = e.clientX - canvas.offsetLeft + Ext.get("modelCanvas-body").dom.scrollLeft+ adjustX;
			var y = e.clientY - canvas.offsetTop + Ext.get("modelCanvas-body").dom.scrollTop+ adjustY ; 
			if(this.isPointIn(x,y)){
				if(e.button == 0){
					
					this.isLeftKeyDown = true;
					this.isCurrent=true;
					this.fillStyle = '#cccc8c';
					
				}else if(e.button == 2){     
					this.isRightKeyDown = true;
					this.isCurrent=true;        
					this.fillStyle = '#cccc8c';    
				}
			}else{
			    this.isCurrent=false;
				//this.fillStyle = '#999999';
			    this.fillStyle = '#B0E2FF';
			}
		};
		
		this.onmousemove = function(e){
			if(this.isLeftKeyDown == true){    
		        var x = e.clientX - this.canvas.offsetLeft + Ext.get("modelCanvas-body").dom.scrollLeft+ adjustX;    
		        var y = e.clientY - this.canvas.offsetTop+ Ext.get("modelCanvas-body").dom.scrollTop+ adjustY ; 
				this.x = x;
				this.y = y;
			}     
		
		};    
		
		this.onmouseup = function(e){
			
		    this.isLeftKeyDown=false;
		    this.isRightKeyDown=false;
		    this.isMounseMove=false;
		    this.isKeyUp=true;
		};
    	
        this.draw = function(){			

			var ctx = this.canvas.getContext('2d');
			ctx.save();
			
			if(this.isReadyToRun){
				if(this.canRun == true){
					this.hasShadow = true;
					ctx.shadowColor='#999999';
					ctx.shadowBlur=5;
					ctx.shadowOffsetX=5;      
					ctx.shadowOffsetY=5;
				    this.fillStyle = '#25dad4';	      
				}else{
					this.hasShadow = true;
					ctx.shadowColor='#999999';
					ctx.shadowBlur=5;
					ctx.shadowOffsetX=5;    
					ctx.shadowOffsetY=5;           
					this.fillStyle = '#ddff8c';                       
				}
			}						
			
			
			ctx.beginPath();
			if(this.y < 40){
				this.y = 40;     
			}
    		ctx.moveTo(this.x - this.width / 2.0,this.y - this.height / 2.0); 
            ctx.lineTo(this.x + this.width / 2.0,this.y - this.height / 2.0);			
		    ctx.lineTo(this.x + this.width / 2.0,this.y  + this.height / 2.0);
			ctx.lineTo(this.x - this.width / 2.0,this.y  + this.height / 2.0);		
            ctx.closePath();			
		    ctx.fillStyle = this.fillStyle;
			ctx.fill();			
			ctx.restore();
			    
			ctx.save();
			ctx.fillStyle = '#000000';
		    ctx.font="15px Arial";   
		    ctx.textAlign = "center";       
            //ctx.fillText(this.label,this.x ,this.y,this.width*2);  
            var temp = this.label;
            var _array = temp.split(" ");
            var len = _array.length;
            if(len ==1){
            	ctx.fillText(this.label,this.x ,this.y,this.width*2);
            }else if(len > 1){
            	for(var i =0; i<len ; i++){    
            		ctx.fillText(_array[i],this.x  ,this.y -10 + i*12,this.width*2);
            	}              
            }                          
			ctx.restore();         
		};		
	
	};

/**
 * arrow 
 * @param canvas the vessel for drawing
 * @param start
 * @param end
 * @inner type arrow
 * @inner isReady 
 * @event isPointIn
 * @event fakemousedown
 * @event onmousedown
 * @event onmousemove
 * @event onmouseup
 * @event draw
 * @event crossMul
 * @event checkCross
 * */
var arrow = function(start,end, canvas){
	    this.start =start;
		this.end = end;
		this.canvas = canvas;
	    this.type = 'arrow';
		this.isReady = false;
		this.fakemousedown = function(e){};
		this.onmousedown=function(e){};
		this.onmousemove = function(e){};
		this.onmouseup = function(e){}; 
	    this.draw=function(){
			
			var ctx = this.canvas.getContext('2d');
			
			this.linewidth = 1.5;
			this.linecolor = '#999999';
			
			var len = Math.sqrt((this.start.x -this.end.x)*(this.start.x -this.end.x)+(this.start.y -this.end.y)*(this.start.y -this.end.y));
			var x1;
			var y1;
			var x2;
			var y2;
			
            if(this.start.type == 'ellipse'){
				var xs = 0;
				var ys = 0;
				var xe = this.end.x - this.start.x;
				var ye = this.end.y - this.start.y;
				var a = this.start.a;
				var b = this.start.b;
				
				if(xe != xs){
					var k = (ye - ys) / (xe - xs);
					if(xe - xs > 0){
						x1 = Math.sqrt((a*a*b*b)/(b*b+a*a*k*k));
						y1 = k * x1;
					}
					else{
						x1 = -1.0*Math.sqrt((a*a*b*b)/(b*b+a*a*k*k));
						y1 = k * x1;
					}
				}
				else if(xe = xs){
					x1 = xe;
					if(ye - ys > 0){
						y1 = Math.sqrt((a*a*b*b - b*b*x1*x1)/(a*a));
					}
					else{
						y1 = -1.0*Math.sqrt((a*a*b*b - b*b*x1*x1)/(a*a));
					}
				}				
				x1 = x1 + this.start.x ;
				y1 = y1 + this.start.y;
			}
			else  if(this.start.type == 'rectangle'){
			    var p1 ={x:this.start.x,y:this.start.y};
				var p2 ={x:this.end.x,y:this.end.y};
				var p3 = {x:this.start.x - this.start.width / 2.0,y:this.start.y - this.start.height / 2.0};
				var p4 = {x:this.start.x + this.start.width / 2.0,y:this.start.y - this.start.height / 2.0};
				var p5 = {x:this.start.x - this.start.width / 2.0,y:this.start.y + this.start.height / 2.0};
				var p6 = {x:this.start.x + this.start.width / 2.0,y:this.start.y + this.start.height / 2.0};
			    var p7 = {x:this.start.x - this.start.width / 2.0,y:this.start.y - this.start.height / 2.0};
				var p8 = {x:this.start.x - this.start.width / 2.0,y:this.start.y + this.start.height / 2.0};
				var p9 = {x:this.start.x + this.start.width / 2.0,y:this.start.y - this.start.height / 2.0};
				var p10 = {x:this.start.x + this.start.width / 2.0,y:this.start.y + this.start.height / 2.0};
				if(this.checkCross(p1,p2,p3,p4)){
				    y1 = this.start.y - this.start.height / 2.0;
					x1 = this.start.x - (this.start.y - y1)*(this.start.x - this.end.x)/(this.start.y - this.end.y);
				}else if(this.checkCross(p1,p2,p5,p6)){
					y1 = this.start.y + this.start.height / 2.0;
					x1 = this.start.x - (this.start.y - y1)*(this.start.x - this.end.x)/(this.start.y - this.end.y);
				}else if(this.checkCross(p1,p2,p7,p8)){
				    x1 = this.start.x - this.start.width / 2.0;
                    y1 = this.end.y + (x1 - this.end.x)*(this.start.y -this.end.y)/(this.start.x - this.end.x);				
				}else if (this.checkCross(p1,p2,p9,p10)){
					x1 = this.start.x + this.start.width / 2.0;
                    y1 = this.end.y + (x1 - this.end.x)*(this.start.y -this.end.y)/(this.start.x - this.end.x);	
				}
			}
			
			if(this.end.type == 'rectangle'){
			    var p1 ={x:this.start.x,y:this.start.y};
				var p2 ={x:this.end.x,y:this.end.y};
				var p3 = {x:this.end.x - this.end.width / 2.0,y:this.end.y - this.end.height / 2.0};
				var p4 = {x:this.end.x + this.end.width / 2.0,y:this.end.y - this.end.height / 2.0};
				var p5 = {x:this.end.x - this.end.width / 2.0,y:this.end.y + this.end.height / 2.0};
				var p6 = {x:this.end.x + this.end.width / 2.0,y:this.end.y + this.end.height / 2.0};
			    var p7 = {x:this.end.x - this.end.width / 2.0,y:this.end.y - this.end.height / 2.0};
				var p8 = {x:this.end.x - this.end.width / 2.0,y:this.end.y + this.end.height / 2.0};
				var p9 = {x:this.end.x + this.end.width / 2.0,y:this.end.y - this.end.height / 2.0};
				var p10 = {x:this.end.x + this.end.width / 2.0,y:this.end.y + this.end.height / 2.0};
				if(this.checkCross(p1,p2,p3,p4)){
				    y2 = this.end.y - this.end.height / 2.0;
					x2 = this.start.x + (y2 - this.start.y)*(this.end.x - this.start.x)/(this.end.y - this.start.y);
				}else if(this.checkCross(p1,p2,p5,p6)){
					y2 = this.end.y + this.end.height / 2.0;
					x2 = this.start.x + (y2 - this.start.y)*(this.end.x - this.start.x)/(this.end.y - this.start.y);
				}else if(this.checkCross(p1,p2,p7,p8)){
				    x2 = this.end.x - this.end.width / 2.0;
                    y2 = this.start.y + (x2 - this.start.x)*(this.end.y -this.start.y)/(this.end.x - this.start.x);					
				}else if (this.checkCross(p1,p2,p9,p10)){
					x2 = this.end.x + this.end.width / 2.0;
                    y2 = this.start.y + (x2 - this.start.x)*(this.end.y -this.start.y)/(this.end.x - this.start.x);	
				}
				
			}
			else if(this.end.type == 'ellipse'){
				var xe = 0;
				var ye = 0;
				var xs = this.start.x - this.end.x ;
				var ys = this.start.y - this.end.y;
				var a = this.end.a;
				var b = this.end.b;
				
				if(xs != xe){
					var k = (ye - ys) / (xe - xs);
					if(xs - xe > 0){
						x2 = Math.sqrt((a*a*b*b)/(b*b+a*a*k*k));
						y2 = k * x2;
					}
					else{
						x2 = -1.0*Math.sqrt((a*a*b*b)/(b*b+a*a*k*k));
						y2 = k * x2;
					}
				}
				else if(xe = xs){
					x1 = xe;
					if(ys - ye > 0){
						y2 = Math.sqrt((a*a*b*b - b*b*x1*x1)/(a*a));
					}
					else{
						y2 = -1.0*Math.sqrt((a*a*b*b - b*b*x1*x1)/(a*a));
					}
				}
				
				x2 = x2 + this.end.x ;
				y2 = y2 + this.end.y;
			}

			ctx.lineWidth = this.linewidth; 
			
			if(! this.isReady){
				//this.linecolor = 'red';
				this.linecolor = '#32CD32';   
				ctx.lineCap = 'round';			
				dashedLine(x1,y1,x2,y2,[10,5], ctx);
			}
			else if(this.isReady){
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.closePath();
				this.linecolor = 'green';
				ctx.strokeStyle = this.linecolor;
				ctx.stroke();
			}

			// draw the arrow
			var ang = Math.atan2(y2 - y1,x2 - x1);			
			ctx.save();
            ctx.translate(x2, y2);			
		    ctx.rotate(ang + Math.PI*0.75); 
			ctx.strokeStyle = this.linecolor;
			ctx.lineWidth = this.linewidth; 
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0,10);
			ctx.lineTo(10,0);
			ctx.closePath();
			ctx.fillStyle = this.linecolor;
			ctx.fill();
			ctx.restore();
		};
	
		this.crossMul=function(point1,point2){
			return   point1.x*point2.y-point1.y*point2.x;
		};
		
		this.checkCross=function(p1,p2,p3,p4){
			var v1={x:p1.x-p3.x,y:p1.y-p3.y};
			var v2={x:p2.x-p3.x,y:p2.y-p3.y};
			var v3={x:p4.x-p3.x,y:p4.y-p3.y};
			var v=this.crossMul(v1,v3)*this.crossMul(v2,v3);
			v1={x:p3.x-p1.x,y:p3.y-p1.y};
			v2={x:p4.x-p1.x,y:p4.y-p1.y};
			v3={x:p2.x-p1.x,y:p2.y-p1.y};
			return (v<=0&&this.crossMul(v1,v3)*this.crossMul(v2,v3)<=0)?true:false
		};
	};
/**
 * dashedLine 
 * @param canvas the vessel for drawing
 * @param x
 * @param y
 * @param x2
 * @param y2
 * @param dashArray
 * @param ctx {canvas.getContext('2d')}
 * */
var dashedLine = function(x, y, x2, y2, dashArray, ctx){
	if(! dashArray) dashArray=[10,5];
	var dashCount = dashArray.length;
	var dx = (x2 - x);
	var dy = (y2 - y);
	var xSlope = (Math.abs(dx) > Math.abs(dy));
	var slope = (xSlope) ? dy / dx : dx / dy;

	ctx.beginPath();
	ctx.moveTo(x, y);
	var distRemaining = Math.sqrt(dx * dx + dy * dy);
	var dashIndex = 0;
	while(distRemaining >= 0.1){
		var dashLength = Math.min(distRemaining, dashArray[dashIndex % dashCount]);
		var step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
		if(xSlope){
			if(dx < 0) step = -step;
			x += step;
			y += slope * step;
		}else{
			if(dy < 0) step = -step;
			x += slope * step;
			y += step;
		}     
		if(dashIndex % 2 == 0){
			ctx.lineTo(x, y);
			//ctx.strokeStyle = 'red';
			ctx.strokeStyle = '#32CD32';    
			ctx.stroke();
		}
		else if(dashIndex % 2 != 0){
			ctx.moveTo(x, y);
		}
		//this[(dashIndex % 2 == 0) ? 'lineTo' : 'moveTo'](x, y);
		distRemaining -= dashLength;
		dashIndex++;
	}
};
/**
 * task 
 * @inherits rectangle
 * @param canvas the vessel for drawing
 * @param x
 * @param y
 * @param width
 * @param height
 * @param label
 * @param graphManager
 * */
var task = function(x,y,width,height,label,canvas,graphManager){
	
	rectangle.call(this, x,y,width,height,label,canvas);// inherit the properties
	this.taskName = label;
    this.graphManager = graphManager;
	this.selectedAlgorithm = null;
	this.algorithms = [];
	this.nextTasks = [];
	this.preTasks = [];
	this.hasInputData = function(inputData){
		return this.selectedAlgorithm.hasInputData(inputData);
	};
	this.hasOutputData = function(outData){
		return this.selectedAlgorithm.hasOutputData(outData);
	};
	this.initAlgorithms = function(){
		var kb = new knowledgeBase(this.taskName);
		var algorithmNames = kb.findAlgorithmNames(this.taskName);
		for(var i =0;i<algorithmNames.length; i++){
			var ag = new algorithm(algorithmNames[i]);
			this.algorithms.push(ag);
		}
	};
	this.setAlgorithm = function(algorithmName){
		for(var i =0 ;i< this.algorithms.length;i++){
			if(this.algorithms[i].algorithmName==algorithmName){
				this.selectedAlgorithm = this.algorithms[i];
			}
		}
	};
	this.getSelectedAlgorithm = function(){
		return this.selectedAlgorithm;
	
	};
	this.setDefaultAlgorithm = function(){
		if(this.algorithms.length>=1){
			this.selectedAlgorithm = this.algorithms[0];
		}
	
	};
	this.setParameters = function(paras){
		if(this.selectedAlgorithm!=null){
			this.selectedAlgorithm.setParameters(paras);
		}
	};
	this.getParameters = function(){   
		if(this.selectedAlgorithm!=null){
			return this.selectedAlgorithm.parameters;
		}
	};
	this.setInputDatas = function(inputDatas){
		if(this.selectedAlgorithm!=null){
			this.selectedAlgorithm.setInputDatas(inputDatas);
		}
		
	};
	this.setOutputDatas = function(outputDatas){
		if(this.selectedAlgorithm!=null){
			this.selectedAlgorithm.setOutputDatas(outputDatas);
		}
	};
	this.taskIsNextTask = function(nexttask){
		for(var i =0;i<this.nextTasks.length;i++){
			if(nexttask == this.nextTasks[i])
				return true;
		}
		return false;
	};
	this.addNextTask = function(nexttask){
		this.nextTasks.push(nexttask);
	};
	this.deleteNextTask = function(nexttask){
		var temp = [];
		for(var i=0;i<this.nextTasks.length;i++){
			if(this.nextTasks[i]!=nexttask){
				temp.push(this.nextTasks[i]);
			}
		}
		this.nextTasks = temp;
	};
    this.addPreTask = function(pretask){
		this.preTasks.push(pretask);
	};
	this.setPreTasks = function(pretasks){
		this.preTasks = [];
		for(var i = 0; i<pretasks.length;i++){
		   this.pretasks.push(nexttasks[i]);
		}
	
	};
	this.run = function(){
	
	};
	this.check = function(){ 
		// to check if input data and output data both have values
		      
		this.isReadyToRun = true;
		this.canRun = false;
		var inputDatas = this.selectedAlgorithm.inputDatas;
		var outputDatas = this.selectedAlgorithm.outputDatas;
		         
		for(var i = 0;i< inputDatas.length; i++ ){             
			 
			//if(inputDatas[i].hasValue == false){
			if(inputDatas[i].value.length == 0){
				this.isReadyToRun = false;                            
			}              
		}
		for(var i = 0;i <outputDatas.length;i++ ){
			//if(outputDatas[i].hasValue == false){
			if(outputDatas[i].value.length == 0){
				this.isReadyToRun = false;             
			}
		}
		if(this.isReadyToRun == true){
			if(this.nextTasks.length==0){       
				var bag = true;
				for(var i = 0;i< this.graphManager.list.length; i++){
					if(this.graphManager.list[i].type =="rectangle" && this.graphManager.list[i]!= this){
						this.graphManager.list[i].check();
						if(!this.graphManager.list[i].isReadyToRun){     
							bag = false;         
							break;     
						}      
					}
				}
				this.canRun = bag;
				//this.canRun = true;
			}else {
				this.canRun = false; 
			}
		}
	};
	this.prototype = new rectangle();      
};

/**
 * data 
 * @inherits ellipse
 * @param canvas the vessel for drawing
 * @param x
 * @param y
 * @param a
 * @param b
 * @param label
 * @param graphManager
 * @event setValue
 * @event getValue
 * @event check judge the ellipse whether hava a data, and set hasValue true or false
 * @event prototype
 * */
var data = function(x,y,a,b,label,canvas){
	ellipse.call(this,x,y,a,b,label,canvas);// inherit the properties
	this.dataName = label;
	this.value = [];
	this.setValue = function(value){
		this.value = [];
		for(var i =0;i<value.length; i++){
			this.value.push(value[i]);
		}
	};
	this.getValue = function(){
		return this.value;
	
	};
    this.check = function(){
    	if(this.value.length==0){
    		this.hasValue = false;
    	}else {
    		this.hasValue = true;      
    	}
	};
	this.prototype = new ellipse();
};
/**
 * parameter 
 * @param parametername
 * @inner parameterName
 * @inner parameterType
 * @inner parameterSemantic
 * @event setValue
 * @event getValue
 * @event check
 * */
var parameter = function(parametername)	{
	this.parameterName = parametername;
	this.parameterType = null;
	this.parameterSemantic = null;
	this.value = [];
	this.setValue = function(value){
		this.value = [];
		for(var i =0;i<value.length; i++){
			this.value.push(value[i]);
		}
	};
	this.getValue = function(){
	
		return this.value;
	};
	this.check = function(){
	
	};

};
/**
 * algorithm 
 * @param algorithmName
 * @inner inputDatas
 * @inner outputDatas
 * @inner parameters
 * @event hasInputData
 * @event setInputDatas
 * @event addInputData
 * @event deleteInputData
 * @event clearInputDatas
 * @event hasOutputData
 * @event setOutputDatas
 * @event addOutputData
 * @event deleteOutputData
 * @event clearOutputDatas
 * @event hasParameter
 * @event setParameter
 * @event setParameters
 * @event addParameter
 * @event deleteParameter
 * @event clearParameters
 * */
var algorithm = function(algorithmName){
	this.algorithmName = algorithmName;
	this.inputDatas = [];
	this.outputDatas = [];
	this.parameters = [];
	//
	this.hasInputData = function(inputData){
		for(var i =0;i<this.inputDatas.length;i++){
			if(inputData == this.inputDatas[i]){
			 return true;
			}
		}
		return false;
	};
	this.setInputDatas = function(inputDatas){
		this.inputDatas = [];
		for(var i =0;i<inputDatas.length;i++){
			this.inputDatas.push(inputDatas[i]);
		}
	};
	this.addInputData = function(inputData){
		this.inputDatas.push(inputData);
	};
	this.deleteInputData = function(inputData){
		var tmp = [];
		for(var i = 0;i<this.inputDatas.length; i++){
			if(inputData!=this.inputDatas[i])
				tmp.push(this.inputDatas[i]);
		}
		this.inputDatas = tmp;
	};
	this.clearInputDatas = function(){
		this.inputDatas = [];
	};
	//
	this.hasOutputData = function(outData){
		
		for(var i =0;i<this.outputDatas.length;i++){
			if(outData == this.outputDatas[i]){
			 return true;
			}
		}
		return false;
	};
	this.setOutputDatas = function(outDatas){
		this.outputDatas = outDatas;
	};
	this.addOutputData = function(outData){
		this.outputDatas.push(outData);
	};
	this.deleteOutputData = function(){
	};
	this.clearOutputDatas = function(){
		this.outputDatas = [];
	};
	//
	this.hasParameter = function(para){
		for(var i =0;i<this.parameters.length;i++){
			if(para == this.parameters[i])
			return true;
		}
		return false;
	};
	this.setParameter = function(para){
		for(var i = 0 ; i<this.parameters.length;i++){
			if(para.parameterName == this.parameters[i].parameterName){
				this.parameters[i].value = para.value;
				return;
			}
		}
	};
	this.setParameters = function(paras){
		this.parameters = [];
		for(var i = 0; i< paras.length; i++){
			this.parameters.push(paras[i]);
		}
	};
	this.addParameter = function(para){
		this.parameters.push(para);
	};
	this.deleteParameter = function(para){
		var tmp = [];
		for(var i=0;i<this.parameters.length;i++){
			if(para!=this.parameters[i])
			   tmp.push(this.parameters[i]);
		}
		this.parameters = tmp;
	};
	this.clearParameters = function(){
		this.parameters = [];
	};

};
var connection = function(start,end,canvas){
	arrow.call(this,start,end,canvas);  
	this._data = null;
	this._task = null;
	if(start.type =="rectangle"){
		this._task = start;
	}else if (start.type =="ellipse"){
		this._data = start;
	}
    if(end.type =="rectangle"){
		this._task = end;
	}else if (end.type =="ellipse"){
		this._data = end;
	}
    this.check = function(){
    	if(start.type =="rectangle" && end.type =="ellipse"){
    	    if(start.nextTasks.length == 0){
    	    	end.check();
    	    	if(end.hasValue){
    	    		this.isReady = true;
    	    	}else {
    	    		this.isReady = false;
    	    	}
    	    }else{
    	    	this.isReady = true;     
    	    }
    		
    	}else if(start.type =="ellipse" && end.type =="rectangle"){
    		start.check();   
    		if(start.hasValue==true){
    			this.isReady = true;
    		}else {
    			this.isReady = false;
    		}
    	}else {
    		this.isReady = false;
    	}
	};
    this.prototype = new arrow();          
};
	