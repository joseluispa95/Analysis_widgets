var mymap,toggle;

require(["esri/map",
"esri/geometry/Extent",
"dojo/domReady!"], function(Map,Extent) { 
    
    myMap = new Map("divMap1",{
        basemap: "osm",
        // center: [-0.117553, 38.8432],
        // zoom: 600,

        extent: new Extent(
            {
                
                xmax: -0.0688838644960129,
                xmin: -0.15986439428104646,
                ymax: 38.89344154702586,
                ymin: 38.78647583903632,
                spatialReference: {wkid: 4326}
            
        })

        
    });
    myMap1 = new Map("divMap2",{
        basemap: "osm",
        // center: [-0.117553, 38.8432],
        // zoom: 600,

        extent: new Extent(
            {
                
                xmax: -0.0688838644960129,
                xmin: -0.15986439428104646,
                ymax: 38.89344154702586,
                ymin: 38.78647583903632,
                spatialReference: {wkid: 4326}
            
        })

        
    });

    

})