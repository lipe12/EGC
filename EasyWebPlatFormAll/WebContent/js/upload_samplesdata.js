/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
//var FileUpload_Form = null;
//var FileUpload_Win = null;
var addSamples  = null;    
CreateFileUpload_Win = function(store,type,format,semantic,top,down,left,right){
	              
	 var FileUpload_Form = null;
	 if(Ext.getCmp('FileUpload_Form')==undefined){
		 FileUpload_Form = new Ext.FormPanel({   
		     frame:true, 
		     id:'FileUpload_Form',
		     bodyStyle:'padding:20px 5px 5px 5px', 
	         tbar: [{ 
			    xtype: 'button', 
			    iconCls:'add',   
				text: 'Add Browse' ,
				handler:function(){
	        	   var filecontainer = {
	   					xtype: 'container',
						layout: 'hbox',
						items: [{
					    	 xtype: 'filefield', 
					    	 width: 230,             
					         name: 'samplefile',
					         fieldLabel: 'File',
					         labelWidth: 30,
					         msgTarget: 'side',
					         allowBlank: true,
					         anchor: '100%',
					         buttonText: 'Browse File'
						},{
						  xtype:'button',  
						  margins:'0 0 0 8',
						  text:'Delete File',
						  handler:function(){    
							if (FileUpload_Form.items.length > 10) {     
	                        	FileUpload_Form.remove(this.ownerCt);
	                        	FileUpload_Win.setHeight(FileUpload_Win.height - 30);
	                        	FileUpload_Form.doLayout();       
	                        }
						  }  
						}]
					};
	        	   FileUpload_Win.setHeight(FileUpload_Win.height + 30);                     
	        	   FileUpload_Form.insert(FileUpload_Form.items.length -1,filecontainer);  
	        	         
	            }
			 },'-'],
		     items:[{
		        	 xtype: 'hiddenfield',
		        	 id:'filenamelist',
		             name: 'filenamelist'       
		        },{
		        	xtype:'hiddenfield',
		        	id:'metaData_format',
		            name:'format'
		        },{
		        	xtype:'hiddenfield',
		        	id:'metaData_type',
		            name:'type'
		        },{
		        	xtype:'hiddenfield',
		        	id:'metaData_semantic',
		            name:'semantic'
		        },{
		        	xtype:'hiddenfield',
		        	id:'metaData_top',
		            name:'top'
		        },{
		        	xtype:'hiddenfield',
		        	id:'metaData_down',
		            name:'down'
		        },{
		        	xtype:'hiddenfield',
		        	id:'metaData_left',
		            name:'left'
		        },{
		        	xtype:'hiddenfield',
		        	id:'metaData_right',
		            name:'right'
		        },{
					xtype: 'container',
					layout: 'hbox',
					items: [{
				    	 xtype: 'filefield', 
				    	 width: 230,             
				         name: 'samplefile',
				         fieldLabel: 'File',
				         labelWidth: 30,
				         msgTarget: 'side',
				         allowBlank: true,
				         anchor: '100%',
				         buttonText: 'Browse File'
					},{
					  xtype:'button',  
					  margins:'0 0 0 8',
					  text:'Delete File',
					  handler:function(){        
						if (FileUpload_Form.items.length > 10) {     
                        	FileUpload_Form.remove(this.ownerCt);
                        	FileUpload_Win.setHeight(FileUpload_Win.height - 30);
                        	FileUpload_Form.doLayout();           
                        }
					  }
					}]
				},{ //end of container          
					 xtype:'component',
					 id:'fileupload_progress',
					 hidden: true,                                          
					 html:'UpLoading <img src="img/progress.gif" >'     
		        }],  
		     buttonAlign:'right',  
		     buttons:[{  
		            text:'Upload', 
		            id:'SampleDataUploadID'
		        },{  
		            text:'Cancel',  
		            handler:function(){  
		        		FileUpload_Win.hide();  
		            }  
		    }]  
		}); 
		 
		 Ext.getCmp('SampleDataUploadID').on('click',uploadFu = function(){
			 uploadFileFun();
	     });
	 }else{
		 FileUpload_Form = Ext.getCmp('FileUpload_Form');
		 Ext.getCmp('SampleDataUploadID').un('click',uploadFu );
    	 Ext.getCmp('SampleDataUploadID').on('click',uploadFu = function(){
    		 uploadFileFun();
    	 });
	 }
	 
	var uploadFileFun = function(){
        
		var form = FileUpload_Form.getForm();   
        if(form.isValid()){
	       	Ext.getCmp('metaData_format').setValue(format);
	       	Ext.getCmp('metaData_type').setValue(type);
	       	Ext.getCmp('metaData_semantic').setValue(semantic);
	       	Ext.getCmp('metaData_top').setValue(top);
	       	Ext.getCmp('metaData_down').setValue(down);
	       	Ext.getCmp('metaData_left').setValue(left);
	       	Ext.getCmp('metaData_right').setValue(right);
	       	
	       	var filenamelist='undefined';
	   	    var filepath='';
	   	    var filename='';   
		        for(var i =0; i<FileUpload_Form.items.length; i++){
		        	var item = FileUpload_Form.items.getAt(i);
		        	if(item.xtype=="container"){
		        		filepath = item.items.getAt(0).getValue();
		        		var pos = filepath.lastIndexOf("\\")*1;  
		        		filename = filepath.substring(pos+1);   
		        		filenamelist = filenamelist + "#" + filename;
		        	}
		        }
		        filenamelist = filenamelist.replace("undefined#",""); 
		        Ext.getCmp('filenamelist').setValue(filenamelist);
                			
	                    
	            form.submit({             
	                url: 'smaplefile_upload.action',           
	                modal:false,  
	                success: function(fp, o) {
						Ext.getCmp('fileupload_progress').setVisible(false); 
						if(o.result.tag == 0){   
							 
						     drawSamples(o.result.fileName,o.result.samplefields,o.result.samplerows);
							           
							 alert("upload file success!");
							 store.load({params:{semantic:semantic,top:top,down:down,left:left,right:right }});  
						}     
	                }, failure:function(f,action){             
						 Ext.getCmp('fileupload_progress').setVisible(false);
						 alert("upload file fail!");                
	                }
	            });     
	            Ext.getCmp('fileupload_progress').setVisible(true);
                      
        }//end of form.isValid()
	};
	

	
    var FileUpload_Win = null;
    if(Ext.getCmp('FileUpload_Win')==undefined){
    	FileUpload_Win=new Ext.Window({  
    	    title:'Upload File',  
    	    id:'FileUpload_Win',
    	    width:350,  
    	    iconCls:'upload',   
    	    height:170,           
    	    layout:'fit',  
    	    autoDestory:true,  
    	    collapsible : true, 
    	    modal:false,          
    	    closeAction:'hide',  
    	    items:[  
    	        FileUpload_Form  
    	    ]  
    	}); 
    }else{
    	FileUpload_Win = Ext.getCmp('FileUpload_Win');
    }
    return FileUpload_Win;
};

		



