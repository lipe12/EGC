/**
 * [DataTreeController]
 * @param {[type]} me ['this']
 */
var DTC_datasetName, DTC_uploader;
var DataTreeController = function()
{
    var displayKML = function()
    {
        /**
         if(personal data)
         var kmlPath =kml/current_username/DTC_datasetName.kml
         if(group)
         username-group-each user=kml/each user/DTC_datasetName.kml exists?
         if(shared)
            shares.xml-uploder=kml/uploder/DTC_datasetName.kml
         */
        grid.getSelectionModel().deselectAll();
        var kmlPath = DTC_uploader + '/' + DTC_datasetName + '.kml';
        //alert(datasetname);                                 
        var xmlUrl = "findkmlextent1.action?datasetname=" + DTC_datasetName + "&upLoader=" + DTC_uploader;
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
                                if(kmllayer.features.length>0){
                                var center_kml = kmllayer.features[0].geometry.getBounds().getCenterLonLat();
                                map.panTo(center_kml);}
                                else
                                    Ext.Msg.alert('tip', 'kml file does not exist');
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
                        Ext.Msg.alert('tip', 'kml file does not exist');
                    }
                }
            }
        };
    };
    var locationAction = new Ext.create('Ext.Action',
    {
        text: 'show location',
        handler: displayKML,
        iconCls: 'Mapgo',
        tooltip:'Show the location of selected data on map'
    });
    //tree contextmenu
    var contextmenu = new Ext.menu.Menu(
    {
        items: [locationAction]
    });

    return {
        contextmenu: contextmenu
    }
}(DTC_datasetName,DTC_uploader);
