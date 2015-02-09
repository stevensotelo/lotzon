$(this).ready(function(){
    MAPS.tools.init('map-canvas');
    var url = "http://localhost:8000/map/layer/get/" + $("#id").val();
    JSZipUtils.getBinaryContent(url, function(err, data) {
        if(err) throw err; // or handle err
        var zip = new JSZip(data);
        var text = zip.file($("#id").val() + ".json").asText();
        
        var worker = new Worker('/static/maps_render/scripts/view-worker.js');
        
        worker.addEventListener('message', function(e) {
            var c=e.data;
            console.log(e.data);
            MAPS.draw.addRentangle(MAPS.tools.coordenates2Location(c.lon_start,c.lat_start),
                                   MAPS.tools.coordenates2Location(c.lon_end,c.lat_end),
                                   c.value);
        }, false);
        worker.postMessage({'points':JSON.parse(text)});
    });
    
});