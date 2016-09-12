///
var current_username = "";
var welcomewords = "Welcome To EGC!";
var checkloginuser = function()
{
    var xmlUrl = "egcCheckuser.action";
    var ajax = new Ajax();
    ajax.open("GET", xmlUrl, true);
    ajax.onreadystatechange = function()
    {
        if (ajax.readyState == 4)
        {
            if (ajax.status == 200)
            {
                var name = ajax.responseText.pJSON().name;
                if (name == null)
                {
                    window.location.href = "login.html";
                }
                else
                {
                    current_username = name;
                    welcomewords = "Welcome " + current_username + " To EGC!";
                    document.getElementById("welcome_label").innerText = welcomewords;
                    current_username = "";
                }
            }
        }
    };
    ajax.send(null);
};
checkloginuser();

//window.setInterval("checktimeout()", 1000*60*25);          
var checktimeout = function()
{
    var xmlUrl = "egcSessiontimeout.action";
    var ajax = new Ajax();
    ajax.open("GET", xmlUrl, true);
    ajax.onreadystatechange = function()
    {
        if (ajax.readyState == 4)
        {
            if (ajax.status == 200)
            {
                var tag = ajax.responseText.pJSON().tag;
                if (tag == "1")
                { //time out
                    alert("session time out, please login again!");
                    window.location.href = "login.html";
                }
            }
        }
    };
    ajax.send(null);
};
///
var Manager = null;
var mm = null;
var tabs = null;
var canvas_height = screen.availHeight - 70;
var canvas_width = screen.availWidth;
var taksTreeCollapseOrExtand = 1; // if taksTreeCollapseOrExtand=1,then extand; if taksTreeCollapseOrExtand=0, then collapse
var ManagerFormCollapseOrExtend = 1; //1:extend;0:collapse
var adjustX = -200;
var adjustY = -57;
//var current_username = "";

var login_flag = "block";
//var logout_flag = "none";
var logout_flag = "block";
window.onload = function()
{
    initMap();

    var canvas = document.getElementById('tutorial');
    Manager = new graphManager(canvas);
    mm = new ModelManager();
    canvas.onmousedown = function(e)
    {
        Manager.onmousedown(e);
    };
    canvas.onmousemove = function(e)
    {
        Manager.onmousemove(e);
    };
    canvas.onmouseup = function(e)
    {
        Manager.onmouseup(e);
    };

    //set_loginlogout();      
};

function init()
{
    var canvas = document.getElementById('tutorial');
    canvas.style.height = canvas_height + 'px';
    canvas.style.width = canvas_width + 'px';
};

function clearResult()
{
    var layers = map.layers;
    for (var i = layers.length - 1; i >= 0; i--)
    {
        if (!layers[i].isBaseLayer)
        {
            layers[i].setVisibility(false);
        }
    }
    for (var i = 0; i < wfs_indicators.length; i++)
    {
        wfs_indicators[i].setVisibility(true);
    }

    map.removeControl(selectControl);
    selectControl = new OpenLayers.Control.SelectFeature(wfs_indicators);
    map.addControl(selectControl);
    selectControl.activate();

    Ext.getCmp('legend_container').setVisible(false);
};

var currentLayerName = null;
var currentLayerOpacity = 1.0;

function getSelectValue(obj)
{
    var sValue = obj.options[obj.options.selectedIndex].value;
    var sText = obj.options[obj.options.selectedIndex].innerHTML;
    currentLayerName = sText;
    if (sText == "Clear result")
    {
        clearResult();
    }
    else
    {
        //Ext.getCmp('legend_container').setVisible(true); 
        for (var i = 0; i < wms_results.length; i++)
        {
            if (wms_results[i].semantic == sText)
            {
                Ext.getCmp('legend_container').setVisible(true);
                displayresult(wms_results[i].wms, wms_results[i].legendUrl, wms_results[i].max, wms_results[i].min);
                break;
            }
        }
    }

};

function clickSelectValue(obj)
{
    obj.focus();
    var sValue = obj.options[obj.options.selectedIndex].value;
    var sText = obj.options[obj.options.selectedIndex].innerHTML;
    currentLayerName = sText;
    if (sText == "Clear result")
    {
        clearResult();
    }
    else
    {
        //Ext.getCmp('legend_container').setVisible(true); 
        for (var i = 0; i < wms_results.length; i++)
        {
            if (wms_results[i].semantic == sText)
            {
                Ext.getCmp('legend_container').setVisible(true);
                displayresult(wms_results[i].wms, wms_results[i].legendUrl, wms_results[i].max, wms_results[i].min);
                break;
            }
        }
    }

};

function getLayerOpacity(obj)
{

    var sValue = obj.options[obj.options.selectedIndex].value;
    if (currentLayerName != "Clear result")
    {
        for (var i = 0; i < wms_results.length; i++)
        {
            if (wms_results[i].semantic == currentLayerName)
            {
                currentLayerOpacity = parseFloat(sValue).toFixed(1);
                wms_results[i].wms.setOpacity(currentLayerOpacity);
            }
        }
    }
};

function clickLayerOpacity(obj)
{
    obj.focus();
    var sValue = obj.options[obj.options.selectedIndex].value;
    if (currentLayerName != "Clear result")
    {
        for (var i = 0; i < wms_results.length; i++)
        {
            if (wms_results[i].semantic == currentLayerName)
            {
                currentLayerOpacity = parseFloat(sValue).toFixed(1);
                wms_results[i].wms.setOpacity(currentLayerOpacity);
            }
        }
    }
};
//begin of ext 
Ext.onReady(function()
{
    // define model-taske tree               
    var treestore = Ext.create('Ext.data.TreeStore',
    {
        proxy:
        {
            type: 'ajax',
            url: 'model-task.json'
        },
        sorters: [
        {
            property: 'leaf',
            direction: 'ASC'
        },
        {
            property: 'text',
            direction: 'ASC'
        }]
    });
    //      
    //define tabs :include "Earth" tab and "Model" tab    
    tabs = new Ext.TabPanel(
    {
        region: 'center',
        margins: '3 3 3 0',
        activeTab: 0,
        style: {
    		top:'50px'
		},
        defaults:
        {
            autoScroll: true
        },
        id: 'TabPanel',
        listeners:
        {
            'tabchange': function()
            {
                if (tabs.getActiveTab().id == 'easyModel')
                {
                    modelManagerwin.show();
                    Ext.get('tutorial').setVisible(true);
                }
                else
                {
                    modelManagerwin.hide();
                    Ext.get('tutorial').setVisible(false);//hide model canvas
                }
            }
        },
        items: [
        { // the first tab: "Earth" tab      
            title: 'Earth',
            //title:'Map',  				
            xtype: 'panel',
            id: 'EarthTab',
            layout: 'border',
            items: [
            {
                region: 'center',
                id: 'easyEarth',
                contentEl: 'map2d',
                autoScroll: false
            },
            {
                region: 'east',
                id: 'easttabs',
                xtype: 'tabpanel',
                frame: true,
                width: 250,
                items: [
//                    {
//                        //title: 'Search',
//                        title: 'Guide',
//                        id: 'searchArea',
//                        xtype: 'form',
//                        autoScroll: true,
//                        frame: true,
//                        items: [
//                        {
//                            xtype: 'component',
//                            html: '<br/>' + '<br/><p style="line-height:20px;"><font  size="2" color="#336699" >You can accomplish geo-computation tasks (e.g. Digital Soil Mapping, Digital Terrain Analysis, Monkey Habitat Mapping, etc.) on EGC platform in <b>three steps</b>:</font></p>' + '<br/><br/><p style="line-height:20px;"><font  size="2" color="#336699" ><b>Step1</b>: Use the prepared the area of interest (AOI) or Define AOI on the ¡°Map¡± interface by pressing the <b>Ctrl</b> key and dragging a rectangle with the mouse;</font></p>' + '<br/><br/><p style="line-height:20px;"><font size="2" color="#336699" ><b>Step2</b>: <b>Left Click</b> on the defined AOI and choose the geo-computation task of interest;</font></p>' + '<br/><br/><p style="line-height:20px;"><font size="2"  color="#336699" ><b>Step3</b>: <b>Construct</b> the model on the "Model" interface (<b>automatically</b> opened). When you finish, run the model and get the results. You may switch between the "Map" interface and the "Model" interface to view the results and modify the model</font></p>',
//                            style: 'margin-bottom: 20px;'
//                        }]
//                    },
                    //FileDataGrid_User,
                    //grid,
                    treePanel,
                    {
                        title: 'Result',
                        hidden: true,
                        id: 'result_display',
                        xtype: 'form',
                        frame: true,
                        items: [
                        {
                            xtype: 'component',
                            hidden: false,
                            id: 'title_for_download',
                            html: '<br/><font face="Times New Roman" size="3" color="#336699">The results as follow, please download</font>'
                        },
                        {
                            xtype: 'component',
                            html: '&nbsp;&nbsp;'
                        },
                        {
                            xtype: 'component',
                            hidden: false,
                            id: 'files_for_download',
                            html: ''

                        },
                        {
                            xtype: 'component',
                            html: '&nbsp;&nbsp;'
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                            {
                                xtype: 'button',
                                text: 'validate',
                                handler: function()
                                {
                                    validate();
                                }
                            },
                            {
                                xtype: 'component',
                                id: 'validate_rmse',
                                margins: '5 0 0 5',
                                html: 'RMSE:'
                            }]

                        },
                        {
                            xtype: 'component',
                            html: '<hr>'
                        },
                        {
                            xtype: 'component',
                            hidden: false,
                            id: 'map_for_show',
                            html: '<br/><font face="Times New Roman" size="3" color="#336699">Select the result that you want to display on map</font><br/>'
                        },
                        {
                            xtype: 'component',
                            html: '&nbsp;&nbsp;'
                        },
                        {
                            xtype: 'component',
                            id: 'select_show_map',
                            hidden: false,
                            html: '<select  STYLE="width: 150px"  onclick="clickSelectValue(this);" onchange="getSelectValue(this);"><option value="1">AttributeMap</option><option value="2">UncertaintyMap</option></select>'

                        },
                        {
                            xtype: 'component',
                            html: '&nbsp;&nbsp;'
                        },
                        {
                            xtype: 'component',
                            html: '<hr>'
                        },
                        {
                            xtype: 'component',
                            hidden: false,
                            id: 'title_map_legend',
                            html: '<font face="Times New Roman" size="3" color="#336699">Legend</font>'
                        },
                        {
                            xtype: 'component',
                            hidden: true,
                            html: '&nbsp;&nbsp;&nbsp;&nbsp;'
                        },
                        {
                            xtype: 'container',
                            id: 'legend_container',
                            //width: 90,
                            anchor: '85%',
                            layout: 'column',
                            items: [
                            {
                                xtype: 'container',
                                //columnWidth:.4,
                                width: 30,
                                layout: 'anchor',
                                items: [
                                {
                                    xtype: 'component',
                                    html: '<img src= "img/stretchedLegend.jpg"  target= "_self " style="cursor:pointer"></img>'
                                }]
                            },
                            {
                                xtype: 'container',
                                //columnWidth:.6,       
                                padding: '0 0 0 -10',
                                layout: 'anchor',
                                items: [
                                {
                                    xtype: 'component',
                                    id: 'legend_max',
                                    height: 85,
                                    html: ""
                                },
                                {
                                    xtype: 'component',
                                    id: 'legend_min',
                                    html: ''
                                }]
                            }]
                        },
                        {
                            xtype: 'component',
                            id: 'legend_StreamLine',
                            hidden: true,
                            html: '<img src= "img/river.bmp"  target= "_self " style="cursor:pointer"></img>'
                        },
                        {
                            xtype: 'component',
                            id: 'legend_WaterShed',
                            hidden: true,
                            html: '<img src= "img/watershed.jpg"  target= "_self " style="cursor:pointer"></img>'
                        }]
                    }
                ]
            }]

        },
        {
            title: 'Model',
            id: 'easyModel',
            xtype: 'panel',
            hidden: true,
            layout: 'border',
            items: [
            {
                region: 'west',
                xtype: 'treepanel',
                store: treestore, //model-taske tree   
                viewConfig:
                {
                    plugins:
                    {
                        ptype: 'treeviewdragdrop'
                    }
                },
                rootVisible: false,
                useArrows: true,
                frame: true,
                title: 'GeoTasks',
                id: 'taskTree',
                width: 200,
                collapsible: true,
                collapsed: false,
                listeners:
                {
                    'itemclick': function(view, record, item, index, e)
                    {
                        if (record.isLeaf())
                        {
                            if (record.raw.text === 'Watershed Delimitation')
                            {
                                Manager.init("extractWatershed");
                                currentTask = "extractWatershed";
                            }
                            else if (record.raw.text === 'Pit-removing')
                            {
                                Manager.init("PitRemoving");
                                currentTask = "PitRemoving";
                            }
                            else if (record.raw.text === 'TWI')
                            {
                                Manager.init("TWICal");
                                currentTask = "TWICal";
                            }
                            else if (record.raw.text === 'Flow Direction Calculator')
                            {
                                Manager.init("FlowDirectionCal");
                                currentTask = "FlowDirectionCal";
                            }
                            else if (record.raw.text === 'Sample Based Mapping')
                            {
                                currentTask = "Sample Based Mapping";
                                Manager.init("Sample Based Mapping");
                            }
                            else if (record.raw.text === "Habitat Mapping")
                            {
                                Manager.init("Habitat Mapping");
                                currentTask = "Habitat Mapping";
                            }
                            else if (record.raw.text === "Stream Extraction")
                            {
                                Manager.init("extractStream");
                                currentTask = "extractStream";
                            }
                            else if (record.raw.text === "Sampling based on purposive")
                            {
                                Manager.init("sampling based on purposive");
                                currentTask = "sampling based on purposive";
                            }
                            else if (record.raw.text === "Sampling based on Uncertainty")
                            {
                                Manager.init("Sampling Based On Uncertainty");
                                currentTask = "Sampling Based On Uncertainty";
                            }
                        }
                    },
                    'collapse': function()
                    {
                        taksTreeCollapseOrExtand = 0;
                        var adjust = 0;
                        adjust = Ext.get("collapse-placeholder-taskTree").dom.style.width;
                        temps = adjust.split("px");
                        adjustX = -temps[0] - 25;
                        //adjustY =  - 57 - 21 ;
                        adjustY = -57;
                        modelManagerwin.showAt(30, 60);
                    },
                    'expand': function()
                    {
                        taksTreeCollapseOrExtand = 1;
                        var adjust = 0;
                        adjust = Ext.get("taskTree").dom.style.width;
                        temps = adjust.split("px");
                        adjustX = -temps[0];
                        //adjustY =  - 57 - 21 ;   
                        adjustY = -57;
                        modelManagerwin.showAt(200, 60);
                    },
                    'show': function()
                    {

                        taksTreeCollapseOrExtand = 0;
                        var adjust = 0;
                        adjust = Ext.get("collapse-placeholder-taskTree").dom.style.width;
                        temps = adjust.split("px");
                        adjustX = -temps[0] - 25;
                        //adjustY =  - 57 - 21 ; 
                        adjustY = -57;
                        modelManagerwin.showAt(30, 60);
                    }
                }
            },
            {
                region: 'center',
                id: 'modelCanvas',
                contentEl: 'model',
                autoScroll: true,
                bbar: [
                {
                    xtype: 'component',
                    hidden: false,

                    html: '<label  style="color: #ff0000;font-size: 10pt;">Status</label>&nbsp;&nbsp;&nbsp;&nbsp;'
                },
                {
                    xtype: 'component',
                    id: 'modelprogressbar',
                    hidden: true,
                    html: '<img src="img/progress.gif" >'
                }]
            }],
            closable: false,
            html: ''
        },
        DataManagePanel.data_panel]
    });
    var viewport = new Ext.Viewport(
    {
        layout: 'border',
        items: [
            {
                region: 'north',
                html: '<div id="header">' + '<table width="100%">' + '<tr class="banner">' + '<td class="banner" width="60px">' + '<img src="img/globe_25.gif" width=25px height=25px alt="World picture" align="top">' + '<img src="img/EGC.jpg" width=25px height=25px alt="GeoNetwork opensource logo" align="top">' + '</td>' + '<td>'
                    //+'<label  style="color: #009999;font-size: 15pt;">&nbsp;&nbsp;&nbsp;Easy GeoComputation PlatForm</label>'
                    + '<label  style="color: #009999;font-size: 15pt;">&nbsp;&nbsp;&nbsp;CyberSoLIM: Easy Digital Soil Mapping PlatForm</label>' + '</td>' + '<td align="right" width="450px">' + '<label id="welcome_label" style="color: #99CC00;font-size: 10pt;">' + welcomewords + '</label>&nbsp;&nbsp;&nbsp;&nbsp;' + '</td>' + '<td align="right" width="30px">'
                    //+'<button id="userlogin_btn" onclick="userlogin()" style="display:' + login_flag + ';background-color:#FFFFFF;border-bottom:1px solid #FFFFFF;;border-right:1px solid #FFFFFF"><font color="#666666"; style="TEXT-DECORATION: underline">Login</font></button>'  
                    + '<button id="userlogout_btn" onclick="userlogout()" style="display:' + logout_flag + ';background-color:#FFFFFF;border-bottom:1px solid #FFFFFF;;border-right:1px solid #FFFFFF"><font color="#666666"; style="TEXT-DECORATION: underline">Logout</font></button>' + '</td>' + '<td align="right" width="30px">' + '<button id="group_btn" onclick="groupOperation1()" style="background-color:#FFFFFF;border-bottom:1px solid #FFFFFF;;border-right:1px solid #FFFFFF"><font color="#666666"; style="TEXT-DECORATION: underline">Group</font></button>' + '</td>' + '</tr>' + '</table>' + '</div>',
                height: 30
            },
            {
                region: 'south',
                html: '<font face="Times New Roman" size="3" color="#666666">Copyright &copy; 2013-2016 Institute of Geographic Sciences and Natural Resources Research, CAS. All rights reserved.</font>',
                height: 30
            },
            tabs //include "Earth" tab and "Model" tab 
        ]
    });

}); // end of ext
var groupOperation1 = function()
{
    //datashow_win.show();
    group_Win.show();
    Group_Form.getForm().reset();
};
var userlogin = function()
{
    UserLogin_Win.show();
    groupOperation_form.getForm().reset();
};
var userlogout = function()
{
    var xmlUrl = "egcLogout.action";
    var ajax = new Ajax();
    ajax.open("GET", xmlUrl, true);
    ajax.onreadystatechange = function()
    {
        if (ajax.readyState == 4)
        {
            if (ajax.status == 200)
            {
                var tag = ajax.responseText.pJSON().tag;
                if (tag == "0")
                {
                    //document.getElementById('userlogin_btn').style.display = "block";
                    //document.getElementById('userlogout_btn').style.display = "none";
                    //document.getElementById("welcome_label").innerText="Welcome To EGC!"; 
                    //delete_cookie("username"); 
                    current_username = "";
                    window.location.href = "login.html";
                }
            }
        }
    }; // end of ajax.onreadystatechange
    ajax.send(null);
};
document.oncontextmenu = function(e)
{
    return false;
};
document.title = 'Easy GeoComputation';
//
var set_cookie = function(c_name, value)
{
    document.cookie = c_name + "=" + escape(value);
};
var get_cookie = function(cookie_name)
{
    var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    if (results)
        return (unescape(results[2]));
    else
        return "";
};
var delete_cookie = function(cookie_name)
{
    var cookie_date = new Date(); //current date & time
    cookie_date.setTime(cookie_date.getTime() - 1);
    document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
};
var set_loginlogout = function()
{
    current_username = get_cookie("username");
    if (current_username == "")
    {
        login_flag = "block";
        logout_flag = "none";
    }
    else
    {
        login_flag = "none";
        logout_flag = "block";
    }
};
window.onbeforeunload = function(e)
{
    current_username = get_cookie("username");
    if (current_username != "")
    {
        delete_cookie("username");
        userlogout();
        return "Are you sure to leave?";
    }
    current_username = "";
};
