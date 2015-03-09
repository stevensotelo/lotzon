app.controller("LayersListCtrl", function($scope, $http, $dataFactoryLayer, $app)
{
    $scope.data = [];  
    $dataFactoryLayer.list()
        .success(function(data) {
            $scope.data = data; 
        })
        .error(function(error)
        {
            $scope.data = null; 
        });
    
    $scope.getById=function(id) {
        if(MAPS.vars.grandient==[])
            MAPS.tools.generateGradient(100);
        JSZipUtils.getBinaryContent('http://localhost:8000/api/layers/json?q=' + id, function(err, data) {
            if(err) throw err; // or handle err
            var zip = new JSZip(data);
            var text = zip.file(id + ".json").asText();

            var worker = new Worker('/static/lotzon/js/scripts/map/view-layer-worker.js');

            worker.addEventListener('message', function(e) {
                var c=e.data;
                MAPS.draw.addRentangle(MAPS.tools.coordenates2Location(c.lon_start,c.lat_start),
                                       MAPS.tools.coordenates2Location(c.lon_end,c.lat_end),
                                       c.value);
            }, false);
            worker.postMessage({'points':JSON.parse(text)});
        });
    };    
})
.controller("LayersAddCtrl", function($scope, $http, $dataFactoryLayer, $app, $location)
{   
    $scope.add=function(layer) {
        var formData = new FormData();
        formData.append("title", layer.title);
        formData.append("file" , $('#file').prop('files')[0]);        
        jQuery.ajax({
            url: 'http://localhost:8000/api/layers/json/',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data){
                $location.path('/layers');
            },
            error: function(error){
                console.log(error);
            }
        });
    };    
});