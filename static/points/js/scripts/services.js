app.constant("$api", { "path" : "/api/points/", "format":"json" });

app.factory("$dataFactory", function($api, $app, $http){
   
    $api.path+=$api.format;
    
    var dataFactory = {};

    dataFactory.list = function()
    {
        return $http.get($api.path);
    };
    dataFactory.getById = function(id)
    {        
        return $http.get($api.path + '?q=' + id );
    };
    dataFactory.delete = function(id){
        return $http.delete($api.path + "?pk=" + id);
    };
    dataFactory.add = function(pointsData)
    {
        return $http.post($api.path + "/", pointsData);
    };
 
   return dataFactory;  
   
});