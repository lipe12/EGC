var website_url = "localhost";
//var website_url = "192.168.6.56";
OpenLayers.ProxyHost ="http://" + website_url + ":8080/EasyWebPlatForm/cgi-bin/proxy.cgi?url=";
    
var wfs_url = "http://localhost:8090/cgi-bin/mapserv.exe";
var wms_url = "http://localhost:8090/cgi-bin/mapserv.exe";
var mapfile_path = 'D:/soft/ms4w/apps/tutorial/htdocs/';
var resultfile_path = 'http://localhost/egcDataFiles/';                
var map;
var soilMappingDataSet; //负责记录用户点击的project（dataset）
var envRaster = [];    //环境变量图层数组
var selectControl;
var selectedFeature;   
var latlng1_temp;
var latlng2_temp; 
var wfs_indicators = [];
var lasha_wfs;

var tana_wfs;
var tansSamples_wfs;

var xinjiangSamples_wfs;
var xinjiang_wfs;

var canada_wfs;
var canadaSamples_wfs;
//
var nenjiang_wfs;
var nenjiangStatus = false;
var walnut_wfs;
var logan_wfs;
var xuancheng_wfs;
var xuanchengSamples_wfs;
var wms_results = [];
var outlet_Layer;

var ctrlPressed = false;

var rectLayer;
var drawrect_control;
var rightclick;
var wfs_nigeriaSamples;
var wfs_nigeria;

var KenyaLayer;
var wfs_KenyaSamples;
var KenyaStatus = false;
var KenyaExtent ;
function ctrlkey_down(e) {          
	var kc ;
	if(navigator.appName == "Microsoft Internet Explorer"){
		kc = event.keyCode;     
	 }else{
		 kc = e.which;     
	 }           
     if(kc ===17){   
    	 ctrlPressed = true;   
    	 drawrect_control.activate();
     }else if(kc==90){      
    	       
    	 rectLayer.removeAllFeatures();  
    	 ctrlPressed = false; 
     }else{
    	 ctrlPressed = false;
     }    
};
function ctrlkey_up(e) {      
	var kc ;
	if(navigator.appName == "Microsoft Internet Explorer"){
		kc = event.keyCode;     
	 }else{
		 kc = e.which;     
	 }       
     if(kc ===17){
    	 ctrlPressed = false;  
    	 drawrect_control.deactivate();
     }
};
document.onkeydown = ctrlkey_down;
document.onkeyup = ctrlkey_up;    

function nigeriaStudyArea(){

	wfs_nigeria = new OpenLayers.Layer.Vector("nigeria", {  
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",            
            url:   wfs_url + "?map=" + mapfile_path + "WFS_Nigeria.map",     
            featureType: "nigeria"
        }),  
        projection: geographic
    });
	wfs_nigeria.events.on({      
		 "featureselected": function(e){              
		
		    latlng1_temp = new OpenLayers.LonLat(-6.771091,5.319164); 
    	    latlng2_temp = new OpenLayers.LonLat(-6.270601,5.671059);    
		         
	   	    var feature = e.feature;        
	        selectedFeature = feature; 
	        AddPop(feature);  
            KenyaStatus = false;			
	        nenjiangStatus = false;    
	     },"featureunselected": function(e) {
		        var feature = e.feature;
		        DeletePop(feature);          
		    }
	});        
	wfs_indicators.push(wfs_nigeria);
    map.addLayer(wfs_nigeria);
        
	wfs_nigeriaSamples = new OpenLayers.Layer.Vector("nigeriaSamples", {  
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",            
            url:   wfs_url + "?map=" + mapfile_path + "WFS_NigeriaSamples.map",     
            featureType: "nigeria"
        }),  
        projection: geographic,
        styleMap: new OpenLayers.StyleMap({  
			pointRadius: "5", // based on feature.attributes.type
			fillColor: "#006666",    
			strokeWidth: 0.1,
			strokeOpacity: 0.5,   
            fillOpacity: 0.7

        }) 		             
    });
	wfs_nigeriaSamples.events.on({
	    "featureselected": function(e) {
			SelectSample(e);
	    },
	    "featureunselected": function(e) {
             UnSelectSample(e);            
	    }
    });
	wfs_indicators.push(wfs_nigeriaSamples);
    map.addLayer(wfs_nigeriaSamples); 
     
};

function XinJiangStudyArea(){
     
    	 
	xinjiang_wfs = new OpenLayers.Layer.Vector("XinJiang", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",            
            url:   wfs_url + "?map=" + mapfile_path + "WFS_XinJiang.map",     
            featureType: "XinJiang"
        }),  
        projection: geographic          
    });
	xinjiang_wfs.events.on({      
		 "featureselected": function(e){              
		
		    latlng1_temp = new OpenLayers.LonLat(42.245765,80.095201); 
    	    latlng2_temp = new OpenLayers.LonLat(44.823604,85.009709);    
		         
	   	    var feature = e.feature;        
	        selectedFeature = feature; 
	        AddPop(feature);  
            KenyaStatus = false;			
	        nenjiangStatus = false;    
	     },"featureunselected": function(e) {
		        var feature = e.feature;
		        DeletePop(feature);          
		    }
	});    
	wfs_indicators.push(xinjiang_wfs);
    map.addLayer(xinjiang_wfs);  
	
	xinjiangSamples_wfs = new OpenLayers.Layer.Vector("xinjiang/xinjiang_samples.csv", {  
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",            
            url:   wfs_url + "?map=" + mapfile_path + "WFS_XinJiangSamples.map",     
            featureType: "XinJiang"
        }),  
        projection: geographic,
        styleMap: new OpenLayers.StyleMap({  
			pointRadius: "5", // based on feature.attributes.type
			fillColor: "#660000",
			strokeWidth: 0.1,
			strokeOpacity: 0.5,
            fillOpacity: 0.7

        }) 		          
    });
	xinjiangSamples_wfs.events.on({
	    "featureselected": function(e) {
			SelectSample(e);
	    },
	    "featureunselected": function(e) {
             UnSelectSample(e);            
	    }
    });
	wfs_indicators.push(xinjiangSamples_wfs);
    map.addLayer(xinjiangSamples_wfs);  
};

function CanadaStudyArea(){

	canada_wfs = new OpenLayers.Layer.Vector("Canada", {
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.WFS({ 
				version: "1.0.0",            
				url:   wfs_url + "?map=" + mapfile_path + "WFS_Canada.map",     
				featureType: "Canada"
			}),  
			projection: geographic          
		});
	canada_wfs.events.on({      
		 "featureselected": function(e){              
		
		    latlng1_temp = new OpenLayers.LonLat(-73.391111,44.941111); 
    	    latlng2_temp = new OpenLayers.LonLat(-72.581111,45.281111);    
		         
	   	    var feature = e.feature;        
	        selectedFeature = feature; 
	        AddPop(feature);  
            KenyaStatus = false;			
	        nenjiangStatus = false;    
	     },"featureunselected": function(e) {
		        var feature = e.feature;
		        DeletePop(feature);          
		    }
	});    
	wfs_indicators.push(canada_wfs);
    map.addLayer(canada_wfs);  
	
	canadaSamples_wfs = new OpenLayers.Layer.Vector("Canada/samples.csv", {  
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",            
            url:   wfs_url + "?map=" + mapfile_path + "WFS_CanadaSamples.map",     
            featureType: "CanadaSamples"  
        }),  
        projection: geographic,
        styleMap: new OpenLayers.StyleMap({  
			pointRadius: "4", // based on feature.attributes.type
			fillColor: "#000066",
			strokeWidth: 0.1,
			strokeOpacity: 0.5,
            fillOpacity: 0.7

        }) 		          
    });
	canadaSamples_wfs.events.on({  
	    "featureselected": function(e) {
			SelectSample(e);
	    },
	    "featureunselected": function(e) {
             UnSelectSample(e)            
	    }
    });
	wfs_indicators.push(canadaSamples_wfs);
    map.addLayer(canadaSamples_wfs); 
            	
};

function KenyaSampleShow(){
   // wfs of KenyaSamples
   wfs_KenyaSamples  = new OpenLayers.Layer.Vector("KenyaExtract/uniqueKenya.csv", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",    
            //url: wfs_url + "?map=" + mapfile_path + "WFS_KenyaSamples.map",     
			url: wfs_url + "?map=" + mapfile_path + "WFS_KenyaUniqueSamples.map",   
            featureType: "Kenya"            
        }),  
        projection: geographic,
        styleMap: new OpenLayers.StyleMap({  
			pointRadius: "5", // based on feature.attributes.type
			fillColor: "#006666",
			strokeWidth: 0.1,   
			strokeOpacity: 0.5,
            fillOpacity: 0.7

        }) 		
    });
	wfs_KenyaSamples.events.on({
	    "featureselected": function(e) {  
			SelectSample(e);
	    },
	    "featureunselected": function(e) {
             UnSelectSample(e);            
	    }
    });
	wfs_indicators.push(wfs_KenyaSamples); 
	map.addLayer(wfs_KenyaSamples); 
          
	 ////	wfs of Tana River Basin 
	tana_wfs = new OpenLayers.Layer.Vector("Tana", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",            
            url:   wfs_url + "?map=" + mapfile_path + "WFS_Tanalittle.map",     
            featureType: "Tana"
        }),  
        projection: geographic                  
    });
	tana_wfs.events.on({      
		 "featureselected": function(e){              
		
		    latlng1_temp = new OpenLayers.LonLat(36.579901,-1.218401); 
    	    latlng2_temp = new OpenLayers.LonLat(39.904701,0.489801);         
	   	    var feature = e.feature;        
	        selectedFeature = feature; 
	        AddPop(feature);  
            KenyaStatus = false;			
	        nenjiangStatus =false;    
	     },"featureunselected": function(e) {
		        var feature = e.feature;
		        DeletePop(feature);          
		    }
	});     
	wfs_indicators.push(tana_wfs); 
	map.addLayer(tana_wfs);     
    
    //// wfs of Tana River Basin Samples	
	tansSamples_wfs = new OpenLayers.Layer.Vector("Kenyalittle/samples12.csv", {    
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",      
			url: wfs_url + "?map=" + mapfile_path + "WFS_TanalittleSamples.map",
            featureType: "Kenya"            
        }),       
        projection: geographic,
        styleMap: new OpenLayers.StyleMap({  
			pointRadius: "5", // based on feature.attributes.type
			fillColor: "#660000",
			strokeWidth: 0.1,
			strokeOpacity: 0.5,
            fillOpacity: 0.7

        }) 		
    });
	tansSamples_wfs.events.on({
	    "featureselected": function(e) {
			SelectSample(e);
	    },
	    "featureunselected": function(e) {
             UnSelectSample(e);            
	    }
    });
    wfs_indicators.push(tansSamples_wfs); 
	map.addLayer(tansSamples_wfs);
};

function KenyaStudyArea(){
	
	KenyaLayer = new OpenLayers.Layer.Vector("Kenya");  
   	wfs_indicators.push(KenyaLayer); 
	map.addLayer(KenyaLayer);   
	var style_line = {
			strokeColor:"#333399",  
			strokeDashstyle: "dot"    
     };
	
	var west = 32.972881;
	var east = 43.017015;
	var south = -5.037148;
	var north = 5.019861 ;
	var west_north = (new OpenLayers.Geometry.Point(west,north)).transform(geographic,mercator);
	var east_north = (new OpenLayers.Geometry.Point(east,north)).transform(geographic,mercator);
	var east_south = (new OpenLayers.Geometry.Point(east,south)).transform(geographic,mercator);
	var west_south = (new OpenLayers.Geometry.Point(west,south)).transform(geographic,mercator); 
	var north_line = new OpenLayers.Geometry.LineString( new Array(west_north,east_north));
	var north_fep= new OpenLayers.Feature.Vector(north_line,null,style_line);
	KenyaLayer.addFeatures(north_fep);
	var south_line = new OpenLayers.Geometry.LineString( new Array(west_south,east_south));
	var south_fep= new OpenLayers.Feature.Vector(south_line,null,style_line);
	KenyaLayer.addFeatures(south_fep); 
	var east_line = new OpenLayers.Geometry.LineString( new Array(east_north,east_south));
	var east_fep= new OpenLayers.Feature.Vector(east_line,null,style_line);
	KenyaLayer.addFeatures(east_fep);
	var west_line = new OpenLayers.Geometry.LineString( new Array(west_north,west_south));
	var west_fep= new OpenLayers.Feature.Vector(west_line,null,style_line);
	KenyaLayer.addFeatures(west_fep);
	
	KenyaSampleShow();    
};
function CreateStudyArea(){
	var components = [];
	var north = Ext.getCmp('Max_Latitude').getValue();
	var south = Ext.getCmp('Min_Latitude').getValue();
	var west = Ext.getCmp('Min_Longitude').getValue();
	var east = Ext.getCmp('Max_Longitude').getValue();
	var west_north = (new OpenLayers.Geometry.Point(west,north)).transform(geographic,mercator);
	var east_north = (new OpenLayers.Geometry.Point(east,north)).transform(geographic,mercator);
	var east_south = (new OpenLayers.Geometry.Point(east,south)).transform(geographic,mercator);
	var west_south = (new OpenLayers.Geometry.Point(west,south)).transform(geographic,mercator); 
	components.push(west_north);
	components.push(east_north);
	components.push(east_south);
	components.push(west_south);
	                 
	var linearRing = new OpenLayers.Geometry.LinearRing(components);
	var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
	var fep=new OpenLayers.Feature.Vector(polygon);
	rectLayer.removeAllFeatures();  
	rectLayer.addFeatures(fep); 
};

function WMS_Result(mapfile,layer,srs,semantic,max,min){
	
	this.semantic = semantic; 
	this.max = max;
	this.min = min;
	this.wms = new OpenLayers.Layer.WMS( "MyWMS",
			wms_url,
			 {
				layers: layer.replace("result_egc/",""),
				map: mapfile_path  + mapfile + '.map',
				transparent: 'true',
				format: 'image/png'   
			}, {
				isBaseLayer: false,
				visibility: true,
				opacity: 1.0,           
				buffer: 0
		}); 
	this.legendUrl = wms_url + '?map=' + mapfile_path  + mapfile + '.map&'
		             +'SERVICE=WMS&VERSION=1.0.0&REQUEST=GetLegendGraphic&LAYER='+ layer.replace("result_egc/","") +'&STYLES=&'
	                 +'SRS=EPSG:'+ srs +'&FORMAT=image/png';  
};
function onPopupClose(evt) {    
   selectControl.unselect(selectedFeature); 
};
function onPopupClose2() { 
	var pops = map.popups;
	for(var a = 0; a < pops.length; a++){
       map.removePopup(map.popups[a]);
    };

};
var geographic;
var mercator;
function initMap() {  
    //
	initMapSize();
	
    geographic = new OpenLayers.Projection("EPSG:4326");
    mercator  =  new OpenLayers.Projection("EPSG:900913");

    map = new OpenLayers.Map('map2d', {   
        projection: mercator,
		displayProjection : geographic          
    });
    //google as basic layer   
	/*       
	var gs = new OpenLayers.Layer.Google("Google Physical", {  
		type: google.maps.MapTypeId.SATELLITE,         
		sphericalMercator: true,        
		'maxExtent': new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34)
    });
	*/
	
	var apiKey = "AmSNBECNoG2887KQ6gs5IRDmL0F0x4sBH5kKfTDee4DaEBQPieE8QbIuyy2x-pg_";
    var gs = new OpenLayers.Layer.Bing({     
        key: apiKey,
        type: "Aerial"
    });
	              
    map.addLayers([gs]);
    
	/*
    var gs = new OpenLayers.Layer.WMS(
            "Global Imagery",
            "http://maps.opengeo.org/geowebcache/service/wms",
            {layers: "bluemarble"},
            {tileOrigin: new OpenLayers.LonLat(-180, -90)}
    );              
    map.addLayers([gs]);
	*/
 //alert(123);         
    //                            
    outlet_Layer = new OpenLayers.Layer.Vector("Point Layer", {
        styleMap: new OpenLayers.StyleMap({
				pointRadius: "5", // based on feature.attributes.type
				fillColor: "#666666"
        })       
    });
	map.addLayer(outlet_Layer);  
	var proj_900913 = map.getProjectionObject();
	//wfs_indicators.push(outlet_Layer);         
	//map.events.register("click", map, onMapClick);
	//map.events.register("rightclick", map, onMapRightClick);
	//map.events.on({"rightclick": function(){alert();}});
	//===================================================
	OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
                defaultHandlerOptions: {
                    'single': true,
                    'double': true,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
                },
                handleRightClicks:true,
                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    ); 
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'rightclick': this.onrightclick,
                            'click': this.onclick
                        }, this.handlerOptions
                    );
                }, 

                onrightclick: function(evt) {
                	onPopupClose2();
                	var location = map.getLonLatFromPixel(evt.xy);
                	var locationTransfrom = new Object();
                	locationTransfrom.lat = location.lat;
                	locationTransfrom.lon = location.lon;
                	Proj4js.defs["EPSG:4326"] = "+proj=longlat +datum=WGS84 +no_defs";
                	var proj_4326 =  new OpenLayers.Projection("EPSG:4326");
    				var mousePosition=location.transform(proj_900913, proj_4326);
    				var lon = mousePosition.lon;
    				var lat = mousePosition.lat;
                    //alert(map.getLonLatFromPixel(evt.xy));
                    Ext.Ajax.request({
                    	url:"finddataset.action",
                    	params:{lon:lon, lat:lat},
                    	method:'POST',
                    	success: function (response, options) {
                    		//TODO: here i just implement click in one study area,and the name in project xml should be just one
                    		var dataSet = Ext.decode(response.responseText).dataSets[0];
                    		soilMappingDataSet = dataSet;
                    	}
                    });
                	AddPop2(locationTransfrom);
                },
                onclick:function(evt){
                	onPopupClose2(evt);
                }

            });
    
    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
	//===================================================
	// 
	lasha_wfs = new OpenLayers.Layer.Vector("Lasha", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({   
            version: "1.0.0",            
            url:   wfs_url + "?map=" + mapfile_path + "WFS_Lasha.map",     
            featureType: "Lasha"    
        }),           
        projection: geographic          
    }); 
	
	lasha_wfs.events.on({   
		 "featureselected": function(e){              
		
   	       latlng1_temp = new OpenLayers.LonLat(99.220176,26.311944); 
   	       latlng2_temp = new OpenLayers.LonLat(99.287922,26.347553);
   	       
	   	    var feature = e.feature;        
	        selectedFeature = feature; 
	        AddPop(feature);  
            KenyaStatus = false;			
	        nenjiangStatus = false;    
	     },"featureunselected": function(e) {
		        var feature = e.feature;
		        DeletePop(feature);          
		    }
	});     
	wfs_indicators.push(lasha_wfs);     
	map.addLayer(lasha_wfs);                     
	
	//
	walnut_wfs = new OpenLayers.Layer.Vector("Walnut", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",            
            url:   wfs_url + "?map=" + mapfile_path + "WFS_Walnut.map",     
            featureType: "walnut"
        }),  
        projection: geographic          
    });
	walnut_wfs.events.on({   
		 "featureselected": function(e){              
		
   	       latlng1_temp = new OpenLayers.LonLat(-110.155168,31.660516); 
   	       latlng2_temp = new OpenLayers.LonLat(-109.876521,31.776321);
   	       
	   	    var feature = e.feature;        
	        selectedFeature = feature; 
	        AddPop(feature);  
            KenyaStatus = false;			
	        nenjiangStatus = false;    
	     },"featureunselected": function(e) {
		        var feature = e.feature;
		        DeletePop(feature);          
		    }
	});     
	wfs_indicators.push(walnut_wfs);     
	map.addLayer(walnut_wfs);
      	
	//
	logan_wfs = new OpenLayers.Layer.Vector("Logan", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",            
            url:   wfs_url + "?map=" + mapfile_path + "WFS_Logan.map",     
            featureType: "Logan"
        }),  
        projection: geographic          
    });
	logan_wfs.events.on({
		 "featureselected": function(e){              
		   selectedFeature = e.feature;        
		   net_watershed.show();  
		   KenyaStatus = false;
		   nenjiangStatus = false;		   
	     }
	}); 
	wfs_indicators.push(logan_wfs);  
	map.addLayer(logan_wfs); 
    //
    nenjiang_wfs = new OpenLayers.Layer.Vector("NenJiang", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",
            srsName: "EPSG:4326",   
            url: wfs_url + "?map=" + mapfile_path + "WFS_NenJiang.map",
            featureType: "NenJiang"
        }),  
        projection: geographic         
    });
	nenjiang_wfs.events.on({
	    "featureselected": function(e) {
    	    latlng1_temp = new OpenLayers.LonLat(125.141551,48.886696); 
    	    latlng2_temp = new OpenLayers.LonLat(125.270336,48.987643);
    	           
    	    var feature = e.feature;        
	        selectedFeature = feature; 
	        AddPop(feature);  
			KenyaStatus = false;
			nenjiangStatus = true;
	    },
	    "featureunselected": function(e) {
	        var feature = e.feature;
	        DeletePop(feature);               
	    }
    });
    wfs_indicators.push(nenjiang_wfs); 
	map.addLayer(nenjiang_wfs);   
	
	//  
	xuancheng_wfs = new OpenLayers.Layer.Vector("XuanCheng", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",
            srsName: "EPSG:900913",   
            url: wfs_url + "?map=" + mapfile_path + "WFS_XuanCheng.map",
            featureType: "XuanCheng"
        }),  
        projection: geographic         
    });
	xuancheng_wfs.events.on({
	    "featureselected": function(e) {
    	    latlng1_temp = new OpenLayers.LonLat(118.468770,30.558708); 
    	    latlng2_temp = new OpenLayers.LonLat(119.644440,31.310547);
    	           
    	    var feature = e.feature;        
	        selectedFeature = feature; 
	        AddPop(feature);  
			KenyaStatus = false;
			nenjiangStatus = false;
	    },
	    "featureunselected": function(e) {
	        var feature = e.feature;
	        DeletePop(feature);               
	    }
    }); 
	wfs_indicators.push(xuancheng_wfs); 
	map.addLayer(xuancheng_wfs); 
	
	//xuancheng samples
	
    xuanchengSamples_wfs = new OpenLayers.Layer.Vector("xuancheng/pnts_ylA_all.csv", {    
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.WFS({ 
            version: "1.0.0",      
			url: wfs_url + "?map=" + mapfile_path + "WFS_XuanChengSamples.map",
            featureType: "XuanChengSamples"            
        }),       
        projection: geographic,
        styleMap: new OpenLayers.StyleMap({  
			pointRadius: "5", // based on feature.attributes.type
			fillColor: "#660066",
			strokeWidth: 0.1,
			strokeOpacity: 0.5,
            fillOpacity: 0.7

        }) 		
    });
	xuanchengSamples_wfs.events.on({
	    "featureselected": function(e) {
			SelectSample(e);
	    },
	    "featureunselected": function(e) {
             UnSelectSample(e);            
	    }
    });
    wfs_indicators.push(xuanchengSamples_wfs); 
	map.addLayer(xuanchengSamples_wfs);	
	
	
	//
	nigeriaStudyArea();       
	// 
	XinJiangStudyArea();
    //	
	//KenyaStudyArea();
	KenyaSampleShow();     
	//
	CanadaStudyArea();
	//
	Proj4js.defs["EPSG:32637"] = "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs";
    var proj_32637 =  new OpenLayers.Projection("EPSG:32637");
    
	
	rectLayer = new OpenLayers.Layer.Vector("Rect Layer");
	wfs_indicators.push(rectLayer);          
	map.addLayer(rectLayer);   
	
	rectLayer.events.on({  
		 "featureselected": function(e){                
            latlng1_temp = new OpenLayers.LonLat(32.972881,-5.037148); 
	        latlng2_temp = new OpenLayers.LonLat(43.017015, 5.019861);       
		    var feature = e.feature;        
	        selectedFeature = feature; 
			var geometry = feature.geometry;
			var bounds = geometry.getBounds();
			
			var west_south = new OpenLayers.Geometry.Point(bounds.left,bounds.bottom);
			var east_north = new OpenLayers.Geometry.Point(bounds.right,bounds.top);
			west_south=west_south.transform(proj_900913, proj_32637);
			east_north=east_north.transform(proj_900913, proj_32637);  
	    	KenyaExtent = west_south.x.toString() +  ' ' + west_south.y.toString()
	    	              +  ' ' + east_north.x.toString() + ' ' + east_north.y.toString();  
	    	KenyaStatus = true; 
		    nenjiangStatus =false;			
	        AddPop(feature);  
		   
	     },"featureunselected": function(e) {
		        var feature = e.feature;
		        DeletePop(feature);               
		 }
	});               
	//    
	//selectControl = new OpenLayers.Control.SelectFeature([lasha_wfs,logan_wfs,xuancheng_wfs,rectLayer]);  
    selectControl = new OpenLayers.Control.SelectFeature([lasha_wfs,logan_wfs,xuancheng_wfs,xuanchengSamples_wfs,rectLayer,wfs_KenyaSamples,
	                                                      tansSamples_wfs,tana_wfs,xinjiangSamples_wfs,xinjiang_wfs,walnut_wfs,
														  wfs_nigeriaSamples,wfs_nigeria,nenjiang_wfs,canada_wfs,canadaSamples_wfs]);	
	map.addControl(selectControl);            
	selectControl.activate();       
	
    //     
    var ddBounds = new OpenLayers.Bounds(  
		//123.6,48.28,126.8,49.56
		//117.5651,30.3206,120.7978,31.7724
        80.02,42.21,85.51,44.9              		
        // 23.6,-6.7,49.6,7.4
		//36.09051, -2.19425, 42.5724, 1.56784        
        //33.20797, -0.71848, 36.44070, 1.15185		
		//99.216587,26.301101,99.281650,26.342935 
		//34,8,39,12 //   
    );              
    map.zoomToExtent(
        ddBounds.transform(geographic, mercator)
    );
	map.addControl( new OpenLayers.Control.MousePosition() );          
	///map.getControlsByClass("OpenLayers.Control.Navigation")[0].deactivate();   

	drawrect_control = new OpenLayers.Control.DrawFeature(rectLayer, 
	    OpenLayers.Handler.RegularPolygon, {
        handlerOptions: {
	        sides: 4,
	        irregular: true
	    }
	   });       
	map.addControl(drawrect_control);  
	drawrect_control.featureAdded = onAddFeature;
	drawrect_control.deactivate(); 
	
                            
}; 
function DeletePop(feature){
	map.removePopup(feature.popup);
    feature.popup.destroy();
    feature.popup = null;  
};
//==================================================================
function AddPop2(location){
	var htmlStr = '<table width="200px">'
                     +'<tr>'    
                     +'<td>'        
                     +'<label  style="color: #009999;font-size: 11pt;">&nbsp;Select Your GeoTask</label>'
                     +'</td>'                                      
                     +'</tr>' 
                     +'<tr>'    
                     +'<td  align="center">'                                      
                     +'<button onclick="SoilMap()" style="cursor: pointer;background-color:#FFFFFF;border-bottom:1px solid #FFFFFF;;border-right:1px solid #FFFFFF"><font face="Times New Roman" size="3" color="#666666"; style="TEXT-DECORATION: underline">Digital&nbsp; Soil &nbsp;Mapping</font></button>'  
                     +'</td>'                                                   
                     +'</tr>' 					 
                     +'<tr>'    
                     +'<td  align="center">'                                       
                     +'<button onclick="WaterShedModeling()" style="cursor: pointer;background-color:#FFFFFF;border-bottom:1px solid #FFFFFF;;border-right:1px solid #FFFFFF"><font face="Times New Roman" size="3" color="#666666"; style="TEXT-DECORATION: underline">Digital Terrain Analysis</font></button>'  
                     +'</td>'                                                     
                     +'</tr>'  
                     +'<tr>'        
                     +'<td  align="center">'                                           
                     +'<button onclick="Others()" style="cursor: pointer;background-color:#FFFFFF;border-bottom:1px solid #FFFFFF;;border-right:1px solid #FFFFFF"><font face="Times New Roman" size="3" color="#666666"; style="TEXT-DECORATION: underline">Monkey Habitat Mapping</font></button>'  
                     +'</td>'                                                 
                     +'</tr>'                                            
                    +'</table>';    
    var popup = new OpenLayers.Popup.FramedCloud("Select Your Tasks", 
                             location,
                             new OpenLayers.Size(250,75),
							 "<div style='font-size:1.0em'>"
							 + htmlStr
							 +"</div>",
                             null,   
                             true, 
                             onPopupClose2);
    map.addPopup(popup);            
};
//==================================================================
function AddPop(feature){
	var htmlStr = '<table width="200px">'
                     +'<tr>'    
                     +'<td>'        
                     +'<label  style="color: #009999;font-size: 11pt;">&nbsp;Select Your GeoTask</label>'
                     +'</td>'                                      
                     +'</tr>' 
                     +'<tr>'    
                     +'<td  align="center">'                                      
                     +'<button onclick="SoilMap()" style="cursor: pointer;background-color:#FFFFFF;border-bottom:1px solid #FFFFFF;;border-right:1px solid #FFFFFF"><font face="Times New Roman" size="3" color="#666666"; style="TEXT-DECORATION: underline">Digital&nbsp; Soil &nbsp;Mapping</font></button>'  
                     +'</td>'                                                   
                     +'</tr>' 					 
                     +'<tr>'    
                     +'<td  align="center">'                                       
                     +'<button onclick="WaterShedModeling()" style="cursor: pointer;background-color:#FFFFFF;border-bottom:1px solid #FFFFFF;;border-right:1px solid #FFFFFF"><font face="Times New Roman" size="3" color="#666666"; style="TEXT-DECORATION: underline">Digital Terrain Analysis</font></button>'  
                     +'</td>'                                                     
                     +'</tr>'  
                     +'<tr>'        
                     +'<td  align="center">'                                           
                     +'<button onclick="Others()" style="cursor: pointer;background-color:#FFFFFF;border-bottom:1px solid #FFFFFF;;border-right:1px solid #FFFFFF"><font face="Times New Roman" size="3" color="#666666"; style="TEXT-DECORATION: underline">Monkey Habitat Mapping</font></button>'  
                     +'</td>'                                                 
                     +'</tr>'                                            
                    +'</table>';    
    var popup = new OpenLayers.Popup.FramedCloud("Select Your Tasks", 
                             feature.geometry.getBounds().getCenterLonLat(),
                             new OpenLayers.Size(250,75),
							 "<div style='font-size:1.0em'>"
							 + htmlStr
							 +"</div>",
                             null,   
                             true, 
                             onPopupClose);
    feature.popup = popup;
    map.addPopup(popup);            
};

function SelectSample(e){
	
	var attr = e.feature.attributes;
	
	var tempstr = "<br><table border='0' frame='void'>";
	var count = 0;
	var tempstr1 ="<tr>";
	var tempstr2 ="<tr>";
	var column_num = 0;
	for(var key in attr){
		column_num ++;
	}
	  
	if(column_num < 4){
	    for( var key in attr ){
			tempstr1 = tempstr1 + "<th width='100px'><font color='red'>" + key.toUpperCase() + "</font></th>";
			    
			if(isNaN(attr[key])){
				tempstr2 = tempstr2 + "<th width='100px'>" +attr[key] + "</th>";
			}else{
				tempstr2 = tempstr2 + "<th width='100px'>" + parseFloat(attr[key]).toFixed(2) + "</th>";
			}    
			
		}
        tempstr = tempstr +tempstr1 + "</tr>" + tempstr2 + "</tr>";		
	}else{
		for( var key in attr ){
			count++;
			tempstr1 = tempstr1 + "<th width='100px'><font color='red'>" + key.toUpperCase() + "</font></th>";
			if(isNaN(attr[key])){
				tempstr2 = tempstr2 + "<th width='100px'>" +attr[key] + "</th>";
			}else{
				tempstr2 = tempstr2 + "<th width='100px'>" + parseFloat(attr[key]).toFixed(2) + "</th>";
			}       
			     
			if(count%4==0){     
				tempstr = tempstr +tempstr1 + "</tr>" + tempstr2 + "</tr>";
				tempstr1 = "<tr>";
				tempstr2 = "<tr>";
			}
			var surplus = column_num-count; 
			if(surplus<1){
				tempstr = tempstr +tempstr1 + "</tr>" + tempstr2 + "</tr>";
				tempstr1 = "<tr>";
				tempstr2 = "<tr>";
			}	
		}
		
	}
	
	tempstr = tempstr + "</table>"; 
	
	var feature = e.feature;
	selectedFeature = feature;
	var popup = new OpenLayers.Popup.FramedCloud("chicken", 
							 feature.geometry.getBounds().getCenterLonLat(),
							 null,
							 "<div style='font-size:.8em'>" + tempstr +"</div>",
							 null, true, onPopupClose);
	feature.popup = popup; 
	map.addPopup(popup);

};
function UnSelectSample(e){
	
	map.removePopup(e.feature.popup);
	e.feature.popup.destroy();
	e.feature.popup = null;  
};

function CheckSampleInRect(){
   var rec = rectLayer.features[0];
   var rec_bounds = rec.geometry.bounds;
   var samples = wfs_KenyaSamples.features;
   var count = 0;   
   for(var i=0;i<samples.length; i++){
      if(rec_bounds.containsBounds(samples[i].geometry.bounds)){
	     count ++;
	  }
   }
   if(count==0){
     return false;
   }else{
     return true;   
   }   
};
var kneya_bounds  = new OpenLayers.Bounds(      
		3670524, -561456  , 4788632,559524        
    );
function onAddFeature(feature){       
	var fea = feature;   
              
	if(!kneya_bounds.containsBounds(fea.geometry.bounds)){  
	  
		rectLayer.removeAllFeatures();
	    rectLayer.refresh(); 
        var index = map.getLayerIndex(rectLayer) + 1;	
        map.setLayerIndex(wfs_KenyaSamples,index); 
             	
		//                  
	}else{  
		            
		rectLayer.removeAllFeatures();
	    rectLayer.addFeatures(fea);    
	    rectLayer.refresh(); 
        var index = map.getLayerIndex(rectLayer) + 1;	
        map.setLayerIndex(wfs_KenyaSamples,index);
		    
	}
	  

    
};
function displayresult(wms,legendUrl,max,min){   
	var layers = map.layers;
    var flag = false;	
	for(var i=layers.length -1; i>=0; i--){      
		if(!layers[i].isBaseLayer){
			//map.removeLayer(layers[i]);
			if(layers[i]==wms){
				flag = true;
			}
			layers[i].setVisibility(false);       
		}
	}           
    if(flag == false){          
		wms.setVisibility(true);  
		wms.setOpacity(currentLayerOpacity);
		map.addLayer(wms);
	}else{  
	   wms.setVisibility(true);
	   wms.setOpacity(currentLayerOpacity);                                         
	}	
	////// let the samples layer at top
	wfs_KenyaSamples.setVisibility(true);  
    var index = map.getLayerIndex(wms) + 1;	
	map.setLayerIndex(wfs_KenyaSamples,index);
	
	tansSamples_wfs.setVisibility(true);  
	map.setLayerIndex(tansSamples_wfs,index+1);  
	
	xinjiangSamples_wfs.setVisibility(true);
	map.setLayerIndex(xinjiangSamples_wfs,index+2);    
	
	wfs_nigeriaSamples.setVisibility(true);
	map.setLayerIndex(wfs_nigeriaSamples,index+3);
	
	xuanchengSamples_wfs.setVisibility(true);
	map.setLayerIndex(xuanchengSamples_wfs,index+4); 	
	
    if(addSamples!=null){    
		addSamples.setVisibility(true);
        map.setLayerIndex(addSamples,index+5);  
	}   
        	
	        
	
	map.removeControl(selectControl);          
	selectControl = new OpenLayers.Control.SelectFeature(wfs_indicators);                      
	map.addControl(selectControl);       
	selectControl.activate();    	
    //////	 
	var result = Ext.getCmp('easttabs').child('#result_display');
	result.tab.show();              
	Ext.getCmp('easttabs').setActiveTab(result); 
	                     
    //if(currentTask =="StreamLE"){
	if(currentTask =="extractStream"){
	  Ext.getCmp('legend_container').setVisible(false);
	  Ext.getCmp('legend_WaterShed').setVisible(false);
	  Ext.getCmp('legend_StreamLine').setVisible(true);
	  
	//}else if(currentTask =="WatershedD"){
	}else if(currentTask =="extractWatershed"){
		Ext.getCmp('legend_container').setVisible(false);
	    Ext.getCmp('legend_WaterShed').setVisible(true);
	    Ext.getCmp('legend_StreamLine').setVisible(false);
	}else{
		 Ext.getCmp('legend_StreamLine').setVisible(false);
		 Ext.getCmp('legend_WaterShed').setVisible(false);
		Ext.getCmp('legend_container').setVisible(true);             		
		document.getElementById('legend_max').innerHTML = "<b>High:" + parseFloat(max).toFixed(2) +"</b>";  
		document.getElementById('legend_min').innerHTML = "<b>Low:" + parseFloat(min).toFixed(2) +"</b>";  
	}	
            
	//Ext.getCmp('MapLegend').getEl().dom.src = legendUrl;     
};
var currentTask = null;
function WaterShedModeling(){
	onPopupClose2();
	var model = tabs.child('#easyModel');
	model.tab.show();  
    tabs.setActiveTab(model);  
    //Manager.init("WatershedD"); 
    Manager.init(""); 
    var rootNode = Ext.getCmp('taskTree').getRootNode();
    var DTANode = rootNode.findChild("id","DTA");
	var PMNode = rootNode.findChild("id","PM");
	var HMNode = rootNode.findChild("id","HM");
	DTANode.expand(true);
    PMNode.collapse(true);
	HMNode.collapse(true);	
   
    DTANode.eachChild(function(childnode) {      
		Ext.getCmp('taskTree').getSelectionModel().deselect(childnode);
	});
	PMNode.eachChild(function(childnode) {      
		Ext.getCmp('taskTree').getSelectionModel().deselect(childnode);
	});   
    HMNode.eachChild(function(childnode) {      
		Ext.getCmp('taskTree').getSelectionModel().deselect(childnode);
	});        
	selectControl.unselect(selectedFeature);    
    //modelManagerwin.showAt(30,60);
	modelManagerwin.show(); 	
	//currentTask = "TWI";
	currentTask = "TWICal";     
};
function SoilMap(){ 
	onPopupClose2();
	var model = tabs.child('#easyModel');
	model.tab.show();  
    tabs.setActiveTab(model);  
    Manager.init("Sample Based Mapping"); 
	var rootNode = Ext.getCmp('taskTree').getRootNode();
    var DTANode = rootNode.findChild("id","DTA");
	var PMNode = rootNode.findChild("id","PM");
	var HMNode = rootNode.findChild("id","HM");
	PMNode.expand(true);
    DTANode.collapse(true);
	HMNode.collapse(true);	
	DTANode.eachChild(function(childnode) {      
		Ext.getCmp('taskTree').getSelectionModel().deselect(childnode);
	});
	PMNode.eachChild(function(childnode) {      
		Ext.getCmp('taskTree').getSelectionModel().deselect(childnode);
	});   
    HMNode.eachChild(function(childnode) {      
		Ext.getCmp('taskTree').getSelectionModel().deselect(childnode);
	}); 
    selectControl.unselect(selectedFeature); 
	modelManagerwin.show();
	//modelManagerwin.showAt(30,60);  
	currentTask = "Sample Based Mapping";
	
};                 
function Others(){
	onPopupClose2();
	var model = tabs.child('#easyModel');
	model.tab.show();  
    tabs.setActiveTab(model);  
    Manager.init("Habitat Mapping"); 
	var rootNode = Ext.getCmp('taskTree').getRootNode();
    var DTANode = rootNode.findChild("id","DTA");
	var PMNode = rootNode.findChild("id","PM");
	var HMNode = rootNode.findChild("id","HM");
	HMNode.expand(true);
    DTANode.collapse(true);
	PMNode.collapse(true);	     
	DTANode.eachChild(function(childnode) {      
		Ext.getCmp('taskTree').getSelectionModel().deselect(childnode);
	});
	PMNode.eachChild(function(childnode) {      
		Ext.getCmp('taskTree').getSelectionModel().deselect(childnode);
	});   
    HMNode.eachChild(function(childnode) {      
		Ext.getCmp('taskTree').getSelectionModel().deselect(childnode);
	}); 
    selectControl.unselect(selectedFeature);
	modelManagerwin.show();	   
	//modelManagerwin.showAt(30,60);  
    currentTask = "Habitat Mapping";		
};   
function initMapSize(){  
      
	document.getElementById('map2d').style.height = windowHeight() - 95 + 'px';       
	document.getElementById('map2d').style.width = windowWidth() - 252 + 'px'; 
};    
function windowHeight() {      
  
	if (self.innerHeight)
		return self.innerHeight;
	// IE 6
	if (document.documentElement && document.documentElement.clientHeight)
		return document.documentElement.clientHeight;
	// IE 5
	if (document.body)
		return document.body.clientHeight;
	// Just in case.  
	return 0;
};
function windowWidth() {      

	if (self.innerWidth)
		return self.innerWidth;
	// IE 6
	if (document.documentElement && document.documentElement.clientWidth)
		return document.documentElement.clientWidth;
	// IE 5
	if (document.body)
		return document.body.clientWidth;
	// Just in case.  
	return 0;
};
window.onresize= function(){         
	  
	if(ManagerFormCollapseOrExtend == 0){//collapse
		document.getElementById('map2d').style.height = windowHeight() - 95 + 'px';       
		document.getElementById('map2d').style.width = windowWidth() - 21 + 'px';  
	}else{
		document.getElementById('map2d').style.height = windowHeight() - 95 + 'px';       
   		document.getElementById('map2d').style.width = windowWidth() - 250 + 'px';   
	}
	
} ;

function showEnvData(){
	//TODO:结合树中被选中环境变量，在地图中动态显示环境变量
	 var n = 10; 
	 for(var i = 0; i < n; i++){
	 	var userName = i;
	 	var dataSetName = i;
	 	var dataName = i;
	 	var layerName = userName + dataSetName + dataName; //TODO:将layerName 改为用户名+数据集+数据名称
	 	var envWMS = new OpenLayers.Layer.WMS(layerName, wms_url,{
		 		layers: dataName,
		 		map: mapfile_path  + userName + "/" + dataSetName + "/" + dataName + '.map',
		 		transparent: 'true',
		 		format: 'image/png'
	 	    },{
	 	    	isBaseLayer: false,
				visibility: true,
				opacity: 1.0,           
				buffer: 0
	 	    });
	 	map.addLayer(envWMS);
	 }
}