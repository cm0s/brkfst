//Declare app level module which depends on filters, and services

angular.module('app', [
  'routes',
  'templates',
  'ngSanitize',
  'ngAnimate',
  'pascalprecht.translate'
]);

angular.module('app').config(function ($translateProvider) {
  //Set which REST url to use to load the localization files
  $translateProvider.useUrlLoader('/api/locale');
  //For now the language is force to english
  $translateProvider.preferredLanguage('en');
});

angular.module('app').controller('HeaderCtrl', function () {

});

angular.module('app').run(function ($rootScope, $location) {

});