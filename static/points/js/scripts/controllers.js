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
    
    $scope.getById=function(id,type) {
        MAPS.draw.clearLayer();            
        JSZipUtils.getBinaryContent('http://localhost:8000/api/points/json?q=' + id, function(err, data) {
            if(err) throw err; // or handle err
            var zip = new JSZip(data);
            var text = zip.file(id + ".json").asText();
            var worker = new Worker('/static/lotzon/js/scripts/map/view-points-worker.js');
            worker.addEventListener('message', function(e) {  
                var location=MAPS.tools.coordenates2Location(e.data.lon,e.data.lat);
                if(type=='heat')
                {
                    MAPS.layer.addPoint(location);
                    //MAPS.layer.addPoint({location: location, weight: e.data.value});
                    if(e.data.final)
                        MAPS.layer.setLayer();
                }
                else if(type=='point'){
                    var content =  '<div class="maps"><p>' + e.data.text + '</p></div>';
                    MAPS.points.addMarketWithInfoWindowTitleImage(location, content, e.data.id,MAPS.vars.pathIcons + e.data.group + '.png');
                }
            }, false);
            worker.postMessage({'points':JSON.parse(text)});
        });
        
    };    
})
.controller("PointsAddCtrl", function($scope, $http, $dataFactory, $app, $location)
{   
    $scope.files = [];
    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {            
            //add the file object to the scope's files collection
            $scope.files.push(args.file);
        });
    });
    $scope.add=function(points) {
        $dataFactory.add(points,$scope.files)
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