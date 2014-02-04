angular.module('homeCtrl', [
    'services.apiRestangularSrv',
    'services.utilsSrv',
    'ui.utils',
    'directives.brkfstApp'
  ])
  .controller('HomeCtrl', function ($scope, apiRestangularSrv, utilsSrv) {
    //PinnedApps are embedded in the user document, therefore the user must be retrieve to get the PinnedApps
    apiRestangularSrv.one('users', 'me').get().then(function (user) {
      $scope.pinnedAppsGroups = user.pinnedAppsGroups;
    });
  });

