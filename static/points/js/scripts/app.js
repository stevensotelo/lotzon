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

app.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0;i<files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }                                       
            });
        }
    };
});