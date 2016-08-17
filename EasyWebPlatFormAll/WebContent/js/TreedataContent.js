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
    fields: ['text', 'id', 'leaf', 'children']
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
        url: 'treecontent.action'
    }
});
//treepanel toolbar
var tbar = new Ext.Toolbar(
{
    buttonAlign: 'center',
    items: [
    {
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
    }]
});
var treePanel = new Ext.tree.TreePanel(
{
    title: 'Data management',
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
        flex: 1
    },
    {
        xtype: 'actioncolumn',
        width: 30,
        tooltip: 'new',
        handler: DataTreeController.actionColumnHandler,
        //An Array which may contain multiple icon definitions
        items: [
        {
            getTip: function(v, meta, rec)
            {
                if (rec.get('text') == 'personal data')
                    return 'add new dataset';
            },
            //A function which returns the CSS class to apply to the icon image.
            getClass: function(v, meta, rec)
            {
                if (rec.get('text') == 'personal data')
                    return 'Add';
                else
                    return 'x-hidden';
            },
            handler: function(grid, rowIndex, colIndex)
            {
                //A function called when the icon is clicked.               
            }
        }]
    }],
    contextMenu: DataTreeController.contextmenu,
    listeners:
    {
        itemcontextmenu: function(menutree, record, items, index, e)
        {
            e.preventDefault();
            e.stopEvent();
            DataTreeController.contextmenu.showAt(e.getXY());
        }
    }
});

// treepanel 模糊查询 ，展开树型结构，选中匹配项  
function searchTables(tree, value)
{
    tree.forEach(function(e)
    {
        var content = e.raw.text;
        var re = new RegExp(Ext.escapeRe(value), 'i');
        if (re.test(content) || re.test(content.toUpperCase()))
        {
            e.parentNode.expand();
            var tabllepanel = Ext.ComponentQuery.query('auditruleview treepanel[name=dataTables]')[0];
            var selModel = tabllepanel.getSelectionModel();
            selModel.select(e, true);
            if (!e.isLeaf())
            {
                e.expand();
            }
        }
        searchTables(e.childNodes, value);
    });
}
