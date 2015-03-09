'use strict';
app.config(function($routeProvider)
{
    
    $routeProvider.when("/layers/",{ controller: 'LayersListCtrl', templateUrl : "/static/layers/views/index.html"})
    $routeProvider.when("/layers/add",{ controller: 'LayersAddCtrl', templateUrl : "/static/layers/views/add.html"})    
});