angular.module('directives.ugNav', [])
  .directive('ugNav', function ($compile, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'directives/ugNav/ugNav.html',
      scope: true,
      replace: true,
      link: function (scope, element, attrs) {
        //Use the sidr jquery plugin to create a side nav bar
        $('.js-nav-header-menu-button', element).sidr({
          name: 'nav-sidemenu',
          source: '.js-nav-menu'
        });

        // The sidr plugin use the .js-nav-menu element as a source to create the side menu. Thus, the nav-sidemenu
        // is added after the directive template compilation. For this reason, it's necessary to compile the new
        // #nav-sidemenu element.
        $compile($('#nav-sidemenu'))(scope);
      }
    };
  });
