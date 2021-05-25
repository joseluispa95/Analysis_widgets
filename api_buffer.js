var mapMain,GS, buffer

require([
    "esri/map",

    "esri/toolbars/draw",
    "esri/graphic",
    "esri/tasks/GeometryService",
    "esri/tasks/BufferParameters",

    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/symbols/SimpleFillSymbol",
    

    "dojo/ready",
    "dojo/parser"], function(Map,Draw,Graphic,GeometryService,BufferParameters,SimpleLineSymbol,Color,SimpleFillSymbol,ready,parser){

        ready(function(){

            parser.parse();

            // Creamos un mapa
            GS = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

            mapMain = new Map("divMap",{
                basemap: "topo",
                center: [-122.45, 37.75],
                zoom: 12
            });

            // Creamos la función que nos permite dibujar una linea
             mapMain.on("load", initToolbar);

    

            function initToolbar() {
                barra_herramienta = new Draw(mapMain);
                barra_herramienta.activate(Draw.LINE);
                barra_herramienta.on("draw-complete",addGraphics);
            }
        
            function addGraphics(line) {
                // barra_herramienta.deactivate();
                console.log("line", line)
                // Linea que dibujamos
                linea = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH,new Color([255,0,0]),3);
        
                var grafico = new Graphic(line.geometry,linea);
                console.log("funciona",line)
            
                mapMain.graphics.add(grafico);

                // Declaramos el buffer

                buffer = new BufferParameters();
    
                buffer.distances = [10,20];
                buffer.unit = GeometryService.UNIT_KILOMETER;
                buffer.geometries = [line.geometry]
                console.log("BUFFER",buffer);

                // Con el método buffer del Geometry Service los pintamos en pantalla. Para ello hay que declarar una funcion, darle estilo y luego mostrarlo por pantalla con el graphic. Params recibe los valores de la declaracion de valores de buffer
                GS.buffer(buffer, function(params){
                    console.log("hola",params);

                    var poligono = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255,0,0]), 2),new Color([255,255,0,0.25]));

                    var poligono1 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255,0,0]), 2),new Color([0,255,0,0.25]));
                    
                    //Params es un array
                    var grafico_buffer = new Graphic(params[0],poligono);
                    mapMain.graphics.add(grafico_buffer);
                    var grafico_buffer1 = new Graphic(params[1],poligono1);
                    mapMain.graphics.add(grafico_buffer1);

                    console.log("el buffer ha funcionado");

                })
                
            }});
    });