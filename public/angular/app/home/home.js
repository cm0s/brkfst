angular.module('homeCtrl', [
  'services.apiRestangularSrv',
  'services.utilsSrv',
  'ui.utils',
  'ui.sortable',
  'directives.ugApp',
  'directives.ugEditableText'
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
            apiRestangularSrv.one('favgroups', favgroupId).one('apps', appNotInBothList.id).post();
            apiRestangularSrv.all('favgroups').one(favgroupId).all('apps').customPUT(newApps);
          } else {
            //Remove the App to the Favgroup
            apiRestangularSrv.one('favgroups', favgroupId).one('apps', appNotInBothList.id).remove();
            apiRestangularSrv.all('favgroups').one(favgroupId).all('apps').customPUT(newApps);
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
      }

      /*      console.log('----OLDVALUE-----');
       _.forEach(oldApps, function (app, key) {
       console.log(key + '-' + app.title);
       });
       console.log('----NEWVALUE-----');
       _.forEach(newApps, function (app, key) {
       console.log(key + '-' + app.title);
       });*/
    }, true);
  })
  .controller('HomeCtrl', function ($scope, apiRestangularSrv, utilsSrv, $parse) {
    apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
      $scope.favgroups = favgroups;
      /*_.forEach($scope.favgroups, function (favgroup, key) {
       $scope.$watch('favgroups[1].apps', function (newValue, oldValue, scope) {
       console.log(newValue);
       }, true);
       });*/
    });

    $scope.updateFavgroupTitle = function (favgroup) {
      favgroup.put();
    };


    /* $scope.$watch(function (scope) {
     return angular.toJson($scope.favgroups);
     }, function (newValue, oldValue, scope) {


     if (newValue === oldValue) {
     console.log(newValue);

     } else {
     console.log('----OLDVALUE-----');
     _.forEach(angular.fromJson(oldValue), function (favgroup, key) {

     console.log(favgroup.title);
     _.forEach(favgroup.apps, function (app, key) {
     console.log(key + '-' + app.title);
     });
     });
     console.log('----NEWVALUE-----');
     _.forEach(angular.fromJson(newValue), function (favgroup, key) {
     console.log(favgroup.title);
     _.forEach(favgroup.apps, function (app, key) {
     console.log(key + '-' + app.title);
     });
     });

     }
     });*/

    $scope.sortableOptions = {
      connectWith: '.js-favgroup-apps-drop-container',
      //TODO should be replaced by the update event once the issue https://github.com/angular-ui/ui-sortable/issues/137 is resolved
      /* stop: function (event, ui) {
       var favgroup = {};
       favgroup.appsIds = $(event.target).sortable('toArray');
       var favgroupId = $(event.target).attr('id').split('favgroup_')[1];
       apiRestangularSrv.all('favgroups').one(favgroupId).all('apps').customPUT(favgroup);
       },

       //TODO update is really needed to make it work.
       update: function (event, ui) {
       console.log('update-');
       },
       */
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

