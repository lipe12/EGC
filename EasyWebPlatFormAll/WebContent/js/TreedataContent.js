/**
 *upload data pannel 
 *version 2.0
 * */
 
/**
 * this js file is the view of tree data list
 */
 
 /**
  * fitst build the accordion form
  */


var treeModel = Ext.define("TreeModel", {
	extend : "Ext.data.Model",
//	fields : [{id: "id", type : "string"},
//			  {name : "text", type : "string"},
//			  {name : "leaf", type : "boolean"}]
	fields:[{name:'array',type:'array'}]
});


var store = new Ext.data.TreeStore({ 
        model: 'treeModel', 
        autoLoad:true ,
        root:{
        expanded: true},
        proxy: { 
            type: 'ajax',
            //api:{read:'listtreecontent.action'}
           // url: 'listtreecontent.action' 
            url:'listtreecontent.action'
        }, 
        reader: { 
	            type: 'json',
	            root: 'array' 
	        },
	     sorters:[{property: 'leaf',
                    direction: 'ASC'},
                    {property: 'text',
                    direction: 'ASC'}]
//	    listeners: {'beforeexpand': function(node, eOpts){
//	    	this.proxy.extraParams.root = node.row.ids;
//	    }}
    }); 

var treePanel = new Ext.tree.TreePanel({ 
        title: 'Data management', 
         
        width: 500, 
        height: 300, 
        renderTo: Ext.getBody(), 

        useArrows: true, 
        rootVisible: false, 
        
       
        store: store
    }); 
