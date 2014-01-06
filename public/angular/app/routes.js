angular.module('routes', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/home', {templateUrl: 'home/index.html'})
      .when('/', {redirectTo: '/home'})
      .otherwise({redirectTo: '/'});
  }]);