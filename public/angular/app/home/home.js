angular.module('homeCtrl', [
  'services.apiRestangularSrv',
  'services.utilsSrv',
  'ui.utils',
  'ui.sortable',
  'directives.ugApp',
  'directives.ugEditableText',
  'duScroll',
  'matchmedia-ng'
])
  .controller('FavgroupCtrl', function ($scope, apiRestangularSrv) {
    $scope.activateFavgroupTitleEditMode = function () {
      $scope.$broadcast('ugEditableText-edit-text', false);
    };

    $scope.$watch('favgroup.apps', function (newApps, oldApps, scope) {
      if (!_.isEqual(angular.toJson(newApps), angular.toJson(oldApps))) { //Skip init watch call
        var favgroupId = $scope.favgroup.id;
        if (newApps.length === oldApps.length) {  //An App has been moved inside a Favgroup
          //Update the Apps position in the Favgroup
          apiRestangularSrv.all('favgroups').one(favgroupId).all('apps').customPUT(newApps);
        } else { //An App has been removed or added in a Favgroup
          var appNotInBothList = this.getAppNotInBothList(newApps, oldApps);
          if (newApps.length > oldApps.length) {
            //Add the App to the Favgroup
            apiRestangularSrv.one('favgroups', favgroupId).one('apps', appNotInBothList.id).post().then(function () {
              apiRestangularSrv.all('favgroups').one(favgroupId).all('apps').customPUT(newApps);
            });

          } else {
            //Remove the App from the Favgroup
            apiRestangularSrv.one('favgroups', favgroupId).one('apps', appNotInBothList.id).remove().then(function () {
              apiRestangularSrv.all('favgroups').one(favgroupId).all('apps').customPUT(newApps);
            });
          }
        }
      }

      this.getAppNotInBothList = function (appList1, appList2) {
        var largerAppsList = appList1,
          smallerAppsList = appList2;
        if (appList1.length < appList2.length) {
          largerAppsList = appList2;
          smallerAppsList = appList1;
        }

        var appNotFoundInBothList = _.find(largerAppsList, function (app) {
          return _.findIndex(smallerAppsList, {id: app.id}) < 0;
        });

        return appNotFoundInBothList;
      };
    }, true);
  })

  .controller('HomeCtrl', function ($scope, apiRestangularSrv, utilsSrv, $parse, $translate, scroller, matchmedia) {
    matchmedia.onPhone(function (mediaQueryList) {
      $scope.isPhone = mediaQueryList.matches;
    });
    matchmedia.onTablet(function (mediaQueryList) {
      $scope.isTablet = mediaQueryList.matches;
    });

    matchmedia.onDesktop(function (mediaQueryList) {
      $scope.isDesktop = mediaQueryList.matches;
    });

    apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
      $scope.favgroups = favgroups;
    });

    $scope.addFavgroup = function () {
      var newFavgroupTitle = $translate.instant('home.favgroup.new');
      apiRestangularSrv.all('favgroups').post({title: newFavgroupTitle}).then(function (newFavgroup) {
        apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
          $scope.favgroups = favgroups;
        });
      });
    };

    $scope.deleteFavgroup = function (favgroupToDelete, index) {
      apiRestangularSrv.all('favgroups').one(favgroupToDelete.id).remove().then(function () {
        apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
          $scope.favgroups = favgroups;
        });
      });
    };

    $scope.updateFavgroupTitle = function (favgroup) {
      //favgroup is a restangular object and thus we can run a PUT request to update the title
      favgroup.put();
    };

    $scope.moveFavgroupUp = function (favgroup) {
      apiRestangularSrv.all('favgroups').one(favgroup.id).one('decreaseposition').post().then(function (favgroups) {
        apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
          $scope.favgroups = favgroups;
        });
      });
    };

    $scope.moveFavgroupDown = function (favgroup) {
      apiRestangularSrv.all('favgroups').one(favgroup.id).one('increaseposition').post().then(function (favgroups) {
        apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
          $scope.favgroups = favgroups;
        });
      });
    };

    $scope.openApp = function (app) {
      window.open(app.url, '_blank');
    };

    $scope.sortableOptions = {
      connectWith: '.js-favgroup-apps-drop-container',

      // When an app is moved from one favgroup to another the app.favroup.id is correctly
      // persisted in the DB but not in the scope.
      // Updating the app.favgroup located in the scope could be done by calling a new XHR but it's not efficient to
      // rerun this HTTP request just for the modification of one app property. For this reason the app.favgroup.id
      // is manually updated whenever the update app event is called.
      update: function (event, ui) {
        //Retrieve the favgroup id located in the id value of the droptarget element.
        var favgroupIdTarget = ui.item.sortable.droptarget[0].id.split('favgroup_')[1];
        var scope = ui.item.scope();

        if (scope) {
          scope.app.favgroup.id = _.parseInt(favgroupIdTarget);
        }
      },
      helper: 'clone',
      appendTo: 'body',
      placeholder: 'app-sortable-placeholder'
    };

    $scope.$on('ugApp.remove.fav', function (event, removedApp) {
      _.forEach($scope.favgroups, function (favgroup, favgroupIndex) {
        _.forEach(favgroup.apps, function (app, appIndex) {
          if (app.id === removedApp.id && favgroup.id === removedApp.favgroup.id) {
            $scope.favgroups[favgroupIndex].apps.splice(appIndex, 1);
            return false;
          }
        });
      });
    });
  });

