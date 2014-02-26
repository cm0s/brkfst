angular.module('homeCtrl', [
    'services.apiRestangularSrv',
    'services.utilsSrv',
    'ui.utils',
    'ui.sortable',
    'directives.ugApp',
    'directives.ugEditableText'
  ])
  .controller('HomeCtrl', function ($scope, apiRestangularSrv, utilsSrv) {
    apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
      $scope.favgroups = favgroups;
    });

    $scope.updateFavgroupTitle = function (favgroup) {
      favgroup.put();
    };

    $scope.sortableOptions = {
      connectWith: '.js-favgroup-apps-drop-container',
      update: function (event, ui) {
        var appsIds = $(event.target).sortable('serialize');
        var favgroupId = $(event.target).attr('id').split('favgroup_')[1];
        apiRestangularSrv.all('favgroups').one(favgroupId).all('apps').customPUT(appsIds);
      },
      scroll: false,
      key: 'test'
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

