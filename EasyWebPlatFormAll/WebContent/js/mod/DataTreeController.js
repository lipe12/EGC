/**
 * [DataTreeController]
 * @param {[type]} me ['this']
 */
var DataTreeController = function()
{
    
    //tree action column handler
    var actionColumnHandler = function(gridView, rowIndex, colIndex, column, e, record)
    {
        var text = record.data.text;
        if (text != "personal data")
            return;
        Ext.Msg.prompt('Add dataset', 'Please enter your name:', function(btn, text)
        {
            if (btn == 'ok')
            {
                // process text value and close...
            }
        });
    };

    var addNewProject = function()
    {
        console.log('addNewProject');
        //获得用户选择的节点
        var selectedNode = treePanel.getSelectionModel().getSelectedNode();
        //var selectedNode = treePanel.getSelectionModel().getSelectedNodes();//复选节点
        //如果用户没有选择任何节点，那么表示用户希望从projects根节点开始加入节点,起始节点就是treePanel.root.
        //当用户选择某节点时，代表用户希望从该节点开始，并将新点作为被选择节点的子节点
        var startNode = selectedNode == null ? treePanel.root : selectedNode;

        if (treePanel.treeEditor == null)
        {
            //确定起始节点后，必须将TreeEditore指定给TreePanel。TreeEditor是用来编辑节点的编辑器
            treePanel.treeEditor = new Ext.tree.TreeEditor(treePanel,
            {
                allowBlank: false, //不能为空
                cancelOnEsc: true, //按下Esc键可跳出输入模式
                completeOnEnter: true, //按下Enter键表示输入完成
                selectOnFocus: true //当输入文本框获得焦点时选中文本框内的文本
            });
        }
        //为了让用户在插入节点时可以看见位于该节点下的所有子节点，可以调用expand()方法，并将插入动作放在expand()的回调函数中。
        //就是说，当起始节点展开后，就将空白节点插入
        startNode.expand(
            false, //如果设定为true，将会展开该节点的全部节点，宝货子节点的子节点
            true, //是否应用动画效果
            function()
            { //展开所有节点后调用的函数
                var nodeConfig = {
                    text: '',
                    leaf: true
                };
                //a()可以接收配置对象作为创建子节点的配置
                var newNode = startNode.a(nodeConfig);
                //newNode会将新的参考节点返回，此时应该将此参考节点指定给TreeEditor作为编辑目标对象
                treePanel.treeEditor.editNode = newNode;
                //明确指定编辑目标对象的文本节点textNode给给TreeEditor
                treePanel.treeEditor.startEdit(newNode.ui.textNode);
            },
            this //回调函数执行时的作用域
        );
    };

    var onEditClick = function()
    {
        var selectedNode = treePanel.getSelectionModel().getSelectedNode();
        if (selectedNode == null)
        {
            showMsgBox('请选择节点', Ext.MessageBox.ERROR);
            return;
        }
        if (treePanel.treeEditor == null)
        {
            treePanel.treeEditor = new Ext.tree.TreeEditor(treePanel,
            {
                allowBlank: false,
                cancelOnEsc: true,
                completeOnEnter: true,
                selectOnFocus: true
            });
        }
        treePanel.treeEditor.editNode = selectedNode;
        treePanel.treeEditor.startEdit(selectedNode.ui.textNode);
    };


    var onDelClick = function()
    {
        var selectedNode = treePanel.getSelectionModel().getSelectedNode();
        if (selectedNode == null)
        { //没有任何节点被选择
            showMsgBox('请选择节点', Ext.MessageBox.ERROR);
            return;
        }
        Ext.MessageBox.confirm("删除节点", "您确定要删除" + selectedNode.text + "节点吗？",
            function(btn)
            {
                if (btn == 'yes')
                {
                    var parent = selectedNode.parentNode;
                    //获得祖父节点
                    var orgParent = parent.parentNode;
                    //删除被选择的节点
                    parent.removeChild(selectedNode);
                    if (orgParent != null)
                    {
                        //更新父节点
                        var nodeConfig = {
                            text: parent.text,
                            leaf: parent.childNodes == null ? true : false,
                            children: parent.childNodes,
                            expanded: true
                        };
                        orgParent.removeChild(parent);
                        //removeChild()必须通过selectNode的父类来删除selectedNode，而remove()是让selectedNode自己删除自己
                        orgParent.a(nodeConfig);
                        if (orgParent.text != 'ROOT')
                        {
                            orgParent.expand(true, false);
                        }
                    }
                }
            }, this);
    };
//tree contextmenu
    var contextmenu = new Ext.menu.Menu(
    {
        items: [
        {
            iconCls: 'Add',
            text: 'New'
        },
        {
            iconCls: 'Edit',
            text: 'Edit'
        },
        {
            iconCls: 'Delete',
            text: 'Delete'
        }],
        listeners:
        {
            click: function(item,e,opt)
            {
                console.log(item);
                console.log('e:');
                console.log(e);
                console.log(opt);
                var nodeDataDel = e.parentMenu.contextNode.attributes;
                var parentNodeData = e.parentMenu.contextNode.parentNode;
                //var nodeData = orgPanel.getSelectionModel().getSelectedNode();
                switch (e.iconCls)
                {
                    case 'Add':
                        this.addNewProject;
                        break;
                    case 'Edit':
                        updateFun(nodeDataDel, parentNodeData);
                        break;
                    case 'delete':
                        deleteFun(nodeDataDel.id, nodeDataDel.children.length == 0 ? true : false);
                        break;
                }
                item.parentMenu.hide();
            }
        }
    });
    return {
        contextmenu: contextmenu,
        actionColumnHandler: actionColumnHandler
    }
}();
