var URL_MAPS_DATA = "http://localhost:8000/map/";

$(this).ready(function(){
    MAPS.tools.init('map-canvas');
    $("#cboLayers").change(loadLayer);
    $("#cboPoints").change(loadPoints);
    loadLayer();
    loadPoints();
});

function loadLayer(){
    if($("#cboLayers").val() !== undefined)
    {
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
}

function loadPoints(){
    if($("#cboPoints").val() !== undefined)
    {
        MAPS.points.clearMarket();
        JSZipUtils.getBinaryContent(URL_MAPS_DATA + "points/get/" + $("#cboPoints").val(), function(err, data) {        
            if(err) throw err; // or handle err
            var zip = new JSZip(data);
            var text = zip.file($("#cboPoints").val() + ".json").asText();        
            var worker = new Worker('/static/maps_render/scripts/view-points-worker.js');

            worker.addEventListener('message', function(e) {  
                var content =  '<div class="maps"><p>' + e.data.text + '</p></div>';
                MAPS.points.addMarketWithInfoWindowTitleImage(MAPS.tools.coordenates2Location(e.data.lon,e.data.lat), content, e.data.id,MAPS.vars.pathIcons + e.data.group + '.png');
            }, false);
            worker.postMessage({'points':JSON.parse(text)});
        });
    }    
}