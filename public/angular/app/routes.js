angular.module('routes', [
    'ui.router',
    'catalogCtrl'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'home/home.html'
      })
      .state('catalog', {
        url: '/catalog',
        templateUrl: 'catalog/catalog.html',
        controller: 'CatalogCtrl'
      });
  });