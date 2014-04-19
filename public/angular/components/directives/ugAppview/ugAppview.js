angular.module('directives.ugAppview', [])
  .controller('UgAppviewCtrl', function ($scope) {
    console.log('NEW');
  })
  .directive('ugAppview', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      controller: 'UgAppviewCtrl',
      templateUrl: 'directives/ugAppview/ugAppview.html',
      link: function ($scope, element, attrs) {
        // To retrieve the attribute we don't use the scope property and use instead
        // the link function this way we avoid the creation of a new scope.
        $scope.hasCloseIcon = attrs.hasCloseIcon;
      }
    };
  });

