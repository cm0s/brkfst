angular.module('directives.brkfstApp', [])
  .controller('BrkfstAppCtrl', function ($scope) {
    var test;
  })

  .directive('brkfstApp', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      controller: 'BrkfstAppCtrl',
      templateUrl: 'directives/brkfstApp/brkfstApp.html',
      scope: {
        app: '=model'
      }
    };
  });

