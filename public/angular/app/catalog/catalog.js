angular.module('catalogCtrl', ['services.apiRestangularSrv','ui.utils'])
  .controller('CatalogCtrl', function ($scope, apiRestangularSrv) {
    var appCategories = apiRestangularSrv.all('appCategories');
    $scope.appCategories = appCategories.getList().$object;
  });

