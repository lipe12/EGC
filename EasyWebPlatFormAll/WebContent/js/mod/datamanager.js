/**
 * 数据管理tab
 */
var DataManagePanel = function()
{


    Ext.Loader.setConfig(
    {
        enabled: true
    });
    Ext.define("DatasetsModel",
    {
        extend: "Ext.data.TreeModel",
        fields: ["text", "id", "leaf",  "children", "type", "semantic", "format"]
    });
    var treeStore = new Ext.data.TreeStore(
    {
        model: 'DatasetsModel',
        autoLoad: true,
        root:
        {
            id: 'data',
            text: 'datasets',
            expand: true
        },
        proxy:
        {
            type: 'ajax',
            url: 'treecontent.action'
        }
    });
    var tb = Ext.create('Ext.Toolbar',
    {
        items: [
            {
                id: 'add',
                text: 'new',
                iconCls: "Folderadd",
                tooltip: 'new dataset or project ',
                // only 'personal data' and 'projects' can add new datasets
                handler: function()
                {
                    var items = treeGrid.getSelectionModel().selected.items;
                    if (items.length == 0)
                    {
                        Ext.MessageBox.alert('message', 'You must select a treenode first!');
                    }
                    else
                    {
                        var item = items[0]; //single select
                        var itemId=item.data.id;
                        var pid = treeGrid.getSelectionModel().selected.map[itemId].parentNode.data.id;
                        var pei = pid.indexOf("Personal Data");
                         /Projects/.test(pid);//true to add dataset
                         /Projects/.test(itemId);//true to add project(not dataset)
                        console.log(pid);
                        if (itemId === "Personal Data"&& pid != "Projects") //p d
                        {
                            Ext.MessageBox.prompt('New Datasets', 'Please enter datasets\' name:', function(btn, text)
                            {
                                if (btn == 'ok')
                                {
                                    Ext.Ajax.request(
                                    {
                                        url: "createdatasets.action",
                                        success: function(response, config)
                                        {
                                            treeStore.reload();
                                            Ext.MessageBox.alert("result", response.responseText);
                                        },
                                        failure: function()
                                        {
                                            Ext.MessageBox.alert("result", "Create dataset folder failed.");
                                        },
                                        method: "post",
                                        params:
                                        {
                                            datasetname: text
                                        }
                                    });
                                }
                            });
                        }
                        else if (itemId === "Projects") //p
                        {
                            Ext.MessageBox.prompt('New Project', 'Please enter project\'s name:', function(btn, text)
                            {
                                if (btn == 'ok')
                                {
                                    Ext.Ajax.request(
                                    {
                                        url: "createproject.action",
                                        success: function(json)
                                        {
                                            treeStore.reload();
                                            console.log(json);
                                            Ext.MessageBox.alert("result", json);
                                        },
                                        failure: function()
                                        {
                                            Ext.MessageBox.alert("result", "Create dataset folder failed!");
                                        },
                                        method: "post",
                                        params:
                                        {
                                            projectName: text
                                        }
                                    });
                                }
                            });
                        }else{
                        	Ext.MessageBox.alert("info","Can not add dataset or project here");
                        }
                    }
                }
            }, '-',
            /*{
                id: 'edit',
                text: 'edit',
                iconCls: "Pencil",
                tooltip: 'edit your dataset'
            }, '-',*/
            {
                id: 'upload',
                text: 'upload',
                tooltip: 'upload data file to dataset',
                iconCls: 'Arrowjoin',
                handler: function()
                {
                    FileUpload_Win_User.show();
                }
            }, '-',
            {
                id: 'share',
                text: 'share',
                iconCls: 'Share',
                tooltip: 'share data to others',
                handler: function()
                {
                    var selected = treeGrid.getSelectionModel().selected.items;
                    if (selected.length == 0)
                    {
                        Ext.MessageBox.alert('message', 'You must select a treenode first!');
                    }
                    else
                    {
                        share(selected[0].data.text);
                    }
                }
            }, '-',
            {
                text: 'refresh',
                iconCls: 'Reload',
                handler: function()
                {
                    treeStore.reload();
                }
            }, '-',
            {
                text: 'delete',
                iconCls: 'Delete',
                handler: function()
                {
                    var selected = treeGrid.getSelectionModel().selected.items;
                    if (selected.length == 0)
                    {
                        Ext.MessageBox.alert('message', 'You must select a treenode first!');
                    }
                    else
                    {
                        Ext.MessageBox.show(
                        {
                            title: 'Delete Dataset?',
                            msg: 'Are you sure to delete this dataset?',
                            buttons: Ext.MessageBox.YESNOCANCEL,
                            icon: Ext.MessageBox.QUESTION,
                            modal: true,
                            fn: function callback(btn)
                            {
                                if (btn == "yes")
                                {
                                    Ext.Ajax.request(
                                    {
                                        url: "deleteDataSet.action",
                                        success: function(response, config)
                                        {
                                            Ext.MessageBox.alert("result", response.responseText);
                                            treeStore.reload();
                                        },
                                        failure: function()
                                        {
                                            Ext.MessageBox.alert("result", "Create dataset folder failed.");
                                        },
                                        method: "post",
                                        params:
                                        {
                                            dataSetName: selected[0].data.text
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        ]
    });

    var treeGrid = Ext.create('Ext.tree.Panel',
    {
        itemId: "tree",
        width: 600,
        height: 500,
        tbar: tb,
        rootVisible: false,
        region: 'center',
        contextMenu: gridmenu,
        listeners:
        {
            itemcontextmenu: function(menutree, record, items, index, e)
            {
                e.preventDefault();
                e.stopEvent();
                //console.log(record);
                gridmenu.showAt(e.getXY());
            }
        },
        store: treeStore, //newstore,
        columns: [
            {
                xtype: 'treecolumn',
                text: 'Dataset',
                dataIndex: "text",
                flex: 1,
                sortable: false
            },
            /*{
                text: "Uploader",
                dataIndex: "upLoader",
                flex: 1,
                sortable: false,
                checked: false
            },
            {
                text: "dataCategory",
                dataIndex: "dataCategory",
                flex: 1,
                sortable: false,
                checked: false
            },*/
            {
                text: "type",
                dataIndex: "type",
                flex: 1,
                sortable: true
            },
            {
                text: "semantic",
                dataIndex: "semantic",
                flex: 1,
                sortable: true
            },
            {
                text: "format",
                dataIndex: "format",
                flex: 1,
                sortable: true
            }
        ]
    });
    /**
     * data-panel
     */
    var dataPanel = Ext.create('Ext.panel.Panel',
    {
        width: 500,
        height: 300,
        title: 'Datasets Management',
        layout: 'border',
        id: 'data_manager_panel',
        items: [
        {
            region: 'center', // center region is required, no width/height specified
            xtype: 'panel',
            layout: 'border',
            margins: '5 5 0 0',
            items: [treeGrid
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


    /**
     * @param upLoader
     * @param dataSetName
     * this two parameters global variables record the content of the clicked row*/
    var upLoader = null;
    var dataSetName = null;
    var authority = null;
    var kmllayer = null;


    /**
     * this method is locate the dataset, show the scope in the map 
     * find the kml or shape file through the datasetname and uploader field
     * this progress will erase the precious kml or shape
     * */
    function displayKML1()
    {
        grid.getSelectionModel().deselectAll();
        var kmlPath = upLoader + '/' + dataSetName + '.kml';
        var xmlUrl = "findkmlextent1.action?datasetname=" + dataSetName + "&upLoader=" + upLoader;
        var ajax = new Ajax();
        ajax.open("GET", xmlUrl, true);
        ajax.send(null);
        ajax.onreadystatechange = function()
        {
            if (ajax.readyState == 4)
            {
                if (ajax.status == 200)
                {
                    var tag = ajax.responseText.pJSON().tag;
                    if (tag == true)
                    {
                        var north = ajax.responseText.pJSON().north;
                        var south = ajax.responseText.pJSON().south;
                        var west = ajax.responseText.pJSON().west;
                        var east = ajax.responseText.pJSON().east;
                        var wfs_indicators_tmp = [];
                        for (var i = wfs_indicators.length - 1; i >= 0; i--)
                        {
                            if (wfs_indicators[i].name != "myKML")
                            {
                                wfs_indicators_tmp.push(wfs_indicators[i]);
                            }
                        }
                        if (kmllayer != null)
                        {
                            map.removeControl(selectControl);
                            selectControl.destroy();
                            map.removeLayer(kmllayer);
                            kmllayer.destroy();
                        }
                        kmllayer = null;
                        kmllayer = new OpenLayers.Layer.Vector("myKML",
                        {
                            styleMap: new OpenLayers.StyleMap(
                            {
                                "default": new OpenLayers.Style(
                                {
                                    fillColor: "#ffcc66",
                                    strokeColor: "#ff9933",
                                    strokeWidth: 2,
                                    fillOpacity: 0.4,
                                    graphicZIndex: 1
                                }),
                                "select": new OpenLayers.Style(
                                {
                                    fillColor: "#6A6AFF",
                                    strokeColor: "#6A6AFF",
                                    fillOpacity: 0.4,
                                    graphicZIndex: 2
                                })
                            }),

                            strategies: [new OpenLayers.Strategy.Fixed()],
                            protocol: new OpenLayers.Protocol.HTTP(
                            {
                                url: "kml/" + kmlPath,
                                format: new OpenLayers.Format.KML(
                                {
                                    extractAttributes: true,
                                    maxDepth: 2
                                })
                            }),
                            projection: geographic
                        });

                        kmllayer.events.on(
                        {
                            "featureselected": function(e)
                            {
                                latlng1_temp = new OpenLayers.LonLat(west, south);
                                latlng2_temp = new OpenLayers.LonLat(east, north);

                                var feature = e.feature;
                                selectedFeature = feature;
                                AddPop(feature);
                            },
                            "featureunselected": function(e)
                            {
                                var feature = e.feature;
                                DeletePop(feature);
                            },
                            "loadend": function()
                            {
                                var center_kml = kmllayer.features[0].geometry.getBounds().getCenterLonLat();
                                map.panTo(center_kml);
                            }
                        });
                        map.addLayers([kmllayer]);

                        wfs_indicators = wfs_indicators_tmp;
                        wfs_indicators.push(kmllayer);
                        map.removeControl(selectControl);
                        selectControl = new OpenLayers.Control.SelectFeature(wfs_indicators);
                        map.addControl(selectControl);
                        selectControl.activate();
                    }
                    else
                    {
                        Ext.MessageBox.alert('tip', 'kml file does not exist');
                    }
                }
            }
        };
    }

    /**
      * the action of button named 'add dataset' 
     function onAddClick(){
            // Create a model instance
            var rec = new ListdataSet({
                dataSetname: 'New dataset',
                Uploader: '',
                dataCategory: ''
            });
            
            ListDataSetStore.insert(0, rec);
            this.cellEditing.startEditByPosition({
                row: 0, 
                column: 0
            });
        };
    */
    //=============================================================================================
    //create the right click menu
    //============================================================================================
    var showDatasAction = new Ext.create('Ext.Action',
    {
        text: 'show data',
        handler: showdata,
        iconCls: 'Table'
    });

    var locationAction = new Ext.create('Ext.Action',
    {
        text: 'location',
        handler: displayKML1,
        iconCls: 'Mapgo'
    });

    var deleteDataSetAction = new Ext.create('Ext.Action',
    {
        text: 'deleteDataSet',
        handler: deleteDataSet,
        iconCls: 'Delete'
    });

    var shareDataSetAction = new Ext.create('Ext.Action',
    {
        text: 'share',
        handler: share,
        iconCls: 'Share'
    });

    //var dataShareAction = new Ext.create('Ext.Action', {text:'location',handler:dataShare});
    var gridmenu = new Ext.menu.Menu(
    {
        id: 'gridmenu',
        items: [showDatasAction, deleteDataSetAction, locationAction, shareDataSetAction],
        //TODO:
        listeners:
        {
            beforeshow: function()
            {
                var xmlurl = "judgeshareduser.action";
                var ajax = new Ajax();
                ajax.open("GET", xmlurl, true);
                ajax.send(null);
                ajax.onreadystatechange = function()
                {
                    if (ajax.readyState == 4)
                    {
                        if (ajax.status == 200)
                        {
                            var tag = ajax.responseText.pJSON().tag;
                            if (tag == true)
                            {
                                Ext.getCmp("rightmenu").setDisabled(true);
                            }
                        }
                    }
                };
            }
        }
    });

    /**
     * @description delete the dataset from xml file and disk
     * @param dataSetName*/
    function deleteDataSet()
    {
        var xmlUrl = "deleteDataSet.action?dataSetName=" + dataSetName;
        var ajax = new Ajax();
        ajax.open("GET", xmlUrl, true);
        ajax.send(null);
        ajax.onreadystatechange = function()
        {
            //TODO:now it do not come in, but it delete the data .
            if (ajax.readyState == 4)
            {
                if (ajax.status == 200)
                {
                    var m = ajax.responseText;
                    var tag = ajax.responseText.pJSON().tag;
                    if (tag == 1)
                    {
                        Ext.MessageBox.alert('tip', 'delete dataset successfully');
                        ListDataSetStore.load();
                    }
                }
            }
        }
    };

    /**
     * make the dataset public
     * */
    function share(dataSetName)
    {
        var xmlurl = "sharedataset.action?dataSetName=" + dataSetName;
        var ajax = new Ajax();
        ajax.open("GET", xmlurl, true);
        ajax.send(null);
        ajax.onreadystatechange = function()
        {
            if (ajax.readyState == 4)
            {
                if (ajax.status == 200)
                {
                    var tag = ajax.responseText.pJSON().tag;
                    if (tag == 0)
                    {
                        Ext.MessageBox.alert("tip", "this data set had been shared");
                    }
                    else if (tag == 1)
                    {
                        Ext.MessageBox.alert("tip", "this data set is shared successfully");
                    }
                }
            }
        };
    };

    function judgeSharedUser()
    {
        var xmlurl = "judgeshareduser.action";
        var ajax = new Ajax();
        ajax.open("GET", xmlurl, true);
        ajax.send(null);
        ajax.onreadystatechange = function()
        {
            if (ajax.readyState == 4)
            {
                if (ajax.status == 200)
                {
                    var tag = ajax.responseText.pJSON().tag;
                    if (tag == true)
                    {
                        Ext.getCmp("rightmenu").setDisabled(true);
                    }
                }
            }
        };
    };
    //===================================================================================================
    //the create dataset window
    //===================================================================================================

    var createDataSet_Form = new Ext.FormPanel(
    {
        frame: true,
        bodyStyle: 'padding:20px 5px 5px 5px',
        items: [
        {
            xtype: 'textfield',
            fieldLabel: 'DataSetName',
            allowBlank: false,
            name: 'datasetname'
        }],

        buttons: [
        {
            text: 'Save',
            handler: function()
                {
                    if (createDataSet_Form.getForm().isValid())
                    {
                        var form = createDataSet_Form.getForm();
                        form.submit(
                        {
                            url: 'createdataset.action',
                            modal: false,
                            success: function(fp, o)
                            {
                                ListDataSetStore.load();
                                Ext.MessageBox.alert('msg', "create dataset sucessfully!");
                            },
                            failure: function(f, action)
                            {
                                Ext.MessageBox.alert('msg', "give a new data set name!");
                            }
                        });
                    }
                    else
                    {
                        Ext.MessageBox.alert('msg', "dataSet name  is null");
                    }
                } // end of handler
        }]
    });

    /**
     * create the dataset window*/
    var createSet_Win = new Ext.Window(
    {
        title: 'Create DataSet',
        collapsible: false,
        modal: false,
        closeAction: 'hide',
        items: createDataSet_Form
    });

    function createDataSetWinShow()
    {
        createSet_Win.show();
    }
    //====================================================================================
    //the window show the data in the right click dataset
    //====================================================================================

    function showdata()
    {
        ListDataStore.load();
        if (authority != "")
        {
            Ext.getCmp("AddData").setDisabled(true);
            Ext.getCmp("DeleteData").setDisabled(true);
            // Ext.getCmp("createboundary").setDisabled(true);
        }
        else
        {
            Ext.getCmp("AddData").setDisabled(false);
            Ext.getCmp("DeleteData").setDisabled(false);
            // Ext.getCmp("createboundary").setDisabled(false);
        }

        datafileshow_win.show();
    }

    function renderFileName(value)
    {
        var str = value;
        if (value.indexOf("/") > 0)
        {
            var pos = value.lastIndexOf("/") * 1;
            str = value.substring(pos + 1);
        }
        else if (value.indexOf("\\") > 0)
        {
            var pos = value.lastIndexOf("\\") * 1;
            str = value.substring(pos + 1);
        }
        return str;
    }
    /*var FileData_User1 = Ext.create('Ext.grid.Panel',
    {
        {
            xtype: 'button',
            text: 'createPublicBoundary',
            handler: function()
            {
                var xmlUrl = "createdatasetkml.action?dataSetName=" + dataSetName;
                var ajax = new Ajax();
                ajax.open("GET", xmlUrl, true);
                ajax.send(null);
                ajax.onreadystatechange = function()
                {
                    if (ajax.readyState == 4)
                        if (ajax.status == 200)
                        {
                            var tag = ajax.responseText.pJSON().tag;
                            if (tag == 1)
                            {
                                Ext.MessageBox.alert('msg',"create public boundary successfully");
                                ListDataStore.load();
                            }
                        }
                }
            }
        }
    });*/

    //=======================================================================
    //below is about the add data window
    //=======================================================================
    var namespace = "data_management";
    Ext.define('SemanticModel',
    {
        extend: 'Ext.data.Model',
        fields: [
        {
            type: 'string',
            name: 'name'
        },
        {
            type: 'string',
            name: 'value'
        }]
    });
    //the content in semantics combox
    var semantics = [
    {
        "name": "Sample Data",
        "value": "Sample Data"
    },
    {
        "name": "DEM",
        "value": "DEM"
    },
    {
        "name": "TWI",
        "value": "TWI"
    },
    {
        "name": "Plan Curvature",
        "value": "Plan Curvature"
    },
    {
        "name": "Profile Curvature",
        "value": "Profile Curvature"
    },
    {
        "name": "Slope Gradient",
        "value": "Slope Gradient"
    },
    {
        "name": "Temperature",
        "value": "Temperature"
    },
    {
        "name": "Parent Material",
        "value": "Parent Material"
    },
    {
        "name": "Precipitation",
        "value": "Precipitation"
    },
    {
        "name": "Evi",
        "value": "Evi"
    },
    {
        "name": "NDVI",
        "value": "NDVI"
    },
    {
        "name": "Ndwi",
        "value": "Ndwi"
    },
    {
        "name": "Palsar08hv",
        "value": "Palsar08hv"
    }];
    var semantic_store = Ext.create('Ext.data.Store',
    {
        model: 'SemanticModel',
        data: semantics
    });

    /**
     * define the semantic combox
     * the action whether select Sample Data or not
     * */
    var semantic_combo = Ext.create('Ext.form.field.ComboBox',
    {
        fieldLabel: 'Semantic',
        displayField: 'name',
        name: 'semantic',
        id: namespace + '_semantics',
        store: semantic_store,
        value: "Sample Data",
        queryMode: 'local',
        typeAhead: true,
        allowBlank: false,
        listeners:
        {
            "select": function()
            {
                document.getElementById('_html5_inputfile').value = '';
                document.getElementById('_inputfile_text').value = '';
                csvFields = [];
                csvFields_store.loadData(csvFields);
                csv_x_filed_combo.setRawValue('');
                csv_y_filed_combo.setRawValue('');

                var seman = semantic_combo.getValue();
                if (seman == "Sample Data")
                {
                    Ext.getCmp(namespace + '_datafile_csv').setDisabled(false);
                    Ext.getCmp(namespace + '_x_field').setDisabled(false);
                    Ext.getCmp(namespace + '_y_field').setDisabled(false);

                    Ext.getCmp(namespace + '_datafile').setDisabled(true);
                }
                else
                {
                    Ext.getCmp(namespace + '_datafile_csv').setDisabled(true);
                    Ext.getCmp(namespace + '_x_field').setDisabled(true);
                    Ext.getCmp(namespace + '_y_field').setDisabled(true);
                    Ext.getCmp(namespace + '_datafile').setDisabled(false);
                }
            }
        }
    });
    var final_csv = "";
    var csv_firstline = "";
    var html5read = function(e)
    {
        var extend = e.value.substring(e.value.lastIndexOf('.') + 1);
        extend = extend.toUpperCase();
        var fileInput = document.getElementById('_html5_inputfile');
        var file = fileInput.files[0];
        if (extend === "CSV")
        {
            var reader = new FileReader();
            reader.onload = function(e)
            {
                var result = reader.result;
                result = result.replace(/\r?\n/g, "\r\n"); // replace \n with \r\n 
                result = result.replace(/(^\s*)|(\s*$)/g, "");
                var strs = result.split("\r\n");
                if (strs.length > 1)
                {
                    csv_firstline = strs[0];
                    var heads = csv_firstline.split(",");
                    var len = heads.length;
                    csvFields = [];

                    for (var i = 0; i < len; i++)
                    {
                        var head = heads[i];
                        var item = [head, head];
                        csvFields.push(item);
                    }
                    csvFields_store.loadData(csvFields);

                    for (var i = 1; i < strs.length; i++)
                    {
                        final_csv = final_csv + strs[i] + "\r\n";
                    }
                    //alert(final_csv);
                    //Ext.getCmp(namespace + 'datafile_csvStr').setValue(final_csv);
                }
                else
                {
                    Ext.MessageBox.alert('message', "CSV file has no data");
                    Ext.getCmp(namespace + '_datafile_csvStr').setValue("");
                }
            };
            reader.readAsText(file);
            document.getElementById('_inputfile_text').value = e.value;

        }
        else
        {
            Ext.MessageBox.alert('message', "only support .CSV");
        }

    };

    /**
     * define and load datasample data fields, 
     * deiine coordinate X,Y combox
     * */
    Ext.define('CSVFieldsModel',
    {
        extend: 'Ext.data.Model',
        fields: [
        {
            type: 'string',
            name: 'name'
        },
        {
            type: 'string',
            name: 'value'
        }]
    });

    var csvFields = []; //fields
    var csvFields_store = Ext.create('Ext.data.Store',
    {
        model: 'CSVFieldsModel',
        data: csvFields
    });

    var csv_x_filed_combo = Ext.create('Ext.form.field.ComboBox',
    {
        fieldLabel: 'X Field',
        id: namespace + '_x_fields',
        displayField: 'name',
        name: 'x_field',
        store: csvFields_store,
        value: "",
        queryMode: 'local',
        typeAhead: true,
        hidden: false,
        disabled: false,
        allowBlank: false
    });

    var csv_y_filed_combo = Ext.create('Ext.form.field.ComboBox',
    {
        fieldLabel: 'Y Field',
        id: namespace + '_y_fields',
        displayField: 'name',
        name: 'y_field',
        store: csvFields_store,
        value: "",
        queryMode: 'local',
        typeAhead: true,
        hidden: false,
        disabled: false,
        allowBlank: false
    });

    /**
     * define the window for upload the user`s data
     * the  widget named filePostfix is a hidden widget that save the file format
     * */
    var FileUpload_Form_User = new Ext.FormPanel(
    {
        frame: true,
        width: 500,
        id: 'FileUpload',
        bodyStyle: 'padding:20px 5px 5px 5px',
        items: [
            {
                xtype: 'hiddenfield',
                name: 'dataSetName',
                value: '',
                id: namespace + '_dataSetName'
            },
            {
                xtype: 'textfield',
                name: 'dataName',
                id: namespace + '_dataName',
                fieldLabel: 'DataName',
                allowBlank: false
            },
            semantic_combo,
            {
                xtype: 'hiddenfield',
                name: 'datafile_csvStr',
                value: '',
                id: namespace + '_datafile_csvStr'
            },
            {
                xtype: 'component',
                id: namespace + '_datafile_csv',
                hidden: false,
                disabled: false,
                html: '<div class="file-box">' +
                    '<label>DataFile(.csv):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>' +
                    '<input type="text" name="textfield" readonly="true" id="_inputfile_text" class="txt" />' +
                    '<label>&nbsp;</label>' +
                    '<input type="button" class="btn" value="Browse Data" class="input" style="width:100px" />' +
                    '<input type="file" onchange="html5read(this)" class="file" id="_html5_inputfile" size="28" />' +
                    '</div>'

            },
            csv_x_filed_combo,
            csv_y_filed_combo,
            {
                xtype: 'hiddenfield',
                name: 'filePostfix',
                id: namespace + '_filePostfix'
            },
            {
                xtype: 'filefield',
                emptyText: 'Select data file',
                fieldLabel: 'DataFile',
                name: 'datafile',
                id: namespace + '_datafile',
                width: 300,
                //allowBlank: false,
                hidden: false,
                disabled: true,
                buttonText: 'Browse data'
            },
            {
                xytpe: 'component',
                height: 3,
                width: 0
            },
            {
                xtype: 'component',
                hidden: false,
                html: '|'
            },
            {
                xtype: 'component',
                id: 'uploadMark',
                hidden: true,
                html: 'Data are uploading,please wait .....'
            }
        ],

        buttons: [
        {
            text: 'Save',
            handler: function()
            {
                var filePostfix = null;
                var semantic = Ext.getCmp(namespace + '_semantic').getValue();
                if (semantic == "Sample Data")
                {
                    Ext.getCmp(namespace + '_datafile').setRawValue('');
                    filePostfix = "csv";
                    //////
                    var x_filed = csv_x_filed_combo.getValue();
                    var y_filed = csv_y_filed_combo.getValue();
                    if (x_filed == "" || y_filed == "")
                    {
                        Ext.MessageBox.alert('msg', "X Field and Y Field cannot be empty");
                        return;
                    }
                    if (csv_firstline == "" || final_csv == "")
                    {
                        Ext.MessageBox.alert('msg', "CSV File cannot be empty");
                        return;
                    }
                    csv_firstline = csv_firstline.replace(x_filed, "X");
                    csv_firstline = csv_firstline.replace(y_filed, "Y");
                    Ext.getCmp(namespace + '_datafile_csvStr').setValue(csv_firstline + "\r\n" + final_csv);
                    //alert(Ext.getCmp(namespace + 'datafile_csvStr').getValue());
                    ///////
                }
                else
                {
                    //Ext.getCmp(namespace + 'datafile_csv').setRawValue('');
                    var asc_value = Ext.getCmp(namespace + '_datafile').getValue();
                    var extend_asc = asc_value.substring(asc_value.lastIndexOf('.') + 1);
                    extend_asc = extend_asc.toUpperCase();

                    if (extend_asc != "TIF")
                    {
                        Ext.MessageBox.alert('msg', ".tif files are required");
                        return;
                    }
                    filePostfix = "tif";
                }
                if (filePostfix != "csv" && filePostfix != "tif")
                {
                    Ext.MessageBox.alert('msg', "only  surpport csv, tif format!");
                    return;
                }

                Ext.getCmp(namespace + 'filePostfix').setValue(filePostfix);

                var postfix = Ext.getCmp(namespace + '_filePostfix').getValue();
                //var dataset = Ext.getCmp(namespace + 'dataSetName').getValue();

                var dataname = Ext.getCmp(namespace + '_dataName').getValue();
                Ext.getCmp(namespace + '_dataSetName').setValue(dataSetName);
                if (postfix == "" || semantic == "" || dataname == "")
                {
                    Ext.MessageBox.alert('msg', "all the input can not be empty!");
                    return;
                }

                if (Ext.getCmp(namespace + '_datafile').getValue() == "" && Ext.getCmp(namespace + 'datafile_csvStr').getValue() == "")
                {
                    Ext.MessageBox.alert('msg', "please select data to unload");
                    return;
                }

                Ext.getCmp("uploadMark").getEl().show();
                var form = FileUpload_Form_User.getForm();
                form.submit(
                {
                    //url: 'uploadData.action',
                    url: 'uploadDataNew.action',
                    modal: false,
                    success: function(fp, o)
                    {
                        Ext.MessageBox.alert('msg', "upload file success!");
                        Ext.getCmp('_List_FileData').getStore().load();
                        Ext.getCmp("uploadMark").getEl().hide();
                    },
                    failure: function(f, action)
                    {
                        Ext.MessageBox.alert('msg', "upload file fail!");
                        Ext.getCmp("uploadMark").getEl().hide();
                    }
                });

            }
        },
        {
            text: 'Reset',
            handler: function()
            {
                FileUpload_Form_User.getForm().reset();
            }
        }]
    });

    var FileUpload_Win_User = new Ext.Window(
    {
        title: 'Upload Data',
        id: 'fileUpload_Win',
        iconCls: 'upload',
        //layout:'fit',  
        autoDestory: true,
        collapsible: false,
        modal: false,
        closeAction: 'hide',
        items: [
            FileUpload_Form_User
        ]
    });

    return {
        data_panel: dataPanel
    }
}();
