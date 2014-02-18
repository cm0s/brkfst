angular.module('directives.ugApp', [])
  .directive('ugApp', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'directives/ugApp/ugApp.html',
      scope: {
        app: '=model'
      }
    };
  });