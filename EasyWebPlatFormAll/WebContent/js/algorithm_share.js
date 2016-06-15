var shareAlgorithm_form = Ext.create('Ext.form.Panel', {
    //layout: 'absolute',  
    defaultType: 'textfield',
    //border: false, 
    autoScroll : true, 
    height:490,   
    frame:true,   
    items: [{///
	           xtype: 'component',
			   html:'<font color="red">Tips: Please equip your algorithm with the appropriate license and intellectual property before sharing it.</font>'
			},{///
				xtype: 'container',
				layout: 'hbox',
				items: [{
				     xtype: 'displayfield',
					 width: 115,    
                     value: 'meta-information(.txt)'
				},{
			    	 xtype: 'filefield',
			    	 name:'metaFile',//
			    	 id:'metaFile_id',
			    	 width: 230, 
					 text:'Browse',
					 allowBlank: false
				}]
			},{///
				xtype: 'container',
				layout: 'hbox',
				items: [{
				     xtype: 'displayfield',
					 width: 115,     
                     value: 'WSDL File(.wsdl)'
				},{
			    	 xtype: 'filefield', 
			    	 width: 230,
			    	 name:'wsdlFile',
			    	 id:'wsdlFile_id',
					 text:'Browse WSDL',
					 allowBlank: false
				}]
			},{///
				xtype: 'container',
				layout: 'hbox',                  
				items: [{
					   xtype: 'displayfield',
					   margins: {left: 20},   
					   value: 'Algorithm:'  
				   },{
					   xtype: 'displayfield',
					   value: 'Name'
				   },{  
					   width: 100,
					   xtype: 'textfield',
					   margins: {left: 18},
					   name:'algorithmName',
					   allowBlank: false
				   },{
					   xtype: 'displayfield',
					   value: 'Description'
				   },{
					   width: 100,
					   xtype: 'textfield',
					   name:'algorithmDescription',
					   allowBlank: false
				   }]
			},{///
	            xtype: 'fieldset',
	            title: 'Inputs',
	            id:'inputs_fieldSet',// 
				width: 450,
				height: 100,  
				autoScroll : true,
	            collapsible: true,
				defaults: {   
	                labelWidth: 70,
	                layout: {      
	                    type: 'hbox',
	                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                }
	            },
	            items:[{
			       xtype: 'button',
				   text: 'Add Input',
				   margin: '0 0 0 300',                          
				   width: 80,
				   handler:function(){   
					   
					   var field_container = {
		                    xtype: 'fieldcontainer',
		                    combineErrors: false,
		                    items: [{
		                        xtype: 'displayfield',
		                        value: 'Name'
		                      },{
		                           width: 100,
								   xtype: 'textfield',
								   name:'inputName',
		                           allowBlank: false
		                      },{
		                          xtype: 'displayfield',
		                          value: 'Description'
		                      },{
		                           width: 100,
								   xtype: 'textfield',
								   name:'inputDescription',
		                           allowBlank: false
		                      },{
			                    	xtype:'button',
			                    	text:'delete input',
			                    	handler:function(){
			                    		 Ext.getCmp('inputs_fieldSet').remove(this.ownerCt);
			                    		 shareAlgorithm_form.doLayout(); 
			                    	}
			                  }]
		                };   
					   Ext.getCmp('inputs_fieldSet').add(field_container);         
					   shareAlgorithm_form.doLayout();                 
					                           
				   	 }// end of handler
	             },{
	                    xtype: 'fieldcontainer',
	                    //fieldLabel: 'Input',
	                    combineErrors: false,
	                    defaults: {
	                        hideLabel: true
	                    },
	                    items: [{
	                        xtype: 'displayfield',
	                        value: 'Name'
	                      },{
	                           width: 100,
							   xtype: 'textfield',
							   name:'inputName',
	                           allowBlank: false
	                      },{
	                          xtype: 'displayfield',
	                          value: 'Description'
	                      },{
	                           width: 100,
							   xtype: 'textfield', 
							   name:'inputDescription',
	                           allowBlank: false
	                    }]
             }]
          },
          {///
            xtype: 'fieldset',
            id:'parameters_fieldSet',
            title: 'Parameters',
			collapsible: true,
			autoScroll : true,
            width: 450,
            height: 100, 
			defaults: {   
                labelWidth: 70,
                //anchor: '100%',
                layout: {      
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
			items:[{
			       xtype: 'button',
				   text: 'Add Parameter',
				   margin: '0 0 0 300',                          
				   width: 100,
				   handler:function(){
					   var field_container = {
			                    xtype: 'fieldcontainer',
			                    combineErrors: false,
			                    items: [{
			                        xtype: 'displayfield',
			                        value: 'Name'
			                      },{
			                           width: 100,
									   xtype: 'textfield',
									   name:'parameterName',
			                           allowBlank: true
			                      },{
			                          xtype: 'displayfield',
			                          value: 'Description'
			                      },{
			                           width: 100,
									   xtype: 'textfield',
									   name:'parameterDescription',
			                           allowBlank: true
			                      },{
				                    	xtype:'button',
				                    	text:'delete input',
				                    	handler:function(){
				                    		 Ext.getCmp('parameters_fieldSet').remove(this.ownerCt);
				                    		 shareAlgorithm_form.doLayout(); 
				                    	}
				                  }]
			                };   
						   Ext.getCmp('parameters_fieldSet').add(field_container);         
						   shareAlgorithm_form.doLayout(); 
				   }
			   },{
                    xtype: 'fieldcontainer',
                    //fieldLabel: 'Parameter',
                    combineErrors: false,
                    defaults: {
                        hideLabel: true
                    },
                    items: [{
                           xtype: 'displayfield',
                           value: 'Name'
                       },{
                           width: 100,
						   xtype: 'textfield',
						   name:'parameterName',
                           allowBlank: true
                       },{
                           xtype: 'displayfield',
                           value: 'Description'
                       },{
                           width: 100,
						   xtype: 'textfield',
						   name:'parameterDescription',
                           allowBlank: true
                   }]
            }]
         },{///
            xtype: 'fieldset',
            title: 'Outputs',
            id:'outputs_fieldSet',
            autoScroll : true,
			collapsible: true,
            width: 450, 
            height: 100, 
            defaults: {   
                labelWidth: 70,
                layout: {      
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
			items:[{
			       xtype: 'button',
				   text: 'Add Output',
				   id:'',
				   margin: '0 0 0 300',                          
				   width: 80,
				   handler:function(){
					   var field_container = {
			                    xtype: 'fieldcontainer',
			                    combineErrors: false,
			                    items: [{
			                        xtype: 'displayfield',
			                        value: 'Name'
			                      },{
			                           width: 100,
									   xtype: 'textfield',
									   name:'outputName',
			                           allowBlank: false
			                      },{
			                          xtype: 'displayfield',
			                          value: 'Description'
			                      },{
			                           width: 100,
									   xtype: 'textfield', 
									   name:'outputDescription',
			                           allowBlank: false
			                      },{
				                    	xtype:'button',
				                    	text:'delete input',
				                    	handler:function(){
				                    		 Ext.getCmp('outputs_fieldSet').remove(this.ownerCt);
				                    		 shareAlgorithm_form.doLayout(); 
				                    	}
				                  }]
			                };   
						   Ext.getCmp('outputs_fieldSet').add(field_container);         
						   shareAlgorithm_form.doLayout();
				   }
			},{
                    xtype: 'fieldcontainer',
                    //fieldLabel: 'Output',     
                    combineErrors: false,
                    defaults: {
                        hideLabel: true
                    },
                    items: [{
                           xtype: 'displayfield',
                           value: 'Name'
                        },{
                           width: 100,
						   xtype: 'textfield',
						   name:'outputName',
                           allowBlank: false
                        },{
                            xtype: 'displayfield',
                            value: 'Description'
                         },{
                           width: 100,
						   xtype: 'textfield',
						   name:'outputDescription',
                           allowBlank: false
                  }]
          }]
    }]
});

var shareAlgorithm_win = Ext.create('Ext.window.Window', {
    title: 'Share your Algorithm',
    width: 500,
    height: 570,                                   
    minWidth: 300,
    minHeight: 200,
    closeAction:'hide',    
    items: shareAlgorithm_form,

    buttons: [{
        text: 'Submmit',
        handler:function(){
        	
        	var form = shareAlgorithm_form.getForm();
        	if(form.isValid()){
        		
        		var metaFile_value = Ext.getCmp('metaFile_id').getValue();
        		var extend_metaFile = metaFile_value.substring(metaFile_value.lastIndexOf('.') + 1)
        		extend_metaFile = extend_metaFile.toUpperCase();
        		
        		var wsdlFile_value = Ext.getCmp('wsdlFile_id').getValue();
        		var extend_wsdlFile = wsdlFile_value.substring(wsdlFile_value.lastIndexOf('.') + 1)
        		extend_wsdlFile = extend_wsdlFile.toUpperCase();
        		
        		if(extend_metaFile != "TXT" || extend_wsdlFile!= "WSDL"){
        			
        			alert("only support .txt and .wsdl file");
        			return;
        		}else{
        			
            		form.submit({                        

                		url:'shareAlgorithm.action',               
                        modal:false,  
                        success: function(fp, o) {   
                             alert("share algorithm success");     
                        }, 
                        failure:function(f,action){
                        	 alert("fail!");
                        }
        	        }); // end of submit
        	        
        		}// end of else              
        		
        	}
        }
    },{
        text: 'Cancel',
        handler:function(){   
        	
        	shareAlgorithm_form.form.reset();
        	shareAlgorithm_win.close();              
        	
        }
    }]
});