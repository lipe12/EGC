/**
 * this function is copied form upload_samplesdata.js
 * 功能：是读取生成样点CSV文件，生成点展示在map中。
 * precious the proj is a define like Proj4js.defs["EPSG:32637"] = "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs";
 * this version modified, let it can be any proj
 * */

var drawSamples = function(filename,fieldstr, rowstr, espgCode, projString){
	
	
    //Proj4js.defs["EPSG:32637"] = "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs";
    //var proj_32637 =  new OpenLayers.Projection("EPSG:32637");
	Proj4js.defs["EPSG:" + espgCode] = projString;
	var proj_32637 =  new OpenLayers.Projection("EPSG:" + espgCode);
    var proj_900913 = map.getProjectionObject();
	
	var fields = fieldstr.split(',');
	var x_index;
	var y_index;      
	for(var i =0; i< fields.length; i++){
	   if(fields[i] =='X' || fields[i] == 'RecommendedX'){
		  x_index = i;  
	   }else if(fields[i] =='Y' || fields[i] =='RecommendedY'){
		  y_index = i;
	   }
	}
	var attr = {};
	var features =[];
	var rows = rowstr.split('#');
	for(var i=0; i< rows.length; i++){       
		var samplerow = rows[i].split(',');
		for(var j =0;j<samplerow.length; j++){
			attr[fields[j]] = samplerow[j];
		}
		var x = samplerow[x_index];
		var y = samplerow[y_index];
		var point = new OpenLayers.Geometry.Point(x,y);
		point = point.transform(proj_32637,proj_900913); 
		
		features.push(new OpenLayers.Feature.Vector(point,attr));
	}
	addSamples = new OpenLayers.Layer.Vector(filename,{
		styleMap: new OpenLayers.StyleMap({  
			pointRadius: "5", // based on feature.attributes.type
			fillColor: "#000066",
			strokeWidth: 0.1,   
			strokeOpacity: 0.5,
			fillOpacity: 0.7

		}) 		
	});
	addSamples.addFeatures(features);	
	addSamples.events.on({     
		"featureselected": function(e) {  
			SelectSample(e);
		},
		"featureunselected": function(e) {
			 UnSelectSample(e);             
		}
	});
	map.addLayer(addSamples);
	wfs_indicators.push(addSamples); 
	
	
	map.removeControl(selectControl);          
	selectControl = new OpenLayers.Control.SelectFeature(wfs_indicators);                      
	map.addControl(selectControl);       
	selectControl.activate();    	 	  	
};


var checkSamples = function(filename, projInfo){
    var flag = false;
    var layers = map.layers;
	for(var i =0; i< layers.length; i++){    
	   
		if(layers[i].name == filename){   
		 //flag = true;  
		}
	}
	var projInfos = new Array();
	projInfos = projInfo.split("#");
	var espgCode = projInfos[0];
	var projString = projInfos[1];
	var newProjString = "";
	var projStringSplit = projString.split(" ");
	var len = projStringSplit.length;
	for (var i = 0; i < len; i++){
		if (newProjString == ""){
			newProjString = newProjString + projStringSplit[i];
		}else{
			newProjString = newProjString + "+" + projStringSplit[i];
		}
	}
//	Ext.Ajax.request({
//		url:"find_fields_datas.action",
//		params:{fileName: filename},
//		method:'POST',
//		success: function (response, options) {
//			 //Ext.MessageBox.alert('success', 'get Result: ' + response.responseText);
//			var messageTxt = Ext.util.JSON.decode(response.responseText);
//			
//			var samplefields=messageTxt.samplefields;
//			var samplerows=messageTxt.samplerows;
//			drawSamples(filename,samplefields,samplerows, espgCode, projString);
//		}
//	});
	if(flag == false){
	    var xmlUrl = "find_fields_datas.action?fileName=" + filename;
		var ajax = new Ajax();   
		ajax.open("GET",xmlUrl,true); 
		ajax.onreadystatechange=function(){          
			if(ajax.readyState==4){
				if(ajax.status==200){
					       					
					var samplefields=ajax.responseText.pJSON().samplefields;           
					var samplerows=ajax.responseText.pJSON().samplerows;
				    drawSamples(filename,samplefields,samplerows, espgCode, newProjString);                     
				}
			 }    
		};
		ajax.send(null);      
	}
	
};