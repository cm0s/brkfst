angular.module('homeCtrl', [
  'services.apiRestangularSrv',
  'services.utilsSrv',
  'ui.utils',
  'ui.sortable',
  'directives.ugApp',
  'directives.ugEditableText',
  'duScroll'
])
  .controller('FavgroupCtrl', function ($scope, apiRestangularSrv) {
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
            //Remove the App to the Favgroup
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

  .controller('HomeCtrl', function ($scope, apiRestangularSrv, utilsSrv, $parse, $translate, scroller) {
    $scope.loadedAppUrl = 'about:blank';

    apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
      $scope.favgroups = favgroups;
    });

    $scope.addFavgroup = function () {
      var newFavgroupTitle = $translate('home.favgroup.new');
      apiRestangularSrv.all('favgroups').post({title: newFavgroupTitle}).then(function (newFavgroup) {
        $scope.favgroups.push(newFavgroup);
      });
    };

    $scope.deleteFavgroup = function (favgroupToDelete, index) {
      apiRestangularSrv.all('favgroups').one(favgroupToDelete.id).remove().then(function () {
        _.remove($scope.favgroups, function (favgroup) {
          return favgroup.id === favgroupToDelete.id;
        });
      });
    };

    $scope.updateFavgroupTitle = function (favgroup) {
      //favgroup is a restangular object and thus we can run a PUT request to update the title
      favgroup.put();
    };

    $scope.loadApp = function (app) {
      //Depending on the app type we open it in the appview or in a new browser window
      switch (app.appType.name) {
        case 'swapp' :
          //TODO should be in a directive (there should be no DOM access in a controller)
          scroller.scrollToElement($('body'), 0, 1000);
          $scope.loadedAppUrl = app.url;
          break;
        default :
          window.open(app.url, '_blank');
      }
    };

    $scope.sortableOptions = {
      connectWith: '.js-favgroup-apps-drop-container',
      update: function (event, ui) {
        var favgroupIdTarget = ui.item.sortable.droptarget[0].id.split('favgroup_')[1];
        var scope = ui.item.scope();
        if (scope) {
          //Update the favgroup.id of the moved app.
          scope.app.favgroup.id = _.parseInt(favgroupIdTarget);
        }
      },

      scroll: false
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

