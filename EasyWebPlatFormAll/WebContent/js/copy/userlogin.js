/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
var UserRegister_Form = Ext.create('Ext.form.Panel', {
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
            fieldLabel: 'User Name',
            id: 'UserRegister_Form_username',
			selectOnFocus:true,        
            allowBlank:false
        },{
            fieldLabel: 'Password',
			inputType:'password',   
            id: 'UserRegister_Form_password',
			allowBlank:false
        },{
            fieldLabel: 'Confirm Password',
            inputType:'password',   
			id: 'UserRegister_Form_confirmpassword',
			allowBlank:false
        },{
            fieldLabel: 'Company/Organization',
            id: 'UserRegister_Form_organization',
			allowBlank:true  
        }/*, {
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email',        
			id:'UserRegister_email',
			allowBlank:false
        }*/]
});

var  UserRegister_Win= new Ext.Window( {
	 
	 title : 'User Register',
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
	 items : UserRegister_Form,
	 buttons: [{
		text: 'Save',
		handler : function(){       
		   var username = Ext.getCmp('UserRegister_Form_username').getValue();
		   var password = Ext.getCmp('UserRegister_Form_password').getValue();
		   var xmlUrl = "egcRegister.action?name=" + username + "&password=" + password;
		   var ajax = new Ajax();   
		   ajax.open("GET",xmlUrl,true);
		   ajax.onreadystatechange=function(){  
				if(ajax.readyState==4){
					if(ajax.status==200){                
						var tag=ajax.responseText.pJSON().tag;
						if(tag == "0"){
							alert("ÕË»§×¢²á³É¹¦£¡");
						}          
					}
				 }    
			};
			ajax.send(null);
		}
	 },{
		text: 'Cancel',
		handler : function(){
		
		}
	 }]

});

var UserLogin_Form  = new Ext.FormPanel({
	defaultType : 'textfield',
	bodyStyle:'padding:20px 5px 5px 5px',  
	 
    fieldDefaults: {
        labelAlign: 'right',
        msgTarget: 'none',
        invalidCls: '' //unset the invalidCls so individual fields do not get styled as invalid
    },
	height : 100,   
	frame : true,
	defaults : {
		allowBlank : false,
		autowidth : true,
		anchor: '90%'
	},  
	items : [ {
		xtype : 'textfield',
		fieldLabel : 'User Name',
		id:'username',
		name : 'username' 
		//blankText : 'User Name can not be empty!'

	},{
		xtype : 'textfield',
		fieldLabel : 'PassWord',
		name : 'password',
		id:'password',
		inputType : 'password'
		//blankText : 'Password can not be empty!'
	} ]
});

var UserLogin_Win = new Ext.Window( {
	
	title : 'UserLogin',
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
	items : UserLogin_Form,
	buttons : [{
		text : "Login",
		id : 'login',
		handler : function() {
		   var username = Ext.getCmp('username').getValue();
		   var password = Ext.getCmp('password').getValue();
		   if(username!=''&&password!=''){       
				var xmlUrl = "egcLogin.action?name=" + username + "&password=" + password;
				var ajax = new Ajax();   
				ajax.open("GET",xmlUrl,true);
				ajax.onreadystatechange=function(){  
					if(ajax.readyState==4){
				        if(ajax.status==200){                
				        	var tag=ajax.responseText.pJSON().tag;
				        	if(tag =="0"){
				     		   document.getElementById('userlogin_btn').style.display = "none";
				    		   document.getElementById('userlogout_btn').style.display = "block";
				    		   UserLogin_Win.hide(); 
				    		   document.getElementById("welcome_label").innerText="Welcome " + username + " To EGC!";
				    		   set_cookie("username", username);  
                               current_username = username;							   
				        	}else if(tag == "1"){
				        		alert("username is wrong!");
				        	}else if(tag =="2"){
				        		alert("password is wrong");
				        	}else if(tag =="3"){
							    alert("user has logined");
							}
				        }
				     }    
				};
				ajax.send(null);
				
		   }else{
			   alert("username or password can not be empty!");
		   }
		}
	},{
		text : "Reset",
		handler : function() {
			UserLogin_Form.getForm().reset();
		}
	}
	]
});