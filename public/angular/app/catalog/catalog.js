angular.module('catalogCtrl', [
    'services.apiRestangularSrv',
    'services.utilsSrv',
    'ui.utils',
    'directives.brkfstApp'
  ])
  .controller('CatalogCtrl', function ($scope, apiRestangularSrv, utilsSrv) {
    var
      appCategories = apiRestangularSrv.all('categories'),
      apps = apiRestangularSrv.all('apps');

    $scope.appCategories = appCategories.getList({embed: 'apps'}).$object;
    $scope.apps = apps.getList().$object;
    $scope.isSearchInputEmpty = true;

    $scope.hideCategories = function () {
      $scope.isSearchInputEmpty = _.isEmpty($scope.search);
    };

    //Filter which ignores accents and also handle text separated by special chars like space, dot, etc.
    $scope.textFilter = function (item) {
      if (!$scope.search) {
        return true;
      }

      //Replace all special char and lowercase the result
      var itemTitle = utilsSrv.replaceDiacritics(item.title).toLowerCase();
      var searchInput = utilsSrv.replaceDiacritics($scope.search).toLowerCase();

      //Split search input with the following char: , .$*+()_-
      var searchInputSplit = searchInput.split(/(?:,| |\.|\$|\*|\+|\(|\)|_|-)+/);

      //Run a lodash find function to see if one of the split element of
      //the search input is not found. If at least one is not found it means the
      //filter must indicates it's a no match (return false). Otherwise it match
      //and the filter return true.
      var elementNotFound = _.find(searchInputSplit, function (searchInputElement) {
        if (itemTitle.indexOf(searchInputElement) < 0) {
          return true;
        }
        return false;
      });
      if (!elementNotFound) {
        return true;
      }
      return false;
    };
  });

