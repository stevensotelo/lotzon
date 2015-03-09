app.constant("$apiLayer", { "path" : "/api/layers/", "format":"json" });

app.factory("$dataFactoryLayer", function($apiLayer, $app, $http){
   
    $apiLayer.path+=$apiLayer.format;
    
    var dataFactoryLayer = {};

    dataFactoryLayer.list = function()
    {
        return $http.get($apiLayer.path);
    };
    dataFactoryLayer.getById = function(id)
    {        
        return $http.get($apiLayer.path + '?q=' + id );
    };
    dataFactoryLayer.delete = function(id){
        return $http.delete($apiLayer.path + "?pk=" + id);
    };
    dataFactoryLayer.add = function(pointsData)
    {
        return $http.post($apiLayer.path + "/", pointsData);
    };
 
   return dataFactoryLayer;  
   
});