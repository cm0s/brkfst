angular.module('catalogCtrl', ['services.apiRestangularSrv'])
  .controller('CatalogCtrl', function ($scope, apiRestangularSrv) {
    var appCategories = apiRestangularSrv.all('appCategories');
    $scope.appCategories = appCategories.getList().$object;
  });

