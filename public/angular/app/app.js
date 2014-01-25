//Declare app level module which depends on filters, and services

angular.module('app', [
  'routes',
  'templates',
  'ngSanitize',
  'ngAnimate',
  'pascalprecht.translate'
]);

angular.module('app').config(function ($locationProvider) {
  //TODO try to make it work
  //$locationProvider.html5Mode(true);
});

angular.module('app').controller('HeaderCtrl', function () {

});

angular.module('app').run(function ($rootScope, $location) {

});