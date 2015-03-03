'use strict';
app.config(function($routeProvider)
{
    
    $routeProvider.when("/points/",{ controller: 'PointsListCtrl', templateUrl : "/static/points/views/index.html"})
    $routeProvider.when("/points/add",{ controller: 'PointsAddCtrl', templateUrl : "/static/points/views/add.html"})
    /*
    .when("/info/:id",
    {
        title: 'info',templateUrl : "/media/views/communities/info.html"       
    })    
    
    .when("/about",
    {
        title: 'info',templateUrl : "/media/views/communities/info.html"       
    })    
    
    .when("/add",
    {
        title: 'add',templateUrl : "/media/views/communities/add.html"
    })
    
    
    .when("/edit/:id",
    {
        title: 'edit',templateUrl : "/media/views/communities/edit.html"
    })
    
    .when("/remove/:id",
    {
        title: 'remove',templateUrl : "/media/views/communities/remove.html"
    })*/
     
});