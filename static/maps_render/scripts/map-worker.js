self.addEventListener('message', 
    function(e) {       
        var data = e.data.points;
        var lat_start=null;
        var lat_end=null;
        var size = data.header.size;
        var item;
        var itemValue;
        var itemCoor;
        var m=0;
        for(var i=0;i<data.content.length; i++){
            item=data.content[i];
            if(lat_start==null){                
                lat_start = item.v;
                lat_end = item.v + size;
            }
            else{
                lat_end = lat_start + 0;
                lat_start = item.v;
            }
            for(var j=0;j<item.d.length;j++){
                itemValue=item.d[j]; 
                for(var k=0;k<itemValue.c.length;k++){
                    itemCoor=itemValue.c[k];
                    if(m>22000)
                    {
                        self.close();
                        break;
                    }
                    console.log("sections: " + m + " from: " + data.header.sections + " " + ((m/data.header.sections)*100) + "%");
                    self.postMessage({'value':itemValue.v,
                                      'lat_start':lat_start,'lat_end':lat_end,
                                      'lon_start':itemCoor[0],'lon_end':itemCoor[1]});
                    m+=1;
                }
            }
        }
        /*drawData(e.data.points);
        console.log('Dibujado');
        self.postMessage({'msg':'Ready','rectangles':rectangles});*/
},false);

/*
function drawData(data){  
    console.log(data);
    var lat_start=null;
    var lat_end=null;
    var size = data.header.size;
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
                    //map: map,
                    bounds: new google.maps.LatLngBounds(
                      new google.maps.LatLng(lat_start, itemCoor[0]),
                      new google.maps.LatLng(lat_end, itemCoor[1]))
                });
                l+=1;
            });
        });
    });    
}*/