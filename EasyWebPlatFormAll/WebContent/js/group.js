/**
* the function of this js file is for user to define a group or join a group
* tag = 0:username and password are right
* tag = 1:the input group name do not exist when join the a group, while means the group is already exist when create a group
* tag = 2:requestcode is wrong
* tag = 3:group already
* author:liangp
* 2016-06-05
*/



//===================================================================
//use Ext create the formPanal parts of Group_Form
//===================================================================
var Group_Form = Ext.create('Ext.form.Panel', {
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        width: 390,
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 120  
        },
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [{

            xtype: 'radiogroup',
            id: 'group',
            fieldLabel : 'operation',
            autoHeight: true,
            defaults:{flex: 1},
            items:[
                   {boxLabel: 'Create', name: 'group', inputValue: '1', checked: true},
                   { boxLabel: 'Join', name: 'group', inputValue: '2' }
                   ]
                },{
            fieldLabel: 'GroupName',
            xtype:'textfield',
            id: 'group_Form_Name',
			allowBlank:true  
        },{
            fieldLabel: 'RequestCode',
            xtype:'textfield',
            id: 'group_Form_RequestCode',
			allowBlank:true  
        }]
});
//===================================================================
//put the Group_Form into a window, define the function of button
//ajax method call the GroupOperation.java 
//===================================================================
var  group_Win= new Ext.Window( {
	 
	 title : 'group',
	 width : 400,
	 iconCls:'userlogin',       
	 collapsible : true,
	 closable : true,
	 resizable : false,
	 shadow : true,
	 shadowOffset : 10,
	 closeAction:'hide' ,
	 defaults : {
 		border : false
	 },
	 buttonAlign : 'center',
	 items : Group_Form,
	 buttons: [{
		text: 'Save',
		handler : function(){       
		   var groupname = Ext.getCmp('group_Form_Name').getValue();
		   var groupcode = Ext.getCmp('group_Form_RequestCode').getValue();
		   var operation = Ext.getCmp('group').getChecked()[0].boxLabel;
		  
		   if(groupname =="" || groupcode =="")
		   {
			   Ext.MessageBox.alert('tip','Group Name or RequestCode can not be null');
			   return;
			}
			if(operation == "Create")
			{
			   var xmlUrl = "creategroup.action?groupName=" + groupname + "&groupCode=" + groupcode;
			   var ajax = new Ajax();   
			   ajax.open("GET",xmlUrl,true);
			   ajax.onreadystatechange=function(){  
				if(ajax.readyState==4){
					if(ajax.status==200){                
						var tag=ajax.responseText.pJSON().tag;
						if(tag == "0"){
							Ext.MessageBox.alert('tip','create group successfully');
						}
						 else if(tag == "1"){
						 	Ext.MessageBox.alert('tip','the group is already exist');
						 }         
					}
				 }    
			};
			ajax.send(null);
			}
			else
			{
				var xmlUrl = "joingroup.action?groupName=" + groupname + "&groupCode=" + groupcode;
			   var ajax = new Ajax();   
			   ajax.open("GET",xmlUrl,true);
			   ajax.onreadystatechange=function(){  
				if(ajax.readyState==4){
					if(ajax.status==200){                
						var tag=ajax.responseText.pJSON().tag;
						if(tag == "0"){
							Ext.MessageBox.alert('tip','join group successfully');
						}
						else if(tag == "1"){
							Ext.MessageBox.alert('tip','the input group is not exist');
						}
						else if(tag == "2"){
							Ext.MessageBox.alert('tip','the input RequestCode is not right');
						}          
					}
				 }    
			};
			ajax.send(null);
			}
		   
		}
	 },{
		text: 'Cancel',
		handler : function(){
		group_Win.hide();
		}
	 }]

});