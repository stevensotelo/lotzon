var map;
var rectangles = [];
var size;
var url= "";
var config = ['E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B'];

function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 2,
        center: new google.maps.LatLng(3, -72),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    var url= "http://localhost:8000/maps/data/get/" + $("#id").val();
    var lat_start=null;
    var lat_end=null;
    $.getJSON(url)
    .done(function( data ) {
        console.log(data);
        size = data.header.size;
        var l=0;
        $.each( data.content, function( i, item ) {            
            if(lat_start==null){                
                lat_start = item.v;
                lat_end = item.v + size;
            }
            else{
                lat_end = lat_start + 0;
                lat_start = item.v;
            }            
            $.each(item.d, function( j, itemValue ) {
                $.each(itemValue.c, function( k, itemCoor ) {                    
                    rectangles[l]=new google.maps.Rectangle({
                        strokeColor: '#' + config[itemValue.v],
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#' + config[itemValue.v],
                        fillOpacity: 0.35,
                        map: map,
                        bounds: new google.maps.LatLngBounds(
                          new google.maps.LatLng(lat_start, itemCoor[0]),
                          new google.maps.LatLng(lat_end, itemCoor[1]))
                    });
                    l+=1;
                });
            });
        });
    });  
}

google.maps.event.addDomListener(window, 'load', initialize);