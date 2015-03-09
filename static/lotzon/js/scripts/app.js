var app = angular.module("lotzon",['ngRoute']).
    config(
        function($interpolateProvider, $httpProvider)               
        {
            $interpolateProvider.startSymbol('{$'); 
            $interpolateProvider.endSymbol('$}');
            //$httpProvider.defaults.headers.post["Content-Type"] = "multipart/form-data";
        }
    );

app.value("$app", { "title" : "lotzon" });
