var app = angular.module("togedle", ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })
    .when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })
    .when('/register', {
        templateUrl: 'templates/register.html',
        controller: 'RegisterController'
    })
    .when('/project/:id', {
        templateUrl: 'templates/project.html',
        controller: 'ProjectController'
    })
    .when('/tile/:name/:id', {
        templateUrl: 'templates/tile.html',
        controller: 'TileController'
    })
    .when('/create', {
        templateUrl: 'templates/create.html',
        controller: 'CreateController'
    })
    .when('/createProject', {
        templateUrl: 'templates/createProject.html',
        controller: 'CreateProjectController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

app.run(function ($rootScope) {
    Parse.initialize("pFC25pM9GzkLNZxSbPKHyQIINxaoNrI1xwJMFrzA",
                       "4FdWCJ4mm9PxhKUcA78xivjRCjoWf6G8PB30wBIs");
    
    // returns current loggedin user
    if (Parse.User.current() != null) {
        Parse.User.current().fetch().then(function (user) {
            $rootScope.sessionUser = user;
            $rootScope.sessionUserForm = user.toJSON();
            if ($rootScope.sessionUser != null) {
            }
        });
    }
   
});


app.run(function($rootScope) {
    $rootScope.accessors = {
      getId: function(row) {
        return row._id
      }
    }
  });

app.controller('HomeController', ['$scope', '$rootScope', 'ParseService', '$location', function ($scope, $rootScope, ParseService, $location) {
    $scope.credential = {};
    $scope.messages = [];
    
    if($rootScope.sessionUser == null) {
        $location.path("/login");
    }
    
    
    if($rootScope.sessionUser != null){
        ParseService.getProjects($rootScope.sessionUser)
        .then(function (result) {
            $scope.projects = result;
            console.log($rootScope.sessionUser);
            console.log($scope.projects);
        }, function (error) {
            $scope.messages.push(error);
        });
    }
    
    $scope.login = function(){
        ParseService.login($scope.credential.email, $scope.credential.password)
        .then(function (result) {
            $rootScope.sessionUser = result;
            $location.path("/");
        }, function (error) {
            $scope.messages.push(error);
        });
    }
}]);

app.controller('LoginController', ['$scope', '$rootScope', 'ParseService', '$location', function ($scope, $rootScope, ParseService, $location) {
    $scope.credential = {};
    $scope.messages = [];
    
    if($rootScope.sessionUser != null) {
        $location.path("/");
    }
    
    $scope.login = function(){
        ParseService.login($scope.credential.email, $scope.credential.password)
        .then(function (result) {
            $rootScope.sessionUser = result;
            $location.path("/");
        }, function (error) {
            $scope.messages.push(error);
        });
    }
}]);



app.controller('RegisterController', ['$scope', '$rootScope', 'ParseService', '$location', function ($scope, $rootScope, ParseService, $location) {

    $scope.messages = [];
    $scope.submit = function(){
        $scope.messages = [];
        if ($scope.credential.password != $scope.credential.passwordRepeat) {
            $scope.messages.push("password and repeated password don't match");
            return;
        }
        ParseService.register($scope.credential)
        .then(function (result) {
            $rootScope.sessionUser = result;
            $location.path("/");
            
        }, function (error) {
            $scope.messages.push(error);
        });
        
    }
    
}]);

app.controller('CreateProjectController', ['$scope', '$rootScope', 'ParseService', '$location', function ($scope, $rootScope, ParseService, $location) {

    $scope.messages = [];
    $scope.submit = function(){
        $scope.messages = [];
        $scope.project.user = $rootScope.sessionUser;
        ParseService.createProject($scope.project)
        .then(function (result) {
            $location.path("/");
        }, function (error) {
            $scope.messages.push(error);
        });
    }
    
}]);

app.controller('CreateController', ['$scope', '$http', function ($scope, $http) {
    $scope.projectInfo = {};
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
    $scope.tools = {};
    $scope.$watch('tools', function(newValue, oldValue) {
        $scope.drawingpad.set("size", $scope.tools.size);
    });
    $scope.drawingpad = $('#colors_sketch').sketch().data('sketch');
    
    $scope.clickColor = function(color){
        $scope.drawingpad.set("color", color);
    };
    
    $scope.mouseOverColor = function(color){
        $scope.tools.color = color;
    };
    
    $scope.clear = function() {
        console.log("clear");
    };
    
    $scope.submit = function() {
        console.log("submit");
    };
    
    $scope.pad = function(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }
    $scope.imageUrl = "http://portalvhds3p9kt60f97ngh.blob.core.windows.net/togedle/tile/" + $routeParams.name + $scope.pad($routeParams.id, 4) + ".jpg";
    $scope.tileNum = $routeParams.id;
    
}]);

app.directive("ngRangeSelect", function () {
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                console.log(e);
            })
        }
    }

});