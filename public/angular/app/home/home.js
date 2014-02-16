angular.module('homeCtrl', [
    'services.apiRestangularSrv',
    'services.utilsSrv',
    'ui.utils',
    'directives.brkfstApp'
  ])
  .controller('HomeCtrl', function ($scope, apiRestangularSrv, utilsSrv) {
    $scope.favgroups = apiRestangularSrv.all('favgroups').getList({embed: 'apps'}).$object;
  });

