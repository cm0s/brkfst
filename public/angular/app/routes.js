angular.module('routes', [
  'ui.router',
  'catalogCtrl',
  'homeCtrl'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
      })
      .state('catalog', {
        url: '/catalog',
        templateUrl: 'catalog/catalog.html',
        controller: 'CatalogCtrl'
      });

    $urlRouterProvider.otherwise('/home');
  });