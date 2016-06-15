var tempfilename_tauDEM;
var flag_setInitialOutlet = 0;
var outlet_lon;
var outlet_lat;

function onMapClick(e){
	if(flag_setInitialOutlet == 1){  
		document.getElementById("exactwatershed_progress").innerHTML="outlet is already, please extract subwatersheds";        
		var lonlat = map.getLonLatFromPixel(e.xy);
		        
		var proj_900913 = map.getProjectionObject();
		
        Proj4js.defs["EPSG:26912"] = "+proj=utm +zone=12 +ellps=GRS80 +datum=NAD83 +units=m +no_defs";
        var proj_26912 =  new OpenLayers.Projection("EPSG:26912"); 
        
	    var point = new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);    
	    var outlet_point = new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);
	    outlet_point = outlet_point.transform(proj_900913, proj_26912);    
	    outlet_lon = outlet_point.x;           
	    outlet_lat = outlet_point.y;       
	      
	    var fea = new OpenLayers.Feature.Vector(point);	
		outlet_Layer.setVisibility(true);    
	    outlet_Layer.removeAllFeatures(); 
	   
	    outlet_Layer.addFeatures(fea); 
	    
	    flag_setInitialOutlet = 0;
	    
   		var sprite = Ext.getCmp('jjc').surface.items.items[4];    	      		   
		sprite.setAttributes({             
			fill: '#CCFF99'              
		}, true); 
		      
	}
  
}
function selectDEM(){
	document.getElementById("exactwatershed_progress").innerHTML="generating the initial river network, please wait a moment"; 
	var date = new Date().getTime();	
	tempfilename_tauDEM =  date;
	
	var xmlUrl = "CreateInitialStreamLine.action?demfilename=logan/logan.tif&"
         +"tempfilename="+ tempfilename_tauDEM +"&threshold=300";
		ajax = new Ajax(); 
		ajax.open("GET",xmlUrl,true);
		ajax.onreadystatechange=function()        
		{  
		if(ajax.readyState==4)
		{
		   if(ajax.status==200)  
		  {     
		   	var tag=ajax.responseText.pJSON().tag;
		   	var maplayers = ajax.responseText.pJSON().layers;
		   	var mapfile =  ajax.responseText.pJSON().mapfile;
		   	if(tag ==1){
			    //
		   		var sprite = Ext.getCmp('jjc').surface.items.items[0];    	      		   
				sprite.setAttributes({      
					fill: '#CCFF99'                
				}, true); 
				//
				var layers = map.layers;  
				for(var i=layers.length -1; i>=0; i--){      
					if(!layers[i].isBaseLayer && layers[i]!=outlet_Layer){       
						//map.removeLayer(layers[i]);
						layers[i].setVisibility(false); 
					}
				}
				                    
				//                 
		   		var wms = new OpenLayers.Layer.WMS( "MyWMS",
           			    wms_url,
           				 {
           					layers: maplayers,
           					map: mapfile_path + mapfile + '.map',
           					transparent: 'true',
           					format: 'image/png'
           				}, {       
           					isBaseLayer: false,
           					visibility: true,
           					buffer: 0
           			});                  
           	    map.addLayer(wms);  
				
				document.getElementById("exactwatershed_progress").innerHTML="please select a outlet from map";
		   	}  
		  }
		}    
		};
		ajax.send(null);
};

function setInitialOutlet(){
	flag_setInitialOutlet = 1;
    
};
function getNet_Watershed(){   
     document.getElementById("exactwatershed_progress").innerHTML="extracting the subwatersheds, please wait a moment";
	 var xmlUrl = "CreateStreamNetWatershed.action?"
           +"tempfilename=" + tempfilename_tauDEM + "&threshold=300&lon=" + outlet_lon + "&lat=" + outlet_lat;
 		 ajax = new Ajax(); 
 		 ajax.open("GET",xmlUrl,true);
 		 ajax.onreadystatechange=function()        
 		 {  
 			if(ajax.readyState==4)
 		    { 
 		        if(ajax.status==200)  
 		       {     
 				   	var tag=ajax.responseText.pJSON().tag;
 				   	var maplayers = ajax.responseText.pJSON().maplayers;
 				   	var mapfile =  ajax.responseText.pJSON().mapfile;     
 				   	if(tag ==1){
 					    //
 				   		var sprite = Ext.getCmp('jjc').surface.items.items[8];    	      		   
 						sprite.setAttributes({      
 							fill: '#79BB3F'          
 						}, true); 
 						//
 						var layers = map.layers;  
 						for(var i=layers.length -1; i>=0; i--){         
 							if(!layers[i].isBaseLayer && layers[i]!=outlet_Layer){       
 								//map.removeLayer(layers[i]);
								layers[i].setVisibility(false); 
 							}
 						}
 						          
 						//                 
 				   		var wms = new OpenLayers.Layer.WMS( "MyWMS",
 				   			    wms_url,
 		           				 {
 		           					layers: maplayers,
 		           					map: mapfile_path + mapfile + '.map',
 		           					transparent: 'true',
 		           					format: 'image/png'
 		           				}, {                
 		           					isBaseLayer: false,
 		           					visibility: true,
 		           					buffer: 0
 		           			});                  
 		           	    map.addLayer(wms); 

                        document.getElementById("exactwatershed_progress").innerHTML="extracting subwatersheds success";  						
 				   	}      
 		       }   
 		     }    
 		  };
 		  ajax.send(null);  
};

var drawComponent = Ext.create('Ext.draw.Component', {
		region:'center',
		viewBox: false,
		height:120,  
		id:"jjc",
		items: [{  
			type: 'circle',
			fill: '#B0E2FF',     
			radius: 45,
			id:'SelectDEM',  
			x: 60,      
			y: 60,           
			listeners :{
			 click : function(){       
				
				DEM_Window.show();  
			 }
			}          
		},{
        type: "text",
		x: 20,         
		y: 60,       
        text: "SelectDEM",     
        fill: "#000000",    
        font: "13px monospace",  
		listeners :{
			 click : function(){   
				DEM_Window.show();  
			 }
		}
     },{  
	 		type: "path",    
			path: "M110 60.5 L210 60.5 L210 61.5 L110 61.5 Z",    //路径 
			"stroke-width": "0.5", 
			stroke: "#000",   
			fill: "red"    
	 
	 
	 },{
		    type: "path",    
			path: "M210 55 L210 65 L220 60 Z",    //路径 
			"stroke-width": "1", 
			stroke: "#000",   
			fill: "red"  	 
	 
	 
	 },{
			type: 'circle',
			fill: '#B0E2FF',  
			radius: 45,
			id:'SelectOutLet',  
			x: 270,        
			y: 60,
			listeners :{
			 click : function(){
			    var sprite = Ext.getCmp('jjc').surface.items.items[4];    	      		   
				sprite.setAttributes({            
					fill: '#CCCCCC'                  
				}, true);  
		 		setInitialOutlet();   
			 }
			}
		},{
        type: "text",
		x: 230,            
		y: 60,          
        text: "SelectOutLet",     
        fill: "#000000",
        font: "13px monospace",
		listeners :{  
		 click : function(){
		    var sprite = Ext.getCmp('jjc').surface.items.items[4];    	      		   
			sprite.setAttributes({            
				fill: '#CCCCCC'             
			}, true);   
			setInitialOutlet();      
		 }
		}
     },{
	 	    type: "path",    
			path: "M320 60.5 L420 60.5 L420 61.5 L320 61.5 Z",    //路径 
			"stroke-width": "0.5", 
			stroke: "#000",   
			fill: "red"    
	 
	 },{
	 		type: "path",    
			path: "M420 55 L420 65 L430 60 Z",    //路径 
			"stroke-width": "1", 
			stroke: "#000",   
			fill: "red"  	
	 
	 },{
			type: 'circle',  
			fill: '#B0E2FF',                
			radius: 45,
			id:'GetWatershed',    
			x: 480,            
			y: 60,    
			listeners :{
			 click : function(){
			    var sprite = Ext.getCmp('jjc').surface.items.items[8];    	      		   
				sprite.setAttributes({            
					fill: '#FFFF99'          
				}, true); 
		        getNet_Watershed();
			 }
			}
		},{
        type: "text",
		x: 440,                 
		y: 60,       
        text: "GetWatershed",     
        fill: "#000000",    
        font: "13px monospace",                   
		listeners :{
		 click : function(){
		    var sprite = Ext.getCmp('jjc').surface.items.items[8];    	      		   
			sprite.setAttributes({            
				fill: '#FFFF99'          
			}, true);  
			getNet_Watershed();   
		 }
		}
     }]
	});

var net_watershed =   Ext.create('Ext.Window', {
	width: 550,  
	height: 150,         
    border:false,		
	layout: 'border',  
	resizable:false, 
	title:'Extract catchments',
	closeAction: 'hide', 
	listeners:{ 
	  "show":function(){ 
		 var sprite0 = Ext.getCmp('jjc').surface.items.items[0];    	      		   
		 sprite0.setAttributes({            
			fill: '#B0E2FF'                  
		 }, true); 

		 var sprite4 = Ext.getCmp('jjc').surface.items.items[4];    	      		   
		 sprite4.setAttributes({            
			fill: '#B0E2FF'                  
		 }, true);

		 var sprite8 = Ext.getCmp('jjc').surface.items.items[8];    	      		   
		 sprite8.setAttributes({            
			fill: '#B0E2FF'                  
		 }, true);	

		 
         	 
	  },
      "hide":function(){
		document.getElementById("exactwatershed_progress").innerHTML="Ready";
	  }	  
	},	
	items: [drawComponent,{   
                    	region:'south',
						xtype:'component', 
						x:100,
                        hidden: false, 
                        id:'exactwatershed_progress',						
                        align:'center',	
                        html:'Ready'						
                        //html:'<img src= "loading.gif" target= "_self "></img>'                         
                                      
                    }]
});
var DEM_Window =  new Ext.Window({
    layout: 'border',
    width: 200,   
    title: 'DEM',   
    resizable:false, 
    height: 120,                 
    items: [{
    	xtype:'component' ,
    	region: "north",  
    	html:'&nbsp;'  
    },{            
    	xtype:'component',        
    	region: "center",      
        hidden: false,                                                               
        html:'&nbsp;&nbsp;&nbsp;&nbsp;<select  STYLE="width: 150px;height:20px;"><option value="1">LoganDEM1</option><option value="2">LoganDEM2</option></select>'	
    }],
    closeAction: 'hide',
    buttons: [{
        text:'OK',
        handler:function(){               
		  var sprite = Ext.getCmp('jjc').surface.items.items[0];    	      		   
			sprite.setAttributes({            
				fill: '#FFFF99'          
			}, true); 
			        
    	  selectDEM();      
    	  DEM_Window.hide();   
        }  
    }]
});
	