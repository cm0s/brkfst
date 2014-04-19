angular.module('directives.ugAppview', [])
  .directive('ugAppview', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'directives/ugAppview/ugAppview.html',
      link: function ($scope, element, attrs) {
        // To retrieve the attribute we don't use the scope property and use instead
        // the link function this way we avoid the creation of a new scope.
        $scope.hasCloseIcon = attrs.hasCloseIcon;

        var iframe = $('.js-appview-iframe', element)[0];
        iframeplus.addAllListeners(iframe);
      }
    };
  });

