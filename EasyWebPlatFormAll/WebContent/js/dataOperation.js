/**
 * 
 */
 //============================================================================
 /**
  * this progress is show the dataset which user can use in the datamanage tap panel
  * model:ListdataSet
  * store:ListDataSetStore
  * gridpanel:grid
  * itemcontextmenu:right click events, show the menu
  * tbar: add dataset, show the dataset input window
  * tbar: searching textbox, filter the dataset showed in the grid pannel*/
 Ext.define('ListdataSet',{ 
	    extend: 'Ext.data.Model', 
	    fields: [ 
	        {name:'dataSetname',mapping:'dataSetName',type:'String'}, 
	        {name:'Uploader',mapping:'upLoader',type:'String'},
	        {name:'dataCategory',type:'String'}
	    ] 
	});

var ListDataSetStore = Ext.create('Ext.data.Store', { 
	    pageSize:50,       
	    remoteSort:true,
	    //storeId:'FileData_Store',
		model: 'ListdataSet',        
	    proxy: { 
	        type: 'ajax', 
	        url: 'listdatasets.action',     
	        reader: { 
	            type: 'json', 
	            root: 'items' ,  
	            totalProperty  : 'total' 
	        } 
	    }, 
	    autoLoad: false      
	});
ListDataSetStore.load();
/**
 * @param upLoader
 * @param dataSetName
 * this two parameters global variables record the content of the clicked row*/
var upLoader = null;
var dataSetName = null;
var authority = null;
var kmllayer = null;
var grid = Ext.create("Ext.grid.Panel", {
	title:"Data Manage",
	store: ListDataSetStore,
	//plugins:[ Ext.create('Ext.grid.plugin.CellEditing',{clicksToEdit:2})],
	/**
	listeners:{itemcontextmenu: function(view, record, item, index, e, options){var row = grid.getSelectionModel().getSelection()[0];
																				
																				var uploader = row.get('Uploader');
																				var datasetname = row.get('dataSetname');
																				displayKML1(datasetname, uploader);
																				}},
	*/
	listeners:{itemcontextmenu:function(view, record, item, index, e, options){var row = grid.getSelectionModel().getSelection()[0];
																				upLoader = row.get('Uploader');
																				dataSetName = row.get('dataSetname');
																				authority = row.get('dataCategory');
																				gridmenu.showAt(e.getXY());}},
	//TODO: add dataset action
	tbar:[{text:'add dataset', handler:createDataSetWinShow},
		{xtype:'textfield', enableKeyEvents:true,
		listeners:{
			keyup:function(){
				var a = this.value;
				var store = this.up().up().store;
				store.clearFilter();
				if(this.value)
					{
						store.filter({property: 'dataSetname', value:this.value, anymatch: true, caseSensitive:false});
					}
			}
			}
	}],
	columns: [
        { text: 'dataSetName',  dataIndex: 'dataSetname',editor: {xtype: 'textfield'}
        
	     },
        { text: 'upLoader', dataIndex: 'Uploader', editor: {xtype: 'textfield'}},
        { text: 'authority', dataIndex: 'dataCategory',editor: {xtype: 'textfield'}}
    ]
    
});

/**
 * this method is locate the dataset, show the scope in the map 
 * find the kml or shape file through the datasetname and uploader field
 * this progress will erase the precious kml or shape
 * */
function displayKML1(){    
	
	//alert(kml_name);
	grid.getSelectionModel().deselectAll();   
	var kmlPath = upLoader + '/' + dataSetName + '.kml';
	//alert(datasetname);                                 
	var xmlUrl = "findkmlextent1.action?datasetname="+ dataSetName + "&upLoader=" + upLoader;
    var ajax = new Ajax();   
    ajax.open("GET",xmlUrl,true);
    ajax.send(null);
    ajax.onreadystatechange=function(){                        
		if(ajax.readyState==4){
			if(ajax.status==200){                
				var tag=ajax.responseText.pJSON().tag;
				              
				if(tag == true){           
				     
					var north = ajax.responseText.pJSON().north;
					var south = ajax.responseText.pJSON().south;
					var west = ajax.responseText.pJSON().west;
					var east = ajax.responseText.pJSON().east;
					
					var wfs_indicators_tmp = [];
					
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
				            url: "kml/" + kmlPath,                                        
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
					    
				}else{
					Ext.Msg.alert('tip','kml file does not exist');
				}          
			}
		 }    
	 };
 }
 
 /**
  * the action of button named 'add dataset' 
 function onAddClick(){
        // Create a model instance
        var rec = new ListdataSet({
            dataSetname: 'New dataset',
            Uploader: '',
            dataCategory: ''
        });
        
        ListDataSetStore.insert(0, rec);
        this.cellEditing.startEditByPosition({
            row: 0, 
            column: 0
        });
    };
*/
//=============================================================================================
//create the right click menu
//============================================================================================
var showDatasAction = new Ext.create('Ext.Action', {text:'show data',handler:showdata});

var locationAction = new Ext.create('Ext.Action', {text:'location',handler:displayKML1});

var deleteDataSetAction = new Ext.create('Ext.Action', {text:'deleteDataSet',handler:deleteDataSet});

var shareDataSetAction = new Ext.create('Ext.Action', {text:'share',handler:share});

//var dataShareAction = new Ext.create('Ext.Action', {text:'location',handler:dataShare});

var gridmenu = new Ext.menu.Menu(
	{
		id:'rightmenu',
		items:[showDatasAction, deleteDataSetAction, locationAction, shareDataSetAction],
		//TODO:
		listeners:{beforeshow:function(){
											var xmlurl = "judgeshareduser.action";
											var ajax = new Ajax();
											ajax.open("GET", xmlurl,true);
											ajax.send(null);
											ajax.onreadystatechange = function()
											{
												if(ajax.readyState == 4)
												{
													if(ajax.status == 200)
													{
														var tag = ajax.responseText.pJSON().tag;
														if(tag == true)
														{
															Ext.getCmp("rightmenu").setDisabled(true);
														}
													}
												}
											};
										}}
	});
	
	
	


	/**
	 * @description delete the dataset from xml file and disk
	 * @param dataSetName*/
	function deleteDataSet()
	{
		var xmlUrl = "deleteDataSet.action?dataSetName=" + dataSetName;
		var ajax = new Ajax();   
	    ajax.open("GET",xmlUrl,true);
	    ajax.send(null);
	    ajax.onreadystatechange=function(){
	    	//TODO:now it do not come in, but it delete the data .
	    	if(ajax.readyState == 4){
	    		if(ajax.status == 200){
	    	    var m = ajax.responseText;
	    		var tag=ajax.responseText.pJSON().tag;
	    		if(tag == 1)
	    		{
	    			Ext.MessageBox.alert('tip','delete dataset successfully');
	    			ListDataSetStore.load();
	    		}
	    		}
	    	}
	    }
	    
	};
	
	/**
	 * make the dataset public
	 * */
	function share(){
		var xmlurl = "sharedataset.action?dataSetName=" + dataSetName;
		var ajax = new Ajax();
		ajax.open("GET", xmlurl,true);
		ajax.send(null);
		ajax.onreadystatechange = function()
		{
			if(ajax.readyState == 4)
			{
				if(ajax.status == 200)
				{
					var tag = ajax.responseText.pJSON().tag;
					if(tag == 0)
					{
						Ext.Msg.alert("tip", "this data set had been shared");
					}else if(tag == 1)
					{
						Ext.Msg.alert("tip", "this data set is shared successfully");
					}
				}
			}
		};
	};
	
	function judgeSharedUser(){
		var xmlurl = "judgeshareduser.action";
		var ajax = new Ajax();
		ajax.open("GET", xmlurl,true);
		ajax.send(null);
		ajax.onreadystatechange = function()
		{
			if(ajax.readyState == 4)
			{
				if(ajax.status == 200)
				{
					var tag = ajax.responseText.pJSON().tag;
					if(tag == true)
					{
						Ext.getCmp("rightmenu").setDisabled(true);
					}
				}
			}
		};
	};
//===================================================================================================
//the create dataset window
//===================================================================================================
/**
 * this is a form panel will be put into the create dataset window
 * */
var createDataSet_Form = new Ext.FormPanel({   
    frame:true, 
    bodyStyle:'padding:20px 5px 5px 5px',                
    items: [{
        xtype: 'textfield',
        fieldLabel: 'DataSetName',
		allowBlank: false, 
        name:'datasetname'
    }],

    buttons: [{
        text: 'Save',
        handler: function(){
        	if(createDataSet_Form.getForm().isValid()){
        		
            	var form = createDataSet_Form.getForm();  
            	form.submit({             
                    url: 'createdataset.action',           
                    modal:false,  
                    success: function(fp, o) {
                           ListDataSetStore.load();                       
    				     alert("create dataset sucessfully!");
    				              
                    }, 
                    failure:function(f,action){             
    					 alert("give a new data set name!");                
                    }
    	        });   
            	
        		
        	}else{
        		
        		alert("dataSet name  is null"); 
        	}
        }// end of handler
    }]  
});

/**
 * create the dataset window*/
var createSet_Win=new Ext.Window({  
    
	title:'Create DataSet',               
    collapsible : false, 
    modal:false,          
    closeAction:'hide',  
    items:createDataSet_Form
});

function createDataSetWinShow()
{
	createSet_Win.show();
}
//====================================================================================
//the window show the data in the right click dataset
//====================================================================================
/**
 * @author lp
 * @description below is to create the datashow window in an specified dataset
 * model:ListData
 * store:ListDataStore
 * grid: FileData_User
 * */

function showdata()
{
	ListDataStore.load();
	if (authority != "")
	{
		Ext.getCmp("AddData").setDisabled(true);
		Ext.getCmp("DeleteData").setDisabled(true);
		Ext.getCmp("createBoundary").setDisabled(true);
	}
	else
	{
		Ext.getCmp("AddData").setDisabled(false);
		Ext.getCmp("DeleteData").setDisabled(false);
		Ext.getCmp("createBoundary").setDisabled(false);
	}
	
	datafileshow_win.show();
	
	
}

Ext.define('ListData',{ 
	    extend: 'Ext.data.Model', 
	    fields: [ 
	        {name:'fileName',mapping:'fileName'}, 
	         'format', 
	         'semantic',
	         'type',
	         'datasetName'
	    ] 
	}); 
	 
var ListDataStore = Ext.create('Ext.data.Store', { 
	    pageSize:50,       
	    remoteSort:true,
		model: 'ListData',        
	    proxy: { 
	        type: 'ajax', 
	        url: "listdata.action",  
	        params:{upLoader:upLoader,datasetname:dataSetName},
	        reader: { 
	            type: 'json', 
	            root: 'items' ,  
	            totalProperty  : 'total' 
	        } 
	    }, 
	    listeners:{
	    beforeload:function(store, options){
	    var params = {upLoader:upLoader,datasetname:dataSetName};
	    Ext.apply(store.proxy.extraParams, params);
	    
	    }
	    },
	    autoLoad: false      
	});
	
	

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
var FileData_User1 = Ext.create('Ext.grid.Panel',{ 
    
	store:ListDataStore,
	
    id:'List_FileData',            
	enableColumnHide: false,
	
    columns: [         
        {text: "datasetName", 
        	
        	width: 80,
        	dataIndex: 'datasetName', sortable: false
        },
        {text: "semantic", 
        	width: 80,             
        	dataIndex: 'semantic', sortable: false
        }, 
        {text: "fileName", 
            width: 80,
        	dataIndex: 'fileName', sortable: false,renderer : renderFileName
        },                       	                 
        {text: "type", 
        	width: 80,                         
        	dataIndex: 'type', sortable: false
        }                     
    ],
                                  
    viewConfig: { 
        stripeRows: true 
    },
    tbar: [{ 
	    xtype: 'button',    
		text: 'AddData',
		id:'AddData',
	    handler:function(){                                                                   
	    	FileUpload_Win_User.show();
	    }   
	},{
		xtype: 'button',    
		text: 'DeleteData',
		id:'DeleteData',
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
							ListDataStore.load();
						}
					}
				 }    
			};
			ajax.send(null); 
	    	              
	    } 
	},{xtype: 'button',
	text: 'createPublicBoundary',
	id:'createBoundary',
	handler:function(){
	var xmlUrl = "createdatasetkml.action?dataSetName=" + dataSetName;
	var ajax = new Ajax();
	ajax.open("GET", xmlUrl, true);
	ajax.send(null);
	ajax.onreadystatechange=function(){
			if(ajax.readyState == 4)
				if(ajax.status == 200)
				{
					var tag=ajax.responseText.pJSON().tag;
					if(tag == 1)
					{
						alert("create public boundary successfully");
						ListDataStore.load();
					}
				}
			}
	}}] 
                 
}) ; 

var datafileshow_win = new Ext.Window({
	height: 300,
    width: 400,
    autoScroll: true,
    bodyPadding: 10,
    constrain: true,
    layout:'fit',
	closeAction:'hide',
	items:FileData_User1
	
});


//=======================================================================
//below is about the add data window
//=======================================================================
var namespace= "data_management";
Ext.define('SemanticModel', {
    extend: 'Ext.data.Model',
    fields: [
        {type: 'string', name: 'name'},
        {type: 'string', name: 'value'}
    ]
});
//the content in semantics combox
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

/**
 * define the semantic combox
 * the action whether select Sample Data or not
 * */
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
      		 
      		   Ext.getCmp(namespace + 'datafile').setDisabled(true);
      		       
      	   }else {
      		   
      		   Ext.getCmp(namespace + 'datafile_csv').setDisabled(true);
      		   Ext.getCmp(namespace + 'x_field').setDisabled(true);
    		   Ext.getCmp(namespace + 'y_field').setDisabled(true);
      		   
      		   Ext.getCmp(namespace + 'datafile').setDisabled(false);        
      		        
      	   }
    	                      
    	}
    }     
});
var final_csv = "";
var csv_firstline = "";
var html5read = function(e){
	  
	      
	var extend = e.value.substring(e.value.lastIndexOf('.') + 1);
	
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
		};

		reader.readAsText(file);	
		
		document.getElementById('inputfile_text').value = e.value;
	       
	} else {
		alert("only support .CSV");
	}
	
};

/**
 * define and load datasample data fields, 
 * deiine coordinate X,Y combox
 * */
Ext.define('CSVFieldsModel', {
    extend: 'Ext.data.Model',
    fields: [
        {type: 'string', name: 'name'},
        {type: 'string', name: 'value'}
    ]
});

var csvFields = []; //fields
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


/**
 * define the window for upload the user`s data
 * the  widget named filePostfix is a hidden widget that save the file format
 * */
var FileUpload_Form_User = new Ext.FormPanel({   
    frame:true, 
    width:500,   
    id:'FileUpload_Form_User',
    bodyStyle:'padding:20px 5px 5px 5px',                
    items: [{xtype: 'hiddenfield',name:'dataSetName',value:'',id:namespace + 'dataSetName'},
    {
        xtype: 'textfield',
        name: 'dataName',
        id: namespace + 'dataName',
        fieldLabel: 'DataName',
        allowBlank: false
        	   
    },
    semantic_combo,
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
        emptyText: 'Select data file',
        fieldLabel: 'DataFile',
        name: 'datafile',
        id: namespace + 'datafile',
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
        		Ext.getCmp(namespace + 'datafile').setRawValue('');
        		
        		
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
        		
        		var asc_value = Ext.getCmp(namespace + 'datafile').getValue();
        		var extend_asc = asc_value.substring(asc_value.lastIndexOf('.') + 1);
        		extend_asc = extend_asc.toUpperCase();
        		
        		if(extend_asc!= "TIF"){
        			
        			alert(".tif files are required");
        			return;                 
        		}
        		
        		filePostfix = "tif";   
        		
        	}
        	
    		if(filePostfix!= "csv" && filePostfix!= "tif"){
    			   
    			alert("only  surpport .csv, .tif!");
    			return;
    	    }   
    		
    		Ext.getCmp(namespace + 'filePostfix').setValue(filePostfix);
    		
    		var postfix = Ext.getCmp(namespace + 'filePostfix').getValue();         
    		//var dataset = Ext.getCmp(namespace + 'dataSetName').getValue();
    		
    		var dataname = Ext.getCmp(namespace + 'dataName').getValue();
    		Ext.getCmp(namespace + 'dataSetName').setValue(dataSetName);
    		if(postfix=="" || semantic=="" || dataname==""){
    			
    			alert("all the input can not be empty!");
    			return;
    		}
            
    		if(Ext.getCmp(namespace + 'datafile').getValue()==""
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
        	FileUpload_Form_User.getForm().reset(); 
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