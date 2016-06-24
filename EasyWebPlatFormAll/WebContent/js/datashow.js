
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

var grid = Ext.create("Ext.grid.Panel", {
	
	store: ListDataSetStore,
	listeners:{itemdblclick: function(view, record, item, index, e, options){var row = grid.getSelectionModel().getSelection()[0];
																				
																				var uploader = row.get('Uploader');
																				var datasetname = row.get('dataSetname');
																				displayKML1(datasetname, uploader);
																				}},
	tbar:[{xtype:'textfield', fieldLabel:'filter dataset',enableKeyEvents:true,
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
        { text: 'upLoader', dataIndex: 'Uploader', flex: 1 },
        { text: 'authority', dataIndex: 'dataCategory' }
    ]
    
});

//grid.addListener('rowcontextmenu',rightClickFn);
var  datashow_win= new Ext.Window( {
    height: 500,
    width: 700,
    title: 'Window',
    autoScroll: true,
    bodyPadding: 10,
    constrain: true,
    items:grid,
    layout:'fit'
});


var rightClickMenue = new Ext.menu.Menu({
	id:'rightClick',
	items:[
		{text:'location',
		handler:function(){
		}
	}]
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