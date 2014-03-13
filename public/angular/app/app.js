//Declare app level module which depends on filters, and services

angular.module('app', [
  'routes',
  'templates.app',
  'templates.directives',
  'ngSanitize',
  'ngAnimate',
  'pascalprecht.translate',
  'ui.bootstrap'
]);

angular.module('app').config(function ($translateProvider, $sceProvider) {
  //Set which REST url to use to load the localization files
  $translateProvider.useUrlLoader('/api/locale');
  //For now the language is force to english
  $translateProvider.preferredLanguage('en');

  // Completely disable SCE.
  //TODO remove it once domain are correctly set
  $sceProvider.enabled(false);
});

angular.module('app').controller('HeaderCtrl', function () {

});

angular.module('app').run(function ($rootScope, $location) {

});