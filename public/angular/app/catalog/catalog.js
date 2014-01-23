angular.module('catalogCtrl', ['services.apiRestangularSrv', 'services.utilsSrv', 'ui.utils'])
  .controller('CatalogCtrl', function ($scope, apiRestangularSrv, utilsSrv) {
    var appCategories = apiRestangularSrv.all('appCategories');
    $scope.appCategories = appCategories.getList().$object;

    $scope.ignoreAccents = function (item) {
      if (!$scope.search) {
        console.log('true');
        return true;
      }
      var itemTitle = utilsSrv.replaceDiacritics(item.title).toLowerCase();
      var searchInput = utilsSrv.replaceDiacritics($scope.search).toLowerCase();
      console.log('searchInput'+searchInput+'  itemTitle:'+itemTitle);
      return itemTitle.indexOf(searchInput) > -1;
    };
  });

