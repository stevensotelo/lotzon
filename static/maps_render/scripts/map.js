var url;
var map;
var rectangles = [];
var pos;
var config = ['E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B','E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B'];


function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 2,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    url= "http://localhost:8000/maps/data/get/" + $("#id").val();
    pos=0;
    JSZipUtils.getBinaryContent(url, function(err, data) {
        if(err) throw err; // or handle err
        var zip = new JSZip(data);
        var text = zip.file($("#id").val() + ".json").asText();
        
        var worker = new Worker('/static/maps_render/scripts/map-worker.js');
        
        worker.addEventListener('message', function(e) {
            var c=e.data;
            rectangles[pos]=new google.maps.Rectangle({
                    strokeColor: '#' + config[c.value],
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#' + config[c.value],
                    fillOpacity: 0.35,
                    map: map,
                    bounds: new google.maps.LatLngBounds(
                      new google.maps.LatLng(c.lat_start, c.lon_start),
                      new google.maps.LatLng(c.lat_end, c.lon_end))
                });
            pos+=1;
        }, false);
        
        worker.postMessage({'points':JSON.parse(text)});
        //drawData(JSON.parse(text));
    });
    
}

google.maps.event.addDomListener(window, 'load', initialize);