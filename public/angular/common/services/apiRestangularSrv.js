angular.module('services.apiRestangularSrv', [
    'restangular'
  ])
  .factory('apiRestangularSrv', function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('api');
    });
  });
