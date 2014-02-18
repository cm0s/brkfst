angular.module('homeCtrl', [
    'services.apiRestangularSrv',
    'services.utilsSrv',
    'ui.utils',
    'directives.brkfstApp'
  ])
  .controller('HomeCtrl', function ($scope, apiRestangularSrv, utilsSrv) {
    apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).then(function (favgroups) {
      $scope.favgroups = favgroups;
    });
  });

