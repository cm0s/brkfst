angular.module('catalogCtrl', [
  'services.apiRestangularSrv',
  'services.utilsSrv',
  'ui.utils',
  'directives.ugApp',
  'directives.ugShowModal'
])
  .controller('CatalogCtrl', function ($scope, apiRestangularSrv, utilsSrv) {

    apiRestangularSrv.all('categories').getList({embed: 'apps'}).then(function (categories) {
      $scope.categories = categories;

      //Create an array of apps from the array of category which have the apps embedded inside.
      //This way it's not necessary to run a second REST request to retrieve the apps list.
      var apps = [];
      _.forEach(categories, function (category) {
        apps = apps.concat(category.apps);
      });
      //Make sure the app array doesn't contain duplicate app.
      $scope.apps = _.uniq(apps, 'id');
    });

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

    $scope.showApp = function (app) {
      //Depending on the app type we open it inside the application or in a new browser window
      switch (app.appType.name) {
        case 'swapp' :
          $scope.app = {
            title: app.title,
            url: app.url,
            imageFileName: app.imageFileName
          };

          //Display the app in a modal window
          $scope.isModalShown = true;
          break;
        default :
          //Display the app in a new browser tab
          window.open(app.url, '_blank');
      }
    };
  });

