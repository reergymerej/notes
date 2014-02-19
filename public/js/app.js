'use strict';

console.log('app is being defined');

// angular.module('mean', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.articles']);

// angular.module('mean.system', []);
// angular.module('mean.articles', []);

// ================================================
// ported
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]);