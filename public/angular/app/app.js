//Declare app level module which depends on filters, and services

angular.module('app', [
  'routes',
  'templates.app',
  'templates.directives',
  'ngSanitize',
  'ngTouch',
  'ngAnimate',
  'pascalprecht.translate',
  'ui.bootstrap',
  'matchmedia-ng',
  'directives.ugActiveLink'
]);

angular.module('app').config(function ($translateProvider, $sceProvider, matchmediaProvider) {
  //Set which REST url to use to load the localization files
  $translateProvider.useUrlLoader('/api/locale');
  //For now the language is force to english
  $translateProvider.preferredLanguage('en');

  // Completely disable SCE.
  //TODO remove it once domain are correctly set
  $sceProvider.enabled(false);

  //Set matchmedia-ng size in order to match the Bootstrap media queries.
  matchmediaProvider.rules.tablet = '(min-width: 768px) and (max-width: 991px)';
  matchmediaProvider.rules.desktop = '(min-width: 991px)';
});

angular.module('app').controller('HeaderCtrl', function () {

});

angular.module('app').run(function ($rootScope, $location) {

});