var map;

var config = ['E6E6FA','D8BFD8','DDA0DD','EE82EE','DA70D6','FF00FF','BA55D3','9370DB','8A2BE2','9400D3','9932CC','8B008B','800080','4B0082','6A5ACD','483D8B'];

function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 2,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    var url= "http://localhost:8000/maps/data/get/" + $("#id").val();
    $.getJSON( url, {})
    .done(function( data ) {
        var size = data.header.size;
        $.each( data.content, function( i, item ) {
            var lat = item.v;            
            $.each(item.d, function( j, itemValue ) {
                $.each(itemValue.c, function( k, itemCoor ) {
                    var rectangle = new google.maps.Rectangle({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35,
                        map: map,
                        bounds: new google.maps.LatLngBounds(
                          new google.maps.LatLng(lat, itemCoor[0]),
                          new google.maps.LatLng(lat+size, itemCoor[1]))
                    });
                });
            });
            
        });
    });  
}

google.maps.event.addDomListener(window, 'load', initialize);