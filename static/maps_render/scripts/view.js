var URL_MAPS_DATA = "http://localhost:8000/map/";

$(this).ready(function(){
    MAPS.tools.init('map-canvas');
    $("#cboLayers").change(loadLayer);
    $("#cboPoints").change(loadPoints);
    loadPoints();
});

function loadLayer(){
    MAPS.draw.clearLayer();
    JSZipUtils.getBinaryContent(URL_MAPS_DATA + "layer/get/" + $("#cboLayers").val(), function(err, data) {
        if(err) throw err; // or handle err
        var zip = new JSZip(data);
        var text = zip.file($("#cboLayers").val() + ".json").asText();
        
        var worker = new Worker('/static/maps_render/scripts/view-layer-worker.js');
        
        worker.addEventListener('message', function(e) {
            var c=e.data;
            MAPS.draw.addRentangle(MAPS.tools.coordenates2Location(c.lon_start,c.lat_start),
                                   MAPS.tools.coordenates2Location(c.lon_end,c.lat_end),
                                   c.value);
        }, false);
        worker.postMessage({'points':JSON.parse(text)});
    });
}

function loadPoints(){
    MAPS.points.clearMarket();
    JSZipUtils.getBinaryContent(URL_MAPS_DATA + "points/get/" + $("#cboPoints").val(), function(err, data) {        
        if(err) throw err; // or handle err
        var zip = new JSZip(data);
        var text = zip.file($("#cboPoints").val() + ".json").asText();        
        var worker = new Worker('/static/maps_render/scripts/view-points-worker.js');
        
        worker.addEventListener('message', function(e) {            
            var c=e.data;
            console.log(c);
            MAPS.points.addMarketWithInfoWindow(MAPS.tools.coordenates2Location(c.lon,c.lat),
                                                '<h1>' +c.id + '</h1>' + '<p>' + c.text + '</p>' );
        }, false);
        worker.postMessage({'points':JSON.parse(text)});
    });
}