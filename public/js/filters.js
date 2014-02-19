'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])

  .filter('timesummary', ['$filter', function ($filter) {
  	return function (note) {
  		var result;

  		if (note.dateEnd && note.dateStart) {
  			result = Math.round((note.dateEnd - note.dateStart) / (1000 * 60)) + ' min';
  		} else {
  			result = $filter('date')(note.dateStart, 'HH:mm:ss');
  		}
  		return result;
  	};
  }]);