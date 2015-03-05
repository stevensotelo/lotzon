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
    dataFactory.add = function(points, files)
    {
        
        return $http.post(
            $api.path + "/", 
            { model: points, files: files },
            { 'Content-Type': undefined },
            function (data) {
                var formData = new FormData();
                //need to convert our json object to a string version of json otherwise
                // the browser will do a 'toString()' on the object which will result 
                // in the value '[Object object]' on the server.
                formData.append("model", angular.toJson(data.model));
                //now add all of the assigned files
                for (var i = 0; i < data.files; i++) {
                    //add each file to the form data and iteratively name them
                    formData.append("file" + i, data.files[i]);
                }
                return formData;
            });
    };
 
   return dataFactory;  
   
});