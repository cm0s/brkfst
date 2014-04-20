angular.module('directives.ugApp', [
  'services.apiRestangularSrv',
  'ui.utils'
])
  .controller('UgAppCtrl', function ($scope, $rootScope, apiRestangularSrv) {
    $scope.addOrRemoveFav = function (app) {
      //Stop click event propagation
      event.stopPropagation();

      if (app.isFavorited) {
        apiRestangularSrv.one('favgroups', 'all').one('apps', app.id).remove().then(function () {
          app.isFavorited = false;
        });
      } else {
        app.isFavorited = true;
        apiRestangularSrv.one('favgroups', 'default').one('apps', app.id).post();
      }
    };
    $scope.removeFav = function (app) {
      //TODO look if it's really the best place to put the add and remove method
      //delete REST call is handled by the watch on favgroups.app in the HomeCtrl. Not perfect... the add and removee
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
        hasUnfavIcon: '=',
        textToHighlight: '='
      }
    };
  });