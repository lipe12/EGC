/**
 *upload data pannel 
 *version 2.0
 */

/**
 * this js file is the view of tree data list
 */

Ext.QuickTips.init(); //init tooltips
Ext.define("myTreeModel",
{
    extend: "Ext.data.Model",
    fields: ['text', 'id', 'leaf', 'children', 'uploader', 'format']
});

var righttreeStore = new Ext.data.TreeStore(
{
    model: 'myTreeModel',
    autoLoad: true,
    root:
    {
        id: 'data',
        text: 'project dataset',
        expanded: true
    },
    proxy:
    {
        type: 'ajax',
        //url: 'treecontent.action'
        url:'projecttreecontent.action'
    }
});
//treepanel toolbar
var tbar = new Ext.Toolbar(
{
    buttonAlign: 'center',
    items: [
        {
            text: 'refresh',
            iconCls: 'Reload',
            handler: function()
            {
                righttreeStore.reload();
            }
        }
        /*{
            xtype: 'textfield',
            emptyText: 'search dataset...',
            id: 'filter_input',
            width: 200
        }, '-',
        {
            iconCls: 'Magnifier',
            id: 'filter_icon',
            handler: function(e)
            {
                var filterInput = Ext.get('filter_input');
                var text = filterInput.dom.value;
                //searchTables(treePanel, text);
            }
        }*/
    ]
});
var treePanel = new Ext.tree.TreePanel(
{
    title: 'Datasets',
    id: 'dataTree',
    width: 500,
    height: 300,
    useArrows: true,
    rootVisible: false,
    store: righttreeStore,
    tbar: tbar,
    columns: [
    {
        xtype: 'treecolumn',
        dataIndex: 'text',
        text: 'Project Datasets',
        flex: 1
    }],
    contextMenu: DataTreeController.contextmenu,
    listeners:
    {
        itemcontextmenu: function(menutree, record, items, index, e)
        {
            e.preventDefault();
            e.stopEvent();
            if (record.data.leaf)
            {
                //DTC_datasetName = record.data.text;
            	DTC_datasetName = Ext.getCmp("dataTree").getSelectionModel().selected.items[0].parentNode.data.text;
                DTC_dataName = record.data.text;
                DTC_uploader = record.data.uploader;
                DTC_format  = record.data.format;
                DataTreeController.contextmenu.showAt(e.getXY());
            }
        },
        beforeitemexpand: function( item, eOpts ) {
                var flag=true;
                if ( item.data.id == "Shared Data" ) {
                    Ext.Ajax.request( {
                        url: 'judgeshareduser.action',
                        async:false,
                        success: function( response, config ) {
                            var json = Ext.JSON.decode( response.responseText );
                            
//                            Ext.MessageBox.alert( "result", json.tag );
                            if(!json.tag){
                                flag= false;
                                Ext.MessageBox.alert( "Message", "You have no access to use shared data before you shared any data." );
                            }
                        },
                        failure: function() {
                            Ext.MessageBox.alert( "Message", "You have no access to use shared data before you shared any data." );
                        },
                        method: "post"
                    } );
                }
                return flag;
            },
        checkchange:function(node, checked, eOpts){
            if(node.data.leaf){
            	DTC_datasetName = Ext.getCmp("dataTree").getSelectionModel().selected.items[0].parentNode.data.text;
                DTC_dataName = node.data.text;
                DTC_uploader = node.data.uploader;
                DTC_format  = node.data.format;
            	if(checked == true){
            		showEnvData();
            	}
            	else if(checked == false){
            		removeLayer();
            	}
            }
            else{
            	if(checked == true){
            		var childrenNum = node.childNodes.length;
                	DTC_datasetName = node.data.text;
                	for(var i = 0; i < childrenNum; i++){
                		var child = node.childNodes[i];
                		if(!child.data.checked){
                			child.set("checked", true);
                    		DTC_dataName = child.data.text;
                            DTC_uploader = child.data.uploader;
                            DTC_format  = child.data.format;
                    		showEnvData();
                		}
                		
                	}
            	}else if(checked == false){
            		var childrenNum = node.childNodes.length;
                	DTC_datasetName = node.data.text;
                	for(var i = 0; i < childrenNum; i++){
                		var child = node.childNodes[i];
                		if(child.data.checked){
                			child.set("checked", false);
                    		DTC_dataName = child.data.text;
                            DTC_uploader = child.data.uploader;
                            DTC_format  = child.data.format;
                            removeLayer();
                		}
                		
                	}
            	}
            	
            }
            
        	
        }
    }
});
