angular.module('directives.ugApp', [
  'services.apiRestangularSrv'
])
  .controller('UgAppCtrl', function ($scope, $rootScope, apiRestangularSrv) {
    $scope.addFav = function favorite(app) {
      apiRestangularSrv.one('favgroups', 'default').one('apps', app.id).post();
    };
    $scope.removeFav = function favorite(app) {
      //TODO look if it's really the best place to put the add and remove method
      //delete REST call is handled by the watch on favgroups.app in the HomeCtrl. Not perfect... the add and remove
      //REST request should be located at the same place
      //apiRestangularSrv.one('favgroups', app.favgroup.id).one('apps', app.id).remove();
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