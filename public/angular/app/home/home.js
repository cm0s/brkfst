angular.module('homeCtrl', [
    'services.apiRestangularSrv',
    'services.utilsSrv',
    'ui.utils',
    'directives.ugApp'
  ])
  .controller('HomeCtrl', function ($scope, apiRestangularSrv, utilsSrv) {
    apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
      $scope.favgroups = favgroups;
    });

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

