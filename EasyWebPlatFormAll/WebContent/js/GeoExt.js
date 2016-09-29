Ext.namespace("GeoExt");
//function introduction
/*
 * function1 createSampleDataWin
 * function2 createFSEnvLayersManageWin
 * function3 createHMEnvLayersManageWin
 * function4 createEnvLayersManageWin
 * function5 createSampleMappingParametersWin
 * function6 createParameterSetWindow
 * function7 createInputDataWindow
 * function8 createOutputDataWindow
 * function9 createAlgorithmSelectWindow
 */
// function1 createSampleDataWin
    //SoilPropertyStore
	Ext.define('SoilPropertyState', {
        extend: 'Ext.data.Model',       
        fields: [
 		        {name:'id',mapping:'id',type:'string'},
		        {name:'name',mapping:'name',type:'string'}
        ]
    });
    var SoilPropertyStore = Ext.create('Ext.data.Store', {
        model: 'SoilPropertyState',
        proxy:{
			type:'ajax',
			url:'samplefields.action',
			reader:{
				type:'json',
				root:'samplefields'
				}
		},
		autoLoad:false,
	    remoteSort:false		
    });
	//SampleFileStore
	Ext.define('SampleFileState',{
		extend:'Ext.data.Model',
		fields:[
		        {name:'id',mapping:'id',type:'string'},
		        {name:'name',mapping:'name',type:'string'}
		]
	});   
	var SampleFileStore = Ext.create('Ext.data.Store',{
		model:'SampleFileState',
		proxy:{
			type:'ajax',
			url:'samplefiles.action',
			reader:{
				type:'json',
				root:'samplefiles'
			}
		},
		autoLoad:false,
	    remoteSort:false						
	});  
	          
GeoExt.createSampleDataWin = function(data,graphManager){
	////// create soilProperty combo
	 
    var SoilPropertyCombo = null;
    if(Ext.getCmp('SelectSoilProperty')==undefined){
    	SoilPropertyCombo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Select Property',
            id:'SelectSoilProperty',
            displayField: 'name',
            valueField:'id',
			listConfig:{
	             loadMask: false
	        },
            queryMode: 'local',   
            labelWidth: 100,            
            store: SoilPropertyStore,    
            queryMode: 'local', 
            //allowBlank:false,
			editable:false,
            typeAhead: false
        });
    }else{            
    	SoilPropertyCombo = Ext.getCmp('SelectSoilProperty');
    }
    //////create soil sample file combo
   
//	var lat1 = latlng1_temp.lat;
//	var lat2 = latlng2_temp.lat;
//	var minLat = lat1 < lat2 ? lat1 : lat2;
//	var maxLat = lat1 < lat2 ? lat2 : lat1;
//	             
//	var lon1 = latlng1_temp.lon;
//	var lon2 = latlng2_temp.lon;  
//	var minLon = lon1 < lon2 ? lon1 : lon2;    
//	var maxLon = lon1 < lon2 ? lon2 : lon1;   
//	      
//	maxLat = maxLat.toFixed(6);  
//	minLat = minLat.toFixed(6);    
//	minLon = minLon.toFixed(6);        
//	maxLon = maxLon.toFixed(6);               
	
	if(KenyaStatus == false){  
		
		//SampleFileStore.load({params:{semantic:data.dataName,dataSetName:soilMappingDataSet,upLoader:dataUploader}});  
		SampleFileStore.load({params:{semantic:data.dataName,lon:positionLon, lat:positionLat}});
		SoilPropertyStore.load();		
	}else if(KenyaStatus == true){
	    if(CheckSampleInRect()==true){
			SampleFileStore.load({params:{semantic:data.dataName,top:maxLat,down:minLat,left:minLon,right:maxLon }});
			SoilPropertyStore.load();				
		}else{
			SampleFileStore.load({params:{semantic:data.dataName,top:-9999,down:-9999,left:-9999,right:-9999 }}); 
			SoilPropertyStore.load();	     			
		}
	}   
	                      
	 
	   
    var SampleFileCombo = null;
    if(Ext.getCmp('SelectSampleFile')==undefined){
    	SampleFileCombo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Select SampleSet',
            id:'SelectSampleFile',
            displayField:'name',
	    	valueField:'id',
			listConfig:{
	             loadMask: false
	        },
	    	store:SampleFileStore,   
            labelWidth: 100,                      
            queryMode: 'local',
            //allowBlank:false,
			editable:false,   
            typeAhead: false,
            listeners:{
    		   select:function(combo,record,index){   
    	          try{  
    	        	  Ext.getCmp('SelectSoilProperty').clearValue();     
					  SoilPropertyStore.load({params:{filename : combo.getValue()}});
					  //checkSamples(combo.getValue());           					  
    			   }catch(ex){
    				   
    			   }  
    			   
    		   }
	        }
        });
    }else{            
    	SampleFileCombo = Ext.getCmp('SelectSampleFile');
		SampleFileCombo.clearValue();
    }
    //
	var form = null;
	if(Ext.getCmp('SampleDataForm')==undefined){  
		form = new Ext.form.FormPanel({
	        labelAlign: 'right',
	        id:'SampleDataForm',
	        labelWidth: 100,
	        frame: true,
	        defaultType: 'combo',
	        items: [{
				xtype: 'container',
				layout: 'hbox',
				items:[SampleFileCombo,{           
					 xtype:'button',  
					 //hidden:(current_username == ""),
                     hidden:true,					 
					 margins:'0 0 0 5',
					 text:'Upload...',
					 id:'SampleFileDataUploadID'
				}]
			  },{
	            xtype:'component',
	            height:10
	        },SoilPropertyCombo]
	    });
		 Ext.getCmp('SampleFileDataUploadID').on('click',uploadFu = function(){
			 var _FileUpload_Win = CreateFileUpload_Win(SampleFileStore,"Table","csv","Sample Data",maxLat,minLat,minLon,maxLon); 
			 _FileUpload_Win.show();
	     });
	}else{
		if(current_username == ""){
			Ext.getCmp('SampleFileDataUploadID').setVisible(false);
		}else{
			//Ext.getCmp('SampleFileDataUploadID').setVisible(true);
			Ext.getCmp('SampleFileDataUploadID').setVisible(false);
		}
		form = Ext.getCmp('SampleDataForm');
		Ext.getCmp('SampleFileDataUploadID').un('click',uploadFu);
		Ext.getCmp('SampleFileDataUploadID').on('click',uploadFu = function(){
			 var _FileUpload_Win = CreateFileUpload_Win(SampleFileStore,"Table","csv","Sample Data",maxLat,minLat,minLon,maxLon); 
			 _FileUpload_Win.show();
	     });
		Ext.getCmp('SelectSoilProperty').clearValue();         
	}
	var _sampleDataFun = function(data,graphManager){
    	    var soilproperty =  Ext.getCmp("SelectSoilProperty").getValue();
			var filename = Ext.getCmp('SelectSampleFile').getValue(); 
			   
			if(soilproperty==""||filename==""||soilproperty==null||filename==null){   
			    alert("SampleFile or SoilProperty can not be empty");
				return;       
			}
    	    var value = [];
			//value.push(filename);   
			//data.setValue(value);
			
			if(KenyaStatus == true){
				value.push(filename+';'+KenyaExtent);   
			    data.setValue(value); 
			}else{
				value.push(filename);   
			    data.setValue(value);
			}
			
			var list = graphManager.list;
			var len = list.length;
					 
			var task = null;
			for(var i =0; i<len; i++){
				if(list[i].type=='rectangle'&&list[i].hasInputData(data)){
					task = list[i];
					break;
				}
			}
			
			if(task!=null){
			   var paras = task.getParameters();    
			   var para = null;
			   for(var i =0; i< paras.length; i++){
				  if(paras[i].parameterName=="SoilProperty"){   
					  para = paras[i];
                      break;					  
				  }
			    }  
				if(para!=null){
					var value = [];
					value.push(Ext.getCmp("SelectSoilProperty").getValue());
					para.setValue(value);
				}
			}
			            
			win.hide();
			graphManager.reDraw(); 
	};
    var win = null;
    if(Ext.getCmp('SampleDataWin')==undefined){
    	win = new Ext.Window({
            width:350,          
            modal:true,      
            id:'SampleDataWin',
            closeAction:'hide',
            items: [form],
            buttons: [{   
                text: 'OK',
                id:'SampleDataWinOK'
            }, {      
                text: 'Cancel',
                handler:function(){
            		win.hide();  
                }
            }]
        });
    	Ext.getCmp('SampleDataWinOK').on('click',inputDataFun = function(){
    		_sampleDataFun(data,graphManager);
    	});
    }else{  
    	win = Ext.getCmp('SampleDataWin');
    	Ext.getCmp('SampleDataWinOK').un('click',inputDataFun );
    	Ext.getCmp('SampleDataWinOK').on('click',inputDataFun = function(){
    		_sampleDataFun(data,graphManager);
    	});
    }
    
    return win;
};//end of createSampleDataWin

var selectedLayersItems = [];
GeoExt.getSelectedEnvLayers = function(){  
	return selectedLayersItems;
};

var selectedFSLayersItems = [];
GeoExt.getSelectedFSEnvLayers = function(){  
	return selectedFSLayersItems;
};

var selectedHMLayersItems = [];
GeoExt.getSelectedHMEnvLayers = function(){  
	return selectedHMLayersItems;
};
// function2 createFSEnvLayersManageWin
GeoExt.createFSEnvLayersManageWin = function(graph, graphManager){
	var list = graphManager.list;
	var len = list.length;
	         
	var task = null;
	for(var i =0; i<len; i++){
		if(list[i].type=='rectangle'&&list[i].hasInputData(graph)){
			task = list[i];
			break;
		}
	}
	
    var  Terrain = null;
    if(Ext.getCmp('FSEnv_Terrain')== undefined){
        Terrain = {
                xtype: 'fieldset',
                id:'FSEnv_Terrain',
                flex: 1,
                title: 'Terrain',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'DEM'
                },{
                	boxLabel:'Slope Gradient'
                },{
                	boxLabel:'Aspect'
                }]
        };
    }else{       
    	Terrain = Ext.getCmp('FSEnv_Terrain');
    }
    
    var  Water = null;
    if(Ext.getCmp('FSEnv_Water')== undefined){
    	Water = {
                xtype: 'fieldset',
                id:'FSEnv_Water',
                flex: 1,
                title: 'Water Source',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Distance To Rivers'
                }]
        };
    }else{       
    	Water = Ext.getCmp('FSEnv_Water');
    }
    
    var  Shelter = null;
    if(Ext.getCmp('FSEnv_Shelter')== undefined){
    	Shelter = {
                xtype: 'fieldset',
                id:'FSEnv_Shelter',
                flex: 1,
                title: 'Shelter And Food',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Plant Type'
                }]
        };
    }else{       
    	Shelter = Ext.getCmp('FSEnv_Shelter');
    }
    
    var  Human = null;
    if(Ext.getCmp('FSEnv_Human')== undefined){
    	Human = {
                xtype: 'fieldset',
                id:'FSEnv_Human',
                flex: 1,
                title: 'Human Impact',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Distance To Villages/Roads'
                }]
        };
    }else{       
    	Human = Ext.getCmp('FSEnv_Human');
    }
    
    var Others = null;
    if(Ext.getCmp('FSEnv_Others')==undefined){
        Others = {
                xtype: 'fieldset',
                flex: 1,
                id:'FSEnv_Others',
                title: 'Others',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Albedo'    
                }]
        }; 
    }else{
    	Others = Ext.getCmp('FSEnv_Others');
    }
    
    var userDefine = null;
    if(Ext.getCmp('FSuserDefine') == undefined){
        userDefine = {
        		xtype:'button',
        		id:'FSuserDefine',
        		text:'User Define...'
        };
    }else{
    	userDefine =Ext.getCmp('FSuserDefine');
    }
         
    var EnvLayers = [];
    EnvLayers.push(Terrain);        
    EnvLayers.push(Water);   
    EnvLayers.push(Shelter);
    EnvLayers.push(Human);
    EnvLayers.push(Others);  
    EnvLayers.push(userDefine);  
    
    var fp = Ext.create('Ext.FormPanel', {
        
        frame: true,
        fieldDefaults: {
            labelWidth: 110
        },
        width: 295,
        bodyPadding: 10,
        items: [
                   
        ],     
        buttons: [{
            text: 'OK',   
            handler: function(){         
    		selectedFSLayersItems = [];
    		var checkboxs = Ext.getCmp('FSEnv_Terrain').query('checkbox');
      	  	var len = checkboxs.length;          
      	  	for(var i =0; i< len ; i++){            
          	  if(checkboxs[i].checked == true){
          		  selectedFSLayersItems.push("Terrain#" + checkboxs[i].boxLabel);      
          	  }
            }
      	  	
    		checkboxs = Ext.getCmp('FSEnv_Water').query('checkbox');
      	  	len = checkboxs.length;          
      	  	for(var i =0; i< len ; i++){            
          	  if(checkboxs[i].checked == true){
          		  selectedFSLayersItems.push("Water#" + checkboxs[i].boxLabel);      
          	  }
            }
      	  	
    		checkboxs = Ext.getCmp('FSEnv_Shelter').query('checkbox');
      	  	len = checkboxs.length;          
      	  	for(var i =0; i< len ; i++){            
          	  if(checkboxs[i].checked == true){
          		  selectedFSLayersItems.push("Shelter#" + checkboxs[i].boxLabel);      
          	  }
            }
      	  	
    		checkboxs = Ext.getCmp('FSEnv_Human').query('checkbox');
      	  	len = checkboxs.length;          
      	  	for(var i =0; i< len ; i++){            
          	  if(checkboxs[i].checked == true){
          		  selectedFSLayersItems.push("Human#" + checkboxs[i].boxLabel);      
          	  }
            }
      	  	
    		checkboxs = Ext.getCmp('FSEnv_Others').query('checkbox');
      	  	len = checkboxs.length;          
      	  	for(var i =0; i< len ; i++){            
          	  if(checkboxs[i].checked == true){
          		  selectedFSLayersItems.push("Others#" + checkboxs[i].boxLabel);      
          	  }
            }
      	  	var lens = selectedFSLayersItems.length;  
      	  	               
      	  	if(lens>=0){
      	  		if(lens>0){
          	  		 
          	  		 var paras = task.getParameters();
	           		 var para = null;
	           		 for(var i =0; i< paras.length; i++){
	           			  if(paras[i].parameterName=="Environment Variable Measurement Level"){
	           				  para = paras[i];
	           				      
	           			  }
	           		  }
      	  			 var value = []; 
    		  		 var rulestringAll = "";
    		  		
    		  		 var kinds = [];
    		  		 kinds.push('Terrain');
    		  		 kinds.push('Water');
    		  		 kinds.push('Shelter');
    		  		 kinds.push('Human');
    		  		 kinds.push('Others'); 
    		  		
    		  		 
    	  		     for(var t = 0;t<kinds.length;t++){
    	  		    	 var kindName = kinds[t];
    	  		    	 var rulestring = "";
    	  		    	 var tag = 0;
     		  		     var temps = Ext.getCmp('FSEnv_' + kindName).query("checkbox");
     		  		     var tempsnet = [];
     		  		     for(var k=0;k<temps.length;k++){ 
     		  		    	 if(temps[k].checked == true){       
     		  		    		 tempsnet.push(temps[k]);
     		  		    	 }
     		  		     }
    	  		         if(tempsnet.length >1){
    	  		        	 tag = 1;
    	  		        	 if(kindName == 'Shelter'){
        	  		        	 for(var k =0;k<tempsnet.length-1;k++){
        	  		        		 if(tempsnet[k].boxLabel =="Plant Type"){
        	  		        			rulestring = rulestring + kindName+ "?nominal?1" +"#"; 
        	  		        		 } 
        	  		        	 }
        	  		        	 if(tempsnet[k].boxLabel =="Plant Type"){
    	  		        			rulestring = rulestring + kindName+ "?nominal?1" ; 
    	  		        		 }
    	  		        	 }else{
    	  		        		 if(kindName == 'Terrain'){
    	  		        			for(var k =0;k<tempsnet.length-1;k++){
           	  		        			 if(tempsnet[k].boxLabel =="DEM"){
	        	  		        			 rulestring = rulestring + kindName+ "?scale?100" +"#";
	        	  		        		 }else if(tempsnet[k].boxLabel =="Slope Gradient"){
	        	  		        			 rulestring = rulestring + kindName+ "?scale?5" +"#";
	        	  		        		 }else if(tempsnet[k].boxLabel =="Aspect"){
	        	  		        			 rulestring = rulestring + kindName+ "?scale?45" +"#";
	        	  		        		 }
	        	  		        	    }
      	  		        			if(tempsnet[k].boxLabel =="DEM"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?100";
        	  		        		 }else if(tempsnet[k].boxLabel =="Slope Gradient"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?5" ;
        	  		        		 }else if(tempsnet[k].boxLabel =="Aspect"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?45" ;
        	  		        		 }

    	  		        		 }else if(kindName == 'Water'){
    	  		        			for(var k =0;k<tempsnet.length-1;k++){
    	  		            			 if(tempsnet[k].boxLabel =="Distance To Rivers"){
	        	  		        			 rulestring = rulestring + kindName+ "?scale?5000" +"#";
	        	  		        		 }
    	  		        			}
    	  		        			if(tempsnet[k].boxLabel =="Distance To Rivers"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?5000" ;
        	  		        		 }
    	  		 
    	  		        		 }else if(kindName == 'Human'){
    	  		        			for(var k =0;k<tempsnet.length-1;k++){
    	  	  		        			 if(tempsnet[k].boxLabel =="Distance To Villages/Roads"){
	        	  		        			 rulestring = rulestring + kindName+ "?scale?5000" +"#";
	        	  		        		 }
    	  		        			}
    	  		        			if(tempsnet[k].boxLabel =="Distance To Villages/Roads"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?5000" ;
        	  		        		 }
    	  		        		 }else if(kindName == 'Others'){
    	  		        			for(var k =0;k<tempsnet.length-1;k++){
    	  		        				 if(tempsnet[k].boxLabel =="Albedo"){
	        	  		        			 rulestring = rulestring + kindName+ "?scale?0.1" +"#";
	        	  		        		 }	
    	  		        			}
    	  		        			if(tempsnet[k].boxLabel =="Albedo"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?0.1" ;
        	  		        		 }	
    	  		        			
    	  		        		 }
        	  		        	 
    	  		        	 }// end of else 

    	  		         }else if(tempsnet.length ==1){       
    	  		        	 tag = 1; 
    	  		        	 if(kindName == 'Shelter'){
        	  		        	
        	  		        	 if(tempsnet[0].boxLabel =="Plant Type"){
    	  		        			rulestring = rulestring + kindName+ "?nominal?1" ; 
    	  		        		 }
    	  		        	 }else{
    	  		        		 if(kindName == 'Terrain'){
    	  		        			
      	  		        			if(tempsnet[0].boxLabel =="DEM"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?100";
        	  		        		 }else if(tempsnet[0].boxLabel =="Slope Gradient"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?5" ;
        	  		        		 }else if(tempsnet[0].boxLabel =="Aspect"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?45" ;
        	  		        		 }

    	  		        		 }else if(kindName == 'Water'){
    	  		        			
    	  		        			if(tempsnet[0].boxLabel =="Distance To Rivers"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?5000" ;
        	  		        		 }
    	  		 
    	  		        		 }else if(kindName == 'Human'){
    	  		        			
    	  		        			if(tempsnet[0].boxLabel =="Distance To Villages/Roads"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?5000" ;
        	  		        		 }
    	  		        		 }else if(kindName == 'Others'){
    	  		        			
    	  		        			if(tempsnet[0].boxLabel =="Albedo"){
        	  		        			 rulestring = rulestring + kindName+ "?scale?0.1" ;
        	  		        		 }	
    	  		        			
    	  		        		 }
        	  		        	 
    	  		        	 }// end of else 
    	  		        	
    	  		         } 
    	  		         if(tag == 1 && rulestringAll != ""){  
    	  		        	rulestringAll = rulestringAll + "#" + rulestring;
    	  		         }else if(tag == 1 && rulestringAll == ""){
    	  		        	rulestringAll =  rulestring;
    	  		         }
    	  		        
    	  		     }// end of for
	  		         value.push(rulestringAll);
	  		         para.setValue(value);  
      	  	      }//end of if
        		  //
        		  var kb = new knowledgeBase();
        		  var inputdatasKB = [];
    			  var  algorithmName =  task.getSelectedAlgorithm().algorithmName;
    			  var inputnames = kb.findInputDataNames(algorithmName);
    			  var list = graphManager.list;
     		      var len =  list.length;
    			  for(var i= 0; i<inputnames.length; i++){
	      			  for(var j =0; j<len; j++ ){
	      				  if(list[j].type =='ellipse' && list[j].dataName == inputnames[i]){
	      					  inputdatasKB.push(list[j]);
	      					  break;
	      				  }
	      			  }        
      		      }
     			 
     			  //
        		  var inputDatasPre = task.getSelectedAlgorithm().inputDatas;
        		    
        		  var temps = [];
        		  for(var i =0; i< inputDatasPre.length; i++){
        			  var tag =0;
        			  for(var k =0; k< inputnames.length; k++){
        				  if(inputDatasPre[i].dataName == inputnames[k]){
        					  tag =1;
        					       
        				  }
        			  }
        			  var flag = 0;
        			  for(var j =0 ;j <selectedFSLayersItems.length;j++ ){
             			 var temp = selectedFSLayersItems[j].split("#");
            			 var dataName = temp[1];
        				  if(inputDatasPre[i].dataName == dataName){
        					  flag = 1;
        				  }
        			  }       
        			  if(flag == 0 && tag == 0){  
        				 
        				  temps.push(inputDatasPre[i]);
        			  }
        		  }  
        		 
        		  //         
        		  var  templist = [];
        		  for(var i = 0; i< temps.length ; i++){
        			  for(var j =0 ;j <graphManager.list.length; j++){
        				  if(graphManager.list[j].type =='arrow' ){
        					  //if(graphManager.list[j].start == temps[i]){
        					  if(graphManager.list[j].start == temps[i]&& graphManager.list[j].end == task){
        						  templist.push(graphManager.list[j]);  
        					  }
        				  }
        			  }     
        		  }
        		  for(var i =0 ; i< templist.length; i++){
        			  temps.push(templist[i]);//temps present the graph that will be deleted
        		  }

        		  var temps_temp = [];
        		  for(var i =0; i< temps.length; i++){
        			  if(temps[i].type == 'arrow'){
        				  
        				  temps_temp.push(temps[i]);
        				  
        			  }else if(temps[i].type == 'ellipse'){
        				  
        				  var count = 0;
                		  for(var z =0; z<graphManager.list.length; z ++){
                			  if(graphManager.list[z].type == 'rectangle'){
                				  if(graphManager.list[z].hasInputData(temps[i])){
                					  count ++;
                				  }
                			  }
                		  }
                		  if(count <2){        
                			  temps_temp.push(temps[i]);
                			
                			  for(var z =0; z<graphManager.list.length; z ++){
                    			  if(graphManager.list[z].type == 'rectangle'){
                    				  if(graphManager.list[z].hasOutputData(temps[i])){
                    					  graphManager.deleteGraph(graphManager.list[z]);
                    					  break;
                    				  }
                    			  }
                    		  }
                			  
                		  }else if(count >= 2){
                			  for(var z =0; z<graphManager.list.length; z ++){
                    			  if(graphManager.list[z].type == 'rectangle'){
                    				  if(graphManager.list[z].hasOutputData(temps[i])){
                    					  //graphManager.list[z].addNextTask(task); 
                    					  graphManager.list[z].deleteNextTask(task); 
                    				  }
                    			  }
                    		  }
                		  }       
        				  
            		  }
        		  }
    				  
        		  temps = temps_temp;  
        		  
        		  
                  //
        		  var    graphManager_list_temp = [];
        		  for(var i = 0; i<graphManager.list.length; i++ ){
        			  var flag =0;
        			  for(var j =0; j< temps.length; j++){
        				  if(graphManager.list[i] == temps[j]){
        					  flag =1;
        				  }
        			  }
        			  if(flag ==0){
        				  graphManager_list_temp.push(graphManager.list[i]);
        			  }
        		  }
        		  graphManager.list = graphManager_list_temp;
        		  //
        		  var inputdatas = [];
        		  var initX = graph.x;   
        		  var initY = graph.y;
        		  var list = graphManager.list;  
        		  var len =  list.length; 
        		  
        		  for(var i =0 ;i < lens; i++){
        			 var temps = selectedFSLayersItems[i].split("#");
        			 var dataName = temps[1];
        			 var flag = 0;
        			 
        			 for(var k = 0; k< len; k++){
        				 if(list[k].type =="ellipse" && list[k].dataName == dataName){
        					 inputdatas.push(list[k]);
        					 flag = 1;
        					 
        					 for(var t = 0; t <len; t++){
        						 if(list[t].type == 'rectangle'){
        							 if(list[t].hasOutputData(list[k])){
        								 list[t].addNextTask(task);
        								 break;
        							 }
        						 }
        					 }
        					 
        					 break; 
        				 }
        			 }
        			 if(flag == 1){// 
        				 continue;
        			 }else{       //
            			 var _data=new data(initX + (i +1)*50 ,initY + (i+1)*10,40,25, dataName, graphManager.canvas);
         			     _data.hasValue = false;
         			     graphManager.list.push(_data);
         				 inputdatas.push(_data);
        			 }

        		 }      
        		    
        		 for(var i=0; i< inputdatas.length;i++){
     				var con = new connection(inputdatas[i], task, graphManager.canvas);
     			    con.isReady = false;
     			    graphManager.list.push(con);  
     			       
     			}  
                 for(var i =0 ;i <inputdatasKB.length; i++){   
    
                	 inputdatas.push(inputdatasKB[i]);     
                 }
     			 task.setInputDatas(inputdatas);
         		 
    			 
				  var temps = [];
				  var layerDataNames = "";
				  for(var i=0;i<inputdatas.length;i++){  
					 
					  if(inputdatas[i].dataName != 'Presence Polygons' && 
					     inputdatas[i].dataName != 'FS Env.Layers ManageMent' ){
						  temps.push(inputdatas[i]);   
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
					  graph.setValue(value); 
				  }else{
	        		  var value = [];                             
	  				        
	  				  graph.setValue(value); 
	  				   
				  }                     
        		 graphManager.reDraw();
      	  		
      	  	}
      	  	 win.hide();
          }
        },{   
            text: 'Cancel',  
            handler: function(){
        		win.hide();
            }
        }]             
    });
    
    fp.add(EnvLayers);          
       
    fp.doLayout();     
    
    var win = new Ext.Window({      
        width:305, 
        modal:true,		
        title:'Env. Layers Management',    
        closeAction:'close',
        items: [fp]
    });
    return win;   
};//end of createFSEnvLayersManageWin

// function3 createHMEnvLayersManageWin
GeoExt.createHMEnvLayersManageWin = function(graph, graphManager){
	var list = graphManager.list;
	var len = list.length;
	         
	//var task = null;
	var task = null;
	var tasks = [];
	for(var i =0; i<len; i++){
		if(list[i].type=='rectangle'&&list[i].hasInputData(graph)){
            tasks.push(list[i]);			
			//task = list[i];
			//break;
		}
	}
    var  Terrain = null;
    if(Ext.getCmp('HMEnv_Terrain')== undefined){
        Terrain = {
                xtype: 'fieldset',
                id:'HMEnv_Terrain',
                flex: 1,
                title: 'Terrain',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'DEM'
                },{
                	boxLabel:'Slope Gradient'
                },{
                	boxLabel:'Aspect'
                }]
        };
    }else{       
    	Terrain = Ext.getCmp('HMEnv_Terrain');
    }
    
    var  Water = null;
    if(Ext.getCmp('HMEnv_Water')== undefined){
    	Water = {
                xtype: 'fieldset',
                id:'HMEnv_Water',
                flex: 1,
                title: 'Water Source',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Distance To Rivers'
                }]
        };
    }else{       
    	Water = Ext.getCmp('HMEnv_Water');
    }
    
    var  Shelter = null;
    if(Ext.getCmp('HMEnv_Shelter')== undefined){
    	Shelter = {
                xtype: 'fieldset',
                id:'HMEnv_Shelter',
                flex: 1,
                title: 'Shelter And Food',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Plant Type'
                }]
        };
    }else{       
    	Shelter = Ext.getCmp('HMEnv_Shelter');
    }
    
    var  Human = null;
    if(Ext.getCmp('HMEnv_Human')== undefined){
    	Human = {
                xtype: 'fieldset',
                id:'HMEnv_Human',
                flex: 1,
                title: 'Human Impact',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Distance To Villages/Roads'
                }]
        };
    }else{       
    	Human = Ext.getCmp('HMEnv_Human');
    }
    
    var Others = null;
    if(Ext.getCmp('HMEnv_Others')==undefined){
        Others = {
                xtype: 'fieldset',
                flex: 1,
                id:'HMEnv_Others',
                title: 'Others',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Albedo'    
                }]
        }; 
    }else{
    	Others = Ext.getCmp('HMEnv_Others');
    }
    
    var userDefine = null;
    if(Ext.getCmp('HMuserDefine') == undefined){
        userDefine = {
        		xtype:'button',
        		id:'HMuserDefine',
        		text:'User Define...'
        };
    }else{
    	userDefine =Ext.getCmp('HMuserDefine');
    }
    
    var EnvLayers = [];
    EnvLayers.push(Terrain);        
    EnvLayers.push(Water);   
    EnvLayers.push(Shelter);
    EnvLayers.push(Human);
    EnvLayers.push(Others);  
    EnvLayers.push(userDefine);  
    
    var fp = Ext.create('Ext.FormPanel', {
        
        frame: true,
        fieldDefaults: {
            labelWidth: 110
        },
        width: 295,
        bodyPadding: 10,
        items: [
                   
        ],     
        buttons: [{
            text: 'OK',   
            handler: function(){         
        		selectedHMLayersItems = [];
        		var checkboxs = Ext.getCmp('HMEnv_Terrain').query('checkbox');
          	  	var len = checkboxs.length;          
          	  	for(var i =0; i< len ; i++){            
              	  if(checkboxs[i].checked == true){
              		  selectedHMLayersItems.push("Terrain#" + checkboxs[i].boxLabel);      
              	  }
                }
          	  	
        		checkboxs = Ext.getCmp('HMEnv_Water').query('checkbox');
          	  	len = checkboxs.length;          
          	  	for(var i =0; i< len ; i++){            
              	  if(checkboxs[i].checked == true){
              		  selectedHMLayersItems.push("Water#" + checkboxs[i].boxLabel);      
              	  }
                }
          	  	
        		checkboxs = Ext.getCmp('HMEnv_Shelter').query('checkbox');
          	  	len = checkboxs.length;          
          	  	for(var i =0; i< len ; i++){            
              	  if(checkboxs[i].checked == true){
              		  selectedHMLayersItems.push("Shelter#" + checkboxs[i].boxLabel);      
              	  }
                }
          	  	
        		checkboxs = Ext.getCmp('HMEnv_Human').query('checkbox');
          	  	len = checkboxs.length;          
          	  	for(var i =0; i< len ; i++){            
              	  if(checkboxs[i].checked == true){
              		  selectedHMLayersItems.push("Human#" + checkboxs[i].boxLabel);      
              	  }
                }
          	  	
        		checkboxs = Ext.getCmp('HMEnv_Others').query('checkbox');
          	  	len = checkboxs.length;          
          	  	for(var i =0; i< len ; i++){            
              	  if(checkboxs[i].checked == true){
              		  selectedHMLayersItems.push("Others#" + checkboxs[i].boxLabel);      
              	  }
                }
          	  	var lens = selectedHMLayersItems.length;  
				
			    for(var p= 0; p< tasks.length; p++){
				    task = tasks[p];
				    if(lens>=0){
						if(lens>0){
							 var paras = task.getParameters();
							 var para = null;
							 for(var i =0; i< paras.length; i++){
								  if(paras[i].parameterName=="Environment Variable Measurement Level"){
									  para = paras[i];
									  break;
								  }
							  }
							 var value = []; 
							 var rulestringAll = "";
							
							 var kinds = [];
							 kinds.push('Terrain');
							 kinds.push('Water');
							 kinds.push('Shelter');
							 kinds.push('Human');
							 kinds.push('Others'); 
							
							 
							 for(var t = 0;t<kinds.length;t++){
								 var kindName = kinds[t];
								 var rulestring = "";
								 var tag = 0;
								 var temps = Ext.getCmp('HMEnv_' + kindName).query("checkbox");
								 var tempsnet = [];
								 for(var k=0;k<temps.length;k++){ 
									 if(temps[k].checked == true){       
										 tempsnet.push(temps[k]);
									 }
								 }
								 if(tempsnet.length >1){
									 tag = 1;
									 if(kindName == 'Shelter'){
										 for(var k =0;k<tempsnet.length-1;k++){
											 if(tempsnet[k].boxLabel =="Plant Type"){
												rulestring = rulestring + kindName+ "?nominal?1" +"#"; 
											 } 
										 }
										 if(tempsnet[k].boxLabel =="Plant Type"){
											rulestring = rulestring + kindName+ "?nominal?1" ; 
										 }
									 }else{
										 if(kindName == 'Terrain'){
											for(var k =0;k<tempsnet.length-1;k++){
												 if(tempsnet[k].boxLabel =="DEM"){
													 rulestring = rulestring + kindName+ "?scale?100" +"#";
												 }else if(tempsnet[k].boxLabel =="Slope Gradient"){
													 rulestring = rulestring + kindName+ "?scale?5" +"#";
												 }else if(tempsnet[k].boxLabel =="Aspect"){
													 rulestring = rulestring + kindName+ "?scale?45" +"#";
												 }
											}
											if(tempsnet[k].boxLabel =="DEM"){
												 rulestring = rulestring + kindName+ "?scale?100";
											 }else if(tempsnet[k].boxLabel =="Slope Gradient"){
												 rulestring = rulestring + kindName+ "?scale?5" ;
											 }else if(tempsnet[k].boxLabel =="Aspect"){
												 rulestring = rulestring + kindName+ "?scale?45" ;
											 }

										 }else if(kindName == 'Water'){
											for(var k =0;k<tempsnet.length-1;k++){
												 if(tempsnet[k].boxLabel =="Distance To Rivers"){
													 rulestring = rulestring + kindName+ "?scale?5000" +"#";
												 }
											}
											if(tempsnet[k].boxLabel =="Distance To Rivers"){
												 rulestring = rulestring + kindName+ "?scale?5000" ;
											 }
						 
										 }else if(kindName == 'Human'){
											for(var k =0;k<tempsnet.length-1;k++){
												 if(tempsnet[k].boxLabel =="Distance To Villages/Roads"){
													 rulestring = rulestring + kindName+ "?scale?5000" +"#";
												 }
											}
											if(tempsnet[k].boxLabel =="Distance To Villages/Roads"){
												 rulestring = rulestring + kindName+ "?scale?5000" ;
											 }
										 }else if(kindName == 'Others'){
											for(var k =0;k<tempsnet.length-1;k++){
												 if(tempsnet[k].boxLabel =="Albedo"){
													 rulestring = rulestring + kindName+ "?scale?0.1" +"#";
												 }	
											}
											if(tempsnet[k].boxLabel =="Albedo"){
												 rulestring = rulestring + kindName+ "?scale?0.1" ;
											 }	
											
										 }
										 
									 }// end of else 
		
								 }else if(tempsnet.length ==1){       
									 tag = 1; 
									 if(kindName == 'Shelter'){
										
										 if(tempsnet[0].boxLabel =="Plant Type"){
											rulestring = rulestring + kindName+ "?nominal?1" ; 
										 }
									 }else{
										 if(kindName == 'Terrain'){
											
											if(tempsnet[0].boxLabel =="DEM"){
												 rulestring = rulestring + kindName+ "?scale?100";
											 }else if(tempsnet[0].boxLabel =="Slope Gradient"){
												 rulestring = rulestring + kindName+ "?scale?5" ;
											 }else if(tempsnet[0].boxLabel =="Aspect"){
												 rulestring = rulestring + kindName+ "?scale?45" ;
											 }

										 }else if(kindName == 'Water'){
											
											if(tempsnet[0].boxLabel =="Distance To Rivers"){
												 rulestring = rulestring + kindName+ "?scale?5000" ;
											 }
						 
										 }else if(kindName == 'Human'){
											
											if(tempsnet[0].boxLabel =="Distance To Villages/Roads"){
												 rulestring = rulestring + kindName+ "?scale?5000" ;
											 }
										 }else if(kindName == 'Others'){
											
											if(tempsnet[0].boxLabel =="Albedo"){
												 rulestring = rulestring + kindName+ "?scale?0.1" ;
											 }	
											
										 }
										 
									 }// end of else 
									
								 } 
								 if(tag == 1 && rulestringAll != ""){  
									rulestringAll = rulestringAll + "#" + rulestring;
								 }else if(tag == 1 && rulestringAll == ""){
									rulestringAll =  rulestring;
								 }
								
							 }// end of for
							 value.push(rulestringAll);
							 para.setValue(value);  
						  }//end of if
						  //
						  var kb = new knowledgeBase();
						  var inputdatasKB = [];
			
						  var  algorithmName =  task.getSelectedAlgorithm().algorithmName;
						  var inputnames = kb.findInputDataNames(algorithmName);
						  var list = graphManager.list;
						  var len =  list.length;
						  for(var i= 0; i<inputnames.length; i++){
							  for(var j =0; j<len; j++ ){
								  if(list[j].type =='ellipse' && list[j].dataName == inputnames[i]){
									  inputdatasKB.push(list[j]);
									  break;
								  }
							  }        
						  }
						 
						  //
						  var inputDatasPre = task.getSelectedAlgorithm().inputDatas;
							
						  var temps = [];
						  for(var i =0; i< inputDatasPre.length; i++){
							  var tag =0;
							  for(var k =0; k< inputnames.length; k++){
								  if(inputDatasPre[i].dataName == inputnames[k]){
									  tag =1;
										   
								  }
							  }
							  var flag = 0;
							  for(var j =0 ;j <selectedHMLayersItems.length;j++ ){
								 var temp = selectedHMLayersItems[j].split("#");
								 var dataName = temp[1];
								  if(inputDatasPre[i].dataName == dataName){
									  flag = 1;
								  }
							  }       
							  if(flag == 0 && tag == 0){  
								  
								  temps.push(inputDatasPre[i]);
							  }
						  }  
						  
						  var  templist = [];
						  for(var i = 0; i< temps.length ; i++){
							  for(var j =0 ;j <graphManager.list.length; j++){
								  if(graphManager.list[j].type =='arrow' ){
									  //if(graphManager.list[j].start == temps[i]){
									  if(graphManager.list[j].start == temps[i] && graphManager.list[j].end == task){
										  templist.push(graphManager.list[j]);
									  }
								  }
							  }     
						  }
						  for(var i =0 ; i< templist.length; i++){
							  temps.push(templist[i]);
						  }
						 
						  var temps_temp = [];
						  for(var i =0; i< temps.length; i++){
							   if(temps[i].type =='arrow'){
								   
								   temps_temp.push(temps[i]);
								   
							   }else if(temps[i].type == 'ellipse'){
								   var count = 0;
								   for(var z =0; z < graphManager.list.length; z ++){
									  if(graphManager.list[z].type == 'rectangle'){
										  if(graphManager.list[z].hasInputData(temps[i])){
											  count ++;
										  }
									  }
								   }
								   if(count <2){      
									  temps_temp.push(temps[i]);
									  
									  for(var z =0; z<graphManager.list.length; z ++){
										  if(graphManager.list[z].type == 'rectangle'){
											  if(graphManager.list[z].hasOutputData(temps[i])){
												  graphManager.deleteGraph(graphManager.list[z]);
												  break;
											  }
										  }
									  }
									  
								  }else if(count >= 2){
									  for(var z =0; z<graphManager.list.length; z ++){
										  if(graphManager.list[z].type == 'rectangle'){
											  if(graphManager.list[z].hasOutputData(temps[i])){
												  //graphManager.list[z].addNextTask(task); 
												  graphManager.list[z].deleteNextTask(task); 
											  }
										  }
									  }
								  }  
							   }             
						 }  
						 temps = temps_temp; 
						  
						  //
						  var    graphManager_list_temp = [];
						  for(var i = 0; i<graphManager.list.length; i++ ){
							  var flag =0;
							  for(var j =0; j< temps.length; j++){
								  if(graphManager.list[i] == temps[j]){
									  flag =1;
								  }
							  }
							  if(flag ==0){
								  graphManager_list_temp.push(graphManager.list[i]);
							  }
						  }
						  graphManager.list = graphManager_list_temp;
						  //
						  var inputdatas = [];
						  var initX = graph.x;   
						  var initY = graph.y;
						  var list = graphManager.list;  
						  var len =  list.length; 
						  
						  for(var i =0 ;i < lens; i++){
							 var temps = selectedHMLayersItems[i].split("#");
							 var dataName = temps[1];
							 var flag = 0;
							 
							 for(var k = 0; k< len; k++){
								 if(list[k].type =="ellipse" && list[k].dataName == dataName){
									 inputdatas.push(list[k]);
									 flag = 1;
									
									 for(var t = 0; t <len; t++){
										 if(list[t].type == 'rectangle'){
											 if(list[t].hasOutputData(list[k])){
												 list[t].addNextTask(task);
												 break;
											 }
										 }
									 }
									
									 break; 
								 }
							 }
							 if(flag == 1){// 
								 continue;
							 }else{       //
								 var _data=new data(initX + (i +1)*50 ,initY + (i+1)*10,40,25, dataName, graphManager.canvas);
								 _data.hasValue = false;
								 graphManager.list.push(_data);
								 inputdatas.push(_data);
							 }

						 }      
							
						 for(var i=0; i< inputdatas.length;i++){
							var con = new connection(inputdatas[i], task, graphManager.canvas);
							con.isReady = false;
							graphManager.list.push(con);  
							   
						}  
						 for(var i =0 ;i <inputdatasKB.length; i++){   
			
							 inputdatas.push(inputdatasKB[i]);     
						 }
						 task.setInputDatas(inputdatas);
						 
						 
						  var temps = [];
						  var layerDataNames = "";
						  for(var i=0;i<inputdatas.length;i++){  
							 
							  if(inputdatas[i].dataName != 'Presence Sites' && 
								 inputdatas[i].dataName != 'HM Env.Layers ManageMent' &&
								 inputdatas[i].dataName != "Cumulative Visibility"){
								  temps.push(inputdatas[i]);   
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
							  graph.setValue(value); 
						  }else{
							  var value = [];                                            
									 
							  graph.setValue(value);       
						  }             
						
		  
						 graphManager.reDraw();  
		
					}
			    }

          	  	win.hide();
            }
        },{   
            text: 'Cancel',
            handler: function(){
        		win.hide();
            }
        }]             
    });
    
    fp.add(EnvLayers);          
       
    fp.doLayout();     
    
    var win = new Ext.Window({      
        width:305, 
		modal:true,      
        title:'HM Env. Layers Management',    
        closeAction:'close',
        items: [fp]
    });
    return win;   
    
};//end of createHMEnvLayersManageWin

//function4 createEnvLayersManageWin
GeoExt.createEnvLayersManageWin = function(graph , graphManager){
	var list = graphManager.list;
	var len = list.length;
	         
	var task = null;
	for(var i =0; i<len; i++){
		if(list[i].type=='rectangle'&&list[i].hasInputData(graph)){
			task = list[i];
			break;
		}
	}
	var Climate = null;
	if(Ext.getCmp('Env_Climate')==undefined){
		Climate = {
	    		 xtype: 'fieldset',   
	             flex: 1,
	             id:'Env_Climate',      
	             title: 'Climate',
	             defaultType: 'checkbox', // each item will be a checkbox
	             layout: 'anchor',
				 height: 95,// add 2014-12-9         
				 autoScroll:true,// add 2014-12-9
	             defaults: {   
	                 anchor: '100%',
	                 hideEmptyLabel: true   
	             },
	             items:[{
	                    boxLabel: 'Precipitation'
	                },{
	                    boxLabel: 'Temperature'
	                },{
	                    boxLabel: 'Evaporation'
	                }]        
	    };
	}else{     
		Climate = Ext.getCmp('Env_Climate');
	}

     
	var Geology = null;
    if(Ext.getCmp('Env_Geology')==undefined){
        Geology = {
                xtype: 'fieldset',
                id:'Env_Geology', 
                flex: 1,
                title: 'Geology',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
				height: 50,// add 2014-12-9         
				autoScroll:true,// add 2014-12-9
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Parent Material'
                }]
        };
    }else{     
    	Geology = Ext.getCmp('Env_Geology');  
    }    
          
    var  Terrain = null;
    if(Ext.getCmp('Env_Terrain')== undefined){
        Terrain = {
                xtype: 'fieldset',
                id:'Env_Terrain',
                flex: 1,
                title: 'Terrain',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
				height: 110,// add 2014-12-9         
				autoScroll:true,// add 2014-12-9
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'TWI'
                },{
                	boxLabel:'Slope Gradient'
                },{
                	boxLabel:'Profile Curvature'
                },{
                	boxLabel:'Plan Curvature'
                }]
        };
    }else{       
    	Terrain = Ext.getCmp('Env_Terrain');
    }
    
    var Vegetation = null;
    if(Ext.getCmp('Env_Vegetation')==undefined){
        Vegetation = {
                xtype: 'fieldset',
                id:'Env_Vegetation',
                flex: 1,
                title: 'Vegetation',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
				height: 50,// add 2014-12-9         
				autoScroll:true,// add 2014-12-9
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'NDVI'
                }]
        };
    }else{
    	Vegetation = Ext.getCmp('Env_Vegetation');
    }
    
    var Others = null;
    if(Ext.getCmp('Env_Others')==undefined){
        Others = {
                xtype: 'fieldset',
                flex: 1,
                id:'Env_Others',
                title: 'Others',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
				height: 85,// add 2014-12-8         
				autoScroll:true,// add 2014-12-8
                defaults: {     
                    anchor: '100%',
                    hideEmptyLabel: true   
                },
                items: [{
                    boxLabel: 'Albedo'    
                },{
                    boxLabel: 'Watershed'       
                }]
        };
    }else{
    	Others = Ext.getCmp('Env_Others');
		
    }
    
    var userDefine = null;
    if(Ext.getCmp('userDefine') == undefined){
        userDefine = {   
        		xtype:'button',
        		id:'userDefine',
        		text:'User Define...',
				listeners: {
				   click: function() {       
				       win_pop.show();	   
				}}
        };
    }else{
    	userDefine =Ext.getCmp('userDefine');
    }

    
    var EnvLayers = [];
    EnvLayers.push(Climate);        
    EnvLayers.push(Geology);   
    EnvLayers.push(Terrain);
    EnvLayers.push(Vegetation);
    EnvLayers.push(Others);  
    EnvLayers.push(userDefine);  
    // combine all that into one huge form
    var fp = Ext.create('Ext.FormPanel', {
        
        frame: true,
        fieldDefaults: {
            labelWidth: 110
        },
        width: 295,
        bodyPadding: 10,
        items: [
                   
        ],     
        buttons: [{
            text: 'OK',   
            handler: function(){         
        	  selectedLayersItems = [];
        	  //var checkboxs = fp.query('checkbox');                 
              var checkboxs = Ext.getCmp('Env_Climate').query('checkbox');
        	  var len = checkboxs.length;          
        	  for(var i =0; i< len ; i++){            
            	  if(checkboxs[i].checked == true){
            		  selectedLayersItems.push("Climate#" + checkboxs[i].boxLabel);      
            	  }
              }
        	  
        	  checkboxs = Ext.getCmp('Env_Geology').query('checkbox');
        	  len = checkboxs.length;          
        	  for(var i =0; i< len ; i++){            
            	  if(checkboxs[i].checked == true){
            		  selectedLayersItems.push("Geology#" + checkboxs[i].boxLabel);        
            	  }
              }
        	  
        	  checkboxs = Ext.getCmp('Env_Terrain').query('checkbox');
        	  len = checkboxs.length;          
        	  for(var i =0; i< len ; i++){            
            	  if(checkboxs[i].checked == true){
            		  selectedLayersItems.push("Terrain#" + checkboxs[i].boxLabel);        
            	  }
              }
        	  
        	  checkboxs = Ext.getCmp('Env_Vegetation').query('checkbox');
        	  len = checkboxs.length;          
        	  for(var i =0; i< len ; i++){            
            	  if(checkboxs[i].checked == true){
            		  selectedLayersItems.push("Vegetation#" + checkboxs[i].boxLabel);        
            	  }
              }
        	  
        	  checkboxs = Ext.getCmp('Env_Others').query('checkbox');
        	  len = checkboxs.length;          
        	  for(var i =0; i< len ; i++){            
            	  if(checkboxs[i].checked == true){
            		  selectedLayersItems.push("Others#" + checkboxs[i].boxLabel);        
            	  }
              }
        	         
        	  var lens = selectedLayersItems.length; 
        	           
        	  if(lens>=0){   
        		  if(lens>0){
            		  var paras = task.getParameters();
            		  var para = null;
            		  for(var i =0; i< paras.length; i++){
            			  if(paras[i].parameterName=="Environmental Attribute Parameter"){
            				  para = paras[i];
            			  }
            		  }
            		          
     		  		 var value = []; 
    		  		 var rulestringAll = "";
    		  		
    		  		 var kinds = [];
    		  		 kinds.push('Climate');
    		  		 kinds.push('Geology');
    		  		 kinds.push('Terrain');
    		  		 kinds.push('Vegetation');
    		  		 kinds.push('Others');
    		  		
    		  		 
    	  		     for(var t = 0;t<kinds.length;t++){
    	  		    	 var kindName = kinds[t];
    	  		    	 var rulestring = "";
    	  		    	 var tag = 0;
     		  		     var temps = Ext.getCmp('Env_' + kindName).query("checkbox");
     		  		     var tempsnet = [];
     		  		     for(var k=0;k<temps.length;k++){ 
     		  		    	 if(temps[k].checked == true){       
     		  		    		 tempsnet.push(temps[k]);
     		  		    	 }
     		  		     }
    	  		         if(tempsnet.length >1){
    	  		        	 tag = 1;
    	  		        	 //TODO:this place just take Geology as Boolen, maybe landuse and others also boolen, should hangle it
    	  		        	 if(kindName == 'Geology'){
        	  		        	 for(var k =0;k<tempsnet.length-1;k++){
        	  		        		 rulestring = rulestring + kindName+ "?Boolean" +"#";
        	  		        	 }
        	  		        	 rulestring = rulestring + kindName+"?Boolean"; 
    	  		        	 }else{
        	  		        	 for(var k =0;k<tempsnet.length-1;k++){
        	  		        		 rulestring = rulestring + kindName+ "?Gower" +"#";
        	  		        	 }
        	  		        	 rulestring = rulestring + kindName+"?Gower";  
    	  		        	 }

    	  		         }else if(tempsnet.length ==1){       
    	  		        	 tag = 1; 
    	  		        	 if(kindName == 'Geology'){
    	  		        		  rulestring = rulestring + kindName+"?Boolean";
    	  		        	  }else{
    	  		        		  rulestring = rulestring + kindName+"?Gower";
    	  		        	  }
    	  		        	
    	  		         }
    	  		         if(tag == 1 && rulestringAll != ""){  
    	  		        	rulestringAll = rulestringAll + "#" + rulestring;
    	  		         }else if(tag == 1 && rulestringAll == ""){
    	  		        	rulestringAll =  rulestring;
    	  		         }
    	  		        
    	  		     }
    	  		            
    		  		 value.push(rulestringAll);
    		  		 if(task.taskName == 'sampling based on purposive')
    		  		 {
    		  		 }
    		  		 else
    		  		 {
    		  		 	para.setValue(value);  
    		  		 }
    		  		 
        		  }

        		  //
        		  var kb = new knowledgeBase();
        		  var inputdatasKB = [];
    			  var  algorithmName =  task.getSelectedAlgorithm().algorithmName;
    			  var inputnames = kb.findInputDataNames(algorithmName);
    			  var list = graphManager.list;
     		      var len =  list.length;
    			  for(var i= 0; i<inputnames.length; i++){
	      			  for(var j =0; j<len; j++ ){
	      				  if(list[j].type =='ellipse' && list[j].dataName == inputnames[i]){
	      					  inputdatasKB.push(list[j]);
	      					  break;
	      				  }
	      			  }        
      		      }
     			 
     			  //
        		  var inputDatasPre = task.getSelectedAlgorithm().inputDatas;
        		    
        		  var temps = [];
        		  for(var i =0; i< inputDatasPre.length; i++){
        			  var tag =0;
        			  for(var k =0; k< inputnames.length; k++){
        				  if(inputDatasPre[i].dataName == inputnames[k]){
        					  tag =1;
        					       
        				  }
        			  }
        			  var flag = 0;
        			  for(var j =0 ;j <selectedLayersItems.length;j++ ){
             			 var temp = selectedLayersItems[j].split("#");
            			 var dataName = temp[1];
        				  if(inputDatasPre[i].dataName == dataName){
        					  flag = 1;
        				  }
        			  }       
        			  if(flag == 0 && tag == 0){  
        				  
        				  temps.push(inputDatasPre[i]);
        			  }
        		  }  
        		 
        		  //         
        		  var  templist = [];
        		  for(var i = 0; i< temps.length ; i++){
        			  for(var j =0 ;j <graphManager.list.length; j++){
        				  if(graphManager.list[j].type =='arrow' ){
        					  //if(graphManager.list[j].start == temps[i]){
        					  if(graphManager.list[j].start == temps[i] && graphManager.list[j].end == task){
        						  templist.push(graphManager.list[j]);
        					  }
        				  }
        			  }     
        		  }
        		  for(var i =0 ; i< templist.length; i++){
        			  temps.push(templist[i]);
        		  }
        		  
                  var temps_temp = [];
                  for(var i =0; i< temps.length; i++){
	                   if(temps[i].type =="arrow"){
	                	   
	                	   temps_temp.push(temps[i]);
	                	   
	                   }else if(temps[i].type =="ellipse"){
	                	   
	                	   var count = 0;
		                   for(var z =0; z < graphManager.list.length; z ++){
		                      if(graphManager.list[z].type == 'rectangle'){
			                      if(graphManager.list[z].hasInputData(temps[i])){
			                    	  count ++;
			                      }
		                      }
		                   }
		                   if(count <2){      
		                      temps_temp.push(temps[i]);
		                      
	            			  for(var z =0; z<graphManager.list.length; z ++){
	                			  if(graphManager.list[z].type == 'rectangle'){
	                				  if(graphManager.list[z].hasOutputData(temps[i])){
	                					  graphManager.deleteGraph(graphManager.list[z]);
	                					  break;
	                				  }
	                			  }
	                		  }
	            			
		                  }else if(count >= 2){
	            			  for(var z =0; z<graphManager.list.length; z ++){
	                			  if(graphManager.list[z].type == 'rectangle'){
	                				  if(graphManager.list[z].hasOutputData(temps[i])){
	                					  //graphManager.list[z].addNextTask(task); 
	                					  graphManager.list[z].deleteNextTask(task);
	                				  }
	                			  }
	                		  }
	            		  }           
	                   }
                 }  
                 temps = temps_temp; 
                  
                  //
        		  var    graphManager_list_temp = [];
        		  for(var i = 0; i<graphManager.list.length; i++ ){
        			  var flag =0;
        			  for(var j =0; j< temps.length; j++){
        				  if(graphManager.list[i] == temps[j]){
        					  flag =1;
        				  }
        			  }
        			  if(flag ==0){
        				  graphManager_list_temp.push(graphManager.list[i]);
        			  }
        		  }
        		  graphManager.list = graphManager_list_temp;
        		  //
        		  var inputdatas = [];
        		  var initX = graph.x;   
        		  var initY = graph.y;
        		  var list = graphManager.list;  
        		  var len =  list.length; 
        		  
        		  for(var i =0 ;i < lens; i++){
        			 var temps = selectedLayersItems[i].split("#");
        			 var dataName = temps[1];
        			 var flag = 0;
        			 
        			 for(var k = 0; k< len; k++){
        				 if(list[k].type =="ellipse" && list[k].dataName == dataName){
        					 inputdatas.push(list[k]);
        					 flag = 1;
        					
        					 for(var t = 0; t <len; t++){
        						 if(list[t].type == 'rectangle'){
        							 if(list[t].hasOutputData(list[k])){
        								 list[t].addNextTask(task);
        								 break;
        							 }
        						 }
        					 }
        					 
        					 break; 
        				 }
        			 }
        			 if(flag == 1){// 
        				 continue;
        			 }else{       //
            			 var _data=new data(initX + (i +1)*50 ,initY + (i+1)*10,40,25, dataName, graphManager.canvas);
         			     _data.hasValue = false;
         			     graphManager.list.push(_data);
         				 inputdatas.push(_data);
        			 }

        		 }      
        		    
        		 for(var i=0; i< inputdatas.length;i++){
     				var con = new connection(inputdatas[i], task, graphManager.canvas);
     			    con.isReady = false;
     			    graphManager.list.push(con);  
     			       
     			}  
                 for(var i =0 ;i <inputdatasKB.length; i++){   
    
                	 inputdatas.push(inputdatasKB[i]);     
                 }
     			 task.setInputDatas(inputdatas);
     			
				  var temps = [];
				  var layerDataNames = "";
				  for(var i=0;i<inputdatas.length;i++){  
					 
					  if(inputdatas[i].dataName != 'Sample Data' && 
					     inputdatas[i].dataName != 'Env.Layers ManageMent' ){
						  temps.push(inputdatas[i]);   
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
					  graph.setValue(value); 
				  }else{
	        		  var value = [];                             
	  				       
	  				  graph.setValue(value);  
				  }       
    			             
        		 graphManager.reDraw();
        	  } 
        	  win.hide();   
            }
        },{   
            text: 'Cancel',
            handler: function(){
        		win.hide();
            }
        }]             
    });
    
    fp.add(EnvLayers);          
      
    
    fp.doLayout();     
    
    var win = new Ext.Window({      
        width:305, 
        modal:true,		
        title:'Env. Layers Management',    
        closeAction:'close',
        items: [fp]
    });
    return win;   
             
};//end of createEnvLayersManageWin

// function5 createSampleMappingParametersWin
GeoExt.createSampleMappingParametersWin = function(paras){   
	  
	var Climate = null;
	if(Ext.getCmp('Climate_Parameter') == undefined){
		
		Climate = {
	    		 xtype: 'fieldset',
	             flex: 1,         
	             id:'Climate_Parameter',      
	             title: 'Climate',
	             defaultType: 'checkbox', // each item will be a checkbox
	             layout: 'anchor',
	             defaults: {      
	                
	                 hideEmptyLabel: true   
	             },
	             items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
	    };
	}else{
		Climate = Ext.getCmp('Climate_Parameter');
	}         
	var Geology = null;
	if(Ext.getCmp('Geology_Parameter') == undefined){
	    Geology = {
	            xtype: 'fieldset',
	            flex: 1,
	            id:'Geology_Parameter',
	            title: 'Geology',
	            defaultType: 'checkbox', // each item will be a checkbox
	            layout: 'anchor',
	            defaults: {
	                //anchor: '100%',
	                hideEmptyLabel: true   
	            },
	            items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
	    };
	}else{
		Geology = Ext.getCmp('Geology_Parameter');
	}
    
	var Terrain = null;
    if(Ext.getCmp('Terrain_Parameter') == undefined){
        Terrain = {
                xtype: 'fieldset',
                flex: 1,
                id:'Terrain_Parameter',
                title: 'Terrain',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                   // anchor: '100%',
                    hideEmptyLabel: true   
                },
                items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
        };
    }else{
    	Terrain = Ext.getCmp('Terrain_Parameter');
    }
     
    var Vegetation = null;
    if(Ext.getCmp('Vegetation_Parameter') == undefined){
        Vegetation = {
                xtype: 'fieldset',
                flex: 1,
                id:'Vegetation_Parameter',
                title: 'Vegetation',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    //anchor: '100%',
                    hideEmptyLabel: true   
                },
                items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
        };
    }else{
    	Vegetation = Ext.getCmp('Vegetation_Parameter');
    }
    
    var Others = null;
    if( Ext.getCmp('Others_Parameter') == undefined){
        Others = {     
                xtype: 'fieldset',
                flex: 1,
                id:'Others_Parameter',
                title: 'Others',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    //anchor: '100%',
                    hideEmptyLabel: true   
                },
                items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
        };
    }else{
    	Others = Ext.getCmp('Others_Parameter');
    }
                        
    //        
    Ext.define('State', {
        extend: 'Ext.data.Model',
        fields: [
            {type: 'string', name: 'name'},
            {type: 'string', name: 'value'}
        ]
    });
	var states = [
	               {"name":"LimitingFactor","value":"LimitingFactor"},
	               {"name":"Average","value":"Average"}    
	             ];
    var store = Ext.create('Ext.data.Store', {        
        model: 'State',
        data: states
    });
    
    //
    Ext.define('State1', {
        extend: 'Ext.data.Model',
        fields: [
            {type: 'string', name: 'name'},
            {type: 'string', name: 'value'}
        ]
    });
	var states1= [
	               {"name":"Gaussian","value":"Gaussian"},
	               {"name":"Gower","value":"Gower"},
	               {"name":"Boolean","value":"Boolean"}
	               
	             ];
    var store1 = Ext.create('Ext.data.Store', {        
        model: 'State1',
        data: states1
    });
    //
    var csim = null
    if(Ext.getCmp('CSIM')==undefined){
        csim = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Category Similarity Integration Method',
            displayField: 'name',
            valueField:'value',
            id:'CSIM',
            width: 400,
            value: 'LimitingFactor',  
            disabled:true, 			
            labelWidth: 220,                       
            store: store,          
            queryMode: 'local',          
            typeAhead: true
        });
    }else{   
    	csim= Ext.getCmp('CSIM');
    }
    
    var ssim = null; 
    if(Ext.getCmp('SSIM')==undefined){
        ssim = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Sample Similarity Integration Method',
            displayField: 'name',
            id:'SSIM',
            valueField:'value',
            width: 400,
            value: 'LimitingFactor',
            disabled:true,               
            labelWidth: 220,            
            store: store,    
            queryMode: 'local',          
            typeAhead: true
        });
    }else{
    	ssim = Ext.getCmp('SSIM');
    }
    
    var ut = null;
    if(Ext.getCmp('UT')==undefined){
        ut = Ext.create('Ext.form.NumberField', {
            fieldLabel: 'Uncertainty Threshold',
            decimalPrecision:2,   
            id:'UT',
            step : 0.1, 
            value: 0.3,  
            minValue: 0.0,          
            maxValue: 1.0,
            width: 400,             
            labelWidth: 220
        });
    }else{    
    	ut = Ext.getCmp('UT');
    }

    
    var parameters = [];   
   
                  
    parameters.push(Climate);
    parameters.push(Geology);  
    parameters.push(Terrain);
    parameters.push(Vegetation); 
    parameters.push(Others);
    
    parameters.push(csim); 
    parameters.push(ssim);   
    parameters.push(ut);          
    // combine all that into one huge form
    var fp = null;
    if(Ext.getCmp('SampleMappingParametersForm') == undefined){
        fp = Ext.create('Ext.FormPanel', {
            
            frame: true,
            id:'SampleMappingParametersForm',
            fieldDefaults: {
                labelWidth: 110
            },
            width: 450,    
            bodyPadding: 10,
            items: [
                    
            ],
            buttons: [{
                text: 'OK',
                handler: function(){
                   
            	  for(var i =0; i< paras.length; i++){
            		  var paraName = paras[i].parameterName;
            		  var para = paras[i];
            		  var value = [];
            		 
            		  switch(paraName){
            		  	case "Uncertainty Threshold":
            		  		 value = []; 
                  			 value.push(Ext.getCmp('UT').getValue());
                  			 para.setValue(value);
                  	         break;
            		  	case "Sample Similarity Integration Method":
           		  		     value = []; 
                 			 value.push(Ext.getCmp('SSIM').getValue());
                 			 para.setValue(value);
                 	         break;
            		  	case "Category Similarity Integration Method":
          		  		     value = []; 
                			 value.push(Ext.getCmp('CSIM').getValue());
                			 para.setValue(value);
                	         break;	 
            		  	case "Environmental Attribute Parameter":
         		  		    
            		  		 value = []; 
         		  		     var rulestringAll = "";
         		  		     var kinds = [];
         		  		     kinds.push('Climate');
         		  		     kinds.push('Geology');
         		  		     kinds.push('Terrain');
         		  		     kinds.push('Vegetation');
         		  		     kinds.push('Others');
         		  		     
         		  		     for(var t = 0;t<kinds.length;t++){
         		  		    	 var kindName = kinds[t];
         		  		    	 var rulestring = ""; 
             		  		     var temps = Ext.getCmp(kindName + '_Parameter').query("combo");
             		  		     var tempsnet = [];
             		  		     for(var v =0;v<temps.length;v++){
             		  		    	 if(temps[v].isVisible()){
             		  		    		 tempsnet.push(temps[v]);
             		  		    	 }
             		  		     }
             		  		     var tag = 0;
         		  		         if(tempsnet.length >1){
         		  		        	 tag =1;
         		  		        	 for(var k =0;k<tempsnet.length-1;k++){
                  		  		    	rulestring = rulestring + kindName+ "?" + tempsnet[k].getValue() +"#";
                  		  		     }
         		  		        	 rulestring = rulestring + kindName+"?" + tempsnet[tempsnet.length-1].getValue(); 
         		  		         }else if(tempsnet.length ==1){     
         		  		              tag =1;
         		  		        	  rulestring = rulestring + kindName+"?" + tempsnet[0].getValue();
         		  		         }
	         		  		     if(tag == 1 && rulestringAll != ""){  
	          	  		        	  rulestringAll = rulestringAll + "#" + rulestring;
	          	  		         }else if(tag == 1 && rulestringAll == ""){
	          	  		        	  rulestringAll =  rulestring;
	          	  		         }

         		  		        	              
         		  		     }               
         		  		     value.push(rulestringAll);          
         		  		     
         		  		     para.setValue(value);
         		  		     break;	    
               	         default:
               	        	 break;
            		  }
            		  
            	  }
            	  
            	  win.hide();   
                }
            },{
                text: 'Cancel',   
                handler: function(){
            	  win.hide();    
                }
            }]             
        });  
    }else{
    	fp = Ext.getCmp('SampleMappingParametersForm');
    }
                  
    
    fp.add(parameters);  
    
    var parameterNames = [];
    parameterNames.push('Climate_Parameter');
    parameterNames.push('Geology_Parameter');
    parameterNames.push('Terrain_Parameter');
    parameterNames.push('Vegetation_Parameter');
    parameterNames.push('Others_Parameter');
   
    for(var k =0 ; k<parameterNames.length ; k++){
        if( Ext.getCmp(parameterNames[k])!=undefined){
	       	 var temps = Ext.getCmp(parameterNames[k]).query('combo');                
	       	 for(var i =0;i< temps.length;i++){
	       		 temps[i].hide();
	       	 }            
       }      
    }       
         
    var EnvLayers= GeoExt.getSelectedEnvLayers();
                                                  
    var climateflag = 0;
    var geologyflag = 0;
    var terrainflag = 0;
    var vegetationflag = 0;
    var othersflag = 0;
    var EnvNames = [];
    EnvNames.push("Climate");
    EnvNames.push("Geology");
    EnvNames.push("Terrain");
    EnvNames.push("Vegetation");
    EnvNames.push("Others");
    
    for(var i =0;i<EnvLayers.length;i++){
    	for(var j =0;j<EnvNames.length;j++){
    		if(EnvLayers[i].indexOf(EnvNames[j])>=0){
    			var temps = EnvLayers[i].split("#");
        		var layername = temps[1]; 
        		var layerid = layername.replace(/\s/g,""); 
        		if(Ext.getCmp(layerid)!=undefined){
        			Ext.getCmp(layerid).show();
        			 if(EnvNames[j]=="Geology"){
         		    	Ext.getCmp(layerid).setValue('Boolean');
         		    }  
        		}else{
        		    var combolayer = Ext.create('Ext.form.field.ComboBox', {
        		        fieldLabel: layername,
        		        id:layerid,    
        		        displayField: 'name',
        		        valueField:'value',
        		        value:'Gaussian',    
        		        width: 200,         
        		        labelWidth: 100,            
        		        store: store1,    
        		        queryMode: 'local',          
        		        typeAhead: true
        		    });
        		    Ext.getCmp(EnvNames[j] + '_Parameter').add(combolayer);
        		    if(EnvNames[j]=="Geology"){
        		    	Ext.getCmp(layerid).setValue('Boolean');
        		    	           
        		    }
        		}           
    		}// end of if
    	}// end of for
    }//end of for
    for(var i =0; i<EnvLayers.length;i++){
       
    	if(EnvLayers[i].indexOf("Climate")>=0){
    		climateflag = 1;
    		
    	}else if(EnvLayers[i].indexOf("Geology")>=0){
    		geologyflag = 1; 
    		
    	} else if(EnvLayers[i].indexOf("Terrain")>=0){
    		terrainflag = 1;
    		
    	} else if(EnvLayers[i].indexOf("Vegetation")>=0){
    		vegetationflag =1;
    		
    	} else if(EnvLayers[i].indexOf("Others")>=0){
    		othersflag = 1; 
    	}         
    }         
    
    if(climateflag == 1){
    	Ext.getCmp('Climate_Parameter').show();
    }else{   
    	Ext.getCmp('Climate_Parameter').hide();
    }
    
    if(geologyflag == 1){
    	Ext.getCmp('Geology_Parameter').show();
    }else{   
    	Ext.getCmp('Geology_Parameter').hide();
    } 
    
    if(terrainflag == 1){
    	Ext.getCmp('Terrain_Parameter').show();
    }else{   
    	Ext.getCmp('Terrain_Parameter').hide();
    }
    
    if(vegetationflag == 1){
    	Ext.getCmp('Vegetation_Parameter').show();
    }else{   
    	Ext.getCmp('Vegetation_Parameter').hide();
    }
    
    if(othersflag == 1){
    	Ext.getCmp('Others_Parameter').show();
    }else{   
    	Ext.getCmp('Others_Parameter').hide();
    }    
    ///////
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="Uncertainty Threshold"){
		   var value = para.getValue();                 
		   Ext.getCmp('UT').setValue(value[0]);   
		}
	};
	///////
    fp.doLayout(); 
    var win = null ;
    if(Ext.getCmp('SampleMappingParametersWin') == undefined){
    	win = new Ext.Window({           
            width:460,
			modal:true,			
            id:'SampleMappingParametersWin',
            title: 'Sample Based Mapping',      
            closeAction:'close',
            items: [fp]
        });  	
    }else{
    	win = Ext.getCmp('SampleMappingParametersWin');   
    }
	
	                   
	return win;            
	   
};//end of createSampleMappingParametersWin

// function6 createParameterSetWindow
GeoExt.createParameterSetWindow = function(paras){
	var form = new Ext.form.FormPanel({
        labelAlign: 'right',
        labelWidth: 50,
        frame: true,
        defaultType: 'textfield',
        items: []
    });  
    var winheight = 30;      
	for(var i = 0; i< paras.length; i++){
		var value = paras[i].value[0];
		         
		var temp =  new Ext.form.TextField({
		    fieldLabel: paras[i].parameterName,
		    id: paras[i].parameterName,
		    value:value,       
		    anchor:'100%'       
		});                    
		winheight = winheight + 50;
		form.items.add(temp); 
	}
	form.doLayout();
	var win = new Ext.Window({
        width:300,
		modal:true,
        height:winheight,  
        title:'Set Parameter',  
        items: [form], 
        closeAction:'hide',
        buttons: [{ 
            text: 'OK',
            handler:function(){
        		for(var i = 0; i< paras.length; i++){
        			var temp = Ext.getCmp(paras[i].parameterName);
        			var value = []; 
        			value.push(temp.getValue());  
        			paras[i].setValue(value);
        		}
        		win.hide();
            }   
        }, {      
            text: 'Cancel',
            handler:function(){
        		win.hide(); 
            }
        }]
    });
            
    return win; 
};//end of createParameterSetWindow

// function7 createInputDataWindow
    Ext.define('FileData',{ 
	    extend: 'Ext.data.Model', 
	    fields: [ 
	        {name:'fileName',mapping:'fileName'}, 
	         'fileSize', 
	         'format', 
	         'semantic',
	         'type'              
	    ] 
	}); 
	 
	var FileDataStore = Ext.create('Ext.data.Store', { 
	    pageSize:50,       
	    remoteSort:true,
	    //storeId:'FileData_Store',
		model: 'FileData',        
	    proxy: { 
	        type: 'ajax', 
	        url: 'datafiles.action',     
	        reader: { 
	            type: 'json', 
	            root: 'items' ,  
	            totalProperty  : 'total' 
	        } 
	    }, 
	    autoLoad: false      
	});
	 	
GeoExt.createInputDataWindow = function(_data , _graphManager){
	////by jjc 2013-5-18 begin	
	var FileDataGrid = null;
	if(Ext.getCmp('SelectFileData')==undefined){
		FileDataGrid = Ext.create('Ext.grid.Panel',{ 
		    store: FileDataStore, 
		    id:'SelectFileData',
			enableColumnHide: false,          
		    columns: [         
		        {text: "fileName", width: 70, dataIndex: 'fileName', sortable: false}, 
		        {text: "fileSize", width: 70, dataIndex: 'fileSize', sortable: false}, 
		        {text: "format", width: 70, dataIndex: 'format', sortable: false},      
		        {text: "type", width: 60, dataIndex: 'type', sortable: false},   
		        {text: "semantic", width: 70, dataIndex: 'semantic', sortable: false} 
		    ], 
		    height:240,     
		    width:345,            
		    viewConfig: { 
		        stripeRows: true
		    },
		    tbar: [{ 
			    xtype: 'button', 
			    iconCls:'add',   
				text: 'Add Data',
				//disabled:(current_username == ""),
				disabled:true,
				id:'FileDataAddID'
			}],
		    bbar: Ext.create('Ext.PagingToolbar', {   
		        store: FileDataStore, 
		        displayInfo: true,   
		        displayMsg: 'Show {0} - {1} item, total {2} items', 
		        emptyMsg: "no data",
				listeners : {
					'change':function(eOpts){
				       
//						FileDataStore.proxy.extraParams["semantic"]=_data.dataName;
//						FileDataStore.proxy.extraParams["top"]=maxLat;
//						FileDataStore.proxy.extraParams["down"]=minLat;
//						FileDataStore.proxy.extraParams["left"]=minLon;
//						FileDataStore.proxy.extraParams["right"]=maxLon;
						return true;
					}
										
				}				
		    }) 
		                 
		}) ;     
		 Ext.getCmp('FileDataAddID').on('click',uploadFu = function(){
			 var _FileUpload_Win = CreateFileUpload_Win(FileDataStore,"Raster","asc",_data.dataName,maxLat,minLat,minLon,maxLon); 
	    		_FileUpload_Win.show();
	     });
	}else{
		FileDataGrid = Ext.getCmp('SelectFileData');
		if(current_username == ""){
		   Ext.getCmp('FileDataAddID').disable();       
		}else{               
		   //Ext.getCmp('FileDataAddID').enable();
			Ext.getCmp('FileDataAddID').disable();       
				   
		}
		
		Ext.getCmp('FileDataAddID').un('click',uploadFu );
		Ext.getCmp('FileDataAddID').on('click',uploadFu = function(){ 
			 var _FileUpload_Win = CreateFileUpload_Win(FileDataStore,"Raster","asc",_data.dataName,maxLat,minLat,minLon,maxLon); 
	    		_FileUpload_Win.show();
	     });      
	}
	////by jjc 2013-5-18 end 
	
	var data = _data;
	var graphManager = _graphManager;
	/**
	var lat1 = latlng1_temp.lat;
	var lat2 = latlng2_temp.lat;
	var minLat = lat1 < lat2 ? lat1 : lat2;
	var maxLat = lat1 < lat2 ? lat2 : lat1;
	             
	var lon1 = latlng1_temp.lon;
	var lon2 = latlng2_temp.lon;  
	var minLon = lon1 < lon2 ? lon1 : lon2;    
	var maxLon = lon1 < lon2 ? lon2 : lon1;   
	      
	maxLat = maxLat.toFixed(6);  
	minLat = minLat.toFixed(6);    
	minLon = minLon.toFixed(6);        
	maxLon = maxLon.toFixed(6);       
	*/
        	
	//FileDataStore.load({params:{semantic:_data.dataName,top:maxLat,down:minLat,left:minLon,right:maxLon }});     
	//FileDataStore.load({params:{semantic:_data.dataName,dataSetName:soilMappingDataSet}});
	FileDataStore.load({params:{semantic:_data.dataName,lon:positionLon, lat:positionLat}});
	var _inputfun = function(){
		var records = FileDataGrid.getSelectionModel().getSelection();
		if(records.length >0){       
			var record = records[0];
			var filename = record.get("fileName");   
			
			//alert(filename);   
			      
			//var filename = data.dataName;   
			var value = [];
		    if(filename ==""){
		    	data.setValue(value); 
		    	                              
			}else{
				   
				//value.push(filename); 
				//data.setValue(value); 
				if(KenyaStatus == true){
					value.push(filename+';'+KenyaExtent);
				}else{
					value.push(filename);
				}
				data.setValue(value);  				
			}
			
			var list = graphManager.list;
			var len = list.length;   
			                
			var task = null;
			var tasks = [];
			for(var i =0; i<len; i++){
				task = null;
				if(list[i].type=='rectangle'&&list[i].hasInputData(data)){
					tasks.push(list[i]);
					//task = list[i];
					//break;
				}
			}//end of for  
			for(var p =0; p<tasks.length; p ++){
				task = tasks[p];
				//TODO: this place must be modified, when add tasks that needed env.
				if(task.taskName == 'Sample Based Mapping' || task.taskName == 'Sampling Based On Uncertainty' || task.taskName == 'sampling based on purposive'){
					     
					  var algorithm = task.selectedAlgorithm;
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
					  if(temps.length>=1){
						  var value = [];
						  value.push(layerDataNames);
						  //alert(layerDataNames);       
						  Env_Layers_ManageMent.setValue(value);  
						  graphManager.reDraw();  
					  }       
			    
					  
				 }else if(task.taskName == 'Habitat Mapping'){
				     		
					  var algorithm = task.selectedAlgorithm;
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
						     inputDatas[i].dataName != 'Cumulative Visibility')
						  {
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
						  //alert(layerDataNames);       
						  Env_Layers_ManageMent.setValue(value);  
						  graphManager.reDraw(); 
						                             
					  }       

				   }else if(task.taskName == 'Frequency Sampler'){
						      
					      var algorithm = task.selectedAlgorithm;
						  
						  //alert(algorithm.algorithmName);
						       
						  var inputDatas = algorithm.inputDatas;
						  var temps = [];
						  var Env_Layers_ManageMent = null;
						  var layerDataNames = "";
						  for(var i=0;i<inputDatas.length;i++){
                            				  
							  if(inputDatas[i].dataName == 'HM Env.Layers ManageMent'){
								  Env_Layers_ManageMent = inputDatas[i];      
							  }
							  if(inputDatas[i].dataName != 'Presence Polygons' && 
							     inputDatas[i].dataName != 'HM Env.Layers ManageMent')
							  {
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
                              //alert(layerDataNames);						  
							  var value = [];
							  value.push(layerDataNames);
							  //alert(layerDataNames);       
							  Env_Layers_ManageMent.setValue(value);  
							  graphManager.reDraw();
						  }       
                          //alert(333); 
				 }// end of else              
			}// end of for
			win.hide(); 
			graphManager.reDraw(); 
		}
	};// end of createInputDataWindow
	
	var win = null;
    if(Ext.getCmp('InputDataWin')==undefined){
        win = new Ext.Window({
            width:360,                       
            height:310,
            modal:true,			
            closeAction:'hide',
            title:'Select Data', 
            id:'InputDataWin',
            items:[FileDataGrid],              
            buttons: [{     
                text: 'OK',
                id:'InputDataWinFormOK'
            }, {      
                text: 'Cancel',
                handler:function(){
            		win.hide();
                }
            }]
        });
        
        Ext.getCmp('InputDataWinFormOK').on('click',inputfun = function(){
		    
    		_inputfun();
    	});  
    }else{
    	win = Ext.getCmp('InputDataWin');
    	Ext.getCmp('InputDataWinFormOK').un('click',inputfun);
    	Ext.getCmp('InputDataWinFormOK').on('click',inputfun = function(){                             
    		_inputfun();                          
    	});    
    }

    return win;  
};

// function8  createOutputDataWindow
GeoExt.createOutputDataWindow = function(_data,_graphManager){  
	var data = _data;
	var graphManager = _graphManager;
	
	Ext.define('State', {
        extend: 'Ext.data.Model',
        fields: [
            {type: 'string', name: 'name'},
            {type: 'string', name: 'value'}
        ]
    });
	var states = [
	               {"name":"png","value":".png"},
	               {"name":"jpg","value":".jpg"},
	               {"name":"asc","value":".asc"}      
	             ];
    var store = Ext.create('Ext.data.Store', {
        model: 'State',
        data: states
    });
    var combo = null;
    if(Ext.getCmp('SelectFormat')==undefined){
        combo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Select format',
            id:'SelectFormat',
            displayField: 'name',
            valueField:'value',
            width: 250,
            labelWidth: 80,            
            store: store,    
            queryMode: 'local',          
            typeAhead: true
        });
    }else{            
    	combo = Ext.getCmp('SelectFormat');
    }
    
    var form = null;
    if(Ext.getCmp('SelectFormatForm')==undefined){
    	form = new Ext.form.FormPanel({
            labelAlign: 'right',
            id:'SelectFormatForm',
            frame: true,
            items: [combo]  
        });
    }else{   
    	form = Ext.getCmp('SelectFormatForm');
    } 
    
    var _selectFun = function(){
	    //var format = combo.getValue();
    	var format = ".asc";       
	    var nowtime = (new Date()).valueOf();
	    data = _data;       
	    var dataName = data.dataName.replace(/\s/g,"");  
	      
	    var filename = "result_egc/" +  dataName + nowtime + format;  
	     
	    var value = [];                       
		value.push(filename);    
		data.setValue(value);
		win.hide();        
		graphManager.reDraw();           
    };
    
	var win = null;
	if(Ext.getCmp('SelectFormatFormWin')== undefined){
		win = new Ext.Window({      
	        width:300,
	        height:100,
			modal:true,
	        id:'SelectFormatFormWin',
	        closeAction:'hide',
	        items: [form],        
	        buttons: [{ 
	            text: 'OK', 
	            id:'SelectFormatFormWinOK'
	        }, {                            
	            text: 'Cancel',
	            handler:function(){      
	        		win.hide();                
	            }
	        }]     
	    });   
		Ext.getCmp('SelectFormatFormWinOK').on('click',selectFun = function(){
			
			_selectFun();       
		});        
	}else{      
		                           
		win = Ext.getCmp('SelectFormatFormWin');               
		Ext.getCmp('SelectFormatFormWinOK').un('click',selectFun); 
		Ext.getCmp('SelectFormatFormWinOK').on('click',selectFun = function(){
			    
			_selectFun();
		});    
		    
	}

    return win;
};//end of createOutputDataWindow
// function9 createAlgorithmSelectWindow
Ext.define('AlgorithmState', {
        extend: 'Ext.data.Model',
        fields: [
            {type: 'string', name: 'name'},
            {type: 'string', name: 'value'}
        ]
    });
var Algorithmstates = [
	               {"name":"SFD","value":"SFD"},
	               {"name":"MFD","value":"MFD"}     
	             ];
var Algorithmstore = Ext.create('Ext.data.Store', {
        model: 'AlgorithmState',
        data: Algorithmstates
    });

GeoExt.createAlgorithmSelectWindow = function(_task,_graphManager,_canvas){
	         
	this.task = _task;
	this.graphManager = _graphManager;
	this.canvas = _canvas;
	this.combo = null;
	     
    if(Ext.getCmp('SelectAlgorithmCombo')==undefined){
        this.combo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Algorithm',
            id:'SelectAlgorithmCombo',
            displayField: 'name',
            valueField:'value',
            width: 250,
            labelWidth: 80,            
            store: Algorithmstore,    
            queryMode: 'local',          
            typeAhead: true
        });
    }else{            
    	this.combo = Ext.getCmp('SelectAlgorithmCombo');
    }

	this.form = null;
    if(Ext.getCmp('SelectAlgorithmForm')==undefined){
    	this.form = new Ext.form.FormPanel({
            labelAlign: 'right',
            id:'SelectAlgorithmForm',
            frame: true,
            items: [this.combo]  
        });
    }else{   
    	this.form = Ext.getCmp('SelectAlgorithmForm');
    } 
	  
   
	Ext.getCmp("SelectAlgorithmCombo").setValue(this.task.selectedAlgorithm.algorithmName);
	this.win = null;
	if(Ext.getCmp('SelectAlgorithmFormWin')== undefined){
	   
		this.win = new Ext.Window({      
	        width:300,
	        height:100,
			modal:true,
	        id:'SelectAlgorithmFormWin',
	        closeAction:'hide',
	        items: [this.form],        
	        buttons: [{ 
	            text: 'OK',
				 id:'SelectAlgorithmFormWinOK'
	        },{                               
	            text: 'Cancel',    
	            handler:function(){                 
					Ext.getCmp('SelectAlgorithmFormWin').hide();				
	            }
	        }]         
	    });
		Ext.getCmp('SelectAlgorithmFormWinOK').on("click" , function(){                   
			           
			  var algorithmName = Ext.getCmp("SelectAlgorithmCombo").getValue();
			  this.task.selectedAlgorithm.algorithmName = algorithmName;
			  Ext.getCmp('SelectAlgorithmFormWin').hide();
			  // 
              var x_task = this.task.x ;
			  var y_task = this.task.y ;   			  
              this.graphManager.deleteGraph(this.task);
		      this.graphManager.reDraw();
              // 
              var kb = new knowledgeBase();
              var outputnames = kb.findOutputDataNames(algorithmName);
              
			  var taskname = kb.findTaskNameHasOutput(outputnames[0]);
			  if(taskname==null)
			   return;	
			 var currentOutput = null;
			 for(var i=0;i<this.graphManager.list.length;i++){
				if(this.graphManager.list[i].type =="ellipse"){
					if(this.graphManager.list[i].dataName == outputnames[0]){
						currentOutput = this.graphManager.list[i];
						break;
					}
				}
			 }
			 var _task = new task(x_task,y_task,100,50,taskname,this.canvas,this.graphManager);     
			 this.graphManager.list.push(_task);
			 _task.initAlgorithms();
			 _task.setAlgorithm(algorithmName);	
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
					var x_data = x_task + 250;
					var y_data = y_task - 100; 
					var _data=new data(x_data + counter*50,y_data,40,25,inputnames[i],this.canvas);
	
					this.graphManager.list.push(_data);
					inputdatas.push(_data);
					counter ++;
				}
			}
			for(var i = 0;i<this.graphManager.list.length;i++){
				if(this.graphManager.list[i].type == 'rectangle'){
					if(this.graphManager.list[i].hasInputData(currentOutput))
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
			
			if(currentOutput.dataName == 'Presence Sites'){
				filename = "result_egc/" + currentOutput.dataName + nowtime + ".shp";
			}else{ 
				filename = "result_egc/" + currentOutput.dataName + nowtime + ".asc";
			}
			
			filename = filename.replace(/\s/g,"");  
			value.push(filename); 
			currentOutput.setValue(value);       
			outputdatas.push(currentOutput);
			_task.setInputDatas(inputdatas);
			_task.setOutputDatas(outputdatas);
			kb.setParametersDefaultValue(algorithmName,paras);
			_task.setParameters(paras);  
             
			var con = new connection(_task,currentOutput, this.canvas);
			this.graphManager.list.push(con);	
			
			for(var i=0;i<inputdatas.length;i++){
				var con = new connection(inputdatas[i],_task, this.canvas);
				this.graphManager.list.push(con);
			}
			this.graphManager._dataMenu = null;                    
			this.graphManager.reDraw();        		
        },this);     
		
	}else{
		this.win = Ext.getCmp('SelectAlgorithmFormWin');
	}
	return this.win;
}


/**
 *@deprecated function for Uncertainty Directed Field Sampling for Digital Soil Mapping
 *@author lp
 *@see 基于推理不确定性的数字土壤制图补样方法研究 张淑杰 博士论文
 * */ 
GeoExt.createAdditonalSamplingWin = function(paras){   
	  
	var Climate = null;
	if(Ext.getCmp('Climate_Parameter') == undefined){
		
		Climate = {
	    		 xtype: 'fieldset',
	             flex: 1,         
	             id:'Climate_Parameter',      
	             title: 'Climate',
	             defaultType: 'checkbox', // each item will be a checkbox
	             layout: 'anchor',
	             defaults: {      
	                
	                 hideEmptyLabel: true   
	             },
	             items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
	    };
	}else{
		Climate = Ext.getCmp('Climate_Parameter');
	}         
	var Geology = null;
	if(Ext.getCmp('Geology_Parameter') == undefined){
	    Geology = {
	            xtype: 'fieldset',
	            flex: 1,
	            id:'Geology_Parameter',
	            title: 'Geology',
	            defaultType: 'checkbox', // each item will be a checkbox
	            layout: 'anchor',
	            defaults: {
	                //anchor: '100%',
	                hideEmptyLabel: true   
	            },
	            items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
	    };
	}else{
		Geology = Ext.getCmp('Geology_Parameter');
	}
    
	var Terrain = null;
    if(Ext.getCmp('Terrain_Parameter') == undefined){
        Terrain = {
                xtype: 'fieldset',
                flex: 1,
                id:'Terrain_Parameter',
                title: 'Terrain',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                   // anchor: '100%',
                    hideEmptyLabel: true   
                },
                items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
        };
    }else{
    	Terrain = Ext.getCmp('Terrain_Parameter');
    }
     
    var Vegetation = null;
    if(Ext.getCmp('Vegetation_Parameter') == undefined){
        Vegetation = {
                xtype: 'fieldset',
                flex: 1,
                id:'Vegetation_Parameter',
                title: 'Vegetation',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    //anchor: '100%',
                    hideEmptyLabel: true   
                },
                items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
        };
    }else{
    	Vegetation = Ext.getCmp('Vegetation_Parameter');
    }
    
    var Others = null;
    if( Ext.getCmp('Others_Parameter') == undefined){
        Others = {     
                xtype: 'fieldset',
                flex: 1,
                id:'Others_Parameter',
                title: 'Others',
                defaultType: 'checkbox', // each item will be a checkbox
                layout: 'anchor',
                defaults: {
                    //anchor: '100%',
                    hideEmptyLabel: true   
                },
                items:[{
	            	 xtype:'component',      
	         		 html:'Env.Layer Name &nbsp;&nbsp;&nbsp;&nbsp;Distance Calculation'
	             },{
	            	 xtype:'component',
	             	 height:10   
	             }]
        };
    }else{
    	Others = Ext.getCmp('Others_Parameter');
    }
                        
    Ext.define('State1', {
        extend: 'Ext.data.Model',
        fields: [
            {type: 'string', name: 'name'},
            {type: 'string', name: 'value'}
        ]
    });
	var states1= [
	               {"name":"Gower","value":"Gower"},
	               {"name":"Boolean","value":"Boolean"}    
	             ];
    var store1 = Ext.create('Ext.data.Store', {        
        model: 'State1',
        data: states1
    });
    //
    var ut = null;
    if(Ext.getCmp('UT')==undefined){
        ut = Ext.create('Ext.form.NumberField', {
            fieldLabel: 'Uncertainty Threshold',
            decimalPrecision:2,   
            id:'UT',
            step : 0.1, 
            value: 0.3,  
            minValue: 0.0,          
            maxValue: 1.0,
            width: 400,             
            labelWidth: 220
        });
    }else{    
    	ut = Ext.getCmp('UT');
    }
    var ms = null;
    if(Ext.getCmp('MS') == undefined){
    	ms = Ext.create('Ext.form.NumberField',{
    		fieldLabel : 'Max Sample Number',
    		decimalPrecision:0,
    		id:'MS',
    		step:1,
    		value:10,
    		minValue:0,
    		maxValue:9999,
    		width:400,
    		labelWidth:220
    	});
    }else{
    	ms = Ext.getCmp('MS');
    }
    
    var parameters = [];   
   
                  
    parameters.push(Climate);
    parameters.push(Geology);  
    parameters.push(Terrain);
    parameters.push(Vegetation); 
    parameters.push(Others); 
    parameters.push(ms);
    parameters.push(ut);          
    // combine all that into one huge form
    var fp = null;
    if(Ext.getCmp('AdditonalSamplingFrom') == undefined){
        fp = Ext.create('Ext.FormPanel', {
            
            frame: true,
            id:'AdditonalSamplingFrom',
            fieldDefaults: {
                labelWidth: 110
            },
            width: 450,    
            bodyPadding: 10,
            items: [
                    
            ],
            buttons: [{
                text: 'OK',
                handler: function(){
                   
            	  for(var i =0; i< paras.length; i++){
            		  var paraName = paras[i].parameterName;
            		  var para = paras[i];
            		  var value = [];
            		 
            		  switch(paraName){
            		  	case "Uncertainty Threshold":
            		  		 value = []; 
                  			 value.push(Ext.getCmp('UT').getValue());
                  			 para.setValue(value);
                  	         break;
            		  	case "Max Sample Number":
           		  		     value = []; 
                 			 value.push(Ext.getCmp('MS').getValue());
                 			 para.setValue(value);
                 	         break;
            		  	case "Environmental Attribute Parameter":
         		  		    
            		  		 value = []; 
         		  		     var rulestringAll = "";
         		  		     var kinds = [];
         		  		     kinds.push('Climate');
         		  		     kinds.push('Geology');
         		  		     kinds.push('Terrain');
         		  		     kinds.push('Vegetation');
         		  		     kinds.push('Others');
         		  		     
         		  		     for(var t = 0;t<kinds.length;t++){
         		  		    	 var kindName = kinds[t];
         		  		    	 var rulestring = ""; 
             		  		     var temps = Ext.getCmp(kindName + '_Parameter').query("combo");
             		  		     var tempsnet = [];
             		  		     for(var v =0;v<temps.length;v++){
             		  		    	 if(temps[v].isVisible()){
             		  		    		 tempsnet.push(temps[v]);
             		  		    	 }
             		  		     }
             		  		     var tag = 0;
         		  		         if(tempsnet.length >1){
         		  		        	 tag =1;
         		  		        	 for(var k =0;k<tempsnet.length-1;k++){
                  		  		    	rulestring = rulestring + kindName+ "?" + tempsnet[k].getValue() +"#";
                  		  		     }
         		  		        	 rulestring = rulestring + kindName+"?" + tempsnet[tempsnet.length-1].getValue(); 
         		  		         }else if(tempsnet.length ==1){     
         		  		              tag =1;
         		  		        	  rulestring = rulestring + kindName+"?" + tempsnet[0].getValue();
         		  		         }
	         		  		     if(tag == 1 && rulestringAll != ""){  
	          	  		        	  rulestringAll = rulestringAll + "#" + rulestring;
	          	  		         }else if(tag == 1 && rulestringAll == ""){
	          	  		        	  rulestringAll =  rulestring;
	          	  		         }

         		  		        	              
         		  		     }               
         		  		     value.push(rulestringAll);          
         		  		     
         		  		     para.setValue(value);
         		  		     break;	    
               	         default:
               	        	 break;
            		  }
            		  
            	  }
            	  
            	  win.hide();   
                }
            },{
                text: 'Cancel',   
                handler: function(){
            	  win.hide();    
                }
            }]             
        });  
    }else{
    	fp = Ext.getCmp('AdditonalSamplingFrom');
    }
                  
    
    fp.add(parameters);  
    
    var parameterNames = [];
    parameterNames.push('Climate_Parameter');
    parameterNames.push('Geology_Parameter');
    parameterNames.push('Terrain_Parameter');
    parameterNames.push('Vegetation_Parameter');
    parameterNames.push('Others_Parameter');
   
    for(var k =0 ; k<parameterNames.length ; k++){
        if( Ext.getCmp(parameterNames[k])!=undefined){
	       	 var temps = Ext.getCmp(parameterNames[k]).query('combo');                
	       	 for(var i =0;i< temps.length;i++){
	       		 temps[i].hide();
	       	 }            
       }      
    }       
         
    var EnvLayers= GeoExt.getSelectedEnvLayers();
                                                  
    var climateflag = 0;
    var geologyflag = 0;
    var terrainflag = 0;
    var vegetationflag = 0;
    var othersflag = 0;
    var EnvNames = [];
    EnvNames.push("Climate");
    EnvNames.push("Geology");
    EnvNames.push("Terrain");
    EnvNames.push("Vegetation");
    EnvNames.push("Others");
    
    for(var i =0;i<EnvLayers.length;i++){
    	for(var j =0;j<EnvNames.length;j++){
    		if(EnvLayers[i].indexOf(EnvNames[j])>=0){
    			var temps = EnvLayers[i].split("#");
        		var layername = temps[1]; 
        		var layerid = layername.replace(/\s/g,""); 
        		if(Ext.getCmp(layerid)!=undefined){
        			Ext.getCmp(layerid).show();
        			 if(EnvNames[j]=="Geology"){
         		    	Ext.getCmp(layerid).setValue('Boolean');
         		    }  
        		}else{
        		    var combolayer = Ext.create('Ext.form.field.ComboBox', {
        		        fieldLabel: layername,
        		        id:layerid,    
        		        displayField: 'name',
        		        valueField:'value',
        		        value:'Gower',    
        		        width: 200,         
        		        labelWidth: 100,            
        		        store: store1,    
        		        queryMode: 'local',          
        		        typeAhead: true
        		    });
        		    Ext.getCmp(EnvNames[j] + '_Parameter').add(combolayer);
        		    if(EnvNames[j]=="Geology"){
        		    	Ext.getCmp(layerid).setValue('Boolean');
        		    	           
        		    }
        		}           
    		}// end of if
    	}// end of for
    }//end of for
    for(var i =0; i<EnvLayers.length;i++){
       
    	if(EnvLayers[i].indexOf("Climate")>=0){
    		climateflag = 1;
    		
    	}else if(EnvLayers[i].indexOf("Geology")>=0){
    		geologyflag = 1; 
    		
    	} else if(EnvLayers[i].indexOf("Terrain")>=0){
    		terrainflag = 1;
    		
    	} else if(EnvLayers[i].indexOf("Vegetation")>=0){
    		vegetationflag =1;
    		
    	} else if(EnvLayers[i].indexOf("Others")>=0){
    		othersflag = 1; 
    	}         
    }         
    
    if(climateflag == 1){
    	Ext.getCmp('Climate_Parameter').show();
    }else{   
    	Ext.getCmp('Climate_Parameter').hide();
    }
    
    if(geologyflag == 1){
    	Ext.getCmp('Geology_Parameter').show();
    }else{   
    	Ext.getCmp('Geology_Parameter').hide();
    } 
    
    if(terrainflag == 1){
    	Ext.getCmp('Terrain_Parameter').show();
    }else{   
    	Ext.getCmp('Terrain_Parameter').hide();
    }
    
    if(vegetationflag == 1){
    	Ext.getCmp('Vegetation_Parameter').show();
    }else{   
    	Ext.getCmp('Vegetation_Parameter').hide();
    }
    
    if(othersflag == 1){
    	Ext.getCmp('Others_Parameter').show();
    }else{   
    	Ext.getCmp('Others_Parameter').hide();
    }    
    ///////
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="Uncertainty Threshold"){
		   var value = para.getValue();                 
		   Ext.getCmp('UT').setValue(value[0]);   
		}
	};
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="Max Sample Number"){
		   var value = para.getValue();                 
		   Ext.getCmp('MS').setValue(value[0]);   
		}
	};
	///////
    fp.doLayout(); 
    var win = null ;
    if(Ext.getCmp('AdditonalSamplingWin') == undefined){
    	win = new Ext.Window({           
            width:460,
			modal:true,			
            id:'AdditonalSamplingWin',
            title: 'Sampling Based on uncertainty',      
            closeAction:'close',
            items: [fp]
        });  	
    }else{
    	win = Ext.getCmp('AdditonalSamplingWin');   
    }
	
	                   
	return win;            
	   
};

/**
 * sampling based on purposive
 * */
GeoExt.createPurposiveSamplingWin = function(paras){                    
    
    //para minClassNum
	var mic = null;
    if(Ext.getCmp('MIC')==undefined){
        mic = Ext.create('Ext.form.NumberField', {
            fieldLabel: 'minClassNum',
            decimalPrecision:0,   
            id:'MIC',
            step : 1, 
            value: 3,  
            minValue: 0,          
            maxValue: 9999,
            width: 400,             
            labelWidth: 220
        });
    }else{    
    	mic = Ext.getCmp('MIC');
    }
    //para maxClassNum
    var mac = null;
    if(Ext.getCmp('MAC') == undefined){
    	mac = Ext.create('Ext.form.NumberField',{
    		fieldLabel : 'maxClassNum',
    		decimalPrecision:0,
    		id:'MAC',
    		step:1,
    		value:5,
    		minValue:0,
    		maxValue:9999,
    		width:400,
    		labelWidth:220
    	});
    }else{
    	mac = Ext.getCmp('MAC');
    }
    //para endError
    var ee = null;
    if(Ext.getCmp('EE') == undefined){
    	ee = Ext.create('Ext.form.NumberField',{
    		fieldLabel : 'endError',
    		decimalPrecision:3,
    		id:'EE',
    		step:0.001,
    		value:0.01,
    		minValue:0.000,
    		maxValue:1.000,
    		width:400,
    		labelWidth:220
    	});
    }else{
    	ee = Ext.getCmp('EE');
    }
    
    //para iterationNum
    var inum = null;
    if(Ext.getCmp('IN') == undefined){
    	inum = Ext.create('Ext.form.NumberField',{
    		fieldLabel : 'iterationNum',
    		decimalPrecision:0,
    		id:'IN',
    		step:1,
    		value:20,
    		minValue:0,
    		maxValue:9999,
    		width:400,
    		labelWidth:220
    	});
    }else{
    	inum = Ext.getCmp('IN');
    }
    //para Alpha_Cut
    var ac = null;
    if(Ext.getCmp('AC') == undefined){
    	ac = Ext.create('Ext.form.NumberField',{
    		fieldLabel : 'Alpha_Cut',
    		decimalPrecision:2,
    		id:'AC',
    		step:0.1,
    		value:0.7,
    		minValue:0.0,
    		maxValue:1.0,
    		width:400,
    		labelWidth:220
    	});
    }else{
    	ac = Ext.getCmp('AC');
    }
    //para patternSampleNum
    var ps = null;
    if(Ext.getCmp('PS') == undefined){
    	ps = Ext.create('Ext.form.NumberField',{
    		fieldLabel : 'patternSampleNum',
    		decimalPrecision:0,
    		id:'PS',
    		step:1,
    		value:3,
    		minValue:0,
    		maxValue:9999,
    		width:400,
    		labelWidth:220
    	});
    }else{
    	ps = Ext.getCmp('PS');
    }
    //para sample_distance
    var sd = null;
    if(Ext.getCmp('SD') == undefined){
    	sd = Ext.create('Ext.form.NumberField',{
    		fieldLabel : 'sample_distance',
    		decimalPrecision:0,
    		id:'SD',
    		step:1,
    		value:100,
    		minValue:0,
    		maxValue:9999,
    		width:400,
    		labelWidth:220
    	});
    }else{
    	sd = Ext.getCmp('SD');
    }
    
    
    var parameters = [];   
   
                  
    parameters.push(mic);
    parameters.push(mac);  
    parameters.push(ee);
    parameters.push(inum); 
    parameters.push(ac); 
    parameters.push(ps);
    parameters.push(sd);          
    // combine all that into one huge form
    var fp = null;
    if(Ext.getCmp('PurposiveSampingFrom') == undefined){
        fp = Ext.create('Ext.FormPanel', {
            
            frame: true,
            id:'PurposiveSampingFrom',
            fieldDefaults: {
                labelWidth: 110
            },
            width: 450,    
            bodyPadding: 10,
            items: [
                    
            ],
            buttons: [{
                text: 'OK',
                handler: function(){
                   
            	  for(var i =0; i< paras.length; i++){
            		  var paraName = paras[i].parameterName;
            		  var para = paras[i];
            		  var value = [];
            		 
            		  switch(paraName){
            		  	case "minClassNum":
            		  		 value = []; 
                  			 value.push(Ext.getCmp('MIC').getValue());
                  			 para.setValue(value);
                  	         break;
            		  	case "maxClassNum":
           		  		     value = []; 
                 			 value.push(Ext.getCmp('MAC').getValue());
                 			 para.setValue(value);
                 	         break;
                 	    case "endError":
           		  		     value = []; 
                 			 value.push(Ext.getCmp('EE').getValue());
                 			 para.setValue(value);
                 	         break;
                 	    case "iterationNum":
           		  		     value = []; 
                 			 value.push(Ext.getCmp('IN').getValue());
                 			 para.setValue(value);
                 	         break;
                 	    case "Alpha_Cut":
           		  		     value = []; 
                 			 value.push(Ext.getCmp('AC').getValue());
                 			 para.setValue(value);
                 	         break;
                 	    case "patternSampleNum":
           		  		     value = []; 
                 			 value.push(Ext.getCmp('PS').getValue());
                 			 para.setValue(value);
                 	         break;
                 	    case "sample_distance":
           		  		     value = []; 
                 			 value.push(Ext.getCmp('SD').getValue());
                 			 para.setValue(value);
                 	         break;
               	         default:
               	        	 break;
            		  }
            		  
            	  }
            	  
            	  win.hide();   
                }
            },{
                text: 'Cancel',   
                handler: function(){
            	  win.hide();    
                }
            }]             
        });  
    }else{
    	fp = Ext.getCmp('PurposiveSampingFrom');
    }
                  
    
    fp.add(parameters);     
    ///////
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="minClassNum"){
		   var value = para.getValue();                 
		   Ext.getCmp('MIC').setValue(value[0]);   
		}
	};
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="maxClassNum"){
		   var value = para.getValue();                 
		   Ext.getCmp('MAC').setValue(value[0]);   
		}
	};
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="endError"){
		   var value = para.getValue();                 
		   Ext.getCmp('EE').setValue(value[0]);   
		}
	};
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="iterationNum"){
		   var value = para.getValue();                 
		   Ext.getCmp('IN').setValue(value[0]);   
		}
	};
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="Alpha_Cut"){
		   var value = para.getValue();                 
		   Ext.getCmp('AC').setValue(value[0]);   
		}
	};
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="patternSampleNum"){
		   var value = para.getValue();                 
		   Ext.getCmp('PS').setValue(value[0]);   
		}
	};
	for(var i =0; i< paras.length; i++){         
		var paraName = paras[i].parameterName;
		var para = paras[i];
		if(paraName =="sample_distance"){
		   var value = para.getValue();                 
		   Ext.getCmp('SD').setValue(value[0]);   
		}
	};
	///////
    fp.doLayout(); 
    var win = null ;
    if(Ext.getCmp('PurposiveSampingWin') == undefined){
    	win = new Ext.Window({           
            width:460,
			modal:true,			
            id:'PurposiveSampingWin',
            title: 'Sampling Based on Purposive',      
            closeAction:'close',
            items: [fp]
        });  	
    }else{
    	win = Ext.getCmp('PurposiveSampingWin');   
    }
	
	                   
	return win;            
	   
};

