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
        console.log("Start process calculate");
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
                    //if(m>5)
                    /*if(m>10000)
                    {
                        self.close();
                        break;
                    }*/
                    //console.log("sections: " + m + " from: " + data.header.sections + " " + ((m/data.header.sections)*100) + "%");
                    self.postMessage({'value':itemValue.v,
                                      'lat_start':lat_start,'lat_end':lat_end,
                                      'lon_start':itemCoor[0],'lon_end':itemCoor[1]});
                    m+=1;
                }
            }
        }
},false);