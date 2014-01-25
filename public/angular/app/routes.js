angular.module('routes', [
    'ui.router',
    'catalogCtrl'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'home/index.html'
      })
      .state('catalog', {
        url: '/catalog',
        templateUrl: 'catalog/catalog.html',
        controller: 'CatalogCtrl'
      });
  });