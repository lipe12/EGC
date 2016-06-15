	Ext.regModel('checkBox_State', {
		fields: [
			{type: 'string', name: 'type'}
		]
	});
    var checkBox_states = [
        {"type":"Climate"},
        {"type":"Geology"},
        {"type":"Terrain"},
		{"type":"Vegetation"},
        {"type":"Others"}
    ];
	// The data store holding the states
	var checkBox_store = Ext.create('Ext.data.Store', {
		model: 'checkBox_State',
		data: checkBox_states
	});

	// Simple ComboBox using the data store
	var simpleCombo = Ext.create('Ext.form.field.ComboBox', {
		fieldLabel: 'Types',
		displayField: 'type',
		//width: 500,  
		labelWidth: 100,   
		store: checkBox_store,
		queryMode: 'local',
		typeAhead: true
	});
	/*
	
	*/
	var form_pop = Ext.create('Ext.form.Panel', {  
        autoHeight: true,
        width   : 335,
        bodyPadding: 10,
		frame:true,   
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },
		items:[simpleCombo,{  
				   width: 60,   
				   xtype: 'textfield',
				   fieldLabel: 'Variable Name',
				   id:'variableName'
	    }]
	});
	
	
	
	var win_pop =new Ext.Window({     
    	    title:'User define Environment variable',  
    	  
    	    width:350,  

    	    height:150,           
    	    //layout:'fit',  
    	    autoDestory:true,  
    	    collapsible : false, 
    	    modal:false,          
    	    closeAction:'hide',  
    	    items:[  
    	        form_pop  
    	    ],
            buttons: [{
			   text   : 'OK',
               handler: function() {
                  
					var variableName = Ext.getCmp('variableName').getValue();
					var type = simpleCombo.getValue();   
					var fieldSet = Ext.getCmp("Env_" + type);
					if(fieldSet!= undefined && variableName!=""){
						var check = {
							 xtype: 'checkbox',
							 boxLabel: variableName
						};
						var com = {  
							 xtype: 'component',
							 html: '&nbsp;', 
							 height:1    
						};
						fieldSet.add(check);
						fieldSet.add(com);
					}
					win_pop.close();
      
               }//end of handler
			},{
			  text : "Cancle",
			  handler: function(){
			    win_pop.close();
			  }
			}]			
    	});