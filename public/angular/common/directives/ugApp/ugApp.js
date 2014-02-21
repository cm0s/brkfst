angular.module('directives.ugApp', [
    'services.apiRestangularSrv'
  ])
  .controller('UgAppCtrl', function ($scope, apiRestangularSrv) {
    $scope.favorite = function favorite(app) {
      apiRestangularSrv.one('favgroups', 'default').one('apps', app.id).post();
    };
  })
  .directive('ugApp', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      controller: 'UgAppCtrl',
      templateUrl: 'directives/ugApp/ugApp.html',
      scope: {
        app: '=model'
      }
    };
  });