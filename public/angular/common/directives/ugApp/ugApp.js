angular.module('directives.ugApp', [
    'services.apiRestangularSrv'
  ])
  .controller('UgAppCtrl', function ($scope, $rootScope, apiRestangularSrv) {
    $scope.addFav = function favorite(app) {
      apiRestangularSrv.one('favgroups', 'default').one('apps', app.id).post();
    };
    $scope.removeFav = function favorite(app) {
      apiRestangularSrv.one('favgroups', app.favgroup.id).one('apps', app.id).remove();
      $rootScope.$broadcast('ugApp.remove.fav', app);
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
        app: '=model',
        hasFavIcon: '=',
        hasUnfavIcon: '='
      }
    };
  });