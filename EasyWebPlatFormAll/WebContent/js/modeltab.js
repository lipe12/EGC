// define model-taske tree  
var treestore = Ext.create('Ext.data.TreeStore', {
	        proxy: {
	            type: 'ajax',          
	            url: 'model-task.json'
	        },
	        sorters: [{
	            property: 'leaf',
	            direction: 'ASC'
	        }, {
	            property: 'text',
	            direction: 'ASC'
	        }]
	    });

var modeltab = new Ext.TabPanel({
	            title: 'Model',
	            id: 'easyModel', 
	            xtype:'panel', 
	            hidden: true,        
	            layout:'border',
	            items:[{
	            	 region: 'west',          
	            	 xtype:'treepanel', 
	            	 store: treestore,    
	                 viewConfig: {
	                     plugins: {
	                         ptype: 'treeviewdragdrop'
	                     }
	                 },    
	                 rootVisible: false,
	                 useArrows: true,
	                 frame: true,        
                     title:'GeoTasks',
                     id:'taskTree',   
                     width:200,
                     collapsible:true,
                     collapsed:false,       
                     listeners:{
                         'itemclick':function(view,record,item,index,e){
		                	 if (record.isLeaf()){       
		                		 if(record.raw.text ==='Watershed Delimitation'){
		                			    Manager.init("extractWatershed");
                                        currentTask = "extractWatershed";										
				                 }else if(record.raw.text ==='Pit-removing'){
				                	    Manager.init("PitRemoving");
                                        currentTask = "PitRemoving";										
						         }else if(record.raw.text ==='TWI'){
						        	    Manager.init("TWICal");
                                        currentTask = "TWICal";										
							     }else if(record.raw.text ==='Flow Direction Calculator'){
				                	    Manager.init("FlowDirectionCal");
										currentTask = "FlowDirectionCal";										
								 }else if(record.raw.text==='Sample Based Mapping'){
										currentTask = "Sample Based Mapping";         
									    Manager.init("Sample Based Mapping");       
							     }else if(record.raw.text ==="Habitat Mapping"){
										Manager.init("Habitat Mapping");
										currentTask = "Habitat Mapping";										
								}else if(record.raw.text ==="Stream Extraction"){     
									 Manager.init("extractStream");
									 currentTask = "extractStream"; 
								}else if(record.raw.text ==="Sampling based on purposive"){     
									 Manager.init("sampling based on purposive");
									 currentTask = "sampling based on purposive"; 
								}else if(record.raw.text ==="Sampling based on Uncertainty"){     
									 Manager.init("Sampling Based On Uncertainty");
									 currentTask = "Sampling Based On Uncertainty"; 
								}        
		                  	}          
                         },
                    	 'collapse':function(){
                    		 	taksTreeCollapseOrExtand = 0;     
                    		 	var adjust = 0;
                 		     	adjust = Ext.get("collapse-placeholder-taskTree").dom.style.width;  
                 			 	temps =  adjust.split("px");
                 			 	adjustX =  - temps[0] - 25;                        
                 		     	//adjustY =  - 57 - 21 ;
                 			 	adjustY =  - 57;  
                                modelManagerwin.showAt(30,60);  								
                    	 },
                    	 'expand':function(){
                    		    taksTreeCollapseOrExtand = 1;
                    		    var adjust = 0;
                    		    adjust = Ext.get("taskTree").dom.style.width;
                    			temps =  adjust.split("px");
                    			adjustX =  -  temps[0];    
                    			//adjustY =  - 57 - 21 ;   
                    			adjustY =  - 57; 
								modelManagerwin.showAt(200,60);       
                    	 },
                    	 'show':function(){ 
                    			        
                    		    taksTreeCollapseOrExtand = 0;
                    		 	var adjust = 0;    
                 		     	adjust = Ext.get("collapse-placeholder-taskTree").dom.style.width;  
                 			 	temps =  adjust.split("px");
                 			 	adjustX =  - temps[0] - 25;       
                 		     	//adjustY =  - 57 - 21 ; 
                 			 	adjustY =  - 57;   
                                modelManagerwin.showAt(30,60);  									
                    	 }     
                     }
	            },{          
	            	region:'center',
	            	id:'modelCanvas',    
	            	contentEl:'model',
	            	autoScroll:true, 
					   
	            	bbar:[{xtype:'component',  
	            		   hidden:false , 
	            		              
                           html:'<label  style="color: #ff0000;font-size: 10pt;">Status</label>&nbsp;&nbsp;&nbsp;&nbsp;'
		            	 },{         
						 xtype:'component',  
						 id:'modelprogressbar',            
						 hidden:true ,                                        
						 html:'<img src="img/progress.gif" >'     
			        }]   
	            }]
});
