var mapMain;
var widgetEditor;

// @formatter:off
require([
        "esri/map",
        "esri/dijit/editing/Editor",
        "esri/layers/FeatureLayer",
        "esri/dijit/editing/TemplatePicker",
        "esri/tasks/GeometryService",

        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/_base/array",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map,Editor, FeatureLayer,TemplatePicker,GeometryService,
              ready, parser, on, array,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            /*
             * Step: Specify the proxy Url. NO HACE FALTA. Extension de logeo con el servidor. Se encarga de que no tengas que estar todo el rato escribiendo usuario y contraseña
             */



            // Create the map
            mapMain = new Map("divMap", {
                basemap: "topo",
                center: [-116.64, 34.37],
                zoom: 10
            });

            var flFirePoints, flFireLines, flFirePolygons;

            

            /*
             * Cargamos las capas que serán editables. El outFields corresponde a todos los campos de las capas editables.
             */
            flFirePolygons = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2",{
                outFields: ['*']
            });
            flFireLines = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/1",{
                outFields: ['*']
            });
            flFirePoints = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0",{
                outFields: ['*']
            });
            
            // Listen for the editable layers to finish loading
            mapMain.on("layers-add-result", initEditor);

            // add the editable layers to the map
            mapMain.addLayers([flFirePolygons, flFireLines, flFirePoints]);

            function initEditor(results) {
                console.log("InitEditor", results.layers)
                // Map the event results into an array of layerInfo objects. Esto irá al editor
                var layerInfosWildfire = array.map(results.layers, function (result) {
                    return {
                        featureLayer: result.layer
                    };
                });
                console.log("LayerInfosWoldFire",layerInfosWildfire)

                // Como el TemplatePicker requiere un array de Feature layers, se obtiene todas las propiedades de la capa para que el constructor no se tenga que meter en el servidor
                /*
                 * Step: Map the event results into an array of Layer objects
                 */
                var layersWildfire = array.map(results.layers, function (result) {
                    return  result.layer;
                });
                console.log("layersWildFire",layersWildfire);

                /*
                 * Step: Build the Editor constructor's first parameter
                 */
                var editor_wild = {
                    featureLayers: layersWildfire,
                    columns: 2
                }
                

                 /*
                 * Step: Add a custom TemplatePicker widget
                 */
                var template_picker = new TemplatePicker(editor_wild,"divLeft")
                template_picker.startup();

                /*
                 * Step: Construct the Editor widget
                 */
                var editor_info = {
                    map : mapMain,
                    geometryService : new GeometryService("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer"),
                    layerInfos : layerInfosWildfire,
                    toolbarVisible : true,
                    templatePicker : template_picker,
                    createOptions : {
                        polygonDrawTools : [Editor.CREATE_TOOL_FREEHAND_POLYGON,Editor.CREATE_TOOL_RECTANGLE,Editor.CREATE_TOOL_TRIANGLE, Editor.CREATE_TOOL_CIRCLE]
                    },
                    // CREATE_TOOL_RECTANGLE,Editor.CREATE_TOOL_TRIANGLE, Editor.CREATE_TOOL_CIRCLE
                    toolbarOptions:{
                        reshapeVisible : true
                    },
                    enableUndoRedo: true

                };

                var params_info = {
                    settings : editor_info
                }
                
               
                /*
                 * Step: Prepare the Editor widget settings
                 */
                var editor = new Editor(params_info ,"divTop");    
                editor.startup()
            };

        });
    });
