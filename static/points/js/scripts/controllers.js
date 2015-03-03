app.controller("PointsListCtrl", function($scope, $http, $dataFactory, $app)
{
    $scope.data = [];  
    $scope.selected = -1;  
    $dataFactory.list()
        .success(function(data) {
            $scope.data = data; 
        })
        .error(function(error)
        {
            $scope.data = null; 
        });
    
    $scope.getById=function(id) {        
        num=1;
        MAPS.draw.clearLayer();            
        JSZipUtils.getBinaryContent('http://localhost:8000/api/points/json?q=' + id, function(err, data) {
            if(err) throw err; // or handle err
            var zip = new JSZip(data);
            var text = zip.file(id + ".json").asText();
            var worker = new Worker('/static/lotzon/js/scripts/map/view-points-worker.js');
            worker.addEventListener('message', function(e) {  
                num+=1;
                //console.log(num + " " + e.data.final + " " + e.data.value);                 
                var location=MAPS.tools.coordenates2Location(e.data.lon,e.data.lat);
                /*for(var k=0;k<e.data.value;k++)
                {                    
                    MAPS.layer.addPoint(location);
                    location=MAPS.tools.coordenates2Location(e.data.lon,e.data.lat);
                }*/
                //MAPS.layer.addPoint(location);
                MAPS.layer.addPoint({location: location, weight: e.data.value});
                if(e.data.final)
                    MAPS.layer.setLayer();
            }, false);
            worker.postMessage({'points':JSON.parse(text)});
        });
        
    };    
})
.controller("PointsAddCtrl", function($scope, $http, $dataFactory, $app, $location)
{
    $scope.add=function(points) {
        var fd=new FormData();
        console.log(fd);
        $dataFactory.add(points)        
        .success(function(data)
        {
            $location.path('/points/');
        })
        .error(function(error)
        {
            console.log(error);
        });       
    };    
});

/*
    $scope.deleteCommunity = function(id){
        
        if(typeof id != 'undefined'){
        
        $dataFactory.deleteCommunity(id)
        
            .success(function(data)
            {
                 console.log(data); init(); $scope.status = "load data successfuly";                                                                                           
            })
            .error(function(error)
            {
                 $scope.status = 'unable to load data' + error.message;
        });
            
        }
        else{ console.log("parameter id undifined"); }
        
    };
    
    $scope.createCommunity = function(community){
        
        $dataFactory.createCommunity(community)        
            .success(function(data)
            {
                console.log(data); init(); $scope.status = "load data successfuly";                                                                                            
            })
            .error(function(error)
            {
                $scope.status = 'unable to load data' + error.message;
        });       
    };
    
     $scope.updateCommunity = function(community){
        
        $dataFactory.updateCommunity(community)        
            .success(function(data)
            {
                console.log(data); init(); $scope.status = "load data successfuly";                                                                                              
            })
            .error(function(error)
            {
                $scope.status = 'unable to load data' + error.message;
        });       
    };
    
    $scope.findByName = function(args){
    
        $dataFactory.getCommunities()        
            .success(function(data)
            {
                console.log(data); init(); $scope.status = "load data successfuly";                                                                                              
            })
            .error(function(error)
            {
                $scope.data = null; $scope.status = 'unable to load data' + error.message;
        });    
        
        
    };*/