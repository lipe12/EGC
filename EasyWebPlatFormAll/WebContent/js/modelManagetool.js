var modelManagerwin;
var modelSavewin;
var modelOpenwin;
var modelstrjjc;

var modelManagerwin = Ext.create('Ext.Window', {
	closeAction: 'hide',   
	width:300,     
	frame:true,  
	plain: false,   				
	shadow:false,				 				
	closable:false,  
	draggable:false,
	resizable:false,  				
	x: 200,   
	y: 60,
	defaults:{
				margins:'0 7 0 0'
			},
	layout: {
				type:'hbox',
				padding: 3  
			},
	items: [{
		xtype:'button',
		height:25,
		text:'Open Model',
		handler: function(){    
			modelOpenwin.show(); 
            GeoModelStore.load();       			
			//Manager.openModel(modelstrjjc);
		}
	},{
		xtype:'button',
		height:25,
		text:'Save Model',
		handler: function(){
			//Manager.saveModel();
			modelSavewin.show();
		}
	},{
		xtype:'button',
		height:25,
		text:'Share Algorithm',
		handler:function(){
			shareAlgorithm_win.show();
		}
	}]
}); 
var modelSaveform = Ext.create('Ext.form.Panel', {
        frame:true,
        width: 236,  
		height:65,          
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 80      
        },
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },
        items: [{
            xtype:'component',
            height:15             		
		},{
            fieldLabel: 'Model Name',
            id: 'modelname',
			selectOnFocus:true,        
            allowBlank:false
        }]
});

modelSavewin =  Ext.create('Ext.Window', {
   title:'Save Model', 
   width:250,
   height:130,     
   resizable:false,  
   closeAction:'hide',
   modal: true,
   items:modelSaveform,    
   buttons:[{
      text:'Save',
	  handler:function(){
	    var modelname = Ext.getCmp('modelname').getValue();
		Manager.saveModel(modelname);
		modelSavewin.hide(); 
		GeoModelStore.load();      
	  }
   },{
      text:'Cancel',
	  handler:function(){
	    modelSavewin.hide(); 
	  }
   }]
	
}); 

///
Ext.define('GeoModel',{ 
	    extend: 'Ext.data.Model', 
	    fields: [ 
	        {name:'modelName',mapping:'modelName'}
	    ] 
	}); 
	 
var GeoModelStore = Ext.create('Ext.data.Store', { 
	pageSize:50,       
	remoteSort:true,
	model: 'GeoModel',        
	proxy: { 
		type: 'ajax', 
		url: 'geomodels.action',     
		reader: { 
			type: 'json', 
			root: 'models' ,  
			totalProperty  : 'total' 
		} 
	}, 
	autoLoad: false      
}); 
    
var  ModelGrid = Ext.create('Ext.grid.Panel',{
            store: GeoModelStore, 
			columns: [         
		        {text: "Model Name", width: 300, dataIndex: 'modelName', sortable: false}
		    ],         
		    height:240,     
		    width:345,            
		    viewConfig: { 
		        stripeRows: true 
		    },
			bbar: Ext.create('Ext.PagingToolbar', {   
		        store: GeoModelStore, 
		        displayInfo: true,   
		        displayMsg: 'Show {0} - {1} item, total {2} items', 
		        emptyMsg: "no data" 
		    }) 
});
GeoModelStore.load(); 

var getmodelstr = function(modelname){
	var xmlUrl = "geomodelstr.action?modelname="+modelname;
	var ajax = new Ajax();   
	ajax.open("GET",xmlUrl,true); 
	ajax.onreadystatechange=function(){  
		if(ajax.readyState==4){
			if(ajax.status==200){                  
				var modelstr=ajax.responseText.pJSON().modelstr;
				Manager.openModel(modelstr);        
			}  
		 }    
	};     
	ajax.send(null);     
};
         
modelOpenwin =  Ext.create('Ext.Window', {
   title:'Open Model', 
   width:360,                       
   height:310,  
   resizable:false,  
   closeAction:'hide',
   modal: true,
   items: ModelGrid,   
   buttons:[{
      text:'OK',
	  handler:function(){  
	     var records = ModelGrid.getSelectionModel().getSelection();
		  var modelname=null;
		  if(records.length >0){          
			var record = records[0];
			modelname = record.get("modelName"); 
	     }
	     getmodelstr(modelname); 
         modelOpenwin.hide();     		 
	  }
   },{
      text:'Cancel',
	  handler:function(){
	    modelOpenwin.hide(); 
	  }
   }]
	
}); 



   
       
        
    
