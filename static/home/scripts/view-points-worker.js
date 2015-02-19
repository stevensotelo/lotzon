self.addEventListener('message', 
    function(e) {
        var data = e.data.points.points;
        for(var i=0;i<data.length; i++){
            self.postMessage({'group':data[i].g,
                            'id':data[i].i,
                            'lat':data[i].lt,
                            'lon':data[i].ln,
                            'text':data[i].t,
                            'value':data[i].v,
                            'final':(i==(data.length-1)?true:false)});
            
        }
},false);