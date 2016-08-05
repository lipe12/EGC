/**
 * 数据管理tab
 */
var DataManagePanel = function()
{

    //data
    /*var ds = Ext.create('Ext.data.Store',
    {
        storeId: 'simpsonsStore',
        fields: ['name', 'email', 'phone'],
        //local test data
        data:
        {
            'items': [
            {
                'name': 'Lisa',
                "email": "lisa@simpsons.com",
                "phone": "555-111-1224"
            },
            {
                'name': 'Bart',
                "email": "bart@simpsons.com",
                "phone": "555-222-1234"
            },
            {
                'name': 'Homer',
                "email": "home@simpsons.com",
                "phone": "555-222-1244"
            },
            {
                'name': 'Marge',
                "email": "marge@simpsons.com",
                "phone": "555-222-1254"
            }]
        },
        proxy:
        {
            type: 'memory',
            reader:
            {
                type: 'json',
                root: 'items'
            }
        }
    });
*/
Ext.Loader.setConfig({enabled: true});
Ext.define("DeptModel", {
    extend: "Ext.data.TreeModel",
    fields: [
        "DeptName", "Leader"
    ]
});
var newstore = Ext.create("Ext.data.TreeStore", {
    model: "DeptModel",
    root: {
        expanded: true,
        DeptName: "总公司",
        Leader: "Lin",
        children: [
            { DeptName: "技术部", Leader: "Xia", leaf: true },
            { DeptName: "财务部", Leader: "Li", leaf: true }
        ]
    }
});
    var tb = Ext.create('Ext.Toolbar',
    {
        items: [
        {
            id: 'add',
            text: 'new',
            iconCls: "add"
        }, '-',
        {
            id: 'edit',
            text: 'edit',
            iconCls: "edit"
        }]
    });
    var treetb = Ext.create('Ext.Toolbar',
    {
        items: [
        {
            id: 'add-tree',
            text: 'new',
            iconCls: "add"
        }, '-',
        {
            id: 'search-tree',
            text: 'search',
            xtype:'textarea',
            width:100,
            iconCls: "search"
        }]
    });

    /**
     * data-grid-panel
     */
    var data_manager_grid = Ext.create('Ext.grid.Panel',
    {
        id: 'data_manager_grid',
        title: 'data-panel',
        tbar: tb,
        store: store,
        region: 'center',
        selModel:
        {
            injectCheckbox: 0,
            mode: "MULTI", //"SINGLE"/"SIMPLE"/"MULTI"
            checkOnly: true //设置只能通过checkbox选择
        },
        selType: "checkboxmodel",
        columns: [
        {
            text: 'dataSetName',
            dataIndex: 'name',
            editor:
            {
                xtype: 'textfield'
            }

        },
        {
            text: 'upLoader',
            dataIndex: 'email',
            editor:
            {
                xtype: 'textfield'
            }
        },
        {
            text: 'authority',
            dataIndex: 'phone',
            editor:
            {
                xtype: 'textfield'
            }
        }]
    });

    var store = Ext.create('Ext.data.TreeStore',
    {
        root:
        {
            expanded: true,
            children: [
            {
                text: "public datasets",
                leaf: false,
                expanded: true,
                children: [
                {
                    text: "pub 1",
                    leaf: true
                },
                {
                    text: "pub 2",
                    leaf: true
                }]
            },
            {
                text: "group datasets",
                expanded: true,
                children: [
                {
                    text: "book report",
                    leaf: true
                },
                {
                    text: "alegrbra",
                    leaf: true
                }]
            },
            {
                text: "personal datasets",
                expanded: true,
                children: [
                {
                    text: "book report",
                    leaf: true,
                    iconCls:'icon-remove'
                },
                {
                    text: "alegrbra",
                    leaf: true
                }]
            },
            {
                text: "projects",
                expanded: true,
                children: [
                {
                    text: "anhui",
                    leaf: false,
                    children:[{
                    	text:'dem',
                    	leaf:true
                    },
                    {
                    	text:'soil',
                    	leaf:true
                    }
                    ]
                },
                {
                    text: "alegrbra",
                    leaf: true
                }]
            }]
        }
    });

    var treePanel = Ext.create('Ext.tree.Panel',
    {
        title: 'Simple Tree',
        width: 200,
        // height: 150,
        region:'west',
        margins: '5 0 0 5',
        store: store,
        layout: 'fit',
        rootVisible: false,
        tbar:treetb
    });


    /**
     * data-panel
     */
    var dataPanel = Ext.create('Ext.panel.Panel',
    {
        width: 500,
        height: 300,
        title: 'Border Layout',
        layout: 'border',
        items: [treePanel ,
        {
            //title: 'Center Region',
            region: 'center', // center region is required, no width/height specified
            xtype: 'panel',
            layout: 'border',
            margins: '5 5 0 0',
            items: [data_manager_grid,
{
            xtype: "treepanel",
            itemId: "tree",
            width: 600,
            height: 500,
            store: newstore,
            columns: [
                {
                    xtype: 'treecolumn',
                    text: '部门',
                    dataIndex: "DeptName",
                    flex: 1,
                    sortable: false
                },
                {
                    text: "领导",
                    dataIndex: "Leader",
                    flex: 1,
                    sortable: false
                }
            ]
        }
           /* ,
            {
                title: 'Map Preview Region ',
                region: 'south', // position for region
                xtype: 'panel',
                height: 400,
                split: true, // enable resizing
                margins: '0 5 5 5'
            }*/
            ]
        }]
    });
    return {
        data_panel: dataPanel
    }
}();
