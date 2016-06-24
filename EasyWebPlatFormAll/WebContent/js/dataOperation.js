/**
 * 
 */
 
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
																				gridmenu.showAt(e.getXY());}},
	//TODO: add dataset action
	tbar:[{text:'add dataset', handler:function(){}},
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


function displayKML1(kml_name, upLoader){    
	
	//alert(kml_name);
	FileDataGrid_User.getSelectionModel().deselectAll();   
	 
	
	var datasetname = kml_name;
	var kmlPath = upLoader + '/' + kml_name + '.kml';
	//alert(datasetname);                                 
	var xmlUrl = "findkmlextent1.action?datasetname="+ datasetname + "&upLoader=" + upLoader;
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

/**
var saveAction = new Ext.create('Ext.Action', {
							text:'Save Dataset',
							disabled:false,
							handler:saveDataSet});
*/
var showDatasAction = new Ext.create('Ext.Action', {text:'Save Dataset',handler:showdata});

var locationAction = new Ext.create('Ext.Action', {});

var gridmenu = new Ext.menu.Menu(
	{
		items:[showDatasAction, locationAction]
	});

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
        		
            	var form = DataSet_Form.getForm();  
            	form.submit({             
                    url: 'createdataset.action',           
                    modal:false,  
                    success: function(fp, o) {
                           ListDataSetStore.load();                       
    				     alert("create dataset sucessfully!");
    				              
                    }, 
                    failure:function(f,action){             
    					 alert("create dataset fail!");                
                    }
    	        });   
            	
        		
        	}else{
        		
        		alert("dataSet name  is null"); 
        	}
        }// end of handler
    }]  
});

var createSet_Win=new Ext.Window({  
    
	title:'Create DataSet',               
    collapsible : false, 
    modal:false,          
    closeAction:'hide',  
    items:[]  
});
//================================================================
/**
 * @author lp
 * @description below is to create the datashow window in an specified dataset
 * */

function showdata()
{
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
	        url: 'listdatafiles.action?uploder=' + upLoader + '&datasetname=' + dataSetName,     
	        reader: { 
	            type: 'json', 
	            root: 'items' ,  
	            totalProperty  : 'total' 
	        } 
	    }, 
	    autoLoad: false      
	});
	ListDataStore.load();
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
var FileData_User = Ext.create('Ext.grid.Panel',{ 
    
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
	}] 
                 
}) ; 

var datafileshow_win = new Ext.Window({
	height: 300,
    width: 400,
    autoScroll: true,
    bodyPadding: 10,
    constrain: true,
    layout:'fit',
	closeAction:'hide',
	items:FileData_User
});