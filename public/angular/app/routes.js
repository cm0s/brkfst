angular.module('routes', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'home/index.html'
      })
      .when('/catalog', {
        templateUrl: 'catalog/catalog.html',
        controller: 'CatalogCtrl'
      })
      .when('/', {redirectTo: '/home'})
      .otherwise({redirectTo: '/'});
  }]);