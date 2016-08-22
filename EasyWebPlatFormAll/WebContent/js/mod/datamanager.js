/**
 * 数据管理tab
 */
var DataManagePanel = function() {
	Ext.Loader.setConfig( {
		enabled: true
	} );
	Ext.define( "DatasetsModel", {
		extend: "Ext.data.TreeModel",
		fields: [ "text", "id", "leaf", "children", "type", "semantic", "format", 'uploader' ]
	} );
	var treeStore = new Ext.data.TreeStore( {
		model: 'DatasetsModel',
		autoLoad: true,
		root: {
			id: 'data',
			text: 'datasets',
			expanded: true
		},
		proxy: {
			type: 'ajax',
			url: 'treecontent.action'
		}
	} );
	var getSelectedItemId = function() {
		var items = treeGrid.getSelectionModel().selected.items;
		if ( items.length == 0 ) {
			Ext.MessageBox.alert( 'message', 'You must select a treenode first!' );
			return;
		}
		var item = items[ 0 ]; //single select
		var itemId = item.data.id;
		return itemId;
		/*
		var pid = treeGrid.getSelectionModel().selected.map[itemId].parentNode.data.id;
		var pei = pid.indexOf("Personal Data");
		/Projects/.test(pid); //true to add dataset
		/Projects/.test(itemId); //true to add project(not dataset)
		*/
	}
	var getSelectedItemText = function() {
			var items = treeGrid.getSelectionModel().selected.items;
			if ( items.length == 0 ) {
				Ext.MessageBox.alert( 'message', 'You must select a treenode first!' );
				return;
			}
			var item = items[ 0 ]; //single select
			return item.data.text;
		}
		/**
		 * parent id
		 * @param  {[type]} itemId [description]
		 * @return {[type]}        [description]
		 */
	var getSelectedItemPId = function( itemId ) {
		var pid = treeGrid.getSelectionModel().selected.map[ itemId ].parentNode.data.id;
		return pid;
	}

	/* start toolbar handler functions*/
	//add
	var tbAddFn = function() {
			var itemId = getSelectedItemId();
			var pid = getSelectedItemPId( itemId );
			if ( itemId === "Personal Data" && pid != "Projects" ) //p d
			{
				Ext.MessageBox.prompt( 'New Dataset', 'Please enter dataset\'s name:', function( btn, text ) {
					if ( btn == 'ok' ) {
						Ext.Ajax.request( {
							url: "createdatasets.action",
							success: function( response, config ) {
								treeStore.reload();
								treeGrid.expandPath( "/data/Personal Data/" );
								var json = Ext.JSON.decode( response.responseText );
								if(json.msg)
									Ext.MessageBox.alert( "result", json.msg );
								else
									Ext.MessageBox.alert( "result", "Success" );
							},
							failure: function() {
								Ext.MessageBox.alert( "result", "Create dataset folder failed." );
							},
							method: "post",
							params: {
								datasetname: text
							}
						} );
					}
				} );
			} else if ( itemId === "Projects" ) //p
			{
				Ext.MessageBox.prompt( 'New Project', 'Please enter project\'s name:', function( btn, text ) {
					if ( btn == 'ok' ) {
						Ext.Ajax.request( {
							url: "createproject.action",
							success: function( response ) {
								treeStore.reload();
								treeGrid.expandPath( "/data/Projects/" );
								var json = Ext.JSON.decode( response.responseText );
								Ext.MessageBox.alert( "result", json.msg );				
							},
							failure: function() {
								Ext.MessageBox.alert( "result", "Create dataset folder failed!" );
							},
							method: "post",
							params: {
								projectName: text
							}
						} );
					}
				} );
			} else {
				Ext.MessageBox.alert( "info", "Can not add dataset or project here" );
			}
		}
		//delete
	var tbDeleteFn = function() {
		//var checkedItems = treeGrid.getChecked();
		var selectedItems = treeGrid.getSelectionModel().selected.items;
		if ( selectedItems.length == 0 ) {
			Ext.MessageBox.alert( 'message', 'You must select a treenode first!' );
		} else {
			var item = selectedItems[ 0 ];
			var type = item.data.type;
			var text = item.data.text;
			var uploader = item.data.uploader;
			var itemId = getSelectedItemId(); //
			var pid = getSelectedItemPId( itemId );
			// different delete actions
			// can not delete group and shared datasets
			if ( itemId.indexOf( "Group Data" ) >= 0 ) {
				Ext.MessageBox.alert( 'message', 'Not allowed to delete group and shared data!' );
				return;
			}
			if ( type == "dataset" ) {
				if ( itemId.indexOf( "Personal Data" ) >= 0 ) {
					delDataSetFn( text, item.data.uploader );
					treeGrid.expandPath( "/data/Personal Data/" );
				} else if ( itemId.indexOf( "Projects" ) >= 0 ) {
					var ptext = treeGrid.getSelectionModel().selected.map[ itemId ].parentNode.data.text;
					rmDataSetFromProjFn( ptext, text );
				} else if ( itemId.indexOf( "Shared Data" ) >= 0 ) {
					rmDataSetFromSharedFn( text );
				}
			} else if ( type == "group" ) {
				Ext.MessageBox.alert( 'message', 'Not allowed to delete group!' );
				return;
				//delGroupFn(item.data.text);
			} else if ( type == "data category" ) {
				Ext.MessageBox.alert( 'message', 'Can not delete data category!' );
				return;
			} else if ( type == "project" ) {
				delProjectFn( text );
			} else //datafile
			{
				if ( itemId.indexOf( "Personal Data" ) >= 0 )
					delDataFileFn( text );
				else if ( itemId.indexOf( "Projects" ) >= 0 ) {
					var ptype='';
					var mapItem=treeGrid.getSelectionModel().selected.map[ itemId ];
					while(ptype!='project'){
						ptype=mapItem.parentNode.data.type;	
						mapItem=mapItem.parentNode;
						// console.log(ptype);
						// console.log(mapItem.data.text);
					}
					var ptext = mapItem.data.text;					
					rmDataFileFromProjFn( ptext, text );
				}

			}
		}
	}
	/**
	 * 移除共享数据集，但不删除对应数据文件
	 * @param  {[type]} dataSetName [description]
	 * @return {[type]}             [description]
	 */
	var rmDataSetFromSharedFn = function( dataSetName ) {
			var paramsObj = {
				dataSetName: dataSetName
			};
			basicDeleteFn( "dataset", "rmDataSetFromShared.action", paramsObj );
			treeGrid.expandPath( "/data/Shared Data/" );
		}
		/**
		 * 移除（remove）项目下的数据集：不删除硬盘文件夹
		 * @param  {[type]} dataSetName [description]
		 * @return {[type]}             [description]
		 */
	var rmDataSetFromProjFn = function( projectName, dataSetName ) {
			var paramsObj = {
				projectName: projectName,
				dataSetName: dataSetName
			};
			basicDeleteFn( "dataset", "rmDataSetFromProj.action", paramsObj );
			treeGrid.expandPath( "/data/Projects/" );
		}
		/**
		 * 移除（remove）项目下的数据：不删除硬盘文件
		 * @param  {[type]} fileName [description]
		 * @return {[type]}          [description]
		 */
	var rmDataFileFromProjFn = function( projectName, fileName ) {
		var paramsObj = {
			projectName: projectName,
			fileName: fileName
		};
		basicDeleteFn( "datafile", "rmDataFileFromProj.action", paramsObj );
	}
	/**
	 * delete dataset
	 * @param  {[type]} dataSetName [description]
	 * @param  {[type]} uploader    [description]
	 * @return {[type]}             [description]
	 */
	var delDataSetFn = function( dataSetName, uploader ) {
		var paramsObj = {
			dataSetName: dataSetName,
			uploader: uploader
		};
		basicDeleteFn( "dataset", "deleteDataSet.action", paramsObj );
	}

	var delDataFileFn = function( fileName ) {
		var paramsObj = {
			fileName: fileName
		};
		basicDeleteFn( "datafile", "deleteData.action", paramsObj );
	}

	var delGroupFn = function( groupName ) {
		var paramsObj = {
			groupName: groupName
		};
		basicDeleteFn( "group", "deleteGroup.action", paramsObj );
		treeGrid.expandPath( "/data/Group Data/" );
	}

	var delProjectFn = function( projectName ) {
		var paramsObj = {
			projectName: projectName
		};
		basicDeleteFn( "project", "deleteProject.action", paramsObj );
		treeGrid.expandPath( "/data/Projects/" );
	}
/**
 * common delete function
 * @param  {[type]} delType   the dataset type to be deleted 
 * @param  {[type]} actionUrl [description]
 * @param  {[type]} paramsObj  parameters send to server
 * @return {[type]}           [description]
 */
	var basicDeleteFn = function( delType, actionUrl, paramsObj ) {
			Ext.MessageBox.show( {
				title: 'Warnning',
				msg: 'Delete is irreversible, are you sure to delete this ' + delType + '?',
				buttons: Ext.MessageBox.YESNOCANCEL,
				icon: Ext.MessageBox.QUESTION,
				modal: true,
				fn: function callback( btn ) {
					if ( btn == "yes" ) {
						Ext.Ajax.request( {
							url: actionUrl,
							success: function( response, config ) {
								var json = Ext.JSON.decode( response.responseText );
								if(json.msg)
									Ext.MessageBox.alert( "result", json.msg );
								else
									Ext.MessageBox.alert( "result", 'Success' );
								treeStore.reload();
							},
							failure: function() {
								Ext.MessageBox.alert( "result", "Create dataset folder failed." );
							},
							method: "post",
							params: paramsObj
						} );
					}
				}
			} );
		}
		//upload
	var tbUploadFn = function() {
			var itemId = getSelectedItemId();
			var pid = getSelectedItemPId( itemId );
			if ( itemId == "Personal Data" || pid == "Personal Data" || /Projects/.test( pid ) ) //p d
			{
				FileUpload_Win_DM.show();
				if ( pid != "data" )
					treeGrid.expandPath( "/data/" + pid + "/" );
			} else {
				Ext.MessageBox.alert( 'message', 'Can only upload datafile to a personal dataset or project!' );
			}
		}
		//share
	var tbShareFn = function() {
			var selected = treeGrid.getSelectionModel().selected.items;
			if ( selected.length == 0 ) {
				Ext.MessageBox.alert( 'message', 'You must select a treenode first!' );
			} else {
				share( selected[ 0 ].data.text );
				treeStore.reload();
				treeGrid.expandPath( "/data/Shared Data/" );
			}
		}
		//add to project
	var tbAdd2ProjectFn = function() {
			var checkedItems = treeGrid.getChecked();
			var itemId = getSelectedItemId();
			var pid = getSelectedItemPId( itemId );
			if ( !/Projects/.test( pid ) ) {
				Ext.MessageBox.alert( "message", "Please select a project." );
			} else if ( checkedItems.length == 0 ) {
				Ext.MessageBox.alert( "message", "Please select datasets first." );
			} else {
				var datasets = [],
					datafiles = [];
				for ( var i = 0; i < checkedItems.length; i++ ) {
					var item = checkedItems[ i ];
					if ( item.data.type === "dataset" )
						datasets.push( item.data.text );
					else
						datafiles.push( item.data.text );
				}
				Ext.Ajax.request( {
					url: "addDataToProject.action",
					success: function( response, config ) {
						console.log( response.responseText );
						Ext.MessageBox.alert( "result", response.responseText );
						treeStore.reload();
					},
					failure: function() {
						Ext.MessageBox.alert( "result", "Failed." );
					},
					method: "post",
					params: {
						datasets: datasets,
						datafiles: datafiles,
						projectName: getSelectedItemText()
					}
				} );
			}
		}
		/* end */

	var tb = Ext.create( 'Ext.Toolbar', {
		items: [ {
				id: 'add',
				text: 'new',
				iconCls: "Folderadd",
				tooltip: 'new personal dataset or project ',
				// only 'personal data' and 'projects' can add new datasets
				handler: function() {
					tbAddFn();
				}
			},
			'-',
			/*{
			    id: 'edit',
			    text: 'edit',
			    iconCls: "Pencil",
			    tooltip: 'edit your dataset'
			}, '-',*/
			{
				id: 'upload',
				text: 'upload',
				tooltip: 'upload data file to a dataset or project',
				iconCls: 'Arrowjoin',
				handler: function() {
					tbUploadFn();
				}
			},
			'-', {
				id: 'share',
				text: 'share',
				iconCls: 'Share',
				tooltip: 'share data to others',
				handler: function() {
					tbShareFn();
				}
			},
			'-', {
				text: 'refresh',
				iconCls: 'Reload',
				handler: function() {
					treeStore.reload();
				}
			},
			'-', {
				text: 'delete',
				iconCls: 'Delete',
				tooltip: 'delete (the first) selected item.',
				handler: function() {
					tbDeleteFn();
				}
			},
			'-', {
				text: 'add into project',
				iconCls: 'Applicationadd',
				tooltip: 'check datasets and add to a selected project',
				handler: function() {
					tbAdd2ProjectFn();
				}
			}
		]
	} );

	var treeGrid = Ext.create( 'Ext.tree.Panel', {
		itemId: "tree",
		width: 600,
		height: 500,
		tbar: tb,
		rootVisible: false,
		region: 'center',
		contextMenu: gridmenu,
		listeners: {
			itemcontextmenu: function( menutree, record, items, index, e ) {
				e.preventDefault();
				e.stopEvent();
				//console.log(record);
				//gridmenu.showAt(e.getXY());
			},
			beforeitemexpand: function( item, eOpts ) {
				var flag=true;
				if ( item.data.id == "Shared Data" ) {
					Ext.Ajax.request( {
						async:false,
						url: 'judgeshareduser.action',
						success: function( response, config ) {
							var json = Ext.JSON.decode( response.responseText );						
							Ext.MessageBox.alert( "result", json.tag );
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
			}
		},
		store: treeStore, //newstore,
		columns: [ {
			header: 'ROW',
			xtype: 'rownumberer',
			width: 40,
			sortable: false
		}, {
			xtype: 'treecolumn',
			text: 'Dataset',
			dataIndex: "text",
			flex: 1,
			sortable: false
		}, {
			text: "uploader",
			dataIndex: "uploader",
			flex: 1,
			sortable: true
		}, {
			text: "type",
			dataIndex: "type",
			flex: 1,
			sortable: true
		}, {
			text: "semantic",
			dataIndex: "semantic",
			flex: 1,
			sortable: true
		}, {
			text: "format",
			dataIndex: "format",
			flex: 1,
			sortable: true
		} ],
		viewConfig: {
			stripeRows: true, //在表格中显示斑马线
			enableTextSelection: true //, //可以复制单元格文字
				//selectedItemCls:'new-grid-row-selected'
		}
	} );
	/**
	 * data-panel
	 */
	var dataPanel = Ext.create( 'Ext.panel.Panel', {
		width: 500,
		height: 300,
		title: 'Datasets Management',
		layout: 'border',
		id: 'data_manager_panel',
		items: [ {
			region: 'center', // center region is required, no width/height specified
			xtype: 'panel',
			layout: 'border',
			margins: '5 5 0 0',
			items: [ treeGrid
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
		} ]
	} );

	/* code copied from dataOperation.js */
	var gridmenu = new Ext.menu.Menu( {
		id: 'gridmenu',
		items: [ showDatasAction, deleteDataSetAction, locationAction, shareDataSetAction ],
		//TODO:
		listeners: {
			beforeshow: function() {
				var xmlurl = "judgeshareduser.action";
				var ajax = new Ajax();
				ajax.open( "GET", xmlurl, true );
				ajax.send( null );
				ajax.onreadystatechange = function() {
					if ( ajax.readyState == 4 ) {
						if ( ajax.status == 200 ) {
							var tag = ajax.responseText.pJSON().tag;
							if ( tag == true ) {
								Ext.getCmp( "rightmenu" ).setDisabled( true );
							}
						}
					}
				};
			}
		}
	} );

	/**
	 * @description delete the dataset from xml file and disk
	 * @param dataSetName*/

	/**
	 * make the dataset public
	 * */
	function share( dataSetName ) {
		var xmlurl = "sharedataset.action?dataSetName=" + dataSetName;
		var ajax = new Ajax();
		ajax.open( "GET", xmlurl, true );
		ajax.send( null );
		ajax.onreadystatechange = function() {
			if ( ajax.readyState == 4 ) {
				if ( ajax.status == 200 ) {
					var tag = ajax.responseText.pJSON().tag;
					if ( tag == 0 ) {
						Ext.MessageBox.alert( "tip", "this data set had been shared" );
						
					} else if ( tag == 1 ) {
						Ext.MessageBox.alert( "tip", "this data set is shared successfully" );
						treeStore.reload();
					}
				}
			}
		};
	};

	function judgeSharedUser() {
		var xmlurl = "judgeshareduser.action";
		var ajax = new Ajax();
		ajax.open( "GET", xmlurl, true );
		ajax.send( null );
		ajax.onreadystatechange = function() {
			if ( ajax.readyState == 4 ) {
				if ( ajax.status == 200 ) {
					var tag = ajax.responseText.pJSON().tag;
					if ( tag == true ) {
						Ext.getCmp( "rightmenu" ).setDisabled( true );
					}
				}
			}
		};
	};
	//===================================================================================================
	//the create dataset window
	//===================================================================================================

	var createDataSet_Form = new Ext.FormPanel( {
		frame: true,
		bodyStyle: 'padding:20px 5px 5px 5px',
		items: [ {
			xtype: 'textfield',
			fieldLabel: 'DataSetName',
			allowBlank: false,
			name: 'datasetname'
		} ],

		buttons: [ {
			text: 'Save',
			handler: function() {
					if ( createDataSet_Form.getForm().isValid() ) {
						var form = createDataSet_Form.getForm();
						form.submit( {
							url: 'createdataset.action',
							modal: false,
							success: function( fp, o ) {
								ListDataSetStore.load();
								Ext.MessageBox.alert( 'msg', "create dataset sucessfully!" );
							},
							failure: function( f, action ) {
								Ext.MessageBox.alert( 'msg', "give a new data set name!" );
							}
						} );
					} else {
						Ext.MessageBox.alert( 'msg', "dataSet name  is null" );
					}
				} // end of handler
		} ]
	} );

	/**
	 * create the dataset window*/
	var createSet_Win = new Ext.Window( {
		title: 'Create DataSet',
		collapsible: false,
		modal: false,
		closeAction: 'hide',
		items: createDataSet_Form
	} );

	function createDataSetWinShow() {
		createSet_Win.show();
	}

	function renderFileName( value ) {
		var str = value;
		if ( value.indexOf( "/" ) > 0 ) {
			var pos = value.lastIndexOf( "/" ) * 1;
			str = value.substring( pos + 1 );
		} else if ( value.indexOf( "\\" ) > 0 ) {
			var pos = value.lastIndexOf( "\\" ) * 1;
			str = value.substring( pos + 1 );
		}
		return str;
	}

	//=======================================================================
	//below is about the add data window
	//=======================================================================
	var namespace = "data_management";
	Ext.define( 'SemanticModel', {
		extend: 'Ext.data.Model',
		fields: [ {
			type: 'string',
			name: 'name'
		}, {
			type: 'string',
			name: 'value'
		} ]
	} );
	//the content in semantics combox
	var semantics = [ {
		"name": "Sample Data",
		"value": "Sample Data"
	}, {
		"name": "DEM",
		"value": "DEM"
	}, {
		"name": "TWI",
		"value": "TWI"
	}, {
		"name": "Plan Curvature",
		"value": "Plan Curvature"
	}, {
		"name": "Profile Curvature",
		"value": "Profile Curvature"
	}, {
		"name": "Slope Gradient",
		"value": "Slope Gradient"
	}, {
		"name": "Temperature",
		"value": "Temperature"
	}, {
		"name": "Parent Material",
		"value": "Parent Material"
	}, {
		"name": "Precipitation",
		"value": "Precipitation"
	}, {
		"name": "Evi",
		"value": "Evi"
	}, {
		"name": "NDVI",
		"value": "NDVI"
	}, {
		"name": "Ndwi",
		"value": "Ndwi"
	}, {
		"name": "Palsar08hv",
		"value": "Palsar08hv"
	} ];
	var semantic_store = Ext.create( 'Ext.data.Store', {
		model: 'SemanticModel',
		data: semantics
	} );

	/**
	 * define the semantic combox
	 * the action whether select Sample Data or not
	 * */
	var semantic_combo = Ext.create( 'Ext.form.field.ComboBox', {
		fieldLabel: 'Semantic',
		displayField: 'name',
		name: 'semantic',
		id: namespace + '_semantic',
		store: semantic_store,
		value: "Sample Data",
		queryMode: 'local',
		typeAhead: true,
		allowBlank: false,
		listeners: {
			"select": function() {
				document.getElementById( 'inputfile' ).value = '';
				document.getElementById( '_inputfile_text' ).value = '';
				csvFields = [];
				csvFields_store.loadData( csvFields );
				csv_x_filed_combo.setRawValue( '' );
				csv_y_filed_combo.setRawValue( '' );

				var seman = semantic_combo.getValue();
				if ( seman == "Sample Data" ) {
					Ext.getCmp( namespace + '_datafile_csv' ).setDisabled( false );
					Ext.getCmp( namespace + '_x_fields' ).setDisabled( false );
					Ext.getCmp( namespace + '_y_fields' ).setDisabled( false );

					Ext.getCmp( namespace + '_datafile' ).setDisabled( true );
				} else {
					Ext.getCmp( namespace + '_datafile_csv' ).setDisabled( true );
					Ext.getCmp( namespace + '_x_fields' ).setDisabled( true );
					Ext.getCmp( namespace + '_y_fields' ).setDisabled( true );
					Ext.getCmp( namespace + '_datafile' ).setDisabled( false );
				}
			}
		}
	} );
	var final_csv = "";
	var csv_firstline = "";
	var html5readFile = function( e ) {
		var extend = e.value.substring( e.value.lastIndexOf( '.' ) + 1 );
		extend = extend.toUpperCase();
		var fileInput = document.getElementById( 'inputfile' );
		var file = fileInput.files[ 0 ];
		if ( extend === "CSV" ) {
			var reader = new FileReader();
			reader.onload = function( e ) {
				var result = reader.result;
				result = result.replace( /\r?\n/g, "\r\n" ); // replace \n with \r\n 
				result = result.replace( /(^\s*)|(\s*$)/g, "" );
				var strs = result.split( "\r\n" );
				if ( strs.length > 1 ) {
					csv_firstline = strs[ 0 ];
					var heads = csv_firstline.split( "," );
					var len = heads.length;
					csvFields = [];

					for ( var i = 0; i < len; i++ ) {
						var head = heads[ i ];
						var item = [ head, head ];
						csvFields.push( item );
					}
					csvFields_store.loadData( csvFields );

					for ( var i = 1; i < strs.length; i++ ) {
						final_csv = final_csv + strs[ i ] + "\r\n";
					}
					//alert(final_csv);
					//Ext.getCmp(namespace + 'datafile_csvStr').setValue(final_csv);
				} else {
					Ext.MessageBox.alert( 'message', "CSV file has no data" );
					Ext.getCmp( namespace + '_datafile_csvStr' ).setValue( "" );
				}
			};
			reader.readAsText( file );
			document.getElementById( '_inputfile_text' ).value = e.value;

		} else {
			Ext.MessageBox.alert( 'message', "only support .CSV" );
		}

	};

	/**
	 * define and load datasample data fields, 
	 * deiine coordinate X,Y combox
	 * */
	Ext.define( 'CSVFieldsModel', {
		extend: 'Ext.data.Model',
		fields: [ {
			type: 'string',
			name: 'name'
		}, {
			type: 'string',
			name: 'value'
		} ]
	} );

	var csvFields = []; //fields
	var csvFields_store = Ext.create( 'Ext.data.Store', {
		model: 'CSVFieldsModel',
		data: csvFields
	} );

	var csv_x_filed_combo = Ext.create( 'Ext.form.field.ComboBox', {
		fieldLabel: 'X Field',
		id: namespace + '_x_field',
		displayField: 'name',
		name: 'x_field',
		store: csvFields_store,
		value: "",
		queryMode: 'local',
		typeAhead: true,
		hidden: false,
		disabled: false,
		allowBlank: false
	} );

	var csv_y_filed_combo = Ext.create( 'Ext.form.field.ComboBox', {
		fieldLabel: 'Y Field',
		id: namespace + '_y_field',
		displayField: 'name',
		name: 'y_field',
		store: csvFields_store,
		value: "",
		queryMode: 'local',
		typeAhead: true,
		hidden: false,
		disabled: false,
		allowBlank: false
	} );

	/**
	 * define the window for upload the user`s data
	 * the  widget named filePostfix is a hidden widget that save the file format
	 * */
	var FileUpload_Form = new Ext.FormPanel( {
		frame: true,
		width: 500,
		id: 'FileUpload',
		bodyStyle: 'padding:20px 5px 5px 5px',
		items: [ {
				xtype: 'hiddenfield',
				name: 'dataSetName',
				value: '',
				id: namespace + '_dataSetName'
			}, {
				xtype: 'textfield',
				name: 'dataName',
				id: namespace + '_dataName',
				fieldLabel: 'DataName',
				allowBlank: false
			},
			semantic_combo, {
				xtype: 'hiddenfield',
				name: 'datafile_csvStr',
				value: '',
				id: namespace + '_datafile_csvStr'
			}, {
				xtype: 'component',
				id: namespace + '_datafile_csv',
				hidden: false,
				disabled: false,
				html: '<div class="file-box">' +
					'<label>DataFile(.csv):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>' +
					'<input type="text" name="textfield" readonly="true" id="_inputfile_text" class="txt" />' +
					'<label>&nbsp;</label>' +
					'<input type="button" class="btn" value="Browse Data" class="input" style="width:100px" />' +
					'<input type="file" onchange="DataManagePanel.html5readFile(this)" class="file" id="inputfile" size="28" />' +
					'</div>'

			},
			csv_x_filed_combo,
			csv_y_filed_combo, {
				xtype: 'hiddenfield',
				name: 'filePostfix',
				id: namespace + '_filePostfix'
			}, {
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
			}, {
				xytpe: 'component',
				height: 3,
				width: 0
			}, {
				xtype: 'component',
				hidden: false,
				html: '|'
			}, {
				xtype: 'component',
				id: 'uploadMark',
				hidden: true,
				html: 'Data are uploading,please wait .....'
			}
		],

		buttons: [ {
			text: 'Save',
			handler: function() {
				var datasetName = getSelectedItemText();
				var node =  Ext.getCmp("dataTreeManager").getSelectionModel().selected.items[0];
				var filePostfix = null;
				var semantic = Ext.getCmp( namespace + '_semantic' ).getValue();
				if ( semantic == "Sample Data" ) {
					Ext.getCmp( namespace + '_datafile' ).setRawValue( '' );
					filePostfix = "csv";
					//////
					var x_filed = csv_x_filed_combo.getValue();
					var y_filed = csv_y_filed_combo.getValue();
					if ( x_filed == "" || y_filed == "" ) {
						Ext.MessageBox.alert( 'msg', "X Field and Y Field cannot be empty" );
						return;
					}
					if ( csv_firstline == "" || final_csv == "" ) {
						Ext.MessageBox.alert( 'msg', "CSV File cannot be empty" );
						return;
					}
					csv_firstline = csv_firstline.replace( x_filed, "X" );
					csv_firstline = csv_firstline.replace( y_filed, "Y" );
					Ext.getCmp( namespace + '_datafile_csvStr' ).setValue( csv_firstline + "\r\n" + final_csv );
					//alert(Ext.getCmp(namespace + 'datafile_csvStr').getValue());
					///////
				} else {
					//Ext.getCmp(namespace + 'datafile_csv').setRawValue('');
					var asc_value = Ext.getCmp( namespace + '_datafile' ).getValue();
					var extend_asc = asc_value.substring( asc_value.lastIndexOf( '.' ) + 1 );
					extend_asc = extend_asc.toUpperCase();

					if ( extend_asc != "TIF" ) {
						Ext.MessageBox.alert( 'msg', ".tif files are required" );
						return;
					}
					filePostfix = "tif";
				}
				if ( filePostfix != "csv" && filePostfix != "tif" ) {
					Ext.MessageBox.alert( 'msg', "only  surpport csv, tif format!" );
					return;
				}

				Ext.getCmp( namespace + '_filePostfix' ).setValue( filePostfix );

				var postfix = Ext.getCmp( namespace + '_filePostfix' ).getValue();
				//var dataset = Ext.getCmp(namespace + 'dataSetName').getValue();

				var dataname = Ext.getCmp( namespace + '_dataName' ).getValue();
				Ext.getCmp( namespace + '_dataSetName' ).setValue(datasetName);
				if ( postfix == "" || semantic == "" || dataname == "" ) {
					Ext.MessageBox.alert( 'msg', "all the input can not be empty!" );
					return;
				}

				if ( Ext.getCmp( namespace + '_datafile' ).getValue() == "" && Ext.getCmp( namespace + '_datafile_csvStr' ).getValue() == "" ) {
					Ext.MessageBox.alert( 'msg', "please select data to unload" );
					return;
				}

				Ext.getCmp( "uploadMark" ).getEl().show();
				var form = FileUpload_Form.getForm();
				form.submit( {
					//url: 'uploadData.action',
					url: 'uploadDataNew.action',
					modal: false,
					success: function( fp, o ) {
						Ext.MessageBox.alert( 'msg', "upload file success!" );
						//Ext.getCmp( '_List_FileData' ).getStore().load();
						Ext.getCmp( "uploadMark" ).getEl().hide();
						//treeStore.reload();
						expandNode(node);
					},
					failure: function( f, action ) {
						Ext.MessageBox.alert( 'msg', "upload file fail!" );
						Ext.getCmp( "uploadMark" ).getEl().hide();
					}
				} );

			}
		}, {
			text: 'Reset',
			handler: function() {
				FileUpload_Form.getForm().reset();
			}
		} ]
	} );
	//FileUpload Window for Data Management
	var FileUpload_Win_DM = new Ext.Window( {
		title: 'Upload Data',
		id: 'fileUpload_Win_DM',
		iconCls: 'upload',
		//layout:'fit',  
		autoDestory: true,
		collapsible: false,
		modal: false,
		closeAction: 'hide',
		items: [
			FileUpload_Form
		]
	} );
	
	
	function expandNode(node){
		var tree1 = Ext.getCmp('dataTreeManager');
		var path = node.getPath('id');
		tree1.getStore().load({node: tree1.getRootNode(),
									callback: function () {
										tree1.expandPath(path, 'id');
									}
		})
	};
	function expandNode(node){
		var tree1 = Ext.getCmp('dataTreeManager');
		var path = node.getPath('id');
		tree1.getStore().load({node: tree1.getRootNode(),
									callback: function () {
										tree1.expandPath(path, 'id');
									}
		})
	}
//TODO: 删除节点后展开，还得和侯志伟商量下
	return {
		data_panel: dataPanel,
		html5readFile: html5readFile
	}
}();