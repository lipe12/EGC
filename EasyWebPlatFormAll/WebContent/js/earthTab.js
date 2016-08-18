
var earthtap = new Ext.TabPanel({     		
	        // the first tab: "Earth" tab      
	            title: 'Earth',
                //title:'Map',  				
	            xtype: 'panel', 
	            id:'EarthTab',
	            layout:'border',               
		        items:[{
                    region:'center',
                    id:'easyEarth',
                    contentEl:'map2d',  
	            	autoScroll:false                 
				},{  
                    region:'east',
                    id:'easttabs',  
                    xtype: 'tabpanel',  
                    frame:true,     
                    width:250,
                    items:[{
                    	//title: 'Search',
						title:'Guide',
                    	id:'searchArea',
                    	xtype:'form',
						autoScroll : true,   
                    	frame:true,   
                    	items:[{           
                            xtype: 'component',         
                            html:'<br/>'
							     +'<br/><p style="line-height:20px;"><font  size="2" color="#336699" >You can accomplish geo-computation tasks (e.g. Digital Soil Mapping, Digital Terrain Analysis, Monkey Habitat Mapping, etc.) on EGC platform in <b>three steps</b>:</font></p>'
								 +'<br/><br/><p style="line-height:20px;"><font  size="2" color="#336699" ><b>Step1</b>: Use the prepared the area of interest (AOI) or Define AOI on the “Map” interface by pressing the <b>Ctrl</b> key and dragging a rectangle with the mouse;</font></p>' 
                                 +'<br/><br/><p style="line-height:20px;"><font size="2" color="#336699" ><b>Step2</b>: <b>Left Click</b> on the defined AOI and choose the geo-computation task of interest;</font></p>'
                                 +'<br/><br/><p style="line-height:20px;"><font size="2"  color="#336699" ><b>Step3</b>: <b>Construct</b> the model on the "Model" interface (<b>automatically</b> opened). When you finish, run the model and get the results. You may switch between the "Map" interface and the "Model" interface to view the results and modify the model</font></p>', 								 
                            style: 'margin-bottom: 20px;'     
                         }]    
                    }, 
					 //FileDataGrid_User,
					 //grid,
					 treePanel,
					{    
                    	title: 'Result',
						hidden: true,         
                    	id:'result_display',
                    	xtype:'form',
                    	frame:true,  
                    	items:[{
                    		xtype:'component',  
                            hidden: false,    
                            id:'title_for_download',          
                            html:'<br/><font face="Times New Roman" size="3" color="#336699">The results as follow, please download</font>'	
                        },{
                            xtype:'component',  
                            html:'&nbsp;&nbsp;'   
                        },{
                        	xtype:'component', 
                            hidden: false,                   
                            id:'files_for_download',          
                            html:''                         
                                          
                        },{
                            xtype:'component',  
                            html:'&nbsp;&nbsp;'                    
                        },{             
                 			xtype: 'container',
                 			layout: 'hbox',
                 			items:[{
                              xtype: 'button',
                              text:'validate',
                              handler:function(){               
                              		
                              	 validate();
                              		
                              }       
                 			},{           
                 				xtype:'component',
                 				id:'validate_rmse',                            
                 				margins: '5 0 0 5',              
                 				html:'RMSE:'              
                 			}]
                        	
                        },{
                            xtype:'component',
                            html:'<hr>'
                        },{           
                    		xtype:'component',     
                            hidden: false,    
                            id:'map_for_show',          
                            html:'<br/><font face="Times New Roman" size="3" color="#336699">Select the result that you want to display on map</font><br/>'	
                        },{
                            xtype:'component',
                            html:'&nbsp;&nbsp;'   
                        },{
                    		xtype:'component', 
                    		id:'select_show_map',   
                            hidden: false,                                                   
                            html:'<select  STYLE="width: 150px"  onclick="clickSelectValue(this);" onchange="getSelectValue(this);"><option value="1">AttributeMap</option><option value="2">UncertaintyMap</option></select>'
                                 							
                        },{
                            xtype:'component',
                            html:'&nbsp;&nbsp;'   
                        },{     
                            xtype:'component',
                            html:'<hr>'
                        },{             
                    		xtype:'component',            
                            hidden: false,               
                            id:'title_map_legend',               
                            html:'<font face="Times New Roman" size="3" color="#336699">Legend</font>'	
                        },{   
                    		xtype:'component',    
                            hidden: true,              
                            html:'&nbsp;&nbsp;&nbsp;&nbsp;'	
                        },{
							xtype: 'container',
							id:'legend_container',
							//width: 90,
							anchor: '85%',      							
							layout:'column',
							items:[{
								xtype: 'container',
								//columnWidth:.4,
                                width:30,								
								layout: 'anchor',
								items: [{
									xtype:'component',   
									html:'<img src= "img/stretchedLegend.jpg"  target= "_self " style="cursor:pointer"></img>'   
								}]
							},{
								xtype: 'container',
								//columnWidth:.6,       
								padding: '0 0 0 -10',       
								layout: 'anchor',
								items: [{
									xtype:'component',
									id:'legend_max',
									height:85,  
									html:""
								},{
									xtype:'component',
									id:'legend_min',
									html:''
								}]
							}]
						},{   
                    		xtype:'component',
                            id:'legend_StreamLine',							
                            hidden: true,              
                            html:'<img src= "img/river.bmp"  target= "_self " style="cursor:pointer"></img>'
                        },{   
                    		xtype:'component',
                            id:'legend_WaterShed',							
                            hidden: true,              
                            html:'<img src= "img/watershed.jpg"  target= "_self " style="cursor:pointer"></img>'
                        }]
                    }]         
                }]
});
		            	
	        