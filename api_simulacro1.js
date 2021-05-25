// @formatter:off
require(["esri/map",

        "esri/geometry/Extent",

        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/_base/array",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"], function (Map,Extent,
            ready, parser, on, array,
            BorderContainer, ContentPane) {
             ready(function(){

                parser.parse();

                // Creamos el mapa
                mapMain = new Map("map", {
                    basemap: "topo",
                    extent: new Extent({
                        xmin: -173.24789851593732,
                        ymin: -69.43544422133593,
                        xmax: -16.2692137558099,
                        ymax: 109.10900234289849
                    })
                    
                });
             });  




});