angular.module('directives.brkfstApp', [])
  .directive('brkfstApp', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'directives/brkfstApp/brkfstApp.html',
      scope: {
        app: '=model'
      }
    };
  });