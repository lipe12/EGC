
var namespace= "data_management";
////////list all the data of the user
   Ext.define('ListFileData',{ 
	    extend: 'Ext.data.Model', 
	    fields: [ 
	        {name:'fileName',mapping:'fileName'}, 
	         'format', 
	         'semantic',
	         'type',
	         'datasetName'
	    ] 
	}); 
	 
	var ListFileDataStore = Ext.create('Ext.data.Store', { 
	    pageSize:50,       
	    remoteSort:true,
	    //storeId:'FileData_Store',
		model: 'ListFileData',        
	    proxy: { 
	        type: 'ajax', 
	        url: 'listdatafiles.action',     
	        reader: { 
	            type: 'json', 
	            root: 'items' ,  
	            totalProperty  : 'total' 
	        } 
	    }, 
	    autoLoad: false      
	});
 var kmllayer = null;
 function displayKML(kml_name){    
	
	//alert(kml_name);
	FileDataGrid_User.getSelectionModel().deselectAll();   
	 
	var tmps = kml_name.split("/"); 
	var datasetname = tmps[1].replace(".kml", ""); 
	//alert(datasetname);                                 
	var xmlUrl = "findkmlextent.action?datasetname="+ datasetname;
    var ajax = new Ajax();   
    ajax.open("GET",xmlUrl,true);
    ajax.onreadystatechange=function(){                        
		if(ajax.readyState==4){
			if(ajax.status==200){                
				var tag=ajax.responseText.pJSON().tag;
				              
				if(tag == true){           
				     
					var north = ajax.responseText.pJSON().north;
					var south = ajax.responseText.pJSON().south;
					var west = ajax.responseText.pJSON().west;
					var east = ajax.responseText.pJSON().east;
					///////////
					
					var wfs_indicators_tmp = [];
					/*
					for(var i= map.layers.length -1; i>=0; i--){        
						if(map.layers[i]==kmllayer){
						
							//var center_kml = kmllayer.features[0].geometry.getBounds().getCenterLonLat();       	  				
                            //map.panTo(center_kml); 
						}
					}*/
					
                   for(var i= wfs_indicators.length -1; i>=0; i--){
						if(wfs_indicators[i].name != "myKML"){
							wfs_indicators_tmp.push(wfs_indicators[i]); 
						}
					}
					
					if(kmllayer != null){
						map.removeControl(selectControl);
						selectControl.destroy();
                                                                     
						map.removeLayer(kmllayer);
						kmllayer.destroy();
					}
					kmllayer= null;
					kmllayer = new OpenLayers.Layer.Vector("myKML", {
				    	 
				    	styleMap: new OpenLayers.StyleMap({
				    		 "default": new OpenLayers.Style({
				                 fillColor: "#ffcc66",
				                 strokeColor: "#ff9933",
				                 strokeWidth: 2,
				                 fillOpacity: 0.4,
				                 graphicZIndex: 1       
				             }),
				             "select": new OpenLayers.Style({
				                 fillColor: "#6A6AFF",
				                 strokeColor: "#6A6AFF",   
				                 fillOpacity: 0.4,        
				                 graphicZIndex: 2            
				             })
				    	 }),  
				    	 
				    	strategies: [new OpenLayers.Strategy.Fixed()],
				        protocol: new OpenLayers.Protocol.HTTP({
				            url: "kml/" + kml_name,                                        
				            format: new OpenLayers.Format.KML({
				              
				                extractAttributes: true,   
				                maxDepth: 2           
				            })        
				        }),
				        projection: geographic            
				     });
				     
					
				     kmllayer.events.on({      
						 "featureselected": function(e){              
					        
						    latlng1_temp = new OpenLayers.LonLat(west,south); 
				    	    latlng2_temp = new OpenLayers.LonLat(east,north);               
						    
				    	    var feature = e.feature;        
					        selectedFeature = feature; 
					        AddPop(feature);        
				    	
					     },"featureunselected": function(e) {
						    
					    	 var feature = e.feature;
						     DeletePop(feature);        
						 }, "loadend": function() {
						            
                            var center_kml = kmllayer.features[0].geometry.getBounds().getCenterLonLat();       	  				
                            map.panTo(center_kml);                					
                                   
						    
						 }
					}); 
				    map.addLayers([kmllayer]); 
				    
					
					wfs_indicators = wfs_indicators_tmp;
					wfs_indicators.push(kmllayer);
					map.removeControl(selectControl);          
					selectControl = new OpenLayers.Control.SelectFeature(wfs_indicators);                      
				    map.addControl(selectControl);       
					selectControl.activate();    						
				    
					//var selectControl = new OpenLayers.Control.SelectFeature([kmllayer]);	
				 	//map.addControl(selectControl);            
				 	//selectControl.activate();  
					//////////
					    
				}          
			}
		 }    
	 };
	 ajax.send(null);

   
 } 
	
 function renderDescn(value) {                                         
	
	 if(value.indexOf("\\")>0){
		 
		 value = value.replace("\\","/");
	 }
	    
	 var str = "";     
	 if(value.indexOf(".kml") >0 ){
		 str = "<input type='button' value='Location' onclick='displayKML(\""+ value +"\")'>";       
	 }    
	                  
     return str;     
 }
 function renderFileName(value){
	 var str = value;
	 if(value.indexOf("/")>0){
		 
		var pos = value.lastIndexOf("/")*1;  
 		str = value.substring(pos+1); 
		 
	 }else if(value.indexOf("\\")>0){
		 
		 var pos = value.lastIndexOf("\\")*1;  
	 	 str = value.substring(pos+1); 
			 
	 }
	 return str;
 }

 ListFileDataStore.load();                 
 
var FileDataGrid_User = Ext.create('Ext.grid.Panel',{ 
    
	store:ListFileDataStore,
    id:'List_FileData',          
    //title:"Create DataSet and Data",  
    title:"Data Manage",
	enableColumnHide: false,          
    columns: [         
        {text: "datasetName", 
        	//width: 100,
        	width: 80,
        	dataIndex: 'datasetName', sortable: false
        },
        {text: "semantic", 
        	width: 80,             
        	dataIndex: 'semantic', sortable: false
        },
        {               
            text:"ShowLocation",
            width: 100,                          
            dataIndex: 'fileName',
            renderer : renderDescn 
        }, 
        {text: "fileName", 
        	//width: 100,
            width: 80,
        	dataIndex: 'fileName', sortable: false,renderer : renderFileName
        },                
        /*
        {text: "format", 
        	width: 50,
        	dataIndex: 'format', sortable : true}, 
        */           	                 
        {text: "type", 
        	width: 80,                         
        	dataIndex: 'type', sortable: false
        } 
       
                     
    ],
    width: 250,                        
    //height:600,     
    //width:600, 
    //x:200,       
    //y:50,            
    viewConfig: { 
        stripeRows: true 
    },
    tbar: [{ 
	    xtype: 'button', 
	    //iconCls:'add',     
		text: 'AddDataSet',   
	    handler:function(){              	
	    	DataSet_Win.show();
	    }
	},{ 
	    xtype: 'button', 
	    //iconCls:'add',     
		text: 'AddData',   
	    handler:function(){                       
	    	                                               
	    	FileUpload_Win_User.show();
	    }   
	},{
		xtype: 'button',    
		text: 'DeleteData',      
	    handler:function(){                       
	    	  
	    	var record = Ext.getCmp('List_FileData').getSelectionModel().getLastSelected();
	    	    
	    	var fileName = record.get("fileName"); 
	    	
			var xmlUrl = "deleteData.action?fileName=" + fileName;
			var ajax = new Ajax();   
			ajax.open("GET",xmlUrl,true); 
			ajax.onreadystatechange=function(){  
				if(ajax.readyState==4){
					if(ajax.status==200){
                        					
						var tag=ajax.responseText.pJSON().tag;
						         
						if(tag == 1){
							
							alert("delete finish!");
							ListFileDataStore.load();
						}
					}
				 }    
			};
			ajax.send(null); 
	    	              
	    } 
	}],
    bbar: Ext.create('Ext.PagingToolbar', {   
        store: ListFileDataStore, 
        displayInfo: true,   
        displayMsg: 'Show {0} - {1} item, total {2} items', 
        emptyMsg: "no data",
		listeners : {
			'change':function(eOpts){
				return true;
			}
								
		}				
    }) 
                 
}) ; 


///////////////// upload user's data into server

//Semantic fields
Ext.define('SemanticModel', {
    extend: 'Ext.data.Model',
    fields: [
        {type: 'string', name: 'name'},
        {type: 'string', name: 'value'}
    ]
});
var semantics = [
              
               {"name":"Sample Data","value":"Sample Data"},
               {"name":"DEM","value":"DEM"},
               {"name":"TWI","value":"TWI"},
               {"name":"Plan Curvature","value":"Plan Curvature"},
               {"name":"Profile Curvature","value":"Profile Curvature"},
               {"name":"Slope Gradient","value":"Slope Gradient"},
               {"name":"Temperature","value":"Temperature"},
               {"name":"Parent Material","value":"Parent Material"},
               {"name":"Precipitation","value":"Precipitation"},
               {"name":"Evi","value":"Evi"},
               {"name":"NDVI","value":"NDVI"},
               {"name":"Ndwi","value":"Ndwi"},
               {"name":"Palsar08hv","value":"Palsar08hv"}       
               
               
             ];
var semantic_store = Ext.create('Ext.data.Store', {        
    model: 'SemanticModel',
    data: semantics
});

var semantic_combo = Ext.create('Ext.form.field.ComboBox', {
    fieldLabel: 'Semantic',
    displayField: 'name', 
    name: 'semantic',
    id: namespace + 'semantic',
    store: semantic_store,
    value: "Sample Data",   
    queryMode: 'local',
    typeAhead: true,
    allowBlank: false,
    listeners:{
    	"select":function(){
    	   
    	   
    	   document.getElementById('html5_inputfile').value='';		
    	   document.getElementById('inputfile_text').value='';	
    	   csvFields = [];
    	   csvFields_store.loadData(csvFields);	
    	   
    	   csv_x_filed_combo.setRawValue('');
    	   csv_y_filed_combo.setRawValue('');
    	                      
    	   var seman = semantic_combo.getValue();
      	   if(seman == "Sample Data"){
      		   
      		   Ext.getCmp(namespace + 'datafile_csv').setDisabled(false);
      		   Ext.getCmp(namespace + 'x_field').setDisabled(false);
      		   Ext.getCmp(namespace + 'y_field').setDisabled(false);
      		 
      		   Ext.getCmp(namespace + 'datafile_asc').setDisabled(true);
      		   Ext.getCmp(namespace + 'datafile_prj').setDisabled(true);        
      	   }else {
      		   
      		   Ext.getCmp(namespace + 'datafile_csv').setDisabled(true);
      		   Ext.getCmp(namespace + 'x_field').setDisabled(true);
    		   Ext.getCmp(namespace + 'y_field').setDisabled(true);
      		   
      		   Ext.getCmp(namespace + 'datafile_asc').setDisabled(false);        
      		   Ext.getCmp(namespace + 'datafile_prj').setDisabled(false);      
      	   }
    	                      
    	}
    }     
});
/// dataset names

Ext.define('DataSetModel', {
    extend: 'Ext.data.Model',       
    fields: [
	        {name:'datasetname',mapping:'datasetname',type:'string'}
    ]
});
var DataSetStore = Ext.create('Ext.data.Store', {
    model: 'DataSetModel',
    proxy:{
		type:'ajax',
		url:'list_dataset.action',
		reader:{
			type:'json',
			root:'items'
		}
	},      
	autoLoad:false,        
    remoteSort:false		
});

var dataset_combo = Ext.create('Ext.form.field.ComboBox', {
    fieldLabel: 'DataSetName',
    displayField: 'datasetname',  
    name: 'dataSetName',
    allowBlank: false, 
    blankText: 'dataSetName can not be empty,please select or create a new one',
        
    id: namespace + 'dataSetName',
    store: DataSetStore,
                      
    queryMode: 'local',
    typeAhead: true
});

DataSetStore.load();

///
///
//html5 FileRead API

var final_csv = "";
var csv_firstline = "";
var html5read = function(e){
	  
	      
	var extend = e.value.substring(e.value.lastIndexOf('.') + 1)
	
	extend = extend.toUpperCase();
	
	  
	var fileInput = document.getElementById('html5_inputfile');
	var file = fileInput.files[0];
	
	if (extend === "CSV") {   
		var reader = new FileReader();

		reader.onload = function(e) {
			
			
			var result = reader.result;
			
			result = result.replace(/\r?\n/g, "\r\n");// replace \n with \r\n 
			
			result = result.replace(/(^\s*)|(\s*$)/g, "");
			
			var strs = result.split("\r\n");
			
			if(strs.length>1){
				csv_firstline = strs[0];
				var heads = csv_firstline.split(",");
				var len = heads.length;
				
				csvFields = [];
				
				for(var i =0; i< len; i++){
					
					var head = heads[i];
					var item = [head,head];  
					csvFields.push(item);
				}
				csvFields_store.loadData(csvFields);
				
				
				
				for(var i =1; i< strs.length; i++){
					
					final_csv = final_csv + strs[i] + "\r\n";
				}
				//alert(final_csv);
				//Ext.getCmp(namespace + 'datafile_csvStr').setValue(final_csv);
				
			}else{
				alert("CSV file has no data");
				Ext.getCmp(namespace + 'datafile_csvStr').setValue("");
			}
		}

		reader.readAsText(file);	
		
		document.getElementById('inputfile_text').value = e.value;
	       
	} else {
		alert("only support .CSV");
	}
	
};

//CSV fields
Ext.define('CSVFieldsModel', {
    extend: 'Ext.data.Model',
    fields: [
        {type: 'string', name: 'name'},
        {type: 'string', name: 'value'}
    ]
});

var csvFields = [];
var csvFields_store = Ext.create('Ext.data.Store', {        
    model: 'CSVFieldsModel',
    data: csvFields
});

var csv_x_filed_combo = Ext.create('Ext.form.field.ComboBox', {
	fieldLabel:'X Field',
	id: namespace + 'x_field',
    displayField: 'name', 
    name: 'x_field',
    store: csvFields_store,
    value: "",   
    queryMode: 'local',
    typeAhead: true,
    hidden: false,
    disabled: false,
    allowBlank: false    
});

var csv_y_filed_combo = Ext.create('Ext.form.field.ComboBox', {
	fieldLabel:'Y Field',
	id: namespace + 'y_field',
    displayField: 'name', 
    name: 'y_field',
    store: csvFields_store,
    value: "",   
    queryMode: 'local',
    typeAhead: true,
    hidden: false, 
    disabled: false,        
    allowBlank: false    
});
/////

///
var FileUpload_Form_User = new Ext.FormPanel({   
    frame:true, 
    width:500,   
    id:'FileUpload_Form_User',
    bodyStyle:'padding:20px 5px 5px 5px',                
    items: [
    dataset_combo,{
        xtype: 'textfield',
        name: 'dataName',
        id: namespace + 'dataName',
        fieldLabel: 'DataName',
        allowBlank: false
        	   
    },semantic_combo,/*
    {      
        xtype: 'filefield',
        emptyText: 'Select a .csv file',
        fieldLabel: 'DataFile(.csv)',
        name: 'datafile_csv',
        id: namespace + 'datafile_csv',
        width:300,                   
        //allowBlank: false,  
        buttonText: 'Browse data'
    },*/
    {
    	xtype: 'hiddenfield',
    	name:'datafile_csvStr',
    	value:'',
    	id:namespace + 'datafile_csvStr'
    },{                       
    	xtype: 'component',
    	id: namespace + 'datafile_csv',
    	hidden: false,
    	disabled: false,
    	html:'<div class="file-box">' +
    		   '<label>DataFile(.csv):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>' + 
    		   '<input type="text" name="textfield" readonly="true" id="inputfile_text" class="txt" />' +  
    		   '<label>&nbsp;</label>'+      
    		   '<input type="button" class="btn" value="Browse Data" class="input" />' +
    		   '<input type="file" onchange="html5read(this)" class="file" id="html5_inputfile" size="28" />'+
    		 '</div>'
        
    },csv_x_filed_combo,             
      csv_y_filed_combo,                    
    {          
    	 xtype: 'hiddenfield',
    	 name: 'filePostfix',
    	 id: namespace + 'filePostfix'
    },{      
        xtype: 'filefield',
        emptyText: 'Select a .asc file',
        fieldLabel: 'DataFile(.asc)',
        name: 'datafile_asc',
        id: namespace + 'datafile_asc',
        width:300,     
        //allowBlank: false,
        hidden: false, 
        disabled: true,
        buttonText: 'Browse data'
    },{
    	xytpe: 'component',
    	height: 3,
    	width: 0     
    },{                
        xtype: 'filefield',
        emptyText: 'Select a .prj file',
        fieldLabel: 'DataFile(.prj)',
        name: 'datafile_prj',
        id: namespace + 'datafile_prj',        
        width:300,                       
        //allowBlank: false,
        hidden: false,
        disabled: true,
        buttonText: 'Browse data'
    },{
    	 xtype:'component',
		 hidden: false,                                               
		 html:'|'           
    },{
   	 xtype:'component',
   	 id:'uploadMarked',
	 hidden: true,                                               
	 html:'Data are uploading,please wait .....'           
   }],                

    buttons: [{
        text: 'Save',
        handler: function(){
        	
        	var filePostfix = null; 
        	
        	var semantic = Ext.getCmp(namespace + 'semantic').getValue();
        	
        	if(semantic == "Sample Data"){
        		Ext.getCmp(namespace + 'datafile_asc').setRawValue('');
        		Ext.getCmp(namespace + 'datafile_prj').setRawValue('');
        		
        		filePostfix = "csv";
        		
                //////
    			var x_filed = csv_x_filed_combo.getValue();
    			var y_filed = csv_y_filed_combo.getValue();
    			if(x_filed=="" || y_filed==""){
    				
    				alert("X Field and Y Field cannot be empty");
    				return;
    			}
    			if(csv_firstline == "" || final_csv == ""){
    				
    				alert("CSV File cannot be empty");
    				return;
    			}
    			csv_firstline = csv_firstline.replace(x_filed,"X");
    			csv_firstline = csv_firstline.replace(y_filed,"Y");
    			Ext.getCmp(namespace + 'datafile_csvStr').setValue(csv_firstline + "\r\n" + final_csv);
    			//alert(Ext.getCmp(namespace + 'datafile_csvStr').getValue());
    			///////
        	}else{
        		//Ext.getCmp(namespace + 'datafile_csv').setRawValue('');
        		
        		var asc_value = Ext.getCmp(namespace + 'datafile_asc').getValue();
        		var extend_asc = asc_value.substring(asc_value.lastIndexOf('.') + 1)
        		extend_asc = extend_asc.toUpperCase();
        		
        		var prj_value = Ext.getCmp(namespace + 'datafile_prj').getValue();
        		var extend_prj = prj_value.substring(prj_value.lastIndexOf('.') + 1)
        		extend_prj = extend_prj.toUpperCase();
        		
        		if(extend_asc!= "ASC" || extend_prj!= "PRJ"){
        			
        			alert(".asc and .prj files are required");
        			return;                 
        		}
        		
        		filePostfix = "asc";   
        		
        	}
        	
    		if(filePostfix!= "csv" && filePostfix!= "asc"){
    			   
    			alert("only  surpport .csv, .asc and .prj!");
    			return;
    	    }   
    		
    		Ext.getCmp(namespace + 'filePostfix').setValue(filePostfix);
    		
    		var postfix = Ext.getCmp(namespace + 'filePostfix').getValue();         
    		var dataset = Ext.getCmp(namespace + 'dataSetName').getValue();
    		
    		var dataname = Ext.getCmp(namespace + 'dataName').getValue();
    		
    		if(postfix=="" || dataset=="" || semantic=="" || dataname==""){
    			
    			alert("all the input can not be empty!");
    			return;
    		}
            
    		if(Ext.getCmp(namespace + 'datafile_asc').getValue()==""
    			&&Ext.getCmp(namespace + 'datafile_prj').getValue()==""
    			&&Ext.getCmp(namespace + 'datafile_csvStr').getValue()==""){
    			
    			alert("please select data to unload");
    			return;  
    		}
            
        	Ext.getCmp("uploadMarked").getEl().show();
    		var form = FileUpload_Form_User.getForm();           
        	form.submit({                        
                       
        		//url: 'uploadData.action',
        		url:'uploadDataNew.action',               
                modal:false,  
                success: function(fp, o) {   
                    
				    alert("upload file success!");
				    Ext.getCmp('List_FileData').getStore().load();      
				    Ext.getCmp("uploadMarked").getEl().hide();         
                }, 
                failure:function(f,action){                                
					 alert("upload file fail!"); 
					 Ext.getCmp("uploadMarked").getEl().hide();  
                }
	        }); 
	                  
        }
    },{
        text: 'Reset',
        handler: function() {
        	FileUpload_Form_User.getForm().reset(); //jjc add
        }
    }]  
}); 
var FileUpload_Win_User=new Ext.Window({  
    title:'Upload Data',  
    id:'FileUpload_Win',
   
    iconCls:'upload',              
    //layout:'fit',  
    autoDestory:true,  
    collapsible : false, 
    modal:false,          
    closeAction:'hide',  
    items:[  
        FileUpload_Form_User  
    ]  
});

//////// create the dataset

var DataSet_Form = new Ext.FormPanel({   
    frame:true, 
    width:400,     
    bodyStyle:'padding:20px 5px 5px 5px',                
    items: [{
        xtype: 'textfield',
        fieldLabel: 'DataSetName',
		allowBlank: false, //jjc add
        name:'datasetname'
    },{
    	 xtype: 'fieldset',
         title: 'Extent(optional)', //jjc add     
         items:[{
             xtype: 'numberfield',
             fieldLabel: 'North',
             name:'north'
         },{
             xtype: 'numberfield',
             fieldLabel: 'South',
             name:'south'
         },{
             xtype: 'numberfield',
             fieldLabel: 'West',
             name:'west'
         },{
             xtype: 'numberfield',
             fieldLabel: 'East',
             name:'east'
         }]
    },{   
        xtype: 'filefield',
        emptyText: 'Boundary',
        fieldLabel: 'KMLFile',
        width: 380,
        name: "kml",
        buttonText: 'Browse KML',
		allowBlank: false // jjc add
    }],

    buttons: [{
        text: 'Save',
        handler: function(){
        	if(DataSet_Form.getForm().isValid()){// jjc add
        		
            	var form = DataSet_Form.getForm();  
            	form.submit({             
                    url: 'create_dataset.action',           
                    modal:false,  
                    success: function(fp, o) {
                                                  
    				     alert("upload file success!");
    				     DataSetStore.load();             
    				     ListFileDataStore.load();           
                    }, 
                    failure:function(f,action){             
    					 alert("upload file fail!");                
                    }
    	        });   
            	
        		
        	}else{
        		
        		alert("dataSet name or kmlfile is null"); // jjc add
        	}
        }// end of handler
    },{
        text: 'Reset',
        handler: function() {
        	DataSet_Form.getForm().reset(); //jjc add
        }
    }]  
});

var DataSet_Win=new Ext.Window({  
    
	title:'Create DataSet',               
    collapsible : false, 
    modal:false,          
    closeAction:'hide',  
    items:[  
           DataSet_Form  
    ]  
});


//// validate results using independent samples

//validate SoilPropertyStore
Ext.define('V_SoilPropertyState', {
    extend: 'Ext.data.Model',       
    fields: [
		    {name:'id',mapping:'id',type:'string'},
	        {name:'name',mapping:'name',type:'string'}
    ]
});
var V_SoilPropertyStore = Ext.create('Ext.data.Store', {
    model: 'V_SoilPropertyState',
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
//validate SampleFileStore
Ext.define('V_SampleFileState',{
	extend:'Ext.data.Model',
	fields:[
	        {name:'id',mapping:'id',type:'string'},
	        {name:'name',mapping:'name',type:'string'}
	]
});   
var V_SampleFileStore = Ext.create('Ext.data.Store',{
	model:'V_SampleFileState',
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

//V_SampleFileStore.on('load', function(){
    
//	V_SampleFileCombo.select(V_SampleFileStore.getAt(0));
//});
                       
/// V_SoilPropertyCombo
var V_SoilPropertyCombo = Ext.create('Ext.form.field.ComboBox', {
    fieldLabel: 'Select Property',
    id:'V_SelectSoilProperty',    
    displayField: 'name',
    valueField:'id',
	listConfig:{
         loadMask: false
    },
    queryMode: 'local',   
    labelWidth: 100,            
    store: V_SoilPropertyStore,    
    queryMode: 'local', 
	editable:false,
    typeAhead: true
});
// V_SampleFileCombo
var V_SampleFileCombo = Ext.create('Ext.form.field.ComboBox', {
    fieldLabel: 'Select SampleSet',
    displayField:'name',
	valueField:'id',
	listConfig:{
         loadMask: false
    },
	store:V_SampleFileStore,   
    labelWidth: 100,                      
    queryMode: 'local',
    //allowBlank:false,
	editable:false,   
    typeAhead: true,
    listeners:{
	   select:function(combo,record,index){                                         
    	  V_SoilPropertyCombo.clearValue();  
    	  //alert(combo.getValue());                      
		  V_SoilPropertyStore.load({params:{filename : combo.getValue()}});

	   }
     }
});

var validate_form = new Ext.form.FormPanel({
    labelAlign: 'right',
    width: 300,           
    labelWidth: 100,
    frame: true,
    defaultType: 'combo',
    items: [
       V_SampleFileCombo,
       {
         xtype:'component',   
         height:10
       },
       V_SoilPropertyCombo
     ],
     buttons: [{
         text     : 'Validate',
         handler  : function(){
        	  
        	 //rmse = 0.0000001949;                          
        	 //document.getElementById("validate_rmse").innerHTML = "RMSE: " + rmse;
        	 
        	 
        	          
        	 var htmlStr = 
        		 '<a href= "'+ resultfile_path + 'PropertyMap1428376395600' + '.asc' +'" target= "_self ">'
		         + 'Property' +'</a><br/>';   	 
        	 
        	 htmlStr = htmlStr + 
        	 	'<a href= "'+ resultfile_path + 'UncertaintyMap1428376395600' + '.asc' +'" target= "_self ">'
        	 	+ 'Uncertainty' +'</a><br/>';
        	 
        	var files_for_download = document.getElementById('files_for_download');
        	
        	files_for_download.innerHTML = htmlStr;
        	
        	 var regExp= /\/(\w*).asc/gi; 
        	 var result = []; 
        	 var match;                           
        	              
        	 while( match=regExp.exec(files_for_download.innerHTML)){                     
        		               
        		 result.push(match[1] + ".asc"); 
        	 } 
        	 
        	 if(result.length == 2){
        		 
        		 var property_filePath = result[0];
        		 //var uncertainty_filePath = result[1];
        		 
        		 var sample_filePath = V_SampleFileCombo.getValue();
            	 var sample_field = V_SoilPropertyCombo.getValue();
                  
            	 var xmlUrl = "validate.action?propertyPath="+ property_filePath +
            	              "&verifySamplePath=" + sample_filePath +
            	              "&fieldName=" + sample_field; 
        	     var ajax = new Ajax();   
        	     ajax.open("GET",xmlUrl,true);
	             ajax.onreadystatechange=function(){                        
            			if(ajax.readyState==4){
            				if(ajax.status==200){                
            					var tag=ajax.responseText.pJSON().tag;         
            					if(tag == true){           
                                    
            						document.getElementById("validate_rmse").innerHTML = "RMSE: " 
            							
            							+ ajax.responseText.pJSON().rmse;           
            						
            						                                            
            					}          
            				}
            			 }    
	             };
            	 ajax.send(null);
            	                            
        	 }
        	                        
        	             
         }
     },{
         text     : 'Close',
         handler  : function(){
         	
         	Validata_Win.hide();
         }
     }]
});


// validate function
var validate = function(){
	
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
	
	V_SampleFileStore.load({params:{
			semantic:'Sample Data',
			top:maxLat,
			down:minLat,
			left:minLon,
			right:maxLon 
		}
	}); 
	
	
	Validata_Win.show();
	
	
};

var Validata_Win=new Ext.Window({  
    
	title:'Validate Results',               
    collapsible : false, 
    modal:false,          
    closeAction:'hide',  
    items:[  
        validate_form  
    ]
});