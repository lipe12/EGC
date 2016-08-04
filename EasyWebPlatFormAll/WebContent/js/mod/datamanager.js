/**
 * 数据管理tab
 */
//data
var ds=Ext.create('Ext.data.Store', {
    storeId:'simpsonsStore',
    fields:['name', 'email', 'phone'],
   //local test data
    data:{'items':[
        { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
        { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
        { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
        { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});

var tb = Ext.create('Ext.Toolbar',{
	items:[
	   {
		   id:'add',text:'new',iconCls:"add"
	   },'-',{
		   id:'edit',text:'edit',iconCls:"edit"
	   }
	]
});
/**
 * data-panel
 */
var data_panel=Ext.create({
	title: 'Model',
	id: 'easyModel', 
	xtype:'panel',         
	layout:'border',
	items:[{
		region"center"
	}]
});
/**
 * data-grid-panel
 */
var data_manager_grid=Ext.create('Ext.grid.Panel',{
	id:'data_manager_grid',
	title:'data-panel',
	tbar:tb,
	store:ds,
	selModel: {
        injectCheckbox: 0,
        mode: "MULTI",     //"SINGLE"/"SIMPLE"/"MULTI"
        checkOnly: true     //设置只能通过checkbox选择
    },
	selType: "checkboxmodel",
	columns: [ 
	          { text: 'dataSetName',  dataIndex: 'name',editor: {xtype: 'textfield'}
	          
	  	     },
	          { text: 'upLoader', dataIndex: 'email', editor: {xtype: 'textfield'}},
	          { text: 'authority', dataIndex: 'phone',editor: {xtype: 'textfield'}}
	      ]
});
var data_manager_grid2=Ext.create('Ext.grid.Panel',{
	id:'data_manager_grid2',
	title:'data-panel',
	tbar:tb,
	store:ds,
	selModel: {
        injectCheckbox: 0,
        mode: "MULTI",     //"SINGLE"/"SIMPLE"/"MULTI"
        checkOnly: true     //设置只能通过checkbox选择
    },
	selType: "checkboxmodel",
	columns: [ 
	          { text: 'dataSetName',  dataIndex: 'name',editor: {xtype: 'textfield'}
	          
	  	     },
	          { text: 'upLoader', dataIndex: 'email', editor: {xtype: 'textfield'}},
	          { text: 'authority', dataIndex: 'phone',editor: {xtype: 'textfield'}}
	      ]
});