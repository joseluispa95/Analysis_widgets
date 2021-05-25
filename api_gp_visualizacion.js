var mapMain;

// @formatter:off
require([
        "esri/map",
        "esri/toolbars/draw",
        "esri/graphic",
        "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",

        "esri/tasks/Geoprocessor",
        "esri/tasks/FeatureSet",
        "esri/tasks/LinearUnit",

        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/_base/array"],
    function (Map, Draw, Graphic, graphicsUtils, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color,Geoprocessor,FeatureSet,LinearUnit,
              ready, parser, on, array) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Create the map
            mapMain = new Map("divMap", {
                basemap: "topo",
                center: [-122.45, 37.75],
                zoom: 12
            });

            /*
             * Step: Construct the Geoprocessor
             */
            

            var gp = new Geoprocessor ("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed");


            mapMain.on("load", function () {
                /*
                 * Step: Set the spatial reference for output geometries
                 */
                gp.setOutputSpatialReference({
                    
                    "wkid":54003
                })


            });

            // Collect the input observation point
            var tbDraw = new Draw(mapMain);
            tbDraw.on("draw-end", calculateViewshed);
            tbDraw.activate(Draw.POINT);

            function calculateViewshed(evt) {

                // clear the graphics layer
                mapMain.graphics.clear();

                // marker symbol for drawing viewpoint
                var smsViewpoint = new SimpleMarkerSymbol();
                smsViewpoint.setSize(12);
                smsViewpoint.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
                smsViewpoint.setColor(new Color([0, 0, 0]));

                // add viewpoint to the map
                var graphicViewpoint = new Graphic(evt.geometry, smsViewpoint);
                mapMain.graphics.add(graphicViewpoint);
                
                console.log("esto es ", graphicViewpoint)

                // Declaramos un Feature set donde declararemos los parametros del servicio

                var feature_set = new FeatureSet();

                feature_set.features = [graphicViewpoint];


                // Declaramos los segundos parametros. En este caso será el Viewshed_Distance

                var linear_unit = new LinearUnit();

                linear_unit.distance = 2;
                linear_unit.units = "esriKilometers";

                console.log("esto es linear unit",linear_unit);

                /*
                 * Step: Build the input parameters into a JSON-formatted object
                 */
                var params = {
                    "Input_Observation_Point": feature_set,
                    "Viewshed_Distance": linear_unit
                };
                

                /*
                 * Step: Wire and execute the Geoprocessor
                 */
                gp.execute(params,displayViewshed);

            }

            function displayViewshed(results, messages) {
                console.log("esta dentro de display")
                // polygon symbol for drawing results
                var sfsResultPolygon = new SimpleFillSymbol();
                sfsResultPolygon.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.5]), 1));
                sfsResultPolygon.setColor(new Color([255, 127, 0, 0.5]));

                /*
                 * Step: Extract the array of features from the results
                 */
                var arrayFeatures = results[0].value.features;


                // loop through results
                array.forEach(arrayFeatures, function (feature) {
                    /*
                     * Step: Symbolize and add each graphic to the map's graphics layer
                     */


                });

                // update the map extent
                var extentViewshed = graphicsUtils.graphicsExtent(mapMain.graphics.graphics);
                mapMain.setExtent(extentViewshed, true);
            }

        });
    });
