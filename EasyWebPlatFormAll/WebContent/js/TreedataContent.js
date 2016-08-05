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

Ext.define("myTreeModel", {
    extend: "Ext.data.Model",
    fields: ['text','id','leaf' ,'children']
        // fields: [{ name: 'array', type: 'array' }]
});

var treeStore = new Ext.data.TreeStore({
    model: 'myTreeModel',
    autoLoad: true,
    root: {
        id: 'data',
        text: 'project dataset',
        expanded: true
    },
    proxy: {
        type: 'ajax',
        url: 'treecontent.action' 
    },
    // reader: {
    //     type: 'json',
    //     root: 'array'
    // },
    sorters: [{
            property: 'leaf',
            direction: 'ASC'
        }, {
            property: 'text',
            direction: 'ASC'
        }]
        //      listeners: {'beforeexpand': function(node, eOpts){
        //          this.proxy.extraParams.root = node.row.ids;
        //      }}
});

var treePanel = new Ext.tree.TreePanel({
    title: 'Data management',
    id: 'dataTree',
    width: 500,
    height: 300,
    //      renderTo: Ext.getBody(), 
    useArrows: true,
    rootVisible: true,
    store: treeStore
});
