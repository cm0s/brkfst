angular.module('catalogCtrl', ['services.apiRestangularSrv'])
  .controller('CatalogCtrl', function ($scope, apiRestangularSrv) {
    var apps = apiRestangularSrv.all('apps');
    $scope.apps = apps.getList().$object;

  });

