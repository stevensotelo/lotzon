var URL_MAPS_DATA = "http://localhost:8000/map/";

$(this).ready(function(){
    MAPS.tools.init('map-canvas');
    $("#cboLayers").change(loadLayer);
    $("#cboPoints").change(loadPoints);
    
    $(".content-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    
     loadPoints();
});

function loadLayer(){
    if($("#cboLayers").val() !== undefined)
    {
        MAPS.draw.clearLayer();
        if(MAPS.vars.grandient==[])
            MAPS.tools.generateGradient(100);
        JSZipUtils.getBinaryContent(URL_MAPS_DATA + "layer/get/" + $("#cboLayers").val(), function(err, data) {
            if(err) throw err; // or handle err
            var zip = new JSZip(data);
            var text = zip.file($("#cboLayers").val() + ".json").asText();

            var worker = new Worker('/static/home/scripts/view-layer-worker.js');

            worker.addEventListener('message', function(e) {
                var c=e.data;
                MAPS.draw.addRentangle(MAPS.tools.coordenates2Location(c.lon_start,c.lat_start),
                                       MAPS.tools.coordenates2Location(c.lon_end,c.lat_end),
                                       c.value);
            }, false);
            worker.postMessage({'points':JSON.parse(text)});
        });
    }
}

/*
function loadPoints(){
    var num=0;
    if($("#cboPoints").val() !== undefined)
    {
        MAPS.points.clearMarket();
        JSZipUtils.getBinaryContent(URL_MAPS_DATA + "points/get/" + $("#cboPoints").val(), function(err, data) {        
            if(err) throw err; // or handle err
            var zip = new JSZip(data);
            var text = zip.file($("#cboPoints").val() + ".json").asText();        
            var worker = new Worker('/static/home/scripts/view-points-worker.js');

            worker.addEventListener('message', function(e) {  
                num+=1;
                //console.log(num + " " + e.data.final + " " + e.data.value);                 
                var location=MAPS.tools.coordenates2Location(e.data.lon,e.data.lat);
                /*for(var k=0;k<e.data.value;k++)
                {                    
                    MAPS.layer.addPoint(location);
                    location=MAPS.tools.coordenates2Location(e.data.lon,e.data.lat);
                }
                MAPS.layer.addPoint(location);
                //MAPS.layer.addPoint({location: location, weight: e.data.value});
                if(e.data.final)
                    MAPS.layer.setLayer();
            }, false);
            worker.postMessage({'points':JSON.parse(text)});
        });
    }    
}
*/

function loadPoints(){
    var num=0;
    if($("#cboPoints").val() !== undefined)
    {
        MAPS.points.clearMarket();
        JSZipUtils.getBinaryContent(URL_MAPS_DATA + "points/get/" + $("#cboPoints").val(), function(err, data) {        
            if(err) throw err; // or handle err
            var zip = new JSZip(data);
            var text = zip.file($("#cboPoints").val() + ".json").asText();        
            var worker = new Worker('/static/home/scripts/view-points-worker.js');

            worker.addEventListener('message', function(e) {  
                num+=1;
                console.log(num);
                var content =  '<div class="maps"><p>' + e.data.text + '</p></div>';
                MAPS.points.addMarketWithInfoWindowTitleImage(MAPS.tools.coordenates2Location(e.data.lon,e.data.lat), content, e.data.id,MAPS.vars.pathIcons + e.data.group + '.png');
            }, false);
            worker.postMessage({'points':JSON.parse(text)});
        });
    }    
}