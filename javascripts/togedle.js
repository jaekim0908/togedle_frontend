var app = angular.module("togedle", ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'ProjectsController'
    })
    .when('/project/:id', {
        templateUrl: 'templates/project.html',
        controller: 'ProjectController'
    })
    .when('/tile/:name/:id', {
        templateUrl: 'templates/tile.html',
        controller: 'TileController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

app.run(function($rootScope) {
    $rootScope.accessors = {
      getId: function(row) {
        return row._id
      }
    }
  });

app.controller('ProjectsController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $http({method: 'GET', url: 'http://localhost:3000/projects'})
    .success(function(data, status, headers, config) {
        $scope.projects = data;
    })
    .error(function(data, status, headers, config) {
        console.log(data);
    });
}]);

app.controller('ProjectController', ['$scope', '$rootScope', '$routeParams', '$http', '$location', function ($scope, $rootScope, $routeParams, $http, $location) {
    $http({method: 'GET', url: 'http://localhost:3000/project/' + $routeParams.id})
    .success(function(data, status, headers, config) {
        $scope.project = data;
    })
    .error(function(data, status, headers, config) {
        console.log(data);
    });
    
    $scope.paintTile = function() {
        $http({method: 'GET', url: 'http://localhost:3000/randomTile/' +  $routeParams.id})
        .success(function(data, status, headers, config) {
            $location.path("/tile/" + $scope.project.imagePrefix + '/' + data.tile);
        })
        .error(function(data, status, headers, config) {
            console.log(data);
        });
    }
}]);

app.controller('TileController', ['$scope', '$rootScope', '$routeParams', '$http', function ($scope, $rootScope, $routeParams, $http) {
    prepareCanvas();
    $scope.pad = function(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }
    $scope.imageUrl = "http://portalvhds3p9kt60f97ngh.blob.core.windows.net/togedle/tile/" + $routeParams.name + $scope.pad($routeParams.id, 4) + ".jpg";
    $scope.tileNum = $routeParams.id;
    
}]);